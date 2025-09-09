<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

class Organisation extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'uuid',
        'user_id',
        'name',
        'slug',
        'description',
        'timezone',
        'cloudflare_account_id',
        'api_token',
        'encrypted_api_token',
        'token_last_validated_at',
        'token_expires_at',
        'token_last_checked',
        'token_permissions',
        'token_renewal_notified',
        'token_renewal_notified_at',
        'settings',
    ];

    protected $casts = [
        'settings' => 'array',
        'token_permissions' => 'array',
        'token_last_validated_at' => 'datetime',
        'token_expires_at' => 'datetime',
        'token_last_checked' => 'datetime',
        'token_renewal_notified_at' => 'datetime',
    ];

    protected $hidden = [
        'encrypted_api_token',
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($organisation) {
            // Generate UUID if not provided
            if (empty($organisation->uuid)) {
                $organisation->uuid = (string) Str::uuid();
            }

            // Generate slug if not provided
            if (empty($organisation->slug)) {
                $organisation->slug = Str::slug($organisation->name);

                $count = 1;
                $originalSlug = $organisation->slug;
                while (self::where('slug', $organisation->slug)->exists()) {
                    $organisation->slug = $originalSlug.'-'.$count++;
                }
            }
        });
    }

    /**
     * Get the route key for the model.
     * Use UUID for API routes, fallback to ID for internal routes
     */
    public function getRouteKeyName()
    {
        return 'uuid';
    }

    /**
     * Resolve a binding value to the model instance.
     * Supports both UUID and numeric ID for backward compatibility
     */
    public function resolveRouteBinding($value, $field = null)
    {
        // If field is explicitly specified, use it
        if ($field) {
            return $this->where($field, $value)->first();
        }

        // Try UUID format first (contains dashes)
        if (str_contains($value, '-') && strlen($value) === 36) {
            return $this->where('uuid', $value)->first();
        }

        // Fallback to numeric ID for backward compatibility
        if (is_numeric($value)) {
            return $this->where('id', $value)->first();
        }

        return null;
    }

    /**
     * Find organization by UUID or ID
     */
    public static function findByIdentifier(string $identifier)
    {
        if (str_contains($identifier, '-') && strlen($identifier) === 36) {
            return static::where('uuid', $identifier)->first();
        }

        if (is_numeric($identifier)) {
            return static::find($identifier);
        }

        return null;
    }

    public function owner()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function users()
    {
        return $this->belongsToMany(User::class, 'organisation_users')
            ->withPivot('role', 'invited_by', 'joined_at')
            ->withTimestamps();
    }

    public function zones()
    {
        return $this->hasMany(CloudflareZone::class);
    }

    public function policies()
    {
        return $this->hasMany(AccessPolicy::class);
    }

    public function auditLogs()
    {
        return $this->hasMany(AuditLog::class);
    }

    public function notificationSetting()
    {
        return $this->hasOne(NotificationSetting::class);
    }

    public function apiTokens()
    {
        return $this->hasMany(ApiToken::class, 'organization_id');
    }

    public function getApiTokenAttribute()
    {
        if (! $this->encrypted_api_token) {
            return null;
        }

        return decrypt($this->encrypted_api_token);
    }

    public function setApiTokenAttribute($value)
    {
        if ($value) {
            $this->attributes['encrypted_api_token'] = encrypt($value);
        } else {
            $this->attributes['encrypted_api_token'] = null;
        }
    }

    public function hasUser(User $user): bool
    {
        return $this->users()->where('user_id', $user->id)->exists();
    }

    public function getUserRole(User $user): ?string
    {
        $pivot = $this->users()->where('user_id', $user->id)->first();

        return $pivot ? $pivot->pivot->role : null;
    }

    public function isAdmin(User $user): bool
    {
        return $this->getUserRole($user) === 'admin' || $this->user_id === $user->id;
    }

    public function isEditor(User $user): bool
    {
        return in_array($this->getUserRole($user), ['admin', 'editor']) || $this->user_id === $user->id;
    }

    public function isViewer(User $user): bool
    {
        return $this->hasUser($user) || $this->user_id === $user->id;
    }

    public function addUser(User $user, string $role = 'viewer', ?User $invitedBy = null): void
    {
        $this->users()->attach($user->id, [
            'role' => $role,
            'invited_by' => $invitedBy?->id,
            'joined_at' => now(),
        ]);
    }

    public function removeUser(User $user): void
    {
        $this->users()->detach($user->id);
    }

    public function updateUserRole(User $user, string $role): void
    {
        $this->users()->updateExistingPivot($user->id, ['role' => $role]);
    }

    /**
     * Token Management Methods
     */
    public function hasValidToken(): bool
    {
        return $this->api_token &&
               ($this->token_expires_at === null || $this->token_expires_at->isFuture());
    }

    public function isTokenExpiring(?int $daysThreshold = 7): bool
    {
        return $this->token_expires_at &&
               $this->token_expires_at->isBefore(now()->addDays($daysThreshold));
    }

    public function isTokenExpired(): bool
    {
        return $this->token_expires_at && $this->token_expires_at->isPast();
    }

    public function getTokenExpiresInDays(): ?int
    {
        if (! $this->token_expires_at) {
            return null;
        }

        return max(0, now()->diffInDays($this->token_expires_at, false));
    }

    public function getTokenStatus(): string
    {
        if (! $this->api_token) {
            return 'missing';
        }

        if ($this->isTokenExpired()) {
            return 'expired';
        }

        if ($this->isTokenExpiring(7)) {
            return 'expiring';
        }

        if ($this->isTokenExpiring(30)) {
            return 'warning';
        }

        return 'valid';
    }

    public function getTokenStatusBadge(): array
    {
        $status = $this->getTokenStatus();

        return match ($status) {
            'missing' => [
                'text' => 'No Token',
                'variant' => 'destructive',
                'description' => 'API token required for Cloudflare integration',
            ],
            'expired' => [
                'text' => 'Expired',
                'variant' => 'destructive',
                'description' => 'Token expired on '.$this->token_expires_at?->format('M j, Y'),
            ],
            'expiring' => [
                'text' => 'Expires Soon',
                'variant' => 'destructive',
                'description' => 'Token expires in '.$this->getTokenExpiresInDays().' days',
            ],
            'warning' => [
                'text' => 'Expires Soon',
                'variant' => 'outline',
                'description' => 'Token expires in '.$this->getTokenExpiresInDays().' days',
            ],
            default => [
                'text' => 'Active',
                'variant' => 'secondary',
                'description' => $this->token_expires_at ?
                    'Expires '.$this->token_expires_at->format('M j, Y') :
                    'Token is active',
            ]
        };
    }

    public function markTokenRenewalNotified(): void
    {
        $this->update([
            'token_renewal_notified' => true,
            'token_renewal_notified_at' => now(),
        ]);
    }

    public function resetTokenRenewalNotification(): void
    {
        $this->update([
            'token_renewal_notified' => false,
            'token_renewal_notified_at' => null,
        ]);
    }

    public function updateTokenInfo(array $tokenInfo, array $permissions): void
    {
        $this->update([
            'token_last_checked' => now(),
            'token_permissions' => $permissions,
            'token_expires_at' => isset($tokenInfo['expires_on']) ?
                \Carbon\Carbon::parse($tokenInfo['expires_on']) : null,
        ]);
    }

    /**
     * Scopes for token management
     */
    public function scopeWithExpiredTokens($query)
    {
        return $query->whereNotNull('token_expires_at')
            ->where('token_expires_at', '<', now());
    }

    public function scopeWithExpiringTokens($query, int $daysThreshold = 7)
    {
        return $query->whereNotNull('token_expires_at')
            ->where('token_expires_at', '<', now()->addDays($daysThreshold))
            ->where('token_expires_at', '>', now());
    }

    public function scopeWithoutTokens($query)
    {
        return $query->where(function ($q) {
            $q->whereNull('encrypted_api_token')
                ->orWhere('encrypted_api_token', '');
        });
    }

    public function scopeNeedingRenewalNotification($query, int $daysThreshold = 7)
    {
        return $query->withExpiringTokens($daysThreshold)
            ->where('token_renewal_notified', false);
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class ApiToken extends Model
{
    use HasUuids;

    protected $fillable = [
        'user_id',
        'organization_id',
        'name',
        'token_hash',
        'scopes',
        'expires_at',
        'last_used_at',
    ];

    protected $casts = [
        'scopes' => 'array',
        'expires_at' => 'datetime',
        'last_used_at' => 'datetime',
    ];

    protected $hidden = [
        'token_hash',
    ];

    // Available scopes for API tokens
    public const AVAILABLE_SCOPES = [
        'policies:read' => 'Read access policies and applications',
        'policies:write' => 'Create and update access policies',
        'policies:delete' => 'Delete access policies',
        'applications:read' => 'Read applications',
        'applications:write' => 'Create and update applications',
        'applications:delete' => 'Delete applications',
        'logs:read' => 'Read access logs',
        'organizations:read' => 'Read organization information',
    ];

    // Relationships
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function organisation(): BelongsTo
    {
        return $this->belongsTo(Organisation::class, 'organization_id');
    }

    public function usageLogs(): HasMany
    {
        return $this->hasMany(ApiTokenUsageLog::class);
    }

    // Token management methods
    public static function generateToken(): array
    {
        $token = 'stnel_' . Str::random(64);
        $hash = Hash::make($token);

        return [
            'token' => $token,
            'hash' => $hash,
        ];
    }

    public function verifyToken(string $token): bool
    {
        return Hash::check($token, $this->token_hash);
    }

    // Permission checking methods
    public function hasScope(string $scope): bool
    {
        return in_array($scope, $this->scopes ?? []);
    }

    public function hasAnyScope(array $scopes): bool
    {
        return !empty(array_intersect($scopes, $this->scopes ?? []));
    }

    public function canReadPolicies(): bool
    {
        return $this->hasScope('policies:read');
    }

    public function canWritePolicies(): bool
    {
        return $this->hasScope('policies:write');
    }

    public function canDeletePolicies(): bool
    {
        return $this->hasScope('policies:delete');
    }

    public function canReadApplications(): bool
    {
        return $this->hasScope('applications:read');
    }

    public function canWriteApplications(): bool
    {
        return $this->hasScope('applications:write');
    }

    public function canDeleteApplications(): bool
    {
        return $this->hasScope('applications:delete');
    }

    public function canReadLogs(): bool
    {
        return $this->hasScope('logs:read');
    }

    public function canReadOrganizations(): bool
    {
        return $this->hasScope('organizations:read');
    }

    // Utility methods
    public function isExpired(): bool
    {
        return $this->expires_at && $this->expires_at->isPast();
    }

    public function isValid(): bool
    {
        return !$this->isExpired();
    }

    public function updateLastUsed(): void
    {
        $this->update(['last_used_at' => now()]);
    }

    // Scopes
    public function scopeValid($query)
    {
        return $query->where(function ($q) {
            $q->whereNull('expires_at')
              ->orWhere('expires_at', '>', now());
        });
    }

    public function scopeForOrganization($query, $organizationId)
    {
        return $query->where('organization_id', $organizationId);
    }

    public function scopeForUser($query, $userId)
    {
        return $query->where('user_id', $userId);
    }

    // Static methods for token lookup
    public static function findByToken(string $token): ?self
    {
        $tokenPrefix = 'stnel_';
        if (!str_starts_with($token, $tokenPrefix)) {
            return null;
        }

        $tokens = self::valid()->get();

        foreach ($tokens as $apiToken) {
            if ($apiToken->verifyToken($token)) {
                return $apiToken;
            }
        }

        return null;
    }
}

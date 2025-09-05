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
        'user_id',
        'name',
        'slug',
        'description',
        'timezone',
        'cloudflare_account_id',
        'api_token',
        'encrypted_api_token',
        'token_last_validated_at',
        'settings',
    ];

    protected $casts = [
        'settings' => 'array',
        'token_last_validated_at' => 'datetime',
    ];

    protected $hidden = [
        'encrypted_api_token',
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($organisation) {
            if (empty($organisation->slug)) {
                $organisation->slug = Str::slug($organisation->name);
                
                $count = 1;
                $originalSlug = $organisation->slug;
                while (self::where('slug', $organisation->slug)->exists()) {
                    $organisation->slug = $originalSlug . '-' . $count++;
                }
            }
        });
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

    public function getApiTokenAttribute()
    {
        if (!$this->encrypted_api_token) {
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
}
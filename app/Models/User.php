<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'workos_id',
        'avatar',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'workos_id',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    /**
     * Get organisations owned by this user.
     */
    public function ownedOrganisations()
    {
        return $this->hasMany(Organisation::class, 'user_id');
    }

    /**
     * Get organisations this user belongs to.
     */
    public function organisations()
    {
        return $this->belongsToMany(Organisation::class, 'organisation_users')
            ->withPivot('role', 'invited_by', 'joined_at')
            ->withTimestamps();
    }

    /**
     * Get all organisations (owned + member).
     */
    public function allOrganisations()
    {
        $owned = $this->ownedOrganisations;
        $member = $this->organisations;
        
        return $owned->merge($member)->unique('id');
    }

    /**
     * Check if user can access an organisation.
     */
    public function canAccessOrganisation(Organisation $organisation): bool
    {
        return $organisation->user_id === $this->id || 
               $organisation->hasUser($this);
    }
}

<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Cashier\Billable;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use Billable, HasFactory, Notifiable;

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
        'role',
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
     * Get API tokens created by this user.
     */
    public function apiTokens()
    {
        return $this->hasMany(ApiToken::class);
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

    /**
     * Subscription and billing methods
     */
    public function getCurrentPlan(): ?BillingPlan
    {
        if ($this->subscribed('default')) {
            $subscription = $this->subscription('default');

            return BillingPlan::where('stripe_price_id', $subscription->stripe_price)->first();
        }

        // Return free plan for non-subscribers
        return BillingPlan::where('name', 'Free')->first();
    }

    public function getMaxOrganizations(): int
    {
        $plan = $this->getCurrentPlan();

        return $plan ? $plan->max_organizations : 1;
    }

    public function getMaxProtectedEndpoints(): int
    {
        $plan = $this->getCurrentPlan();

        return $plan ? $plan->max_protected_endpoints : 5;
    }

    public function canCreateOrganization(): bool
    {
        $maxOrganizations = $this->getMaxOrganizations();

        if ($maxOrganizations === -1) {
            return true; // Unlimited
        }

        return $this->ownedOrganisations()->count() < $maxOrganizations;
    }

    public function canCreateProtectedEndpoint(): bool
    {
        $maxEndpoints = $this->getMaxProtectedEndpoints();

        if ($maxEndpoints === -1) {
            return true; // Unlimited
        }

        $totalEndpoints = $this->ownedOrganisations()
            ->withCount('policies')
            ->get()
            ->sum('policies_count');

        return $totalEndpoints < $maxEndpoints;
    }

    public function isSubscribed(): bool
    {
        return $this->subscribed('default');
    }

    public function isOnFreePlan(): bool
    {
        return ! $this->isSubscribed();
    }

    public function isOnProPlan(): bool
    {
        $plan = $this->getCurrentPlan();

        return $plan && $plan->name === 'Pro';
    }

    public function hasReachedOrganizationLimit(): bool
    {
        return ! $this->canCreateOrganization();
    }

    public function hasReachedEndpointLimit(): bool
    {
        return ! $this->canCreateProtectedEndpoint();
    }

    public function needsUpgrade(): bool
    {
        return $this->hasReachedOrganizationLimit() || $this->hasReachedEndpointLimit();
    }

    /**
     * Role-based access control methods
     */
    public function isAdmin(): bool
    {
        return $this->role === 'admin';
    }

    public function isMember(): bool
    {
        return $this->role === 'member';
    }

    public function hasProAccess(): bool
    {
        return $this->isAdmin() || $this->isOnProPlan();
    }

    public function canAccessApiTokens(): bool
    {
        return $this->hasProAccess();
    }

    public function canAccessAdvancedFeatures(): bool
    {
        return $this->hasProAccess();
    }
}

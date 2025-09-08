<?php

namespace App\Services;

use App\Models\AccessPolicy;
use App\Models\BillingPlan;
use App\Models\Organisation;
use App\Models\User;

class SubscriptionService
{
    public function enforceSubscriptionLimits(User $user): void
    {
        $plan = $user->getCurrentPlan();

        if (! $plan) {
            return;
        }

        $this->enforceOrganizationLimits($user, $plan);
        $this->enforceEndpointLimits($user, $plan);
    }

    protected function enforceOrganizationLimits(User $user, BillingPlan $plan): void
    {
        if ($plan->isUnlimitedOrganizations()) {
            return;
        }

        $organizations = $user->ownedOrganisations()
            ->orderBy('created_at', 'desc')
            ->get();

        if ($organizations->count() <= $plan->max_organizations) {
            return;
        }

        // Disable excess organizations (keep the newest ones)
        $organizationsToDisable = $organizations->skip($plan->max_organizations);

        foreach ($organizationsToDisable as $organization) {
            $this->disableOrganization($organization);
        }
    }

    protected function enforceEndpointLimits(User $user, BillingPlan $plan): void
    {
        if ($plan->isUnlimitedEndpoints()) {
            return;
        }

        $allPolicies = $user->ownedOrganisations()
            ->with(['policies' => function ($query) {
                $query->orderBy('created_at', 'desc');
            }])
            ->get()
            ->pluck('policies')
            ->flatten();

        if ($allPolicies->count() <= $plan->max_protected_endpoints) {
            return;
        }

        // Disable excess policies (keep the newest ones)
        $policiesToDisable = $allPolicies->skip($plan->max_protected_endpoints);

        foreach ($policiesToDisable as $policy) {
            $this->disablePolicy($policy);
        }
    }

    protected function disableOrganization(Organisation $organization): void
    {
        // For now, we'll soft delete the organization
        // In a more sophisticated approach, we might just mark it as disabled
        $organization->delete();
    }

    protected function disablePolicy(AccessPolicy $policy): void
    {
        // Disable the policy by setting status to inactive
        $policy->update(['status' => 'inactive']);
    }

    public function canUserCreateOrganization(User $user): bool
    {
        return $user->canCreateOrganization();
    }

    public function canUserCreatePolicy(User $user): bool
    {
        return $user->canCreateProtectedEndpoint();
    }

    public function getUserUsageStats(User $user): array
    {
        $plan = $user->getCurrentPlan();
        $organizationCount = $user->ownedOrganisations()->count();
        $policyCount = $user->ownedOrganisations()
            ->withCount('policies')
            ->get()
            ->sum('policies_count');

        return [
            'plan' => $plan,
            'organizations' => [
                'current' => $organizationCount,
                'limit' => $plan ? $plan->max_organizations : 1,
                'unlimited' => $plan ? $plan->isUnlimitedOrganizations() : false,
            ],
            'endpoints' => [
                'current' => $policyCount,
                'limit' => $plan ? $plan->max_protected_endpoints : 5,
                'unlimited' => $plan ? $plan->isUnlimitedEndpoints() : false,
            ],
        ];
    }

    public function getUpgradeRecommendation(User $user): ?string
    {
        if ($user->isOnProPlan()) {
            return null;
        }

        $stats = $this->getUserUsageStats($user);

        if ($stats['organizations']['current'] >= $stats['organizations']['limit'] ||
            $stats['endpoints']['current'] >= $stats['endpoints']['limit']) {
            return 'You\'ve reached your plan limits. Upgrade to Pro for unlimited organizations and endpoints.';
        }

        // Close to limits
        if ($stats['organizations']['current'] / $stats['organizations']['limit'] >= 0.8 ||
            $stats['endpoints']['current'] / $stats['endpoints']['limit'] >= 0.8) {
            return 'You\'re approaching your plan limits. Consider upgrading to Pro for unlimited access.';
        }

        return null;
    }
}

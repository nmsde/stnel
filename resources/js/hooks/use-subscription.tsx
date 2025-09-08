import { type PageProps } from '@inertiajs/core';
import { usePage } from '@inertiajs/react';

interface BillingPlan {
    id: number;
    name: string;
    price: number;
    billing_interval: string;
    max_organizations: number;
    max_protected_endpoints: number;
    features: string[];
    is_active: boolean;
}

interface User {
    id: number;
    name: string;
    email: string;
    // Add subscription-related fields that might be passed from the backend
    current_plan?: BillingPlan;
    organizations_count?: number;
    endpoints_count?: number;
    max_organizations?: number;
    max_endpoints?: number;
}

interface SharedData extends PageProps {
    auth: {
        user: User;
    };
}

export function useSubscription() {
    const { auth } = usePage<SharedData>().props;
    const user = auth.user;

    // Get current plan data (this would be passed from the backend)
    const currentPlan = user.current_plan;
    const organizationsCount = user.organizations_count || 0;
    const endpointsCount = user.endpoints_count || 0;
    const maxOrganizations = user.max_organizations || (currentPlan?.max_organizations ?? 1);
    const maxEndpoints = user.max_endpoints || (currentPlan?.max_protected_endpoints ?? 5);

    const isUnlimitedOrganizations = maxOrganizations === -1;
    const isUnlimitedEndpoints = maxEndpoints === -1;

    const isOnFreePlan = !currentPlan || currentPlan.price === 0;
    const isOnProPlan = currentPlan && currentPlan.name === 'Pro';

    const canCreateOrganization = isUnlimitedOrganizations || organizationsCount < maxOrganizations;
    const canCreateEndpoint = isUnlimitedEndpoints || endpointsCount < maxEndpoints;

    const organizationUsagePercentage = isUnlimitedOrganizations ? 0 : (organizationsCount / maxOrganizations) * 100;
    const endpointUsagePercentage = isUnlimitedEndpoints ? 0 : (endpointsCount / maxEndpoints) * 100;

    const hasReachedOrganizationLimit = !canCreateOrganization;
    const hasReachedEndpointLimit = !canCreateEndpoint;
    const needsUpgrade = hasReachedOrganizationLimit || hasReachedEndpointLimit;

    const isNearOrganizationLimit = organizationUsagePercentage >= 80;
    const isNearEndpointLimit = endpointUsagePercentage >= 80;

    return {
        currentPlan,
        isOnFreePlan,
        isOnProPlan,

        // Organizations
        organizationsCount,
        maxOrganizations,
        isUnlimitedOrganizations,
        canCreateOrganization,
        hasReachedOrganizationLimit,
        isNearOrganizationLimit,
        organizationUsagePercentage,

        // Endpoints
        endpointsCount,
        maxEndpoints,
        isUnlimitedEndpoints,
        canCreateEndpoint,
        hasReachedEndpointLimit,
        isNearEndpointLimit,
        endpointUsagePercentage,

        // Overall
        needsUpgrade,
    };
}

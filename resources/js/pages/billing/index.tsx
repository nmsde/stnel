import HeadingSmall from '@/components/heading-small';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { cancel, portal, resume, subscribe } from '@/routes/billing';
import { type BreadcrumbItem } from '@/types';
import { type PageProps } from '@inertiajs/core';
import { Head, router, usePage } from '@inertiajs/react';
import { AlertTriangle, Check, CreditCard, ExternalLink } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Billing',
        href: '/settings/billing',
    },
];

interface BillingPlan {
    id: number;
    name: string;
    price: number;
    billing_interval: string;
    max_organizations: number;
    max_protected_endpoints: number;
    features: string[];
    is_active: boolean;
    stripe_price_id: string;
}

interface UsageStats {
    plan: BillingPlan | null;
    organizations: {
        current: number;
        limit: number;
        unlimited: boolean;
    };
    endpoints: {
        current: number;
        limit: number;
        unlimited: boolean;
    };
}

interface CurrentSubscription {
    id: string;
    stripe_status: string;
    stripe_price: string;
    quantity: number;
    trial_ends_at: string | null;
    ends_at: string | null;
    created_at: string;
    updated_at: string;
}

interface BillingPageProps extends PageProps {
    plans: BillingPlan[];
    currentSubscription: CurrentSubscription | null;
    usageStats: UsageStats;
    upgradeRecommendation: string | null;
    stripeKey: string;
}

const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    }).format(price);
};

const getProgressPercentage = (current: number, limit: number): number => {
    if (limit === -1) return 0; // Unlimited
    return Math.min((current / limit) * 100, 100);
};

const getProgressColor = (percentage: number): string => {
    if (percentage >= 90) return 'bg-red-500';
    if (percentage >= 75) return 'bg-yellow-500';
    return 'bg-green-500';
};

export default function BillingIndex() {
    const { plans, currentSubscription, usageStats, upgradeRecommendation } = usePage<BillingPageProps>().props;

    const handleSubscribe = (planId: number) => {
        router.post(subscribe().url, { plan_id: planId });
    };

    const handleCancel = () => {
        if (confirm('Are you sure you want to cancel your subscription? You will lose access to Pro features at the end of your billing period.')) {
            router.post(cancel().url);
        }
    };

    const handleResume = () => {
        router.post(resume().url);
    };

    const handlePortal = () => {
        window.open(portal().url, '_blank');
    };

    const currentPlan = usageStats.plan;
    const isSubscribed = !!currentSubscription;
    const isCancelled = currentSubscription?.ends_at && !currentSubscription.ends_at.includes('1970');

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Billing" />

            <SettingsLayout>
                <div className="space-y-6">
                    <HeadingSmall title="Billing & Subscription" description="Manage your subscription and billing information" />

                    {/* Upgrade Recommendation */}
                    {upgradeRecommendation && (
                        <Card className="border-orange-200 bg-orange-50">
                            <CardHeader>
                                <div className="flex items-center gap-2">
                                    <AlertTriangle className="h-5 w-5 text-orange-600" />
                                    <CardTitle className="text-orange-900">Upgrade Recommended</CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <p className="text-orange-800">{upgradeRecommendation}</p>
                            </CardContent>
                        </Card>
                    )}

                    {/* Current Usage */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Current Usage</CardTitle>
                            <CardDescription>Your usage for the current {currentPlan?.name || 'Free'} plan</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {/* Organizations Usage */}
                            <div>
                                <div className="mb-2 flex items-center justify-between">
                                    <span className="text-sm font-medium">Organizations</span>
                                    <span className="text-sm text-muted-foreground">
                                        {usageStats.organizations.current} of{' '}
                                        {usageStats.organizations.unlimited ? '∞' : usageStats.organizations.limit}
                                    </span>
                                </div>
                                {!usageStats.organizations.unlimited && (
                                    <Progress
                                        value={getProgressPercentage(usageStats.organizations.current, usageStats.organizations.limit)}
                                        className="h-2"
                                    />
                                )}
                            </div>

                            {/* Endpoints Usage */}
                            <div>
                                <div className="mb-2 flex items-center justify-between">
                                    <span className="text-sm font-medium">Protected Endpoints</span>
                                    <span className="text-sm text-muted-foreground">
                                        {usageStats.endpoints.current} of {usageStats.endpoints.unlimited ? '∞' : usageStats.endpoints.limit}
                                    </span>
                                </div>
                                {!usageStats.endpoints.unlimited && (
                                    <Progress
                                        value={getProgressPercentage(usageStats.endpoints.current, usageStats.endpoints.limit)}
                                        className="h-2"
                                    />
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Current Subscription */}
                    {currentSubscription && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Current Subscription</CardTitle>
                                <CardDescription>
                                    {currentPlan?.name} Plan - {formatPrice(currentPlan?.price || 0)}/{currentPlan?.billing_interval}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <Badge variant={currentSubscription.stripe_status === 'active' ? 'default' : 'secondary'}>
                                            {currentSubscription.stripe_status}
                                        </Badge>
                                        {isCancelled && (
                                            <p className="mt-2 text-sm text-muted-foreground">
                                                Ends on {new Date(currentSubscription.ends_at!).toLocaleDateString()}
                                            </p>
                                        )}
                                    </div>
                                    <div className="flex gap-2">
                                        <Button onClick={handlePortal} variant="outline" size="sm">
                                            <ExternalLink className="mr-2 h-4 w-4" />
                                            Manage Billing
                                        </Button>
                                        {isCancelled ? (
                                            <Button onClick={handleResume} size="sm">
                                                Resume Subscription
                                            </Button>
                                        ) : (
                                            <Button onClick={handleCancel} variant="destructive" size="sm">
                                                Cancel Subscription
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Available Plans */}
                    <div>
                        <h3 className="mb-4 text-lg font-medium">Available Plans</h3>
                        <div className="grid gap-4 md:grid-cols-2">
                            {plans.map((plan) => {
                                const isCurrentPlan = currentPlan?.id === plan.id;
                                const isPro = plan.name === 'Pro';

                                return (
                                    <Card key={plan.id} className={isCurrentPlan ? 'ring-2 ring-primary' : ''}>
                                        <CardHeader>
                                            <div className="flex items-center justify-between">
                                                <CardTitle>{plan.name}</CardTitle>
                                                {isCurrentPlan && <Badge>Current</Badge>}
                                            </div>
                                            <CardDescription>
                                                {formatPrice(plan.price)} / {plan.billing_interval}
                                                {plan.price === 0 && ' forever'}
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="space-y-2">
                                                <div className="flex items-center gap-2">
                                                    <Check className="h-4 w-4 text-green-500" />
                                                    <span className="text-sm">
                                                        {plan.max_organizations === -1 ? 'Unlimited' : plan.max_organizations} Organization
                                                        {plan.max_organizations !== 1 ? 's' : ''}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Check className="h-4 w-4 text-green-500" />
                                                    <span className="text-sm">
                                                        {plan.max_protected_endpoints === -1 ? 'Unlimited' : plan.max_protected_endpoints} Protected
                                                        Endpoint{plan.max_protected_endpoints !== 1 ? 's' : ''}
                                                    </span>
                                                </div>
                                                {plan.features.map((feature, index) => (
                                                    <div key={index} className="flex items-center gap-2">
                                                        <Check className="h-4 w-4 text-green-500" />
                                                        <span className="text-sm">{feature}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </CardContent>
                                        <CardFooter>
                                            {plan.price === 0 ? (
                                                <Button disabled className="w-full" variant="outline">
                                                    Always Free
                                                </Button>
                                            ) : isCurrentPlan ? (
                                                <Button disabled className="w-full">
                                                    Current Plan
                                                </Button>
                                            ) : (
                                                <Button
                                                    onClick={() => handleSubscribe(plan.id)}
                                                    className="w-full"
                                                    variant={isPro ? 'default' : 'outline'}
                                                >
                                                    <CreditCard className="mr-2 h-4 w-4" />
                                                    {isSubscribed ? 'Switch Plan' : 'Subscribe'}
                                                </Button>
                                            )}
                                        </CardFooter>
                                    </Card>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </SettingsLayout>
        </AppLayout>
    );
}

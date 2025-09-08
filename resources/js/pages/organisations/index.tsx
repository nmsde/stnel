import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import UpgradePrompt from '@/components/upgrade-prompt';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type SharedData } from '@/types';
import { type OrganisationIndexProps } from '@/types/cloudflare';
import { Head, Link, usePage } from '@inertiajs/react';
import { Building2, Globe, Plus, Shield, Users } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Organizations',
        href: '/organisations',
    },
];

interface SubscriptionData {
    current_plan?: any;
    organizations_count: number;
    max_organizations: number;
    endpoints_count: number;
    max_endpoints: number;
    can_create_organization: boolean;
    can_create_endpoint: boolean;
}

interface PageProps extends OrganisationIndexProps {
    subscriptionData: SubscriptionData;
}

export default function OrganisationsIndex() {
    const { organisations, subscriptionData } = usePage<SharedData & PageProps>().props;

    const isAtOrgLimit = !subscriptionData.can_create_organization;
    const isNearOrgLimit = subscriptionData.max_organizations > 0 && subscriptionData.organizations_count / subscriptionData.max_organizations >= 0.8;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Organizations" />

            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold text-gray-900">Organizations</h1>
                        <p className="mt-1 text-sm text-gray-600">Manage your Cloudflare Access organizations and protected apps.</p>
                    </div>
                    <Link href="/organisations/create">
                        <Button disabled={isAtOrgLimit}>
                            <Plus className="mr-2 h-4 w-4" />
                            New Organization
                        </Button>
                    </Link>
                </div>

                {/* Upgrade Prompts */}
                {isAtOrgLimit && (
                    <UpgradePrompt
                        type="organizations"
                        current={subscriptionData.organizations_count}
                        limit={subscriptionData.max_organizations}
                        variant="limit-reached"
                    />
                )}

                {!isAtOrgLimit && isNearOrgLimit && (
                    <UpgradePrompt
                        type="organizations"
                        current={subscriptionData.organizations_count}
                        limit={subscriptionData.max_organizations}
                        variant="warning"
                    />
                )}

                {!isAtOrgLimit && !isNearOrgLimit && organisations.length > 0 && (
                    <UpgradePrompt
                        type="organizations"
                        current={subscriptionData.organizations_count}
                        limit={subscriptionData.max_organizations}
                        variant="suggestion"
                    />
                )}

                {organisations.length === 0 ? (
                    <Card>
                        <CardContent className="flex flex-col items-center justify-center py-12">
                            <Building2 className="mb-4 h-12 w-12 text-gray-400" />
                            <h3 className="mb-2 text-lg font-medium text-gray-900">No organizations yet</h3>
                            <p className="mb-6 text-center text-gray-600">Get started by creating your first organization to protect your apps.</p>
                            <Link href="/organisations/create">
                                <Button>
                                    <Plus className="mr-2 h-4 w-4" />
                                    Create your first organization
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {organisations.map((organisation) => (
                            <Card key={organisation.id} className="transition-shadow hover:shadow-lg">
                                <CardHeader>
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <CardTitle className="text-lg">
                                                <Link href={`/organisations/${organisation.id}`} className="transition-colors hover:text-blue-600">
                                                    {organisation.name}
                                                </Link>
                                            </CardTitle>
                                            {organisation.description && (
                                                <CardDescription className="mt-1">{organisation.description}</CardDescription>
                                            )}
                                        </div>
                                        <Badge variant="secondary" className="ml-2">
                                            {organisation.timezone}
                                        </Badge>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between text-sm">
                                            <div className="flex items-center text-gray-600">
                                                <Globe className="mr-2 h-4 w-4" />
                                                <span>{organisation.zones_count || 0} zones</span>
                                            </div>
                                            <div className="flex items-center text-gray-600">
                                                <Shield className="mr-2 h-4 w-4" />
                                                <span>{organisation.policies_count || 0} apps</span>
                                            </div>
                                        </div>

                                        {organisation.token_last_validated_at ? (
                                            <div className="flex items-center text-sm text-green-600">
                                                <div className="mr-2 h-2 w-2 rounded-full bg-green-400"></div>
                                                API token validated
                                            </div>
                                        ) : (
                                            <div className="flex items-center text-sm text-amber-600">
                                                <div className="mr-2 h-2 w-2 rounded-full bg-amber-400"></div>
                                                API token not configured
                                            </div>
                                        )}

                                        <div className="flex items-center justify-between pt-2">
                                            <div className="flex items-center text-xs text-gray-500">
                                                <Users className="mr-1 h-3 w-3" />
                                                Owner: {organisation.owner?.name}
                                            </div>
                                            <div className="text-xs text-gray-500">
                                                Created {new Date(organisation.created_at).toLocaleDateString()}
                                            </div>
                                        </div>

                                        <div className="border-t pt-3">
                                            <Link href={`/organisations/${organisation.id}`} className="block">
                                                <Button variant="default" size="sm" className="w-full">
                                                    Manage Apps
                                                </Button>
                                            </Link>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}

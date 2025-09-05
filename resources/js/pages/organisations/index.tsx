import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type SharedData } from '@/types';
import { type OrganisationIndexProps } from '@/types/cloudflare';
import { Head, Link, usePage } from '@inertiajs/react';
import { Building2, Plus, Users, Globe, Shield } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Organizations',
        href: '/organisations',
    },
];

export default function OrganisationsIndex() {
    const { organisations } = usePage<SharedData & OrganisationIndexProps>().props;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Organizations" />

            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold text-gray-900">Organizations</h1>
                        <p className="mt-1 text-sm text-gray-600">
                            Manage your Cloudflare Access organizations and protected apps.
                        </p>
                    </div>
                    <Link href="/organisations/create">
                        <Button>
                            <Plus className="h-4 w-4 mr-2" />
                            New Organization
                        </Button>
                    </Link>
                </div>

                {organisations.length === 0 ? (
                    <Card>
                        <CardContent className="flex flex-col items-center justify-center py-12">
                            <Building2 className="h-12 w-12 text-gray-400 mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No organizations yet</h3>
                            <p className="text-gray-600 text-center mb-6">
                                Get started by creating your first organization to protect your apps.
                            </p>
                            <Link href="/organisations/create">
                                <Button>
                                    <Plus className="h-4 w-4 mr-2" />
                                    Create your first organization
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {organisations.map((organisation) => (
                            <Card key={organisation.id} className="hover:shadow-lg transition-shadow">
                                <CardHeader>
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <CardTitle className="text-lg">
                                                <Link 
                                                    href={`/organisations/${organisation.id}`}
                                                    className="hover:text-blue-600 transition-colors"
                                                >
                                                    {organisation.name}
                                                </Link>
                                            </CardTitle>
                                            {organisation.description && (
                                                <CardDescription className="mt-1">
                                                    {organisation.description}
                                                </CardDescription>
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
                                                <Globe className="h-4 w-4 mr-2" />
                                                <span>{organisation.zones_count || 0} zones</span>
                                            </div>
                                            <div className="flex items-center text-gray-600">
                                                <Shield className="h-4 w-4 mr-2" />
                                                <span>{organisation.policies_count || 0} apps</span>
                                            </div>
                                        </div>

                                        {organisation.token_last_validated_at ? (
                                            <div className="flex items-center text-sm text-green-600">
                                                <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                                                API token validated
                                            </div>
                                        ) : (
                                            <div className="flex items-center text-sm text-amber-600">
                                                <div className="w-2 h-2 bg-amber-400 rounded-full mr-2"></div>
                                                API token not configured
                                            </div>
                                        )}

                                        <div className="flex items-center justify-between pt-2">
                                            <div className="flex items-center text-xs text-gray-500">
                                                <Users className="h-3 w-3 mr-1" />
                                                Owner: {organisation.owner?.name}
                                            </div>
                                            <div className="text-xs text-gray-500">
                                                Created {new Date(organisation.created_at).toLocaleDateString()}
                                            </div>
                                        </div>

                                        <div className="flex gap-2 pt-3 border-t">
                                            <Link href={`/organisations/${organisation.id}`} className="flex-1">
                                                <Button variant="outline" size="sm" className="w-full">
                                                    View Details
                                                </Button>
                                            </Link>
                                            <Link href={`/organisations/${organisation.id}`} className="flex-1">
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
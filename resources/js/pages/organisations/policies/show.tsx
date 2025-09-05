import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type SharedData } from '@/types';
import { type PolicyShowProps } from '@/types/cloudflare';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { ArrowLeft, Globe, Shield, Clock, Users, Mail, Edit, Trash2, RefreshCw, ExternalLink, CheckCircle, XCircle, AlertCircle, Activity } from 'lucide-react';

export default function PolicyShow() {
    const { organisation, policy } = usePage<SharedData & PolicyShowProps>().props;

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Organizations',
            href: '/organisations',
        },
        {
            title: organisation.name,
            href: `/organisations/${organisation.id}`,
        },
        {
            title: 'Protected Apps',
            href: `/organisations/${organisation.id}`,
        },
        {
            title: policy.name,
            href: `/organisations/${organisation.id}/policies/${policy.id}`,
        },
    ];

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active': return 'default';
            case 'pending': return 'secondary';
            case 'inactive': return 'destructive';
            default: return 'secondary';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'active': return <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />;
            case 'pending': return <AlertCircle className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />;
            case 'inactive': return <XCircle className="h-4 w-4 text-red-600 dark:text-red-400" />;
            default: return <AlertCircle className="h-4 w-4 text-muted-foreground" />;
        }
    };

    const handleDelete = () => {
        if (confirm('Are you sure you want to remove protection from this app? This action cannot be undone.')) {
            router.delete(`/organisations/${organisation.id}/policies/${policy.id}`);
        }
    };

    const handleSync = () => {
        router.post(`/organisations/${organisation.id}/policies/${policy.id}/sync`);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`${policy.name} - Protected App`} />

            <div className="max-w-4xl mx-auto space-y-6">
                <div className="flex items-center gap-4">
                    <Link href={`/organisations/${organisation.id}`}>
                        <Button variant="ghost" size="sm">
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back to protected apps
                        </Button>
                    </Link>
                </div>

                {/* Header */}
                <div className="flex items-start justify-between">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <h1 className="text-2xl font-semibold text-foreground">{policy.name}</h1>
                            <Badge variant={getStatusColor(policy.status)} className="flex items-center gap-1">
                                {getStatusIcon(policy.status)}
                                {policy.status}
                            </Badge>
                            {policy.require_mfa && (
                                <Badge variant="outline" className="text-xs">
                                    MFA Required
                                </Badge>
                            )}
                        </div>
                        <p className="text-muted-foreground">
                            {policy.zone ? `Protecting ${policy.domain} on ${policy.zone.name}` : `Protecting ${policy.domain}`}
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        <Link href={`/organisations/${organisation.id}/policies/${policy.id}/edit`}>
                            <Button>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit Policy
                            </Button>
                        </Link>
                        {policy.status === 'pending' && (
                            <Button variant="outline" onClick={handleSync}>
                                <RefreshCw className="h-4 w-4 mr-2" />
                                Sync with Cloudflare
                            </Button>
                        )}
                        {policy.status === 'active' && (
                            <Button variant="outline" onClick={handleSync}>
                                <RefreshCw className="h-4 w-4 mr-2" />
                                Re-sync Policy
                            </Button>
                        )}
                        <Button variant="destructive" onClick={handleDelete}>
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                        </Button>
                    </div>
                </div>

                {/* Policy Details */}
                <Card>
                    <CardHeader>
                        <CardTitle>Policy Configuration</CardTitle>
                        <CardDescription>
                            Details and settings for this access policy.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid gap-6 md:grid-cols-2">
                            <div className="space-y-4">
                                <div>
                                    <h4 className="text-sm font-medium text-foreground mb-1">Application</h4>
                                    <div className="flex items-center gap-2">
                                        <Globe className="h-4 w-4 text-muted-foreground" />
                                        <span className="text-sm">{policy.domain}</span>
                                        {policy.path && policy.path !== '/' && (
                                            <span className="text-sm text-muted-foreground/70">/{policy.path}</span>
                                        )}
                                        <a
                                            href={`https://${policy.domain}${policy.path || ''}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-primary hover:text-primary/80"
                                        >
                                            <ExternalLink className="h-4 w-4" />
                                        </a>
                                    </div>
                                </div>

                                <div>
                                    <h4 className="text-sm font-medium text-foreground mb-1">Zone</h4>
                                    <div className="flex items-center gap-2">
                                        <Shield className="h-4 w-4 text-muted-foreground" />
                                        <span className="text-sm">{policy.zone?.name || 'Unknown Zone'}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <h4 className="text-sm font-medium text-foreground mb-1">Session Duration</h4>
                                    <div className="flex items-center gap-2">
                                        <Clock className="h-4 w-4 text-muted-foreground" />
                                        <span className="text-sm">{policy.session_duration || '24h'}</span>
                                    </div>
                                </div>

                                <div>
                                    <h4 className="text-sm font-medium text-foreground mb-1">Access Rules</h4>
                                    <div className="flex items-center gap-2">
                                        <Users className="h-4 w-4 text-muted-foreground" />
                                        <span className="text-sm">{policy.rules?.length || 0} rules configured</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <Separator />

                        <div>
                            <h4 className="text-sm font-medium text-foreground mb-3">Security Settings</h4>
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2">
                                    <Shield className="h-4 w-4 text-gray-500" />
                                    <span className="text-sm">Multi-Factor Authentication:</span>
                                    <Badge variant={policy.require_mfa ? 'default' : 'secondary'}>
                                        {policy.require_mfa ? 'Required' : 'Optional'}
                                    </Badge>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Access Rules */}
                <Card>
                    <CardHeader>
                        <CardTitle>Access Rules</CardTitle>
                        <CardDescription>
                            Users and groups with access to this application.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {policy.rules && policy.rules.length > 0 ? (
                            <div className="space-y-3">
                                {policy.rules.map((rule, index) => (
                                    <div key={index} className="flex items-center justify-between bg-muted/20 p-3 rounded-lg">
                                        <div className="flex items-center gap-2">
                                            {rule.type === 'email' ? (
                                                <Mail className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                            ) : rule.type === 'domain' ? (
                                                <Globe className="h-4 w-4 text-green-600 dark:text-green-400" />
                                            ) : (
                                                <Users className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                                            )}
                                            <span className="font-medium">{rule.value}</span>
                                            <Badge variant="outline" className="text-xs">
                                                {rule.type}
                                            </Badge>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                <h3 className="text-lg font-medium text-foreground mb-2">No access rules</h3>
                                <p className="text-muted-foreground mb-4">This policy has no access rules configured.</p>
                                <Link href={`/organisations/${organisation.id}/policies/${policy.id}/edit`}>
                                    <Button>
                                        <Edit className="h-4 w-4 mr-2" />
                                        Edit Policy
                                    </Button>
                                </Link>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Policy Metadata */}
                <Card>
                    <CardHeader>
                        <CardTitle>Policy Information</CardTitle>
                        <CardDescription>
                            Creation and modification details.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid gap-4 md:grid-cols-2">
                            <div>
                                <h4 className="text-sm font-medium text-foreground mb-1">Created</h4>
                                <p className="text-sm text-muted-foreground">
                                    {new Date(policy.created_at).toLocaleString()}
                                    {policy.creator && ` by ${policy.creator.name}`}
                                </p>
                            </div>
                            <div>
                                <h4 className="text-sm font-medium text-foreground mb-1">Last Updated</h4>
                                <p className="text-sm text-muted-foreground">
                                    {new Date(policy.updated_at).toLocaleString()}
                                    {policy.updater && ` by ${policy.updater.name}`}
                                </p>
                            </div>
                        </div>

                        {policy.cloudflare_policy_id && (
                            <>
                                <Separator />
                                <div>
                                    <h4 className="text-sm font-medium text-foreground mb-1">Cloudflare Policy ID</h4>
                                    <p className="text-sm text-muted-foreground font-mono">{policy.cloudflare_policy_id}</p>
                                </div>
                            </>
                        )}
                    </CardContent>
                </Card>

                {/* Status Help */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm">Policy Status Guide</CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm text-muted-foreground space-y-2">
                        <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                            <span className="font-medium">Active:</span>
                            <span>Policy is synchronized with Cloudflare and actively protecting your application.</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <AlertCircle className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                            <span className="font-medium">Pending:</span>
                            <span>Policy created but not yet synchronized with Cloudflare. Click "Sync" to activate.</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <XCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
                            <span className="font-medium">Inactive:</span>
                            <span>Policy has been disabled or there was an error during synchronization.</span>
                        </div>
                    </CardContent>
                </Card>

                {/* Recent Activity */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle>Recent Activity</CardTitle>
                                <CardDescription>
                                    Recent changes and access attempts for this policy.
                                </CardDescription>
                            </div>
                            <Link href={`/organisations/${organisation.id}/policies/${policy.id}/access-logs`}>
                                <Button variant="outline" size="sm">
                                    <Activity className="h-4 w-4 mr-2" />
                                    View Access Logs
                                </Button>
                            </Link>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-center py-8 text-muted-foreground">
                            <Activity className="h-8 w-8 mx-auto mb-2" />
                            <p className="text-sm">Policy activity logs will appear here.</p>
                            <p className="text-xs mt-1">
                                Access attempts, rule changes, and sync events are logged automatically.
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
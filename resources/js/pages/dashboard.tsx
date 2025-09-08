import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem, type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import {
    Activity,
    AlertTriangle,
    Building,
    CheckCircle,
    CreditCard,
    ExternalLink,
    Eye,
    Mail,
    Plus,
    Settings,
    Shield,
    TrendingUp,
} from 'lucide-react';

interface DashboardData {
    overview: {
        organisations: {
            total: number;
            active: number;
            percentage: number;
            trend: string;
        };
        protectedApps: {
            total: number;
            active: number;
            pending: number;
            percentage: number;
            trend: string;
        };
        recentActivity: {
            total: number;
            allowed: number;
            blocked: number;
            percentage: number;
            trend: string;
        };
        systemHealth: {
            score: number;
            status: string;
            trend: string;
        };
    };
    organisations: Array<{
        id: number;
        name: string;
        slug: string;
        description: string;
        protectedApps: {
            total: number;
            active: number;
            pending: number;
        };
        tokenStatus: {
            status: string;
            badge: string;
            expiresInDays: number | null;
        };
        notificationsEnabled: boolean;
        recentActivity: {
            total: number;
            allowed: number;
            blocked: number;
        };
        healthScore: number;
        lastActivity: string | null;
    }>;
    recentActivity: Array<{
        id: string;
        type: string;
        organisation: string;
        organisation_id: number;
        user_email: string;
        application: string;
        timestamp: string;
        ip_address: string;
        country: string;
    }>;
    healthAlerts: Array<{
        type: string;
        severity: string;
        title: string;
        message: string;
        organisation_id: number;
        organisation_name: string;
        action_url: string;
        created_at: string;
    }>;
    analytics: {
        summary: {
            totalOrganisations: number;
            totalApps: number;
            activeApps: number;
            appUtilization: number;
        };
        trends: {
            daily: Array<{
                date: string;
                access_attempts: number;
                successful: number;
                blocked: number;
            }>;
            weekly: Array<{
                week: string;
                access_attempts: number;
                successful: number;
                blocked: number;
            }>;
        };
        topApplications: Array<{
            name: string;
            organisation: string;
            domain: string;
            access_count: number;
            status: string;
        }>;
        geographicDistribution: Array<{
            country: string;
            count: number;
            percentage: number;
        }>;
    };
    quickActions: Array<{
        title: string;
        description: string;
        icon: string;
        url: string;
        color: string;
    }>;
}

interface SubscriptionData {
    plan: {
        id: number;
        name: string;
        price: number;
        max_organizations: number;
        max_protected_endpoints: number;
    };
    usage: {
        plan: any;
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
    };
    canCreateOrganization: boolean;
    canCreateEndpoint: boolean;
    needsUpgrade: boolean;
    upgradeRecommendation: string | null;
}

interface DashboardPageProps {
    dashboard: DashboardData & {
        subscription: SubscriptionData;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];

function getHealthScoreColor(score: number): string {
    if (score >= 90) return 'text-green-600';
    if (score >= 75) return 'text-blue-600';
    if (score >= 50) return 'text-yellow-600';
    return 'text-red-600';
}

function getHealthScoreBg(score: number): string {
    if (score >= 90) return 'bg-green-50 border-green-200';
    if (score >= 75) return 'bg-blue-50 border-blue-200';
    if (score >= 50) return 'bg-yellow-50 border-yellow-200';
    return 'bg-red-50 border-red-200';
}

function getSeverityColor(severity: string): 'destructive' | 'secondary' | 'default' {
    switch (severity) {
        case 'critical':
            return 'destructive';
        case 'warning':
            return 'secondary';
        default:
            return 'default';
    }
}

export default function Dashboard() {
    const { dashboard: data } = usePage<SharedData & DashboardPageProps>().props;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="space-y-8">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
                        <p className="mt-1 text-lg text-muted-foreground">Complete overview of your protected applications</p>
                    </div>
                    <div className="flex items-center gap-3">
                        {!data.subscription.usage.organizations.unlimited && (
                            <div className="text-right text-sm text-muted-foreground">
                                <p>
                                    Organizations: {data.subscription.usage.organizations.current}/{data.subscription.usage.organizations.limit}
                                </p>
                                <p>
                                    Apps: {data.subscription.usage.endpoints.current}/
                                    {data.subscription.usage.endpoints.unlimited ? '∞' : data.subscription.usage.endpoints.limit}
                                </p>
                            </div>
                        )}
                        {data.subscription.canCreateOrganization ? (
                            <Link href="/organisations/create">
                                <Button size="lg">
                                    <Plus className="mr-2 h-5 w-5" />
                                    New Organization
                                </Button>
                            </Link>
                        ) : (
                            <Link href="/settings/billing">
                                <Button size="lg" variant="outline">
                                    <CreditCard className="mr-2 h-5 w-5" />
                                    Upgrade to Pro
                                </Button>
                            </Link>
                        )}
                    </div>
                </div>

                {/* Upgrade Notification */}
                {data.subscription.upgradeRecommendation && (
                    <Alert>
                        <AlertTriangle className="h-4 w-4" />
                        <AlertTitle className="flex items-center justify-between">
                            <span>Subscription Notice</span>
                            <Badge variant="secondary" className="text-xs mb-2">
                                {data.subscription.plan.name} Plan
                            </Badge>
                        </AlertTitle>
                        <AlertDescription className="flex items-center justify-between">
                            <span>{data.subscription.upgradeRecommendation}</span>
                            <Link href="/settings/billing">
                                <Button size="sm">
                                    <CreditCard className="mr-2 h-4 w-4" />
                                    Upgrade Now
                                </Button>
                            </Link>
                        </AlertDescription>
                    </Alert>
                )}

                {/* Overview Metrics */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                    {/* Organizations */}
                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Organizations</p>
                                    <div className="flex items-baseline gap-2">
                                        <p className="text-3xl font-bold text-primary">{data.overview.organisations.active}</p>
                                        <span className="text-lg text-muted-foreground">active</span>
                                    </div>
                                    <p className="mt-1 text-xs text-muted-foreground">
                                        {data.overview.organisations.total} total • {data.overview.organisations.percentage}% active
                                    </p>
                                </div>
                                <Building className="h-12 w-12 text-primary/60" />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Protected Apps */}
                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Protected Apps</p>
                                    <div className="flex items-baseline gap-2">
                                        <p className="text-3xl font-bold text-primary">{data.overview.protectedApps.active}</p>
                                        <span className="text-lg text-muted-foreground">active</span>
                                    </div>
                                    <p className="mt-1 text-xs text-muted-foreground">
                                        {data.overview.protectedApps.pending} pending • {data.overview.protectedApps.total} total
                                    </p>
                                </div>
                                <Shield className="h-12 w-12 text-primary/60" />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Recent Activity */}
                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Recent Activity</p>
                                    <div className="flex items-baseline gap-2">
                                        <p className="text-3xl font-bold text-primary">{data.overview.recentActivity.allowed}</p>
                                        <span className="text-lg text-muted-foreground">allowed</span>
                                    </div>
                                    <p className="mt-1 text-xs text-muted-foreground">
                                        {data.overview.recentActivity.blocked} blocked • {data.overview.recentActivity.percentage}% success
                                    </p>
                                </div>
                                <Activity className="h-12 w-12 text-primary/60" />
                            </div>
                        </CardContent>
                    </Card>

                    {/* System Health */}
                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">System Health</p>
                                    <div className="mt-1 flex items-center gap-2">
                                        <div
                                            className={`h-3 w-3 rounded-full ${
                                                data.overview.systemHealth.score >= 90
                                                    ? 'bg-green-500'
                                                    : data.overview.systemHealth.score >= 75
                                                      ? 'bg-blue-500'
                                                      : data.overview.systemHealth.score >= 50
                                                        ? 'bg-yellow-500'
                                                        : 'bg-red-500'
                                            }`}
                                        ></div>
                                        <p className="text-xl font-bold text-foreground">{data.overview.systemHealth.score}/100</p>
                                    </div>
                                    <p className="mt-1 text-xs text-muted-foreground capitalize">
                                        {data.overview.systemHealth.status.replace('_', ' ')}
                                    </p>
                                </div>
                                <CheckCircle className="h-12 w-12 text-primary/60" />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Health Alerts */}
                {data.healthAlerts.length > 0 && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <AlertTriangle className="h-5 w-5" />
                                Health Alerts
                            </CardTitle>
                            <CardDescription>Issues that require your attention</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {data.healthAlerts.map((alert, index) => (
                                    <Alert key={index}>
                                        <AlertTriangle className="h-4 w-4" />
                                        <AlertTitle className="flex items-center justify-between">
                                            <span>{alert.title}</span>
                                            <div className="flex items-center gap-2">
                                                <Badge variant={getSeverityColor(alert.severity)} className="text-xs">
                                                    {alert.severity}
                                                </Badge>
                                                <Badge variant="outline" className="text-xs">
                                                    {alert.organisation_name}
                                                </Badge>
                                            </div>
                                        </AlertTitle>
                                        <AlertDescription className="flex items-center justify-between">
                                            <span>{alert.message}</span>
                                            <Link href={alert.action_url}>
                                                <Button variant="outline" size="sm">
                                                    Fix Now
                                                </Button>
                                            </Link>
                                        </AlertDescription>
                                    </Alert>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}

                <div className="grid gap-6 lg:grid-cols-2">
                    {/* Organizations Overview */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle>Organizations</CardTitle>
                                    <CardDescription>Status and health overview</CardDescription>
                                </div>
                                <Link href="/organisations">
                                    <Button variant="outline" size="sm">
                                        View All
                                    </Button>
                                </Link>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {data.organisations.length === 0 ? (
                                    <div className="py-8 text-center">
                                        <Building className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                                        <h3 className="mb-2 text-lg font-medium text-foreground">No organizations yet</h3>
                                        <p className="mb-4 text-muted-foreground">Create your first organization to get started.</p>
                                        {data.subscription.canCreateOrganization ? (
                                            <Link href="/organisations/create">
                                                <Button>
                                                    <Plus className="mr-2 h-4 w-4" />
                                                    Create Organization
                                                </Button>
                                            </Link>
                                        ) : (
                                            <Link href="/settings/billing">
                                                <Button variant="outline">
                                                    <CreditCard className="mr-2 h-4 w-4" />
                                                    Upgrade to Create Organizations
                                                </Button>
                                            </Link>
                                        )}
                                    </div>
                                ) : (
                                    data.organisations.map((org) => (
                                        <div
                                            key={org.id}
                                            className="flex items-center justify-between rounded-lg border border-border p-4 transition-colors hover:bg-muted/30"
                                        >
                                            <div className="flex-1">
                                                <div className="mb-2 flex items-center gap-3">
                                                    <Link
                                                        href={`/organisations/${org.id}`}
                                                        className="font-medium transition-colors hover:text-primary"
                                                    >
                                                        {org.name}
                                                    </Link>
                                                    <Badge variant={org.tokenStatus.status === 'valid' ? 'default' : 'secondary'} className="text-xs">
                                                        {org.tokenStatus.badge}
                                                    </Badge>
                                                    {org.notificationsEnabled && (
                                                        <Badge variant="outline" className="text-xs">
                                                            <Mail className="mr-1 h-3 w-3" />
                                                            Notifications
                                                        </Badge>
                                                    )}
                                                </div>
                                                <div className="flex items-center gap-6 text-sm text-muted-foreground">
                                                    <span>{org.protectedApps.active} apps active</span>
                                                    <span>
                                                        Health: <span className={getHealthScoreColor(org.healthScore)}>{org.healthScore}/100</span>
                                                    </span>
                                                    {org.lastActivity && (
                                                        <span>Last activity: {new Date(org.lastActivity).toLocaleDateString()}</span>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Link href={`/organisations/${org.id}`}>
                                                    <Button variant="ghost" size="sm">
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                </Link>
                                                <Link href={`/organisations/${org.id}/edit`}>
                                                    <Button variant="ghost" size="sm">
                                                        <Settings className="h-4 w-4" />
                                                    </Button>
                                                </Link>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Recent Activity Feed */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle>Recent Activity</CardTitle>
                                    <CardDescription>Latest access attempts across all organizations</CardDescription>
                                </div>
                                <Link href="/organisations">
                                    <Button variant="outline" size="sm">
                                        <Activity className="mr-2 h-4 w-4" />
                                        View All Logs
                                    </Button>
                                </Link>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {data.recentActivity.length === 0 ? (
                                    <div className="py-8 text-center">
                                        <Activity className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                                        <p className="text-muted-foreground">No recent activity to display</p>
                                    </div>
                                ) : (
                                    data.recentActivity.slice(0, 8).map((activity, index) => (
                                        <div key={index} className="flex items-start justify-between border-b border-border py-3 last:border-0">
                                            <div className="flex flex-1 items-start gap-3">
                                                <div className="mt-1">
                                                    {activity.type === 'access_allowed' ? (
                                                        <CheckCircle className="h-5 w-5 text-green-500" />
                                                    ) : (
                                                        <AlertTriangle className="h-5 w-5 text-red-500" />
                                                    )}
                                                </div>
                                                <div className="flex-1 space-y-1">
                                                    <div className="flex items-center gap-2">
                                                        <p className="text-sm font-medium">{activity.user_email}</p>
                                                        <Badge
                                                            variant={activity.type === 'access_allowed' ? 'default' : 'destructive'}
                                                            className="text-xs"
                                                        >
                                                            {activity.type === 'access_allowed' ? 'Allowed' : 'Blocked'}
                                                        </Badge>
                                                        <Badge variant="outline" className="text-xs">
                                                            {activity.organisation}
                                                        </Badge>
                                                    </div>
                                                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                                        <span className="font-medium">{activity.application}</span>
                                                        <span>•</span>
                                                        <span>{activity.ip_address}</span>
                                                        <span>•</span>
                                                        <span className="uppercase">{activity.country}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="ml-4 text-right">
                                                <p className="text-xs font-medium text-foreground">
                                                    {new Date(activity.timestamp).toLocaleTimeString()}
                                                </p>
                                                <p className="text-xs text-muted-foreground">{new Date(activity.timestamp).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Analytics Summary */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <TrendingUp className="h-5 w-5" />
                            Analytics Summary
                        </CardTitle>
                        <CardDescription>Usage trends and insights across all organizations</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-6 md:grid-cols-2">
                            {/* Usage Summary */}
                            <div className="space-y-4">
                                <h4 className="text-sm font-medium text-foreground">Usage Overview</h4>
                                <div className="grid gap-4">
                                    <div className="flex items-center justify-between rounded-lg border border-border p-3">
                                        <div>
                                            <p className="text-sm text-muted-foreground">App Utilization</p>
                                            <p className="text-2xl font-bold text-primary">{data.analytics.summary.appUtilization}%</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs text-muted-foreground">{data.analytics.summary.activeApps} active</p>
                                            <p className="text-xs text-muted-foreground">{data.analytics.summary.totalApps} total</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Top Applications */}
                            <div className="space-y-4">
                                <h4 className="text-sm font-medium text-foreground">Top Applications</h4>
                                <div className="space-y-2">
                                    {data.analytics.topApplications.slice(0, 5).map((app, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center justify-between rounded-lg p-2 transition-colors hover:bg-muted/30"
                                        >
                                            <div className="flex-1">
                                                <p className="text-sm font-medium">{app.name}</p>
                                                <p className="text-xs text-muted-foreground">
                                                    {app.organisation} • {app.domain}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-sm font-medium">{app.access_count}</p>
                                                <p className="text-xs text-muted-foreground">accesses</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Quick Actions */}
                <Card>
                    <CardHeader>
                        <CardTitle>Quick Actions</CardTitle>
                        <CardDescription>Common tasks and shortcuts</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                            {data.quickActions.map((action, index) => (
                                <Link key={index} href={action.url}>
                                    <div className="cursor-pointer rounded-lg border border-border p-4 transition-colors hover:bg-muted/30">
                                        <div className="mb-2 flex items-center gap-3">
                                            <div
                                                className={`rounded-lg p-2 ${
                                                    action.color === 'primary'
                                                        ? 'bg-primary/10'
                                                        : action.color === 'success'
                                                          ? 'bg-green-50'
                                                          : action.color === 'info'
                                                            ? 'bg-blue-50'
                                                            : 'bg-orange-50'
                                                }`}
                                            >
                                                {action.icon === 'building' && <Building className="h-5 w-5" />}
                                                {action.icon === 'shield' && <Shield className="h-5 w-5" />}
                                                {action.icon === 'activity' && <Activity className="h-5 w-5" />}
                                                {action.icon === 'credit-card' && <CreditCard className="h-5 w-5" />}
                                            </div>
                                            <ExternalLink className="h-4 w-4 text-muted-foreground" />
                                        </div>
                                        <h4 className="mb-1 font-medium text-foreground">{action.title}</h4>
                                        <p className="text-sm text-muted-foreground">{action.description}</p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import { 
    ArrowLeft, 
    Key, 
    Activity, 
    Settings, 
    RefreshCw, 
    Trash2, 
    AlertTriangle, 
    CheckCircle2,
    TrendingUp,
    Clock,
    Zap,
    BarChart3
} from 'lucide-react';

interface Token {
    id: string;
    name: string;
    organization: {
        id: number;
        name: string;
    };
    scopes: string[];
    expires_at: string | null;
    last_used_at: string | null;
    is_expired: boolean;
    created_at: string;
}

interface UsageStats {
    total_requests: number;
    successful_requests: number;
    failed_requests: number;
    last_24h_requests: number;
    average_response_time: number;
}

interface ActivityLog {
    endpoint: string;
    method: string;
    response_status: number;
    response_time_ms: number;
    ip_address: string;
    created_at: string;
}

interface Props {
    token: Token;
    usageStats: UsageStats;
    recentActivity: ActivityLog[];
    availableScopes: Record<string, string>;
}

export default function ApiTokenShow({ token, usageStats, recentActivity, availableScopes }: Props) {
    const getStatusColor = (status: number) => {
        if (status >= 200 && status < 300) return 'text-green-600';
        if (status >= 400 && status < 500) return 'text-yellow-600';
        return 'text-red-600';
    };

    const formatResponseTime = (ms: number) => {
        return `${Math.round(ms)}ms`;
    };

    const successRate = usageStats.total_requests > 0 
        ? ((usageStats.successful_requests / usageStats.total_requests) * 100).toFixed(1) 
        : '0';

    return (
        <AppLayout>
            <Head title={`API Token: ${token.name}`} />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/api-tokens">
                            <Button variant="outline" size="sm">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Back
                            </Button>
                        </Link>
                        <div>
                            <div className="flex items-center gap-3">
                                <h1 className="text-2xl font-bold">{token.name}</h1>
                                {token.is_expired && (
                                    <Badge variant="destructive" className="flex items-center gap-1">
                                        <AlertTriangle className="h-3 w-3" />
                                        Expired
                                    </Badge>
                                )}
                            </div>
                            <p className="text-muted-foreground">
                                API token for {token.organization.name}
                            </p>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                        <Link href={`/api-tokens/${token.id}/edit`}>
                            <Button variant="outline">
                                <Settings className="mr-2 h-4 w-4" />
                                Edit
                            </Button>
                        </Link>
                        <Link
                            href={`/api-tokens/${token.id}/regenerate`}
                            method="post"
                            as="button"
                            onBefore={() => confirm('Are you sure you want to regenerate this token? The old token will stop working immediately.')}
                        >
                            <Button variant="outline">
                                <RefreshCw className="mr-2 h-4 w-4" />
                                Regenerate
                            </Button>
                        </Link>
                        <Link
                            href={`/api-tokens/${token.id}`}
                            method="delete"
                            as="button"
                            onBefore={() => confirm('Are you sure you want to delete this API token? This action cannot be undone.')}
                        >
                            <Button variant="outline" className="text-destructive hover:text-destructive">
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                            </Button>
                        </Link>
                    </div>
                </div>

                {token.is_expired && (
                    <Alert>
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription>
                            This API token has expired and is no longer functional. 
                            <Link href={`/api-tokens/${token.id}/regenerate`} className="underline ml-1">
                                Regenerate it
                            </Link> to continue using the API.
                        </AlertDescription>
                    </Alert>
                )}

                <Tabs defaultValue="overview" className="space-y-6">
                    <TabsList>
                        <TabsTrigger value="overview">Overview</TabsTrigger>
                        <TabsTrigger value="activity">Activity</TabsTrigger>
                        <TabsTrigger value="permissions">Permissions</TabsTrigger>
                    </TabsList>

                    <TabsContent value="overview" className="space-y-6">
                        {/* Usage Statistics */}
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                            <Card>
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between space-y-0 pb-2">
                                        <p className="text-sm font-medium">Total Requests</p>
                                        <BarChart3 className="h-4 w-4 text-muted-foreground" />
                                    </div>
                                    <div className="text-2xl font-bold">{usageStats.total_requests.toLocaleString()}</div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between space-y-0 pb-2">
                                        <p className="text-sm font-medium">Success Rate</p>
                                        <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
                                    </div>
                                    <div className="text-2xl font-bold">{successRate}%</div>
                                    <p className="text-xs text-muted-foreground">
                                        {usageStats.successful_requests} successful
                                    </p>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between space-y-0 pb-2">
                                        <p className="text-sm font-medium">Last 24h</p>
                                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                                    </div>
                                    <div className="text-2xl font-bold">{usageStats.last_24h_requests}</div>
                                    <p className="text-xs text-muted-foreground">requests</p>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between space-y-0 pb-2">
                                        <p className="text-sm font-medium">Avg Response</p>
                                        <Zap className="h-4 w-4 text-muted-foreground" />
                                    </div>
                                    <div className="text-2xl font-bold">
                                        {usageStats.average_response_time ? Math.round(usageStats.average_response_time) : 0}ms
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Token Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Key className="h-5 w-5" />
                                    Token Information
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid gap-4 md:grid-cols-2">
                                    <div>
                                        <label className="text-sm font-medium text-muted-foreground">Organization</label>
                                        <p className="font-medium">{token.organization.name}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-muted-foreground">Created</label>
                                        <p className="font-medium">{token.created_at}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-muted-foreground">Last Used</label>
                                        <p className="font-medium">{token.last_used_at || 'Never'}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-muted-foreground">Expires</label>
                                        <p className="font-medium">{token.expires_at || 'Never'}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="activity" className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Activity className="h-5 w-5" />
                                    Recent Activity
                                </CardTitle>
                                <CardDescription>
                                    Last 50 API requests made with this token
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {recentActivity.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                                        <Activity className="h-8 w-8 mb-2" />
                                        <p>No recent activity</p>
                                        <p className="text-sm">API requests will appear here once you start using the token</p>
                                    </div>
                                ) : (
                                    <div className="space-y-2">
                                        {recentActivity.map((log, index) => (
                                            <div key={index} className="flex items-center justify-between py-2 border-b last:border-b-0">
                                                <div className="flex items-center gap-3">
                                                    <Badge variant="outline" className="font-mono text-xs">
                                                        {log.method}
                                                    </Badge>
                                                    <span className="font-mono text-sm">{log.endpoint}</span>
                                                </div>
                                                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                                    <span className={`font-medium ${getStatusColor(log.response_status)}`}>
                                                        {log.response_status}
                                                    </span>
                                                    <span>{formatResponseTime(log.response_time_ms)}</span>
                                                    <span className="text-xs">{log.ip_address}</span>
                                                    <div className="flex items-center gap-1">
                                                        <Clock className="h-3 w-3" />
                                                        <span className="text-xs">{log.created_at}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="permissions" className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Token Permissions</CardTitle>
                                <CardDescription>
                                    API endpoints and operations this token can access
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {token.scopes.map((scope) => (
                                        <div key={scope} className="flex items-start justify-between p-3 border rounded-lg">
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2">
                                                    <Badge variant="outline" className="font-mono">
                                                        {scope}
                                                    </Badge>
                                                    {(scope.includes(':write') || scope.includes(':delete')) && (
                                                        <AlertTriangle className="h-4 w-4 text-amber-500" />
                                                    )}
                                                </div>
                                                <p className="text-sm text-muted-foreground">
                                                    {availableScopes[scope] || 'Custom permission'}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </AppLayout>
    );
}
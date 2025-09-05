import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type SharedData } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { ArrowLeft, Shield, User, Globe, Clock, CheckCircle, XCircle, AlertTriangle, RefreshCw, Search, Filter, Download, Activity, Eye } from 'lucide-react';
import { useState } from 'react';

interface AccessLog {
    id: string;
    timestamp: string;
    user_email: string;
    user_name?: string;
    application: string;
    application_uid?: string;
    action: string;
    allowed: boolean;
    ip_address: string;
    country: string;
    user_agent?: string;
    ray_id?: string;
    session_id?: string;
    purpose: string;
    app_type: string;
    created_at: string;
}

interface AccessLogsStats {
    total: number;
    allowed: number;
    blocked: number;
    unique_users: number;
    unique_applications: number;
    countries: Record<string, number>;
}

interface PolicyAccessLogsProps {
    organisation: any;
    policy: any;
    logs: AccessLog[];
    stats: AccessLogsStats;
    error?: string;
    filters: Record<string, any>;
}

export default function PolicyAccessLogs() {
    const { organisation, policy, logs, stats, error, filters } = usePage<SharedData & PolicyAccessLogsProps>().props;
    const [searchTerm, setSearchTerm] = useState(filters.user_email || '');
    const [selectedAction, setSelectedAction] = useState(filters.action || 'all');

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
        {
            title: 'Access Logs',
            href: `/organisations/${organisation.id}/policies/${policy.id}/access-logs`,
        },
    ];

    const getActionIcon = (log: AccessLog) => {
        if (log.allowed) {
            return <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />;
        } else {
            return <XCircle className="h-4 w-4 text-red-600 dark:text-red-400" />;
        }
    };

    const getActionBadge = (log: AccessLog) => {
        if (log.allowed) {
            return <Badge variant="secondary">Allowed</Badge>;
        } else {
            return <Badge variant="destructive">Blocked</Badge>;
        }
    };

    const handleFilter = () => {
        const params: Record<string, string> = {};
        if (searchTerm && searchTerm !== '') params.user_email = searchTerm;
        if (selectedAction && selectedAction !== 'all') params.action = selectedAction;
        
        router.get(`/organisations/${organisation.id}/policies/${policy.id}/access-logs`, params);
    };

    const clearFilters = () => {
        setSearchTerm('');
        setSelectedAction('all');
        router.get(`/organisations/${organisation.id}/policies/${policy.id}/access-logs`);
    };

    const handleRefresh = () => {
        router.reload();
    };

    const filteredLogs = logs.filter(log => {
        const matchesSearch = !searchTerm || 
            log.user_email.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesSearch;
    });

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`${policy.name} - Access Logs`} />

            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <div className="flex items-center gap-4 mb-2">
                            <Link href={`/organisations/${organisation.id}/policies/${policy.id}`}>
                                <Button variant="ghost" size="sm">
                                    <ArrowLeft className="h-4 w-4 mr-2" />
                                    Back to policy
                                </Button>
                            </Link>
                        </div>
                        <h1 className="text-2xl font-semibold text-foreground">Access Logs</h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Authentication attempts for <span className="font-medium">{policy.name}</span> ({policy.domain})
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button onClick={handleRefresh} variant="outline">
                            <RefreshCw className="h-4 w-4 mr-2" />
                            Refresh
                        </Button>
                        <Link href={`/organisations/${organisation.id}/access-logs`}>
                            <Button variant="outline">
                                <Activity className="h-4 w-4 mr-2" />
                                All Logs
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Policy Info */}
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                                <Shield className="h-5 w-5 text-blue-500" />
                                <span className="font-medium">{policy.name}</span>
                                <Badge variant={policy.status === 'active' ? 'default' : 'secondary'}>
                                    {policy.status}
                                </Badge>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                <Globe className="h-4 w-4" />
                                <span>{policy.domain}</span>
                            </div>
                            {policy.zone && (
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <span>Zone: {policy.zone.name}</span>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Error Display */}
                {error && (
                    <Card className="border-destructive/50">
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-2 text-destructive">
                                <AlertTriangle className="h-5 w-5" />
                                <span className="font-medium">Unable to fetch access logs:</span>
                            </div>
                            <p className="text-sm text-destructive mt-2">{error}</p>
                            <p className="text-xs text-muted-foreground mt-2">
                                This policy may not be synced with Cloudflare yet, or the API token needs Access logs permissions.
                            </p>
                        </CardContent>
                    </Card>
                )}

                {/* Statistics */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Card>
                        <CardContent className="pt-6">
                            <div className="text-2xl font-bold text-foreground">{stats.total}</div>
                            <div className="text-sm text-muted-foreground">Total Requests</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="pt-6">
                            <div className="text-2xl font-bold text-foreground">{stats.allowed}</div>
                            <div className="text-sm text-muted-foreground">Allowed</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="pt-6">
                            <div className="text-2xl font-bold text-foreground">{stats.blocked}</div>
                            <div className="text-sm text-muted-foreground">Blocked</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="pt-6">
                            <div className="text-2xl font-bold text-foreground">{stats.unique_users}</div>
                            <div className="text-sm text-muted-foreground">Unique Users</div>
                        </CardContent>
                    </Card>
                </div>

                {/* Filters */}
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex flex-col sm:flex-row gap-4">
                            <div className="flex-1">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        placeholder="Search by user email..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-10"
                                    />
                                </div>
                            </div>
                            
                            <Select value={selectedAction} onValueChange={setSelectedAction}>
                                <SelectTrigger className="w-32">
                                    <SelectValue placeholder="Action" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All actions</SelectItem>
                                    <SelectItem value="allow">Allow</SelectItem>
                                    <SelectItem value="block">Block</SelectItem>
                                </SelectContent>
                            </Select>

                            <div className="flex gap-2">
                                <Button onClick={handleFilter} variant="outline">
                                    <Filter className="h-4 w-4 mr-2" />
                                    Apply
                                </Button>
                                {(searchTerm !== '' || selectedAction !== 'all') && (
                                    <Button onClick={clearFilters} variant="ghost">
                                        Clear
                                    </Button>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Logs List */}
                {filteredLogs.length === 0 ? (
                    <Card>
                        <CardContent className="flex flex-col items-center justify-center py-12">
                            <Shield className="h-12 w-12 text-muted-foreground mb-4" />
                            <h3 className="text-lg font-medium text-foreground mb-2">
                                {error ? 'Unable to load logs' : 'No access logs found'}
                            </h3>
                            <p className="text-muted-foreground text-center">
                                {error 
                                    ? 'Make sure this policy is synced with Cloudflare and your API token has the correct permissions.'
                                    : logs.length === 0 
                                        ? 'Access logs will appear here when users attempt to access this application.'
                                        : 'Try adjusting your search terms or filters.'
                                }
                            </p>
                            {!error && policy.status === 'pending' && (
                                <div className="mt-4">
                                    <Link href={`/organisations/${organisation.id}/policies/${policy.id}`}>
                                        <Button variant="outline">
                                            <RefreshCw className="h-4 w-4 mr-2" />
                                            Sync Policy First
                                        </Button>
                                    </Link>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                ) : (
                    <div className="border border-border rounded-lg overflow-hidden">
                        <div className="bg-muted/50 px-4 py-3 border-b border-border">
                            <div className="flex items-center text-sm font-medium text-muted-foreground">
                                <div className="w-16">Status</div>
                                <div className="min-w-0 flex-1">User</div>
                                <div className="w-32">IP Address</div>
                                <div className="w-40">Time</div>
                                <div className="w-20">Ray ID</div>
                            </div>
                        </div>
                        <div className="divide-y divide-border">
                            {filteredLogs.map((log) => (
                                <div key={log.id} className="px-4 py-3 hover:bg-muted/30 transition-colors">
                                    <div className="flex items-center">
                                        <div className="w-16 flex items-center">
                                            <div className="flex items-center gap-1">
                                                {getActionIcon(log)}
                                                <span className="text-xs">
                                                    {getActionBadge(log)}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <div className="font-medium text-foreground truncate">
                                                {log.user_email}
                                            </div>
                                            {log.user_name && (
                                                <div className="text-xs text-muted-foreground truncate">
                                                    {log.user_name}
                                                </div>
                                            )}
                                        </div>
                                        <div className="w-32">
                                            <div className="text-sm text-foreground">
                                                {log.ip_address}
                                            </div>
                                            {log.country !== 'Unknown' && (
                                                <div className="text-xs text-muted-foreground">
                                                    {log.country}
                                                </div>
                                            )}
                                        </div>
                                        <div className="w-40 text-xs text-muted-foreground">
                                            {new Date(log.created_at).toLocaleString()}
                                        </div>
                                        <div className="w-20">
                                            {log.ray_id && (
                                                <code className="text-xs text-muted-foreground font-mono">
                                                    {log.ray_id.substring(0, 8)}
                                                </code>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
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

interface AccessLogsProps {
    organisation: any;
    logs: AccessLog[];
    stats: AccessLogsStats;
    error?: string;
    filters: Record<string, any>;
    policies: any[];
}

export default function AccessLogs() {
    const { organisation, logs, stats, error, filters, policies } = usePage<SharedData & AccessLogsProps>().props;
    const [searchTerm, setSearchTerm] = useState(filters.user_email || '');
    const [selectedAction, setSelectedAction] = useState(filters.action || 'all');
    const [selectedPolicy, setSelectedPolicy] = useState(filters.app_uid || 'all');

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
            title: 'Access Logs',
            href: `/organisations/${organisation.id}/access-logs`,
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
        if (selectedPolicy && selectedPolicy !== 'all') params.app_uid = selectedPolicy;
        
        router.get(`/organisations/${organisation.id}/access-logs`, params);
    };

    const clearFilters = () => {
        setSearchTerm('');
        setSelectedAction('all');
        setSelectedPolicy('all');
        router.get(`/organisations/${organisation.id}/access-logs`);
    };

    const handleRefresh = () => {
        router.reload();
    };

    const filteredLogs = logs.filter(log => {
        const matchesSearch = !searchTerm || 
            log.user_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            log.application.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesSearch;
    });

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`${organisation.name} - Access Logs`} />

            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <div className="flex items-center gap-4 mb-2">
                            <Link href={`/organisations/${organisation.id}`}>
                                <Button variant="ghost" size="sm">
                                    <ArrowLeft className="h-4 w-4 mr-2" />
                                    Back to organization
                                </Button>
                            </Link>
                        </div>
                        <h1 className="text-2xl font-semibold text-foreground">Access Logs</h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            View authentication attempts and access logs from Cloudflare Access.
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button onClick={handleRefresh} variant="outline">
                            <RefreshCw className="h-4 w-4 mr-2" />
                            Refresh
                        </Button>
                        <Button variant="outline">
                            <Download className="h-4 w-4 mr-2" />
                            Export
                        </Button>
                    </div>
                </div>

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
                                Make sure your Cloudflare API token has the correct permissions for Access logs.
                            </p>
                        </CardContent>
                    </Card>
                )}

                {/* Statistics */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
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
                    <Card>
                        <CardContent className="pt-6">
                            <div className="text-2xl font-bold text-foreground">{stats.unique_applications}</div>
                            <div className="text-sm text-muted-foreground">Applications</div>
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
                                        placeholder="Search by user email or application..."
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

                            <Select value={selectedPolicy} onValueChange={setSelectedPolicy}>
                                <SelectTrigger className="w-48">
                                    <SelectValue placeholder="Application" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All applications</SelectItem>
                                    {policies.map((policy) => (
                                        <SelectItem key={policy.id} value={policy.cf_application_id || ''}>
                                            {policy.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            <div className="flex gap-2">
                                <Button onClick={handleFilter} variant="outline">
                                    <Filter className="h-4 w-4 mr-2" />
                                    Apply
                                </Button>
                                {(searchTerm !== '' || selectedAction !== 'all' || selectedPolicy !== 'all') && (
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
                                    ? 'Check your API token permissions and try again.'
                                    : logs.length === 0 
                                        ? 'Access logs will appear here when users attempt to access your protected applications.'
                                        : 'Try adjusting your search terms or filters.'
                                }
                            </p>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="border border-border rounded-lg overflow-hidden">
                        <div className="bg-muted/50 px-4 py-3 border-b border-border">
                            <div className="grid grid-cols-12 gap-3 items-center text-sm font-medium text-muted-foreground">
                                <div className="col-span-2">Status</div>
                                <div className="col-span-2">Event</div>
                                <div className="col-span-2">User</div>
                                <div className="col-span-2">Application</div>
                                <div className="col-span-2">IP Address</div>
                                <div className="col-span-2">Time</div>
                            </div>
                        </div>
                        <div className="divide-y divide-border">
                            {filteredLogs.map((log) => (
                                <div key={log.id} className="px-4 py-3 hover:bg-muted/30 transition-colors">
                                    <div className="grid grid-cols-12 gap-3 items-center">
                                        <div className="col-span-2">
                                            <div className="flex items-center gap-1.5">
                                                {getActionIcon(log)}
                                                <div className="text-xs">
                                                    {getActionBadge(log)}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-span-2 min-w-0">
                                            <div className="text-sm font-medium text-foreground capitalize">
                                                {log.action || 'login'}
                                            </div>
                                            {log.purpose && (
                                                <div className="text-xs text-muted-foreground truncate">
                                                    {log.purpose}
                                                </div>
                                            )}
                                        </div>
                                        <div className="col-span-2 min-w-0">
                                            <div className="text-sm text-foreground truncate">
                                                {log.user_email}
                                            </div>
                                            {log.user_name && (
                                                <div className="text-xs text-muted-foreground truncate">
                                                    {log.user_name}
                                                </div>
                                            )}
                                        </div>
                                        <div className="col-span-2 min-w-0">
                                            <div className="text-sm text-foreground truncate">
                                                {log.application}
                                            </div>
                                        </div>
                                        <div className="col-span-2 min-w-0">
                                            <div className="text-sm text-foreground">
                                                {log.ip_address}
                                            </div>
                                            {log.country !== 'Unknown' && (
                                                <div className="text-xs text-muted-foreground uppercase">
                                                    {log.country}
                                                </div>
                                            )}
                                        </div>
                                        <div className="col-span-2 min-w-0">
                                            <div className="text-xs text-muted-foreground">
                                                <div>{new Date(log.created_at).toLocaleDateString()}</div>
                                                <div>{new Date(log.created_at).toLocaleTimeString()}</div>
                                            </div>
                                            {log.ray_id && (
                                                <div className="text-xs text-muted-foreground/70 font-mono mt-1">
                                                    {log.ray_id.substring(0, 8)}...
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Countries Summary */}
                {Object.keys(stats.countries).length > 0 && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Access by Country</CardTitle>
                            <CardDescription>
                                Geographic distribution of access requests.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {Object.entries(stats.countries)
                                    .sort(([,a], [,b]) => b - a)
                                    .slice(0, 8)
                                    .map(([country, count]) => (
                                        <div key={country} className="text-center">
                                            <div className="text-xl font-bold text-foreground">{count}</div>
                                            <div className="text-sm text-muted-foreground">{country}</div>
                                        </div>
                                    ))}
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </AppLayout>
    );
}
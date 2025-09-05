import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type SharedData } from '@/types';
import { type OrganisationShowProps, type PolicyIndexProps } from '@/types/cloudflare';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { Shield, Settings, Eye, Edit, Trash2, RefreshCw, CheckSquare, Square, CheckCircle, AlertTriangle, Activity, Lock, UserCheck, Search, Filter } from 'lucide-react';
import { useState } from 'react';

interface AccessLog {
    id: string;
    user_email: string;
    user_name?: string;
    application: string;
    application_uid?: string;
    action: string;
    allowed: boolean;
    ip_address: string;
    country: string;
    purpose?: string;
    app_type?: string;
    created_at: string;
    ray_id?: string;
}

interface LogStats {
    total: number;
    allowed: number;
    blocked: number;
    unique_users: number;
}

interface EnhancedOrganisationShowProps extends OrganisationShowProps, PolicyIndexProps {
    recentLogs: AccessLog[];
    logStats: LogStats;
}

export default function OrganisationShow() {
    const { organisation, policies, zones, recentLogs, logStats } = usePage<SharedData & EnhancedOrganisationShowProps>().props;
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('all');
    const [selectedPolicies, setSelectedPolicies] = useState<number[]>([]);
    const [isSelectAllChecked, setIsSelectAllChecked] = useState(false);

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Organizations',
            href: '/organisations',
        },
        {
            title: organisation.name,
            href: `/organisations/${organisation.id}`,
        },
    ];

    const getTokenStatus = () => {
        if (!organisation.token_last_validated_at) {
            return {
                status: 'Setup Required',
                color: 'text-yellow-600',
                bgColor: 'bg-yellow-50',
                borderColor: 'border-yellow-200',
                icon: <AlertTriangle className="h-5 w-5 text-yellow-600" />,
            };
        }

        const lastValidated = new Date(organisation.token_last_validated_at);
        const now = new Date();
        const hoursSince = (now.getTime() - lastValidated.getTime()) / (1000 * 60 * 60);

        if (hoursSince < 24) {
            return {
                status: 'Protection Active',
                color: 'text-green-600',
                bgColor: 'bg-green-50',
                borderColor: 'border-green-200',
                icon: <CheckCircle className="h-5 w-5 text-green-600" />,
            };
        } else {
            return {
                status: 'Needs Validation',
                color: 'text-yellow-600',
                bgColor: 'bg-yellow-50',
                borderColor: 'border-yellow-200',
                icon: <AlertTriangle className="h-5 w-5 text-yellow-600" />,
            };
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active': return 'default';
            case 'pending': return 'secondary';
            case 'inactive': return 'destructive';
            default: return 'secondary';
        }
    };

    const filteredPolicies = policies.data.filter(policy =>
        policy.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        policy.domain.toLowerCase().includes(searchTerm.toLowerCase())
    ).filter(policy => 
        selectedStatus === 'all' || policy.status === selectedStatus
    );

    const togglePolicySelection = (policyId: number) => {
        setSelectedPolicies(prev => 
            prev.includes(policyId) 
                ? prev.filter(id => id !== policyId)
                : [...prev, policyId]
        );
    };

    const toggleSelectAll = () => {
        if (isSelectAllChecked) {
            setSelectedPolicies([]);
            setIsSelectAllChecked(false);
        } else {
            setSelectedPolicies(filteredPolicies.map(p => p.id));
            setIsSelectAllChecked(true);
        }
    };

    const handleBulkDelete = () => {
        if (selectedPolicies.length === 0) return;
        
        if (confirm(`Are you sure you want to remove protection from ${selectedPolicies.length} selected apps?\\n\\nThis action cannot be undone.`)) {
            selectedPolicies.forEach(policyId => {
                router.delete(`/organisations/${organisation.id}/policies/${policyId}`);
            });
            setSelectedPolicies([]);
            setIsSelectAllChecked(false);
        }
    };

    const tokenStatus = getTokenStatus();

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`${organisation.name} - Protected Apps`} />

            <div className="space-y-8">
                {/* Header with Protection Status */}
                <div className="flex items-start justify-between">
                    <div className="space-y-3">
                        <div className="flex items-center gap-4">
                            <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
                                <Shield className="h-8 w-8 text-primary" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-foreground">{organisation.name}</h1>
                                <p className="text-lg text-muted-foreground mt-1">Protected apps and security overview</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 ml-16">
                            <div className={`flex items-center gap-2 px-3 py-1 rounded-md ${tokenStatus.bgColor} ${tokenStatus.borderColor} border`}>
                                {tokenStatus.icon}
                                <span className={`text-sm font-medium ${tokenStatus.color}`}>
                                    {tokenStatus.status}
                                </span>
                            </div>
                            <span className="text-sm text-muted-foreground">
                                {policies.data.length} apps protected • {policies.data.filter(p => p.status === 'active').length} active
                            </span>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        {organisation.token_last_validated_at ? (
                            <Link href={`/organisations/${organisation.id}/policies/create`}>
                                <Button size="lg">
                                    <Shield className="h-5 w-5 mr-2" />
                                    Protect New App
                                </Button>
                            </Link>
                        ) : (
                            <div className="text-right">
                                <p className="text-sm text-muted-foreground mb-2">Setup required to protect apps</p>
                                <Link href={`/organisations/${organisation.id}/edit`}>
                                    <Button>
                                        <Settings className="h-4 w-4 mr-2" />
                                        Get Started
                                    </Button>
                                </Link>
                            </div>
                        )}
                    </div>
                </div>

                {/* Real-time Stats Cards */}
                <div className="grid gap-6 md:grid-cols-3">
                    {/* Protection Status */}
                    <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Protected Apps</p>
                                    <div className="flex items-baseline gap-2">
                                        <p className="text-3xl font-bold text-primary">{policies.data.filter(p => p.status === 'active').length}</p>
                                        <span className="text-lg text-muted-foreground">active</span>
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        {policies.data.length} total apps • {policies.data.filter(p => p.require_mfa).length} with MFA
                                    </p>
                                </div>
                                <Shield className="h-12 w-12 text-primary" />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Today's Activity */}
                    <Card className="bg-gradient-to-br from-green-500/5 to-green-500/10 border-green-500/20">
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Today's Access</p>
                                    <div className="flex items-baseline gap-2">
                                        <p className="text-3xl font-bold text-green-600 dark:text-green-400">{logStats.allowed}</p>
                                        <span className="text-lg text-muted-foreground">allowed</span>
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        {logStats.blocked} blocked • {logStats.unique_users} unique users
                                    </p>
                                </div>
                                <CheckCircle className="h-12 w-12 text-green-500" />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Security Health */}
                    <Card className="bg-gradient-to-br from-blue-500/5 to-blue-500/10 border-blue-500/20">
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Security Health</p>
                                    <div className="flex items-center gap-2 mt-1">
                                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                        <p className="text-xl font-bold text-foreground">All Good</p>
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        No security issues detected
                                    </p>
                                </div>
                                <Lock className="h-12 w-12 text-blue-500" />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Protected Sites List */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle>Protected Apps</CardTitle>
                                <CardDescription>
                                    Manage and monitor your protected applications
                                </CardDescription>
                            </div>
                            <div className="flex items-center gap-3">
                                {selectedPolicies.length > 0 && (
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm text-muted-foreground">
                                            {selectedPolicies.length} selected
                                        </span>
                                        <Button
                                            variant="destructive"
                                            size="sm"
                                            onClick={handleBulkDelete}
                                        >
                                            <Trash2 className="h-4 w-4 mr-2" />
                                            Remove Protection
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {/* Search and Filters */}
                        <div className="flex items-center gap-4 mb-6">
                            <div className="relative flex-1">
                                <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    placeholder="Search protected apps..."
                                    className="pl-9"
                                />
                            </div>
                            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                                <SelectTrigger className="w-40">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Status</SelectItem>
                                    <SelectItem value="active">Active</SelectItem>
                                    <SelectItem value="pending">Pending</SelectItem>
                                    <SelectItem value="inactive">Inactive</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Sites List */}
                        {filteredPolicies.length === 0 ? (
                            <div className="text-center py-12">
                                <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                <h3 className="text-lg font-medium text-foreground mb-2">No protected apps yet</h3>
                                <p className="text-muted-foreground mb-4">
                                    Get started by protecting your first application.
                                </p>
                                {organisation.token_last_validated_at ? (
                                    <Link href={`/organisations/${organisation.id}/policies/create`}>
                                        <Button>
                                            <Shield className="h-4 w-4 mr-2" />
                                            Protect Your First App
                                        </Button>
                                    </Link>
                                ) : (
                                    <Link href={`/organisations/${organisation.id}/edit`}>
                                        <Button>
                                            <Settings className="h-4 w-4 mr-2" />
                                            Setup Protection
                                        </Button>
                                    </Link>
                                )}
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {/* Table Header */}
                                <div className="border border-border rounded-lg overflow-hidden">
                                    <div className="bg-muted/50 px-4 py-3 border-b border-border">
                                        <div className="grid grid-cols-12 gap-4 items-center text-sm font-medium text-muted-foreground">
                                            <div className="col-span-1 flex justify-center">
                                                <button
                                                    onClick={toggleSelectAll}
                                                    className="w-4 h-4 text-muted-foreground hover:text-foreground"
                                                >
                                                    {isSelectAllChecked ? (
                                                        <CheckSquare className="h-4 w-4" />
                                                    ) : (
                                                        <Square className="h-4 w-4" />
                                                    )}
                                                </button>
                                            </div>
                                            <div className="col-span-3">App Name</div>
                                            <div className="col-span-2">Protection</div>
                                            <div className="col-span-2">URL</div>
                                            <div className="col-span-1">Access</div>
                                            <div className="col-span-2">Protected</div>
                                            <div className="col-span-1">Actions</div>
                                        </div>
                                    </div>
                                    <div className="divide-y divide-border">
                                        {filteredPolicies.map((policy) => (
                                            <div key={policy.id} className="px-4 py-4 hover:bg-muted/30 transition-colors">
                                                <div className="grid grid-cols-12 gap-4 items-center">
                                                    <div className="col-span-1 flex justify-center">
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => togglePolicySelection(policy.id)}
                                                            className="w-8 h-8 p-0"
                                                        >
                                                            {selectedPolicies.includes(policy.id) ? (
                                                                <CheckSquare className="h-4 w-4" />
                                                            ) : (
                                                                <Square className="h-4 w-4" />
                                                            )}
                                                        </Button>
                                                    </div>
                                                    <div className="col-span-3">
                                                            <div className="flex items-center gap-2 mb-1">
                                                                <Link 
                                                                    href={`/organisations/${organisation.id}/policies/${policy.id}`}
                                                                    className="font-medium hover:text-primary transition-colors truncate"
                                                                >
                                                                    {policy.name}
                                                                </Link>
                                                                {policy.require_mfa && (
                                                                    <Badge variant="outline" className="text-xs">MFA</Badge>
                                                                )}
                                                            </div>
                                                            <div className="text-xs text-muted-foreground">
                                                                {policy.zone?.name}
                                                            </div>
                                                        </div>
                                                    <div className="col-span-2">
                                                        <Badge variant={getStatusColor(policy.status)} className="text-xs">
                                                            {policy.status}
                                                        </Badge>
                                                    </div>
                                                    <div className="col-span-2">
                                                        <div className="text-sm text-foreground truncate">
                                                            {policy.domain}
                                                        </div>
                                                        {policy.path && policy.path !== '/' && (
                                                            <div className="text-xs text-muted-foreground truncate">
                                                                {policy.path}
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="col-span-1 text-sm text-muted-foreground">
                                                        {policy.rules?.length || 0}
                                                    </div>
                                                    <div className="col-span-2 text-xs text-muted-foreground">
                                                        {new Date(policy.created_at).toLocaleDateString()}
                                                    </div>
                                                    <div className="col-span-1 flex items-center gap-1">
                                                            <Link href={`/organisations/${organisation.id}/policies/${policy.id}`}>
                                                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0" title="View App">
                                                                    <Eye className="h-3 w-3" />
                                                                </Button>
                                                            </Link>
                                                            <Link href={`/organisations/${organisation.id}/policies/${policy.id}/edit`}>
                                                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0" title="Edit Protection">
                                                                    <Edit className="h-3 w-3" />
                                                                </Button>
                                                            </Link>
                                                            {policy.status === 'pending' && (
                                                                <Button 
                                                                    variant="ghost" 
                                                                    size="sm"
                                                                    className="h-8 w-8 p-0"
                                                                    title="Update Protection"
                                                                    onClick={() => router.post(`/organisations/${organisation.id}/policies/${policy.id}/sync`)}
                                                                >
                                                                    <RefreshCw className="h-3 w-3" />
                                                                </Button>
                                                            )}
                                                            <Button 
                                                                variant="ghost" 
                                                                size="sm"
                                                                className="h-8 w-8 p-0"
                                                                title="Remove Protection"
                                                                onClick={() => {
                                                                    if (confirm(`Are you sure you want to remove protection from "${policy.name}"?`)) {
                                                                        router.delete(`/organisations/${organisation.id}/policies/${policy.id}`);
                                                                    }
                                                                }}
                                                            >
                                                                <Trash2 className="h-3 w-3 text-destructive" />
                                                            </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Recent Activity */}
                {recentLogs.length > 0 && (
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle>Recent Activity</CardTitle>
                                    <CardDescription>Latest access attempts across all protected apps</CardDescription>
                                </div>
                                <Link href={`/organisations/${organisation.id}/access-logs`}>
                                    <Button variant="outline" size="sm">
                                        <Activity className="h-4 w-4 mr-2" />
                                        View All Logs
                                    </Button>
                                </Link>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {recentLogs.slice(0, 10).map((log, index) => (
                                    <div key={index} className="flex items-start justify-between py-3 border-b border-border last:border-0">
                                        <div className="flex items-start gap-3 flex-1">
                                            <div className="mt-1">
                                                {log.allowed ? (
                                                    <CheckCircle className="h-5 w-5 text-green-500" />
                                                ) : (
                                                    <AlertTriangle className="h-5 w-5 text-red-500" />
                                                )}
                                            </div>
                                            <div className="flex-1 space-y-1">
                                                <div className="flex items-center gap-2">
                                                    <p className="text-sm font-medium">{log.user_email}</p>
                                                    <Badge variant={log.allowed ? 'default' : 'destructive'} className="text-xs">
                                                        {log.allowed ? 'Allowed' : 'Blocked'}
                                                    </Badge>
                                                    {log.purpose && (
                                                        <Badge variant="outline" className="text-xs">
                                                            {log.purpose}
                                                        </Badge>
                                                    )}
                                                </div>
                                                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                                    <span className="font-medium">{log.application}</span>
                                                    <span>•</span>
                                                    <span>{log.ip_address}</span>
                                                    <span>•</span>
                                                    <span className="uppercase">{log.country}</span>
                                                    {log.action && log.action !== 'unknown' && (
                                                        <>
                                                            <span>•</span>
                                                            <span>{log.action}</span>
                                                        </>
                                                    )}
                                                </div>
                                                {log.ray_id && (
                                                    <div className="text-xs text-muted-foreground/70">
                                                        Ray ID: {log.ray_id}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <div className="text-right ml-4">
                                            <p className="text-xs font-medium text-foreground">
                                                {new Date(log.created_at).toLocaleTimeString()}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                {new Date(log.created_at).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            {recentLogs.length > 10 && (
                                <div className="pt-4 text-center">
                                    <Link href={`/organisations/${organisation.id}/access-logs`}>
                                        <Button variant="outline" size="sm" className="w-full">
                                            View All {recentLogs.length}+ Access Logs
                                        </Button>
                                    </Link>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                )}
            </div>
        </AppLayout>
    );
}
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type SharedData } from '@/types';
import { type OrganisationShowProps, type PolicyIndexProps } from '@/types/cloudflare';
import { Head, Link, router, usePage } from '@inertiajs/react';
import {
    Activity,
    AlertTriangle,
    CheckCircle,
    CheckSquare,
    Edit,
    Eye,
    Lock,
    RefreshCw,
    Search,
    Settings,
    Shield,
    Square,
    Trash2,
} from 'lucide-react';
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
            case 'active':
                return 'default';
            case 'pending':
                return 'secondary';
            case 'inactive':
                return 'destructive';
            default:
                return 'secondary';
        }
    };

    const filteredPolicies = policies.data
        .filter(
            (policy) =>
                policy.name.toLowerCase().includes(searchTerm.toLowerCase()) || policy.domain.toLowerCase().includes(searchTerm.toLowerCase()),
        )
        .filter((policy) => selectedStatus === 'all' || policy.status === selectedStatus);

    const togglePolicySelection = (policyId: number) => {
        setSelectedPolicies((prev) => (prev.includes(policyId) ? prev.filter((id) => id !== policyId) : [...prev, policyId]));
    };

    const toggleSelectAll = () => {
        if (isSelectAllChecked) {
            setSelectedPolicies([]);
            setIsSelectAllChecked(false);
        } else {
            setSelectedPolicies(filteredPolicies.map((p) => p.id));
            setIsSelectAllChecked(true);
        }
    };

    const handleBulkDelete = () => {
        if (selectedPolicies.length === 0) return;

        if (confirm(`Are you sure you want to remove protection from ${selectedPolicies.length} selected apps?\\n\\nThis action cannot be undone.`)) {
            selectedPolicies.forEach((policyId) => {
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
                            <div className="rounded-lg border border-primary/20 bg-white p-3">
                                <Shield className="h-8 w-8 text-primary" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-foreground">{organisation.name}</h1>
                                <p className="mt-1 text-lg text-muted-foreground">Protected apps and security overview</p>
                            </div>
                        </div>
                        <div className="ml-16 flex items-center gap-4">
                            <div className={`flex items-center gap-2 rounded-md px-3 py-1 ${tokenStatus.bgColor} ${tokenStatus.borderColor} border`}>
                                {tokenStatus.icon}
                                <span className={`text-sm font-medium ${tokenStatus.color}`}>{tokenStatus.status}</span>
                            </div>
                            <span className="text-sm text-muted-foreground">
                                {policies.data.length} apps protected • {policies.data.filter((p) => p.status === 'active').length} active
                            </span>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        {organisation.token_last_validated_at ? (
                            <Link href={`/organisations/${organisation.id}/policies/create`}>
                                <Button size="lg">
                                    <Shield className="mr-2 h-5 w-5" />
                                    Protect New App
                                </Button>
                            </Link>
                        ) : (
                            <div className="text-right">
                                <p className="mb-2 text-sm text-muted-foreground">Setup required to protect apps</p>
                                <Link href={`/organisations/${organisation.id}/edit`}>
                                    <Button>
                                        <Settings className="mr-2 h-4 w-4" />
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
                    <Card className="border-primary/20 bg-white">
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Protected Apps</p>
                                    <div className="flex items-baseline gap-2">
                                        <p className="text-3xl font-bold text-primary">{policies.data.filter((p) => p.status === 'active').length}</p>
                                        <span className="text-lg text-muted-foreground">active</span>
                                    </div>
                                    <p className="mt-1 text-xs text-muted-foreground">
                                        {policies.data.length} total apps • {policies.data.filter((p) => p.require_mfa).length} with MFA
                                    </p>
                                </div>
                                <Shield className="h-12 w-12 text-primary/60" />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Today's Activity */}
                    <Card className="border-primary/20 bg-white">
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Today's Access</p>
                                    <div className="flex items-baseline gap-2">
                                        <p className="text-3xl font-bold text-primary">{logStats.allowed}</p>
                                        <span className="text-lg text-muted-foreground">allowed</span>
                                    </div>
                                    <p className="mt-1 text-xs text-muted-foreground">
                                        {logStats.blocked} blocked • {logStats.unique_users} unique users
                                    </p>
                                </div>
                                <CheckCircle className="h-12 w-12 text-primary/60" />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Security Health */}
                    <Card className="border-primary/20 bg-white">
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Security Health</p>
                                    <div className="mt-1 flex items-center gap-2">
                                        <div className="h-3 w-3 rounded-full bg-green-500/50"></div>
                                        <p className="text-xl font-bold text-foreground">All Good</p>
                                    </div>
                                    <p className="mt-1 text-xs text-muted-foreground">No security issues detected</p>
                                </div>
                                <Lock className="h-12 w-12 text-primary/60" />
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
                                <CardDescription>Manage and monitor your protected applications</CardDescription>
                            </div>
                            <div className="flex items-center gap-3">
                                {selectedPolicies.length > 0 && (
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm text-muted-foreground">{selectedPolicies.length} selected</span>
                                        <Button variant="destructive" size="sm" onClick={handleBulkDelete}>
                                            <Trash2 className="mr-2 h-4 w-4" />
                                            Remove Protection
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {/* Search and Filters */}
                        <div className="mb-6 flex items-center gap-4">
                            <div className="relative flex-1">
                                <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-muted-foreground" />
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
                            <div className="py-12 text-center">
                                <Shield className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                                <h3 className="mb-2 text-lg font-medium text-foreground">No protected apps yet</h3>
                                <p className="mb-4 text-muted-foreground">Get started by protecting your first application.</p>
                                {organisation.token_last_validated_at ? (
                                    <Link href={`/organisations/${organisation.id}/policies/create`}>
                                        <Button>
                                            <Shield className="mr-2 h-4 w-4" />
                                            Protect Your First App
                                        </Button>
                                    </Link>
                                ) : (
                                    <Link href={`/organisations/${organisation.id}/edit`}>
                                        <Button>
                                            <Settings className="mr-2 h-4 w-4" />
                                            Setup Protection
                                        </Button>
                                    </Link>
                                )}
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <>
                                {/* Desktop Table */}
                                <div className="hidden lg:block">
                                    <div className="overflow-hidden rounded-lg border border-border">
                                        {/* Table Header */}
                                        <div className="border-b border-border bg-muted/50 px-4 py-3">
                                            <div className="grid grid-cols-12 items-center gap-4 text-sm font-medium text-muted-foreground">
                                                <div className="col-span-1 flex justify-center">
                                                    <button onClick={toggleSelectAll} className="h-4 w-4 text-muted-foreground hover:text-foreground">
                                                        {isSelectAllChecked ? <CheckSquare className="h-4 w-4" /> : <Square className="h-4 w-4" />}
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
                                        {/* Desktop Table Body */}
                                        <div className="divide-y divide-border">
                                            {filteredPolicies.map((policy) => (
                                                <div key={policy.id} className="px-4 py-4 transition-colors hover:bg-muted/30">
                                                    <div className="grid grid-cols-12 items-center gap-4">
                                                        <div className="col-span-1 flex justify-center">
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => togglePolicySelection(policy.id)}
                                                                className="h-8 w-8 p-0"
                                                            >
                                                                {selectedPolicies.includes(policy.id) ? (
                                                                    <CheckSquare className="h-4 w-4" />
                                                                ) : (
                                                                    <Square className="h-4 w-4" />
                                                                )}
                                                            </Button>
                                                        </div>
                                                        <div className="col-span-3">
                                                            <div className="mb-1 flex items-center gap-2">
                                                                <Link
                                                                    href={`/organisations/${organisation.id}/policies/${policy.id}`}
                                                                    className="truncate font-medium transition-colors hover:text-primary"
                                                                >
                                                                    {policy.name}
                                                                </Link>
                                                                {policy.require_mfa && (
                                                                    <Badge variant="outline" className="text-xs">
                                                                        MFA
                                                                    </Badge>
                                                                )}
                                                            </div>
                                                            <div className="text-xs text-muted-foreground">{policy.zone?.name}</div>
                                                        </div>
                                                        <div className="col-span-2">
                                                            <Badge variant={getStatusColor(policy.status)} className="text-xs">
                                                                {policy.status}
                                                            </Badge>
                                                        </div>
                                                        <div className="col-span-2">
                                                            <div className="truncate text-sm text-foreground">{policy.domain}</div>
                                                            {policy.path && policy.path !== '/' && (
                                                                <div className="truncate text-xs text-muted-foreground">{policy.path}</div>
                                                            )}
                                                        </div>
                                                        <div className="col-span-1 text-sm text-muted-foreground">{policy.rules?.length || 0}</div>
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
                                                                    onClick={() =>
                                                                        router.post(`/organisations/${organisation.id}/policies/${policy.id}/sync`)
                                                                    }
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

                                {/* Mobile Card Layout */}
                                <div className="space-y-4 lg:hidden">
                                    {/* Mobile Bulk Actions */}
                                    {selectedPolicies.length > 0 && (
                                        <div className="flex items-center justify-between rounded-lg border border-amber-200 bg-amber-50 p-3">
                                            <div className="flex items-center gap-2">
                                                <CheckSquare className="h-4 w-4 text-amber-600" />
                                                <span className="text-sm font-medium text-amber-800">
                                                    {selectedPolicies.length} app{selectedPolicies.length !== 1 ? 's' : ''} selected
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => {
                                                        setSelectedPolicies([]);
                                                        setIsSelectAllChecked(false);
                                                    }}
                                                >
                                                    Clear
                                                </Button>
                                                <Button variant="destructive" size="sm" onClick={handleBulkDelete}>
                                                    <Trash2 className="mr-2 h-4 w-4" />
                                                    Remove Protection
                                                </Button>
                                            </div>
                                        </div>
                                    )}

                                    {/* Select All Toggle for Mobile */}
                                    <div className="flex items-center justify-between rounded-lg border border-border bg-muted/30 p-3">
                                        <span className="text-sm font-medium text-muted-foreground">
                                            {filteredPolicies.length} app{filteredPolicies.length !== 1 ? 's' : ''} found
                                        </span>
                                        <Button variant="ghost" size="sm" onClick={toggleSelectAll} className="text-sm">
                                            {isSelectAllChecked ? (
                                                <>
                                                    <CheckSquare className="mr-2 h-4 w-4" />
                                                    Deselect All
                                                </>
                                            ) : (
                                                <>
                                                    <Square className="mr-2 h-4 w-4" />
                                                    Select All
                                                </>
                                            )}
                                        </Button>
                                    </div>

                                    {/* Mobile Policy Cards */}
                                    {filteredPolicies.map((policy) => (
                                        <div
                                            key={policy.id}
                                            className="rounded-lg border border-border bg-white p-4 shadow-sm transition-colors hover:bg-muted/20"
                                        >
                                            <div className="space-y-3">
                                                {/* Header Row */}
                                                <div className="flex items-start justify-between">
                                                    <div className="flex items-start gap-3 min-w-0 flex-1">
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => togglePolicySelection(policy.id)}
                                                            className="mt-0.5 h-5 w-5 p-0 shrink-0"
                                                        >
                                                            {selectedPolicies.includes(policy.id) ? (
                                                                <CheckSquare className="h-4 w-4" />
                                                            ) : (
                                                                <Square className="h-4 w-4" />
                                                            )}
                                                        </Button>
                                                        <div className="min-w-0 flex-1">
                                                            <div className="flex items-start gap-2 mb-2">
                                                                <Link
                                                                    href={`/organisations/${organisation.id}/policies/${policy.id}`}
                                                                    className="font-semibold text-lg leading-tight transition-colors hover:text-primary min-w-0 flex-1"
                                                                >
                                                                    {policy.name}
                                                                </Link>
                                                                <Badge variant={getStatusColor(policy.status)} className="text-xs shrink-0">
                                                                    {policy.status}
                                                                </Badge>
                                                            </div>
                                                            <div className="text-sm text-muted-foreground break-all">
                                                                {policy.domain}{policy.path && policy.path !== '/' && policy.path}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Details Grid */}
                                                <div className="grid grid-cols-2 gap-3 text-sm">
                                                    <div>
                                                        <span className="text-muted-foreground">Zone:</span>
                                                        <div className="font-medium">{policy.zone?.name || 'N/A'}</div>
                                                    </div>
                                                    <div>
                                                        <span className="text-muted-foreground">Rules:</span>
                                                        <div className="font-medium">{policy.rules?.length || 0}</div>
                                                    </div>
                                                    <div>
                                                        <span className="text-muted-foreground">Protected:</span>
                                                        <div className="font-medium">{new Date(policy.created_at).toLocaleDateString()}</div>
                                                    </div>
                                                    <div>
                                                        <span className="text-muted-foreground">Security:</span>
                                                        <div className="flex items-center gap-1">
                                                            {policy.require_mfa && (
                                                                <Badge variant="outline" className="text-xs">
                                                                    MFA
                                                                </Badge>
                                                            )}
                                                            {!policy.require_mfa && (
                                                                <span className="text-muted-foreground text-xs">Standard</span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Actions */}
                                                <div className="flex items-center justify-between pt-2 border-t border-border">
                                                    <div className="flex items-center gap-2">
                                                        <Link href={`/organisations/${organisation.id}/policies/${policy.id}`}>
                                                            <Button variant="ghost" size="sm" className="h-8">
                                                                <Eye className="mr-2 h-3 w-3" />
                                                                View
                                                            </Button>
                                                        </Link>
                                                        <Link href={`/organisations/${organisation.id}/policies/${policy.id}/edit`}>
                                                            <Button variant="ghost" size="sm" className="h-8">
                                                                <Edit className="mr-2 h-3 w-3" />
                                                                Edit
                                                            </Button>
                                                        </Link>
                                                        {policy.status === 'pending' && (
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                className="h-8"
                                                                onClick={() =>
                                                                    router.post(`/organisations/${organisation.id}/policies/${policy.id}/sync`)
                                                                }
                                                            >
                                                                <RefreshCw className="mr-2 h-3 w-3" />
                                                                Sync
                                                            </Button>
                                                        )}
                                                    </div>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-8 text-destructive hover:text-destructive"
                                                        onClick={() => {
                                                            if (confirm(`Are you sure you want to remove protection from "${policy.name}"?`)) {
                                                                router.delete(`/organisations/${organisation.id}/policies/${policy.id}`);
                                                            }
                                                        }}
                                                    >
                                                        <Trash2 className="mr-2 h-3 w-3" />
                                                        Remove
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                </>
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
                                        <Activity className="mr-2 h-4 w-4" />
                                        View All Logs
                                    </Button>
                                </Link>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {recentLogs.slice(0, 10).map((log, index) => (
                                    <div key={index} className="flex items-start justify-between border-b border-border py-3 last:border-0">
                                        <div className="flex flex-1 items-start gap-3">
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
                                                {log.ray_id && <div className="text-xs text-muted-foreground/70">Ray ID: {log.ray_id}</div>}
                                            </div>
                                        </div>
                                        <div className="ml-4 text-right">
                                            <p className="text-xs font-medium text-foreground">{new Date(log.created_at).toLocaleTimeString()}</p>
                                            <p className="text-xs text-muted-foreground">{new Date(log.created_at).toLocaleDateString()}</p>
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

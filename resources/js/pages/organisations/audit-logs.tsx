import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type SharedData } from '@/types';
import { type AuditLogProps } from '@/types/cloudflare';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { ArrowLeft, Activity, User, Calendar, Shield, RefreshCw, Search, Filter, Eye, Download } from 'lucide-react';
import { useState } from 'react';

export default function AuditLogs() {
    const { organisation, logs } = usePage<SharedData & AuditLogProps>().props;
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedAction, setSelectedAction] = useState('all');

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
            title: 'Audit Logs',
            href: `/organisations/${organisation.id}/audit-logs`,
        },
    ];

    const getActionColor = (action: string) => {
        switch (action.toLowerCase()) {
            case 'organisation_created':
            case 'policy_created':
                return 'default';
            case 'organisation_updated':
            case 'policy_updated':
                return 'secondary';
            case 'organisation_deleted':
            case 'policy_deleted':
                return 'destructive';
            case 'token_validated':
            case 'zones_synced':
                return 'outline';
            default:
                return 'secondary';
        }
    };

    const getActionIcon = (action: string) => {
        switch (action.toLowerCase()) {
            case 'organisation_created':
            case 'policy_created':
                return <Shield className="h-4 w-4" />;
            case 'token_validated':
                return <RefreshCw className="h-4 w-4" />;
            case 'zones_synced':
                return <RefreshCw className="h-4 w-4" />;
            default:
                return <Activity className="h-4 w-4" />;
        }
    };

    const formatAction = (action: string) => {
        return action.split('_').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
    };

    const filteredLogs = logs.data.filter(log => {
        const matchesSearch = log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            log.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            log.user?.email?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesAction = selectedAction === 'all' || log.action === selectedAction;
        return matchesSearch && matchesAction;
    });

    const uniqueActions = [...new Set(logs.data.map(log => log.action))];

    const handleRefresh = () => {
        router.get(`/organisations/${organisation.id}/audit-logs`);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`${organisation.name} - Audit Logs`} />

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
                        <h1 className="text-2xl font-semibold text-gray-900">Audit Logs</h1>
                        <p className="mt-1 text-sm text-gray-600">
                            View all activities and changes made to {organisation.name}.
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

                {/* Filters */}
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex flex-col sm:flex-row gap-4">
                            <div className="flex-1">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    <Input
                                        placeholder="Search logs..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-10"
                                    />
                                </div>
                            </div>
                            
                            <Select value={selectedAction} onValueChange={setSelectedAction}>
                                <SelectTrigger className="w-48">
                                    <SelectValue placeholder="Filter by action" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All actions</SelectItem>
                                    {uniqueActions.map((action) => (
                                        <SelectItem key={action} value={action}>
                                            {formatAction(action)}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                </Card>

                {/* Logs List */}
                {filteredLogs.length === 0 ? (
                    <Card>
                        <CardContent className="flex flex-col items-center justify-center py-12">
                            <Activity className="h-12 w-12 text-gray-400 mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">
                                {searchTerm || selectedAction !== 'all' ? 'No logs found' : 'No audit logs yet'}
                            </h3>
                            <p className="text-gray-600 text-center">
                                {searchTerm || selectedAction !== 'all' 
                                    ? 'Try adjusting your search terms or filters.'
                                    : 'Activity logs will appear here as actions are performed.'
                                }
                            </p>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="space-y-4">
                        {filteredLogs.map((log) => (
                            <Card key={log.id} className="hover:shadow-lg transition-shadow">
                                <CardContent className="p-6">
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-start gap-4">
                                            <div className="flex-shrink-0">
                                                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                                                    {getActionIcon(log.action)}
                                                </div>
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <Badge variant={getActionColor(log.action)}>
                                                        {formatAction(log.action)}
                                                    </Badge>
                                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                                        <User className="h-4 w-4" />
                                                        <span>{log.user?.name || 'System'}</span>
                                                        {log.user?.email && (
                                                            <span className="text-gray-500">({log.user.email})</span>
                                                        )}
                                                    </div>
                                                </div>
                                                
                                                {log.description && (
                                                    <p className="text-gray-900 mb-2">{log.description}</p>
                                                )}

                                                {log.formatted_changes && log.formatted_changes.length > 0 && (
                                                    <div className="mt-3 space-y-1">
                                                        <p className="text-sm font-medium text-gray-900">Changes:</p>
                                                        {log.formatted_changes.map((change, index) => (
                                                            <div key={index} className="text-sm text-gray-600 ml-4">
                                                                <span className="font-medium">{change.field}:</span>
                                                                {change.old && (
                                                                    <span className="text-red-600 line-through ml-1">
                                                                        {String(change.old)}
                                                                    </span>
                                                                )}
                                                                {change.new && (
                                                                    <span className="text-green-600 ml-1">
                                                                        {String(change.new)}
                                                                    </span>
                                                                )}
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}

                                                <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
                                                    <div className="flex items-center gap-1">
                                                        <Calendar className="h-3 w-3" />
                                                        <span>{new Date(log.created_at).toLocaleString()}</span>
                                                    </div>
                                                    {log.ip_address && (
                                                        <span>IP: {log.ip_address}</span>
                                                    )}
                                                    {log.entity_type && log.entity_id && (
                                                        <span>{log.entity_type} #{log.entity_id}</span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        <Button variant="ghost" size="sm">
                                            <Eye className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}

                        {/* Pagination */}
                        {logs.links && (
                            <div className="flex justify-center pt-6">
                                <div className="flex space-x-1">
                                    {logs.links.map((link: any, index: number) => (
                                        <Button
                                            key={index}
                                            variant={link.active ? "default" : "outline"}
                                            size="sm"
                                            disabled={!link.url}
                                            onClick={() => link.url && router.get(link.url)}
                                            className={!link.url ? 'opacity-50 cursor-not-allowed' : ''}
                                        >
                                            <span dangerouslySetInnerHTML={{ __html: link.label }} />
                                        </Button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Log Statistics */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Activity Summary</CardTitle>
                        <CardDescription>
                            Overview of recent activities in this organization.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="text-center">
                                <div className="text-2xl font-bold text-gray-900">{logs.data.length}</div>
                                <div className="text-sm text-gray-600">Total Events</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-green-600">
                                    {logs.data.filter(log => log.action.includes('created')).length}
                                </div>
                                <div className="text-sm text-gray-600">Created</div>
                            </div>
                            <div className="text-2xl font-bold text-blue-600">
                                <div className="text-center">
                                    {logs.data.filter(log => log.action.includes('updated')).length}
                                </div>
                                <div className="text-sm text-gray-600">Updated</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-orange-600">
                                    {logs.data.filter(log => log.action.includes('synced') || log.action.includes('validated')).length}
                                </div>
                                <div className="text-sm text-gray-600">Synced</div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
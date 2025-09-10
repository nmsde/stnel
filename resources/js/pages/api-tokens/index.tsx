import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MobileCardSkeleton, TableSkeleton } from '@/components/loading-skeletons';
import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import { Clock, Key, Plus, Settings, Trash2, Eye, AlertTriangle, CheckSquare, Square, Search } from 'lucide-react';
import { useState } from 'react';

interface ApiToken {
    id: string;
    name: string;
    organization: {
        id: number;
        name: string;
    };
    scopes: string[];
    expires_at: string | null;
    last_used_at: string | null;
    usage_count: number;
    is_expired: boolean;
    created_at: string;
}

interface Props {
    tokens: ApiToken[];
    organizations: Array<{ id: number; name: string }>;
    availableScopes: Record<string, string>;
}

export default function ApiTokensIndex({ tokens, organizations, availableScopes }: Props) {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedOrg, setSelectedOrg] = useState('all');
    const [selectedTokens, setSelectedTokens] = useState<string[]>([]);
    const [isSelectAllChecked, setIsSelectAllChecked] = useState(false);
    
    // Loading state - check if we're still fetching token data  
    const isLoading = !tokens || tokens === undefined;

    const formatScopes = (scopes: string[]) => {
        return scopes.map(scope => availableScopes[scope] || scope).join(', ');
    };

    const getScopesBadgeVariant = (scopes: string[]) => {
        const hasWriteAccess = scopes.some(scope => scope.includes(':write') || scope.includes(':delete'));
        return hasWriteAccess ? 'destructive' : 'secondary';
    };

    const filteredTokens = tokens
        .filter(token => 
            token.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            token.organization.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .filter(token => selectedOrg === 'all' || token.organization.id.toString() === selectedOrg);

    const toggleTokenSelection = (tokenId: string) => {
        setSelectedTokens(prev => 
            prev.includes(tokenId) 
                ? prev.filter(id => id !== tokenId)
                : [...prev, tokenId]
        );
    };

    const toggleSelectAll = () => {
        if (isSelectAllChecked) {
            setSelectedTokens([]);
            setIsSelectAllChecked(false);
        } else {
            setSelectedTokens(filteredTokens.map(t => t.id));
            setIsSelectAllChecked(true);
        }
    };

    const handleBulkDelete = () => {
        if (selectedTokens.length === 0) return;
        
        if (confirm(`Are you sure you want to delete ${selectedTokens.length} selected tokens? This action cannot be undone.`)) {
            // Handle bulk delete logic here
            selectedTokens.forEach(tokenId => {
                // router.delete(`/api-tokens/${tokenId}`);
            });
            setSelectedTokens([]);
            setIsSelectAllChecked(false);
        }
    };

    return (
        <AppLayout>
            <Head title="API Tokens" />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">API Tokens</h1>
                        <p className="text-muted-foreground">
                            Manage API tokens for CI/CD integration and programmatic access
                        </p>
                    </div>
                    <Link href="/api-tokens/create">
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Create Token
                        </Button>
                    </Link>
                </div>

                {/* Info Card */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Key className="h-5 w-5" />
                            API Integration
                        </CardTitle>
                        <CardDescription>
                            Use API tokens to manage Cloudflare Access policies from your CI/CD pipelines, scripts, and applications.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-start justify-between">
                            <div className="space-y-2 text-sm">
                                <p><strong>Base URL:</strong> <code className="bg-muted px-2 py-1 rounded">https://stnel.com/api/v1</code></p>
                                <p><strong>Authentication:</strong> <code className="bg-muted px-2 py-1 rounded">Bearer your_token_here</code></p>
                                <p><strong>Rate Limit:</strong> 1000 requests per hour per token</p>
                            </div>
                            <Link href="/docs/api">
                                <Button variant="outline" size="sm">
                                    View Documentation
                                </Button>
                            </Link>
                        </div>
                    </CardContent>
                </Card>

                {/* API Tokens List */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle>API Tokens</CardTitle>
                                <CardDescription>Manage API tokens for CI/CD integration and programmatic access</CardDescription>
                            </div>
                            <div className="flex items-center gap-3">
                                {selectedTokens.length > 0 && (
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm text-muted-foreground">{selectedTokens.length} selected</span>
                                        <Button variant="destructive" size="sm" onClick={handleBulkDelete}>
                                            <Trash2 className="mr-2 h-4 w-4" />
                                            Delete Selected
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
                                    placeholder="Search API tokens..."
                                    className="pl-9"
                                />
                            </div>
                            <Select value={selectedOrg} onValueChange={setSelectedOrg}>
                                <SelectTrigger className="w-48">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Organizations</SelectItem>
                                    {organizations.map(org => (
                                        <SelectItem key={org.id} value={org.id.toString()}>{org.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Tokens List */}
                        {isLoading ? (
                            <>
                                {/* Desktop Loading Table */}
                                <div className="hidden lg:block">
                                    <TableSkeleton rows={3} />
                                </div>
                                
                                {/* Mobile Loading Cards */}
                                <div className="lg:hidden">
                                    <MobileCardSkeleton cards={3} />
                                </div>
                            </>
                        ) : filteredTokens.length === 0 ? (
                            <div className="py-12 text-center">
                                <Key className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                                <h3 className="mb-2 text-lg font-medium text-foreground">No API tokens found</h3>
                                <p className="mb-4 text-muted-foreground">
                                    {tokens.length === 0 
                                        ? 'Create your first API token to start managing policies programmatically.'
                                        : 'No tokens match your current filters.'}
                                </p>
                                {tokens.length === 0 && (
                                    <Link href="/api-tokens/create">
                                        <Button>
                                            <Plus className="mr-2 h-4 w-4" />
                                            Create Your First Token
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
                                                <div className="col-span-3">Token Name</div>
                                                <div className="col-span-2">Organization</div>
                                                <div className="col-span-2">Permissions</div>
                                                <div className="col-span-1">Usage</div>
                                                <div className="col-span-2">Status</div>
                                                <div className="col-span-1">Actions</div>
                                            </div>
                                        </div>
                                        {/* Desktop Table Body */}
                                        <div className="divide-y divide-border">
                                            {filteredTokens.map((token) => (
                                                <div key={token.id} className={`px-4 py-4 transition-colors hover:bg-muted/30 ${token.is_expired ? 'bg-destructive/5' : ''}`}>
                                                    <div className="grid grid-cols-12 items-center gap-4">
                                                        <div className="col-span-1 flex justify-center">
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => toggleTokenSelection(token.id)}
                                                                className="h-8 w-8 p-0"
                                                            >
                                                                {selectedTokens.includes(token.id) ? (
                                                                    <CheckSquare className="h-4 w-4" />
                                                                ) : (
                                                                    <Square className="h-4 w-4" />
                                                                )}
                                                            </Button>
                                                        </div>
                                                        <div className="col-span-3">
                                                            <div className="mb-1 flex items-center gap-2">
                                                                <Link
                                                                    href={`/api-tokens/${token.id}`}
                                                                    className="truncate font-medium transition-colors hover:text-primary"
                                                                >
                                                                    {token.name}
                                                                </Link>
                                                                {token.is_expired && (
                                                                    <Badge variant="destructive" className="text-xs flex items-center gap-1">
                                                                        <AlertTriangle className="h-3 w-3" />
                                                                        Expired
                                                                    </Badge>
                                                                )}
                                                            </div>
                                                            <div className="text-xs text-muted-foreground">Created {token.created_at}</div>
                                                        </div>
                                                        <div className="col-span-2">
                                                            <div className="text-sm font-medium">{token.organization.name}</div>
                                                        </div>
                                                        <div className="col-span-2">
                                                            <Badge variant={getScopesBadgeVariant(token.scopes)} className="text-xs">
                                                                {token.scopes.length} permission{token.scopes.length !== 1 ? 's' : ''}
                                                            </Badge>
                                                            <div className="text-xs text-muted-foreground mt-1">
                                                                {token.scopes.some(s => s.includes(':write') || s.includes(':delete')) ? 'Write Access' : 'Read Only'}
                                                            </div>
                                                        </div>
                                                        <div className="col-span-1 text-sm text-muted-foreground">
                                                            {token.usage_count}
                                                        </div>
                                                        <div className="col-span-2">
                                                            <div className="text-xs text-muted-foreground">
                                                                {token.last_used_at ? (
                                                                    <div className="flex items-center gap-1">
                                                                        <Clock className="h-3 w-3" />
                                                                        {token.last_used_at}
                                                                    </div>
                                                                ) : (
                                                                    <span className="text-muted-foreground/70">Never used</span>
                                                                )}
                                                            </div>
                                                            {token.expires_at && (
                                                                <div className="text-xs text-muted-foreground mt-1">
                                                                    Expires {token.expires_at}
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div className="col-span-1 flex items-center gap-1">
                                                            <Link href={`/api-tokens/${token.id}`}>
                                                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0" title="View Token">
                                                                    <Eye className="h-3 w-3" />
                                                                </Button>
                                                            </Link>
                                                            <Link href={`/api-tokens/${token.id}/edit`}>
                                                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0" title="Edit Token">
                                                                    <Settings className="h-3 w-3" />
                                                                </Button>
                                                            </Link>
                                                            <Link
                                                                href={`/api-tokens/${token.id}`}
                                                                method="delete"
                                                                as="button"
                                                                onBefore={() => confirm('Are you sure you want to delete this API token? This action cannot be undone.')}
                                                            >
                                                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0" title="Delete Token">
                                                                    <Trash2 className="h-3 w-3 text-destructive" />
                                                                </Button>
                                                            </Link>
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
                                    {selectedTokens.length > 0 && (
                                        <div className="flex items-center justify-between rounded-lg border border-amber-200 bg-amber-50 p-3">
                                            <div className="flex items-center gap-2">
                                                <CheckSquare className="h-4 w-4 text-amber-600" />
                                                <span className="text-sm font-medium text-amber-800">
                                                    {selectedTokens.length} token{selectedTokens.length !== 1 ? 's' : ''} selected
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => {
                                                        setSelectedTokens([]);
                                                        setIsSelectAllChecked(false);
                                                    }}
                                                >
                                                    Clear
                                                </Button>
                                                <Button variant="destructive" size="sm" onClick={handleBulkDelete}>
                                                    <Trash2 className="mr-2 h-4 w-4" />
                                                    Delete Selected
                                                </Button>
                                            </div>
                                        </div>
                                    )}

                                    {/* Select All Toggle for Mobile */}
                                    <div className="flex items-center justify-between rounded-lg border border-border bg-muted/30 p-3">
                                        <span className="text-sm font-medium text-muted-foreground">
                                            {filteredTokens.length} token{filteredTokens.length !== 1 ? 's' : ''} found
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

                                    {/* Mobile Token Cards */}
                                    {filteredTokens.map((token) => (
                                        <div
                                            key={token.id}
                                            className={`rounded-lg border border-border bg-white p-4 shadow-sm transition-colors hover:bg-muted/20 ${
                                                token.is_expired ? 'border-destructive/30 bg-destructive/5' : ''
                                            }`}
                                        >
                                            <div className="space-y-3">
                                                {/* Header Row */}
                                                <div className="flex items-start justify-between">
                                                    <div className="flex items-start gap-3 min-w-0 flex-1">
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => toggleTokenSelection(token.id)}
                                                            className="mt-0.5 h-5 w-5 p-0 shrink-0"
                                                        >
                                                            {selectedTokens.includes(token.id) ? (
                                                                <CheckSquare className="h-4 w-4" />
                                                            ) : (
                                                                <Square className="h-4 w-4" />
                                                            )}
                                                        </Button>
                                                        <div className="min-w-0 flex-1">
                                                            <div className="flex items-start gap-2 mb-2">
                                                                <Link
                                                                    href={`/api-tokens/${token.id}`}
                                                                    className="font-semibold text-lg leading-tight transition-colors hover:text-primary min-w-0 flex-1"
                                                                >
                                                                    {token.name}
                                                                </Link>
                                                                {token.is_expired && (
                                                                    <Badge variant="destructive" className="text-xs flex items-center gap-1 shrink-0">
                                                                        <AlertTriangle className="h-3 w-3" />
                                                                        Expired
                                                                    </Badge>
                                                                )}
                                                            </div>
                                                            <div className="text-sm text-muted-foreground">
                                                                {token.organization.name}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Details Grid */}
                                                <div className="grid grid-cols-2 gap-3 text-sm">
                                                    <div>
                                                        <span className="text-muted-foreground">Permissions:</span>
                                                        <div className="flex items-center gap-2">
                                                            <Badge variant={getScopesBadgeVariant(token.scopes)} className="text-xs">
                                                                {token.scopes.length}
                                                            </Badge>
                                                            <span className="text-xs text-muted-foreground">
                                                                {token.scopes.some(s => s.includes(':write') || s.includes(':delete')) ? 'Write' : 'Read'}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <span className="text-muted-foreground">Usage:</span>
                                                        <div className="font-medium">{token.usage_count} requests</div>
                                                    </div>
                                                    <div>
                                                        <span className="text-muted-foreground">Created:</span>
                                                        <div className="font-medium">{token.created_at}</div>
                                                    </div>
                                                    <div>
                                                        <span className="text-muted-foreground">Last used:</span>
                                                        <div className="text-xs">
                                                            {token.last_used_at ? (
                                                                <div className="flex items-center gap-1">
                                                                    <Clock className="h-3 w-3" />
                                                                    {token.last_used_at}
                                                                </div>
                                                            ) : (
                                                                <span className="text-muted-foreground/70">Never used</span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>

                                                {token.expires_at && (
                                                    <div className="rounded-lg bg-muted/50 p-2">
                                                        <span className="text-xs text-muted-foreground">Expires: </span>
                                                        <span className="text-xs font-medium">{token.expires_at}</span>
                                                    </div>
                                                )}

                                                {/* Actions */}
                                                <div className="flex items-center justify-between pt-2 border-t border-border">
                                                    <div className="flex items-center gap-2">
                                                        <Link href={`/api-tokens/${token.id}`}>
                                                            <Button variant="ghost" size="sm" className="h-8">
                                                                <Eye className="mr-2 h-3 w-3" />
                                                                View
                                                            </Button>
                                                        </Link>
                                                        <Link href={`/api-tokens/${token.id}/edit`}>
                                                            <Button variant="ghost" size="sm" className="h-8">
                                                                <Settings className="mr-2 h-3 w-3" />
                                                                Edit
                                                            </Button>
                                                        </Link>
                                                    </div>
                                                    <Link
                                                        href={`/api-tokens/${token.id}`}
                                                        method="delete"
                                                        as="button"
                                                        onBefore={() => confirm('Are you sure you want to delete this API token? This action cannot be undone.')}
                                                    >
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            className="h-8 text-destructive hover:text-destructive"
                                                        >
                                                            <Trash2 className="mr-2 h-3 w-3" />
                                                            Delete
                                                        </Button>
                                                    </Link>
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
            </div>
        </AppLayout>
    );
}
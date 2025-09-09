import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Settings, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface TokenData {
    id: string;
    name: string;
    organization_id: number;
    scopes: string[];
    expires_at: string | null;
}

interface Organization {
    id: number;
    name: string;
}

interface Props {
    token: TokenData;
    organizations: Organization[];
    availableScopes: Record<string, string>;
}

export default function EditApiToken({ token, organizations, availableScopes }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        name: token.name,
        scopes: token.scopes,
        expires_at: token.expires_at || '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/api-tokens/${token.id}`);
    };

    const handleScopeChange = (scope: string, checked: boolean) => {
        if (checked) {
            setData('scopes', [...data.scopes, scope]);
        } else {
            setData('scopes', data.scopes.filter(s => s !== scope));
        }
    };

    const getScopeCategory = (scope: string) => {
        if (scope.startsWith('policies:')) return 'Access Policies';
        if (scope.startsWith('applications:')) return 'Applications';
        if (scope.startsWith('logs:')) return 'Access Logs';
        if (scope.startsWith('organizations:')) return 'Organizations';
        return 'Other';
    };

    const getScopeIcon = (scope: string) => {
        const isWriteOrDelete = scope.includes(':write') || scope.includes(':delete');
        return isWriteOrDelete ? (
            <AlertTriangle className="h-4 w-4 text-amber-500" />
        ) : (
            <CheckCircle2 className="h-4 w-4 text-green-500" />
        );
    };

    const groupedScopes = Object.entries(availableScopes).reduce((acc, [scope, description]) => {
        const category = getScopeCategory(scope);
        if (!acc[category]) acc[category] = [];
        acc[category].push({ scope, description });
        return acc;
    }, {} as Record<string, Array<{ scope: string; description: string }>>);

    const hasWritePermissions = data.scopes.some(scope => scope.includes(':write') || scope.includes(':delete'));
    const currentOrganization = organizations.find(org => org.id === token.organization_id);

    return (
        <AppLayout>
            <Head title={`Edit API Token: ${token.name}`} />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => window.location.href = `/api-tokens/${token.id}`}
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold">Edit API Token</h1>
                        <p className="text-muted-foreground">
                            Update permissions and settings for "{token.name}"
                        </p>
                    </div>
                </div>

                {/* Warning for write permissions */}
                {hasWritePermissions && (
                    <Alert>
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription>
                            This token will have write permissions. Ensure it's stored securely and only used in trusted environments.
                        </AlertDescription>
                    </Alert>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid gap-6 lg:grid-cols-2">
                        {/* Basic Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Settings className="h-5 w-5" />
                                    Token Settings
                                </CardTitle>
                                <CardDescription>
                                    Basic information for your API token
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Token Name</Label>
                                    <Input
                                        id="name"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        className={errors.name ? 'border-destructive' : ''}
                                    />
                                    {errors.name && (
                                        <p className="text-sm text-destructive">{errors.name}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label>Organization</Label>
                                    <div className="p-3 bg-muted rounded-lg">
                                        <p className="font-medium">{currentOrganization?.name}</p>
                                        <p className="text-xs text-muted-foreground">
                                            Organization cannot be changed after creation
                                        </p>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="expires_at">Expiration Date (Optional)</Label>
                                    <Input
                                        id="expires_at"
                                        type="date"
                                        value={data.expires_at}
                                        onChange={(e) => setData('expires_at', e.target.value)}
                                        min={new Date().toISOString().split('T')[0]}
                                        className={errors.expires_at ? 'border-destructive' : ''}
                                    />
                                    {errors.expires_at && (
                                        <p className="text-sm text-destructive">{errors.expires_at}</p>
                                    )}
                                    <p className="text-xs text-muted-foreground">
                                        Leave empty for no expiration
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Permissions */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Permissions</CardTitle>
                                <CardDescription>
                                    Select the API endpoints this token can access
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-6">
                                    {Object.entries(groupedScopes).map(([category, scopes]) => (
                                        <div key={category} className="space-y-3">
                                            <h4 className="font-medium text-sm">{category}</h4>
                                            <div className="space-y-2 pl-4">
                                                {scopes.map(({ scope, description }) => (
                                                    <div key={scope} className="flex items-start space-x-3">
                                                        <Checkbox
                                                            id={scope}
                                                            checked={data.scopes.includes(scope)}
                                                            onCheckedChange={(checked) => 
                                                                handleScopeChange(scope, checked as boolean)
                                                            }
                                                        />
                                                        <div className="grid gap-1.5 leading-none">
                                                            <label
                                                                htmlFor={scope}
                                                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer flex items-center gap-2"
                                                            >
                                                                {getScopeIcon(scope)}
                                                                {scope}
                                                            </label>
                                                            <p className="text-xs text-muted-foreground">
                                                                {description}
                                                            </p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                {errors.scopes && (
                                    <p className="text-sm text-destructive mt-4">{errors.scopes}</p>
                                )}
                                {data.scopes.length === 0 && (
                                    <p className="text-sm text-muted-foreground mt-4">
                                        Select at least one permission for this token
                                    </p>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-4">
                        <Button 
                            type="button" 
                            variant="outline"
                            onClick={() => window.location.href = `/api-tokens/${token.id}`}
                        >
                            Cancel
                        </Button>
                        <Button 
                            type="submit" 
                            disabled={processing || data.scopes.length === 0}
                        >
                            {processing ? 'Updating...' : 'Update Token'}
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
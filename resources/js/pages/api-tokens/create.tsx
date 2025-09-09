import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Key, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface Organization {
    id: number;
    name: string;
}

interface Props {
    organizations: Organization[];
    availableScopes: Record<string, string>;
}

export default function CreateApiToken({ organizations, availableScopes }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        organization_id: '',
        scopes: [] as string[],
        expires_at: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/api-tokens');
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

    return (
        <AppLayout>
            <Head title="Create API Token" />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Link href="/api-tokens">
                        <Button variant="outline" size="sm">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold">Create API Token</h1>
                        <p className="text-muted-foreground">
                            Generate a new API token for CI/CD integration
                        </p>
                    </div>
                </div>

                {/* Warning for write permissions */}
                {hasWritePermissions && (
                    <Alert>
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription>
                            This token will have write permissions. Store it securely and only use it in trusted environments.
                        </AlertDescription>
                    </Alert>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid gap-6 lg:grid-cols-2">
                        {/* Basic Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Key className="h-5 w-5" />
                                    Token Information
                                </CardTitle>
                                <CardDescription>
                                    Basic details for your API token
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Token Name</Label>
                                    <Input
                                        id="name"
                                        placeholder="e.g., Production Deployment"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        className={errors.name ? 'border-destructive' : ''}
                                    />
                                    {errors.name && (
                                        <p className="text-sm text-destructive">{errors.name}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="organization_id">Organization</Label>
                                    <Select
                                        value={data.organization_id}
                                        onValueChange={(value) => setData('organization_id', value)}
                                    >
                                        <SelectTrigger className={errors.organization_id ? 'border-destructive' : ''}>
                                            <SelectValue placeholder="Select organization" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {organizations.map((org) => (
                                                <SelectItem key={org.id} value={org.id.toString()}>
                                                    {org.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.organization_id && (
                                        <p className="text-sm text-destructive">{errors.organization_id}</p>
                                    )}
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
                        <Link href="/api-tokens">
                            <Button type="button" variant="outline">
                                Cancel
                            </Button>
                        </Link>
                        <Button 
                            type="submit" 
                            disabled={processing || data.scopes.length === 0}
                        >
                            {processing ? 'Creating...' : 'Create Token'}
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
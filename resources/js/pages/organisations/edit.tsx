import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import InputError from '@/components/input-error';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type SharedData } from '@/types';
import { type OrganisationEditProps } from '@/types/cloudflare';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { ArrowLeft, Eye, EyeOff, CheckCircle, AlertCircle } from 'lucide-react';
import { useState } from 'react';

const timezones = [
    'UTC',
    'America/New_York',
    'America/Chicago',
    'America/Denver',
    'America/Los_Angeles',
    'Europe/London',
    'Europe/Paris',
    'Europe/Berlin',
    'Europe/Rome',
    'Asia/Tokyo',
    'Asia/Shanghai',
    'Asia/Kolkata',
    'Australia/Sydney',
];

export default function OrganisationEdit() {
    const { organisation, status } = usePage<SharedData & OrganisationEditProps & { status?: string }>().props;
    const [showToken, setShowToken] = useState(false);

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
            title: 'Edit',
            href: `/organisations/${organisation.id}/edit`,
        },
    ];

    const { data, setData, patch, processing, errors } = useForm({
        name: organisation.name,
        description: organisation.description || '',
        timezone: organisation.timezone,
        api_token: '',
    });

    const { post: validateToken, processing: validatingToken } = useForm({
        api_token: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        const submitData = { ...data };
        if (!submitData.api_token.trim()) {
            delete submitData.api_token;
        }
        
        patch(`/organisations/${organisation.id}`, submitData);
    };

    const handleValidateToken = () => {
        if (!data.api_token.trim()) return;
        
        validateToken(`/organisations/${organisation.id}/validate-token`, {
            api_token: data.api_token,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit ${organisation.name}`} />

            <div className="max-w-4xl mx-auto space-y-6">
                {status && (
                    <div className="rounded-md bg-green-50 p-4">
                        <div className="flex">
                            <CheckCircle className="h-5 w-5 text-green-400" />
                            <div className="ml-3">
                                <p className="text-sm font-medium text-green-800">{status}</p>
                            </div>
                        </div>
                    </div>
                )}

                <div className="flex items-center gap-4">
                    <Link href={`/organisations/${organisation.id}`}>
                        <Button variant="ghost" size="sm">
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back to organisation
                        </Button>
                    </Link>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Basic Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Basic Information</CardTitle>
                            <CardDescription>
                                Update your organisation's basic details.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="name">Organisation Name *</Label>
                                <Input
                                    id="name"
                                    type="text"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    required
                                />
                                <InputError message={errors.name} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Description</Label>
                                <Textarea
                                    id="description"
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    placeholder="Brief description of this organisation"
                                    rows={3}
                                />
                                <InputError message={errors.description} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="timezone">Timezone</Label>
                                <Select value={data.timezone} onValueChange={(value) => setData('timezone', value)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select timezone" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {timezones.map((tz) => (
                                            <SelectItem key={tz} value={tz}>
                                                {tz}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <InputError message={errors.timezone} />
                            </div>
                        </CardContent>
                    </Card>

                    <Separator />

                    {/* API Token Management */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Cloudflare API Token</CardTitle>
                            <CardDescription>
                                Manage your Cloudflare API token for zone and policy management.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* Current Token Status */}
                            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                <div className="flex items-center space-x-3">
                                    {organisation.token_last_validated_at ? (
                                        <>
                                            <CheckCircle className="h-5 w-5 text-green-500" />
                                            <div>
                                                <p className="text-sm font-medium text-gray-900">API Token Active</p>
                                                <p className="text-xs text-gray-600">
                                                    Last validated: {new Date(organisation.token_last_validated_at).toLocaleString()}
                                                </p>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <AlertCircle className="h-5 w-5 text-amber-500" />
                                            <div>
                                                <p className="text-sm font-medium text-gray-900">No API Token</p>
                                                <p className="text-xs text-gray-600">Configure a token to sync zones and manage policies</p>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* Token Input */}
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="api_token">
                                        {organisation.token_last_validated_at ? 'Update API Token' : 'Add API Token'}
                                    </Label>
                                    <div className="relative">
                                        <Input
                                            id="api_token"
                                            type={showToken ? 'text' : 'password'}
                                            value={data.api_token}
                                            onChange={(e) => setData('api_token', e.target.value)}
                                            placeholder="Enter your Cloudflare API token"
                                        />
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            className="absolute right-2 top-1/2 -translate-y-1/2"
                                            onClick={() => setShowToken(!showToken)}
                                        >
                                            {showToken ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                        </Button>
                                    </div>
                                    <InputError message={errors.api_token} />
                                </div>

                                {data.api_token && (
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={handleValidateToken}
                                        disabled={validatingToken}
                                    >
                                        {validatingToken ? 'Validating...' : 'Test Token'}
                                    </Button>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Actions */}
                    <div className="flex gap-3 pt-6 border-t">
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Saving...' : 'Save Changes'}
                        </Button>
                        <Link href={`/organisations/${organisation.id}`}>
                            <Button type="button" variant="outline">
                                Cancel
                            </Button>
                        </Link>
                    </div>
                </form>

                {/* Help Section */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm">API Token Setup Guide</CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm text-gray-600 space-y-2">
                        <p>To create a Cloudflare API token with the required permissions:</p>
                        <ol className="list-decimal list-inside space-y-1 ml-2">
                            <li>Visit <a href="https://dash.cloudflare.com/profile/api-tokens" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Cloudflare API Tokens</a></li>
                            <li>Click "Create Token" and select "Custom token"</li>
                            <li>Add these permissions:
                                <ul className="list-disc list-inside ml-4 mt-1">
                                    <li>Zone:Zone:Read</li>
                                    <li>Zone:DNS:Edit</li>
                                    <li>Account:Cloudflare Access:Edit</li>
                                </ul>
                            </li>
                            <li>Select your account and zones</li>
                            <li>Create and copy the token</li>
                        </ol>
                    </CardContent>
                </Card>

                {/* Danger Zone */}
                <Card className="border-red-200">
                    <CardHeader>
                        <CardTitle className="text-red-700">Danger Zone</CardTitle>
                        <CardDescription>
                            Permanent actions that cannot be undone.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center justify-between">
                            <div>
                                <h4 className="text-sm font-medium text-gray-900">Delete Organisation</h4>
                                <p className="text-sm text-gray-600 mt-1">
                                    This will permanently delete the organisation and all its data.
                                </p>
                            </div>
                            <Button variant="destructive" disabled>
                                Delete Organisation
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
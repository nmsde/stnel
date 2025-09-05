import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import InputError from '@/components/input-error';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type SharedData } from '@/types';
import { type OrganisationCreateProps } from '@/types/cloudflare';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Organizations',
        href: '/organisations',
    },
    {
        title: 'Create Organization',
        href: '/organisations/create',
    },
];

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

export default function OrganisationCreate() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        description: '',
        timezone: 'UTC',
        api_token: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        // Don't send api_token if it's empty
        const submitData = { ...data };
        if (!submitData.api_token.trim()) {
            delete submitData.api_token;
        }
        
        post('/organisations', submitData);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Organization" />

            <div className="max-w-2xl mx-auto space-y-6">
                <div className="flex items-center gap-4">
                    <Link href="/organisations">
                        <Button variant="ghost" size="sm">
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back to organizations
                        </Button>
                    </Link>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Create New Organization</CardTitle>
                        <CardDescription>
                            Set up a new organization to manage your Cloudflare Access policies.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="name">Organization Name *</Label>
                                <Input
                                    id="name"
                                    type="text"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    placeholder="My Company"
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
                                    placeholder="Brief description of this organization"
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

                            <div className="border-t pt-6">
                                <div className="space-y-2">
                                    <Label htmlFor="api_token">Cloudflare API Token (Optional)</Label>
                                    <Input
                                        id="api_token"
                                        type="password"
                                        value={data.api_token}
                                        onChange={(e) => setData('api_token', e.target.value)}
                                        placeholder="Enter your Cloudflare API token"
                                    />
                                    <p className="text-sm text-gray-600">
                                        You can add this later. The token needs Access and DNS permissions.
                                    </p>
                                    <InputError message={errors.api_token} />
                                </div>
                            </div>

                            <div className="flex gap-3 pt-6 border-t">
                                <Button type="submit" disabled={processing} className="flex-1">
                                    {processing ? 'Creating...' : 'Create Organization'}
                                </Button>
                                <Link href="/organisations">
                                    <Button type="button" variant="outline">
                                        Cancel
                                    </Button>
                                </Link>
                            </div>
                        </form>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm">Cloudflare API Token Setup</CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm text-gray-600 space-y-2">
                        <p>To get your Cloudflare API token:</p>
                        <ol className="list-decimal list-inside space-y-1 ml-2">
                            <li>Go to Cloudflare Dashboard → My Profile → API Tokens</li>
                            <li>Click "Create Token"</li>
                            <li>Use the "Custom token" template</li>
                            <li>Add permissions: Zone:Zone:Read, Zone:DNS:Edit, Account:Cloudflare Access:Edit</li>
                            <li>Select your account and zones</li>
                            <li>Create and copy the token</li>
                        </ol>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
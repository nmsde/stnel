import InputError from '@/components/input-error';
import { TokenStatusCard } from '@/components/token-status-card';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type SharedData } from '@/types';
import { type OrganisationEditProps } from '@/types/cloudflare';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { ArrowLeft, CheckCircle } from 'lucide-react';
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

            <div className="mx-auto max-w-4xl space-y-6">
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
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to organisation
                        </Button>
                    </Link>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Basic Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Basic Information</CardTitle>
                            <CardDescription>Update your organisation's basic details.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="name">Organisation Name *</Label>
                                <Input id="name" type="text" value={data.name} onChange={(e) => setData('name', e.target.value)} required />
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

                    {/* API Token Status & Management */}
                    <TokenStatusCard organisation={organisation} />

                    {/* Actions */}
                    <div className="flex gap-3 border-t pt-6">
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

                {/* Danger Zone */}
                <Card className="border-red-200">
                    <CardHeader>
                        <CardTitle className="text-red-700">Danger Zone</CardTitle>
                        <CardDescription>Permanent actions that cannot be undone.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center justify-between">
                            <div>
                                <h4 className="text-sm font-medium text-gray-900">Delete Organisation</h4>
                                <p className="mt-1 text-sm text-gray-600">This will permanently delete the organisation and all its data.</p>
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

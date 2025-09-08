import InputError from '@/components/input-error';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type SharedData } from '@/types';
import { type PolicyEditProps, type PolicyRule } from '@/types/cloudflare';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { ArrowLeft, Clock, Globe, Mail, Plus, Shield, X } from 'lucide-react';
import { useState } from 'react';

const sessionDurations = [
    { value: '30m', label: '30 minutes' },
    { value: '1h', label: '1 hour' },
    { value: '2h', label: '2 hours' },
    { value: '4h', label: '4 hours' },
    { value: '8h', label: '8 hours' },
    { value: '12h', label: '12 hours' },
    { value: '24h', label: '24 hours' },
    { value: '7d', label: '7 days' },
    { value: '30d', label: '30 days' },
];

export default function PolicyEdit() {
    const { organisation, policy, zones } = usePage<SharedData & PolicyEditProps>().props;
    const [emailInput, setEmailInput] = useState('');
    const [domainInput, setDomainInput] = useState('');

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
            title: 'Protected Apps',
            href: `/organisations/${organisation.id}`,
        },
        {
            title: policy.name,
            href: `/organisations/${organisation.id}/policies/${policy.id}`,
        },
        {
            title: 'Edit',
            href: `/organisations/${organisation.id}/policies/${policy.id}/edit`,
        },
    ];

    const { data, setData, patch, processing, errors } = useForm({
        name: policy.name,
        domain: policy.domain,
        path: policy.path || '/',
        session_duration: policy.session_duration || '24h',
        require_mfa: policy.require_mfa || false,
        rules: policy.rules || ([] as PolicyRule[]),
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        patch(`/organisations/${organisation.id}/policies/${policy.id}`);
    };

    const addEmailRule = () => {
        if (!emailInput.trim()) return;

        const newRule: PolicyRule = {
            type: 'email',
            value: emailInput.trim(),
        };

        setData('rules', [...data.rules, newRule]);
        setEmailInput('');
    };

    const addDomainRule = () => {
        if (!domainInput.trim()) return;

        const newRule: PolicyRule = {
            type: 'domain',
            value: domainInput.trim(),
        };

        setData('rules', [...data.rules, newRule]);
        setDomainInput('');
    };

    const removeRule = (index: number) => {
        setData(
            'rules',
            data.rules.filter((_, i) => i !== index),
        );
    };

    const selectedZone = zones.find((zone) => zone.id.toString() === policy.cloudflare_zone_id?.toString());

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit ${policy.name}`} />

            <div className="mx-auto max-w-4xl space-y-6">
                <div className="flex items-center gap-4">
                    <Link href={`/organisations/${organisation.id}/policies/${policy.id}`}>
                        <Button variant="ghost" size="sm">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to policy
                        </Button>
                    </Link>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Basic Configuration */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Basic Configuration</CardTitle>
                            <CardDescription>Update the basic settings for your access policy.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid gap-6 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Policy Name *</Label>
                                    <Input
                                        id="name"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        placeholder="Admin Access Policy"
                                        required
                                    />
                                    <InputError message={errors.name} />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="zone">Cloudflare Zone</Label>
                                    <div className="rounded-lg bg-gray-50 p-3">
                                        <div className="flex items-center gap-2">
                                            <Globe className="h-4 w-4" />
                                            <span className="font-medium">{selectedZone?.name}</span>
                                            <Badge variant="outline" className="text-xs">
                                                {selectedZone?.status}
                                            </Badge>
                                        </div>
                                        <p className="mt-1 text-xs text-gray-600">Zone cannot be changed after policy creation</p>
                                    </div>
                                </div>
                            </div>

                            <div className="grid gap-6 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="domain">Domain *</Label>
                                    <Input
                                        id="domain"
                                        value={data.domain}
                                        onChange={(e) => setData('domain', e.target.value)}
                                        placeholder={selectedZone ? `admin.${selectedZone.name}` : 'admin.example.com'}
                                        required
                                    />
                                    <p className="text-xs text-gray-600">The subdomain or domain to protect</p>
                                    <InputError message={errors.domain} />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="path">Path</Label>
                                    <Input id="path" value={data.path} onChange={(e) => setData('path', e.target.value)} placeholder="/" />
                                    <p className="text-xs text-gray-600">The path to protect (e.g., /admin, /api)</p>
                                    <InputError message={errors.path} />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Access Rules */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Access Rules</CardTitle>
                            <CardDescription>Define who can access this application.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* Email Rules */}
                            <div className="space-y-4">
                                <div>
                                    <Label className="flex items-center gap-2">
                                        <Mail className="h-4 w-4" />
                                        Email Addresses
                                    </Label>
                                    <p className="mt-1 text-sm text-gray-600">Allow specific email addresses to access this application.</p>
                                </div>

                                <div className="flex gap-2">
                                    <Input
                                        value={emailInput}
                                        onChange={(e) => setEmailInput(e.target.value)}
                                        placeholder="user@example.com"
                                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addEmailRule())}
                                    />
                                    <Button type="button" onClick={addEmailRule} disabled={!emailInput.trim()}>
                                        <Plus className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>

                            {/* Domain Rules */}
                            <div className="space-y-4">
                                <div>
                                    <Label className="flex items-center gap-2">
                                        <Globe className="h-4 w-4" />
                                        Email Domains
                                    </Label>
                                    <p className="mt-1 text-sm text-gray-600">Allow all users from specific domains (e.g., company.com).</p>
                                </div>

                                <div className="flex gap-2">
                                    <Input
                                        value={domainInput}
                                        onChange={(e) => setDomainInput(e.target.value)}
                                        placeholder="company.com"
                                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addDomainRule())}
                                    />
                                    <Button type="button" onClick={addDomainRule} disabled={!domainInput.trim()}>
                                        <Plus className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>

                            {/* Rules Display */}
                            {data.rules.length > 0 && (
                                <div className="space-y-3">
                                    <Label>Current Rules ({data.rules.length})</Label>
                                    <div className="space-y-2">
                                        {data.rules.map((rule, index) => (
                                            <div key={index} className="flex items-center justify-between rounded-lg bg-gray-50 p-3">
                                                <div className="flex items-center gap-2">
                                                    {rule.type === 'email' ? (
                                                        <Mail className="h-4 w-4 text-blue-500" />
                                                    ) : (
                                                        <Globe className="h-4 w-4 text-green-500" />
                                                    )}
                                                    <span className="font-medium">{rule.value}</span>
                                                    <Badge variant="outline" className="text-xs">
                                                        {rule.type}
                                                    </Badge>
                                                </div>
                                                <Button type="button" variant="ghost" size="sm" onClick={() => removeRule(index)}>
                                                    <X className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <InputError message={errors.rules} />
                        </CardContent>
                    </Card>

                    {/* Security Settings */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Security Settings</CardTitle>
                            <CardDescription>Configure additional security requirements.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid gap-6 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="session_duration" className="flex items-center gap-2">
                                        <Clock className="h-4 w-4" />
                                        Session Duration
                                    </Label>
                                    <Select value={data.session_duration} onValueChange={(value) => setData('session_duration', value)}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {sessionDurations.map((duration) => (
                                                <SelectItem key={duration.value} value={duration.value}>
                                                    {duration.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <p className="text-xs text-gray-600">How long users stay authenticated</p>
                                </div>

                                <div className="space-y-4">
                                    <Label className="flex items-center gap-2">
                                        <Shield className="h-4 w-4" />
                                        Multi-Factor Authentication
                                    </Label>
                                    <div className="flex items-center space-x-2">
                                        <Checkbox
                                            id="require_mfa"
                                            checked={data.require_mfa}
                                            onCheckedChange={(checked) => setData('require_mfa', !!checked)}
                                        />
                                        <Label htmlFor="require_mfa" className="text-sm">
                                            Require MFA for this application
                                        </Label>
                                    </div>
                                    <p className="text-xs text-gray-600">Users will need to provide additional authentication factors</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Actions */}
                    <div className="flex gap-3 border-t pt-6">
                        <Button type="submit" disabled={processing || data.rules.length === 0}>
                            {processing ? 'Updating...' : 'Update Policy'}
                        </Button>
                        <Link href={`/organisations/${organisation.id}/policies/${policy.id}`}>
                            <Button type="button" variant="outline">
                                Cancel
                            </Button>
                        </Link>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}

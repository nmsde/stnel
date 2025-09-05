import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import InputError from '@/components/input-error';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type SharedData } from '@/types';
import { type PolicyCreateProps, type PolicyRule } from '@/types/cloudflare';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { ArrowLeft, Plus, X, Mail, Globe, Shield, Clock } from 'lucide-react';
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

export default function PolicyCreate() {
    const { organisation, zones } = usePage<SharedData & PolicyCreateProps>().props;
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
            title: 'Protect New App',
            href: `/organisations/${organisation.id}/policies/create`,
        },
    ];

    const { data, setData, post, processing, errors } = useForm({
        cloudflare_zone_id: '',
        name: '',
        domain: '',
        path: '/',
        session_duration: '24h',
        require_mfa: false,
        rules: [] as PolicyRule[],
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(`/organisations/${organisation.id}/policies`);
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
        setData('rules', data.rules.filter((_, i) => i !== index));
    };

    const selectedZone = zones.find(zone => zone.id.toString() === data.cloudflare_zone_id);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Protect New App" />

            <div className="max-w-4xl mx-auto space-y-6">
                <div className="flex items-center gap-4">
                    <Link href={`/organisations/${organisation.id}`}>
                        <Button variant="ghost" size="sm">
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back to protected apps
                        </Button>
                    </Link>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Basic Configuration */}
                    <Card>
                        <CardHeader>
                            <CardTitle>App Information</CardTitle>
                            <CardDescription>
                                Tell us about the app you want to protect.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid gap-6 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="name">App Name *</Label>
                                    <Input
                                        id="name"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        placeholder="My CRM Admin"
                                        required
                                    />
                                    <InputError message={errors.name} />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="cloudflare_zone_id">Domain *</Label>
                                    <Select 
                                        value={data.cloudflare_zone_id} 
                                        onValueChange={(value) => setData('cloudflare_zone_id', value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select your domain" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {zones.map((zone) => (
                                                <SelectItem key={zone.id} value={zone.id.toString()}>
                                                    <div className="flex items-center gap-2">
                                                        <Globe className="h-4 w-4" />
                                                        {zone.name}
                                                        <Badge variant="outline" className="text-xs">
                                                            {zone.status}
                                                        </Badge>
                                                    </div>
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <InputError message={errors.cloudflare_zone_id} />
                                </div>
                            </div>

                            <div className="grid gap-6 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="domain">Domain *</Label>
                                    <Input
                                        id="domain"
                                        value={data.domain}
                                        onChange={(e) => setData('domain', e.target.value)}
                                        placeholder={selectedZone ? `admin.${selectedZone.name}` : 'admin.yourapp.com'}
                                        required
                                    />
                                    <p className="text-xs text-muted-foreground">
                                        The URL where your app is hosted
                                    </p>
                                    <InputError message={errors.domain} />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="path">Path</Label>
                                    <Input
                                        id="path"
                                        value={data.path}
                                        onChange={(e) => setData('path', e.target.value)}
                                        placeholder="/"
                                    />
                                    <p className="text-xs text-muted-foreground">
                                        Specific path to protect (e.g., /admin, /dashboard)
                                    </p>
                                    <InputError message={errors.path} />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Access Rules */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Who Can Access</CardTitle>
                            <CardDescription>
                                Specify which users should have access to this app.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* Email Rules */}
                            <div className="space-y-4">
                                <div>
                                    <Label className="flex items-center gap-2">
                                        <Mail className="h-4 w-4" />
                                        Email Addresses
                                    </Label>
                                    <p className="text-sm text-muted-foreground mt-1">
                                        Grant access to specific people by their email address.
                                    </p>
                                </div>
                                
                                <div className="flex gap-2">
                                    <Input
                                        value={emailInput}
                                        onChange={(e) => setEmailInput(e.target.value)}
                                        placeholder="john@yourcompany.com"
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
                                    <p className="text-sm text-muted-foreground mt-1">
                                        Grant access to everyone from your company domain.
                                    </p>
                                </div>
                                
                                <div className="flex gap-2">
                                    <Input
                                        value={domainInput}
                                        onChange={(e) => setDomainInput(e.target.value)}
                                        placeholder="yourcompany.com"
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
                                    <Label>Authorized Users ({data.rules.length})</Label>
                                    <div className="space-y-2">
                                        {data.rules.map((rule, index) => (
                                            <div key={index} className="flex items-center justify-between bg-muted/50 p-3 rounded-lg">
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
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => removeRule(index)}
                                                >
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
                            <CardTitle>Security Options</CardTitle>
                            <CardDescription>
                                Choose how secure you want this protection to be.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid gap-6 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="session_duration" className="flex items-center gap-2">
                                        <Clock className="h-4 w-4" />
                                        Session Duration
                                    </Label>
                                    <Select 
                                        value={data.session_duration} 
                                        onValueChange={(value) => setData('session_duration', value)}
                                    >
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
                                    <p className="text-xs text-muted-foreground">
                                        How long users stay logged in before re-authenticating
                                    </p>
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
                                            Require two-factor authentication
                                        </Label>
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                        Users will need their phone or authenticator app for extra security
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Actions */}
                    <div className="flex gap-3 pt-6 border-t">
                        <Button type="submit" disabled={processing || data.rules.length === 0}>
                            {processing ? 'Setting up protection...' : 'Protect This App'}
                        </Button>
                        <Link href={`/organisations/${organisation.id}`}>
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
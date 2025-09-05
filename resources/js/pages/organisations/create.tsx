import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import InputError from '@/components/input-error';
import AppLayout from '@/layouts/app-layout';
import { CloudflareTokenSetup } from '@/components/cloudflare-token-setup';
import { type BreadcrumbItem, type SharedData } from '@/types';
import { type OrganisationCreateProps } from '@/types/cloudflare';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { ArrowLeft, CheckCircle, AlertTriangle } from 'lucide-react';
import { useState } from 'react';

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

    const [tokenValidated, setTokenValidated] = useState(false);
    const [validationResult, setValidationResult] = useState<any>(null);
    const [currentStep, setCurrentStep] = useState<'basic' | 'token'>('basic');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        // Don't send api_token if it's empty
        const submitData = { ...data };
        if (!submitData.api_token.trim()) {
            delete submitData.api_token;
        }
        
        post('/organisations', submitData);
    };

    const handleTokenValidated = (token: string, validation: any) => {
        setData('api_token', token);
        setTokenValidated(true);
        setValidationResult(validation);
    };

    const handleBasicInfoNext = (e: React.FormEvent) => {
        e.preventDefault();
        if (data.name.trim()) {
            setCurrentStep('token');
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Organization" />

            <div className="max-w-4xl mx-auto space-y-6">
                <div className="flex items-center gap-4">
                    <Link href="/organisations">
                        <Button variant="ghost" size="sm">
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back to organizations
                        </Button>
                    </Link>
                </div>

                {/* Progress Steps */}
                <div className="flex items-center justify-center space-x-4 mb-8">
                    <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm ${
                        currentStep === 'basic' ? 'bg-primary text-primary-foreground' : 
                        currentStep === 'token' ? 'bg-muted text-muted-foreground' : 'bg-muted text-muted-foreground'
                    }`}>
                        <div className="w-6 h-6 rounded-full bg-current/20 flex items-center justify-center text-xs font-medium">1</div>
                        Basic Info
                    </div>
                    <div className="w-8 h-px bg-border" />
                    <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm ${
                        currentStep === 'token' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                    }`}>
                        <div className="w-6 h-6 rounded-full bg-current/20 flex items-center justify-center text-xs font-medium">
                            {tokenValidated ? <CheckCircle className="w-3 h-3" /> : '2'}
                        </div>
                        Cloudflare Setup
                    </div>
                </div>

                {currentStep === 'basic' && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Create New Organization</CardTitle>
                            <CardDescription>
                                Set up a new organization to protect your applications with Cloudflare Access.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleBasicInfoNext} className="space-y-6">
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

                                <div className="flex gap-3 pt-6 border-t">
                                    <Button type="submit" disabled={!data.name.trim()} className="flex-1">
                                        Continue to Cloudflare Setup
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
                )}

                {currentStep === 'token' && (
                    <div className="space-y-6">
                        {/* Organization Summary */}
                        <Card>
                            <CardContent className="pt-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="font-medium text-foreground">{data.name}</h3>
                                        <p className="text-sm text-muted-foreground">
                                            {data.description || 'No description'}
                                        </p>
                                    </div>
                                    <Button 
                                        variant="ghost" 
                                        size="sm"
                                        onClick={() => setCurrentStep('basic')}
                                    >
                                        Edit
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Token Setup */}
                        <CloudflareTokenSetup onTokenValidated={handleTokenValidated} />

                        {/* Token Status & Actions */}
                        <Card>
                            <CardContent className="pt-6">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        {tokenValidated ? (
                                            <>
                                                <CheckCircle className="h-5 w-5 text-green-600" />
                                                <div>
                                                    <p className="font-medium text-foreground">Token Validated</p>
                                                    <p className="text-sm text-muted-foreground">
                                                        Ready to create organization with Cloudflare integration
                                                    </p>
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                <AlertTriangle className="h-5 w-5 text-amber-600" />
                                                <div>
                                                    <p className="font-medium text-foreground">Token Required</p>
                                                    <p className="text-sm text-muted-foreground">
                                                        Validate your token above to continue
                                                    </p>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                    
                                    <div className="flex gap-3">
                                        <Button
                                            variant="outline"
                                            onClick={() => {
                                                setData('api_token', '');
                                                setTokenValidated(false);
                                                setValidationResult(null);
                                                handleSubmit(new Event('submit') as any);
                                            }}
                                        >
                                            Skip for Now
                                        </Button>
                                        <Button
                                            onClick={() => handleSubmit(new Event('submit') as any)}
                                            disabled={processing || !tokenValidated}
                                        >
                                            {processing ? 'Creating...' : 'Create Organization'}
                                        </Button>
                                    </div>
                                </div>

                                {validationResult?.account_access?.accounts && (
                                    <div className="mt-4 pt-4 border-t">
                                        <p className="text-sm font-medium mb-2">Connected Accounts:</p>
                                        <div className="flex flex-wrap gap-2">
                                            {validationResult.account_access.accounts.map((account: any) => (
                                                <Badge key={account.id} variant="secondary">
                                                    {account.name}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
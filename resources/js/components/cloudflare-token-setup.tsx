import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { AlertTriangle, Check, CheckCircle, Copy, ExternalLink, Eye, EyeOff, Loader2, XCircle } from 'lucide-react';
import { useState } from 'react';

interface TokenPermission {
    required: boolean;
    granted: boolean;
    description: string;
    error?: string;
}

interface TokenValidationResult {
    valid: boolean;
    error?: string;
    token_info?: any;
    permissions?: Record<string, TokenPermission>;
    account_access?: {
        has_access: boolean;
        accounts: Array<{ id: string; name: string; type: string }>;
    };
}

interface CloudflareTokenSetupProps {
    organisationId?: number;
    onTokenValidated?: (token: string, validation: TokenValidationResult) => void;
    showInstructions?: boolean;
}

export function CloudflareTokenSetup({ organisationId, onTokenValidated, showInstructions = true }: CloudflareTokenSetupProps) {
    const [token, setToken] = useState('');
    const [showToken, setShowToken] = useState(false);
    const [isValidating, setIsValidating] = useState(false);
    const [validation, setValidation] = useState<TokenValidationResult | null>(null);
    const [currentStep, setCurrentStep] = useState(0);
    const [copied, setCopied] = useState(false);

    const instructions = [
        {
            title: 'Go to Cloudflare Dashboard',
            description: 'Open the Cloudflare API Tokens page',
            action: 'Click "Create Token"',
            url: 'https://dash.cloudflare.com/profile/api-tokens',
        },
        {
            title: 'Use Custom Token Template',
            description: 'Select "Custom token" to set specific permissions',
            action: 'Click "Get started" under Custom token',
        },
        {
            title: 'Add Required Permissions',
            description: 'Configure these EXACT permissions (copy/paste each one):',
            permissions: [
                'Account Settings:Read',
                'Access: Apps and Policies:Edit',
                'Access: Audit Logs:Read',
                'Access: SSH Auditing:Edit',
                'Access: Custom Pages:Edit',
                'Access: Device Posture:Edit',
                'Access: Organizations, Identity Providers, and Groups:Edit',
            ],
        },
        {
            title: 'Add Zone Permissions',
            description: 'Add Zone permissions for ALL zones:',
            permissions: ['Zone:Read', 'DNS:Edit'],
            action: 'Select "Include - All zones" for both permissions',
        },
        {
            title: 'Set Account Resources',
            description: 'Under "Account Resources", select your account',
            action: 'Choose "Include - All accounts" or select specific accounts',
        },
        {
            title: 'Create Token',
            description: 'Review settings and create the token',
            action: "Copy the token immediately - it won't be shown again!",
        },
    ];

    const validateToken = async () => {
        if (!token.trim()) {
            return;
        }

        setIsValidating(true);
        setValidation(null);

        try {
            const response = await fetch('/api/cloudflare/validate-token', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || '',
                },
                body: JSON.stringify({
                    token: token.trim(),
                    ...(organisationId && { organisation_id: organisationId }),
                }),
            });

            const result = await response.json();
            setValidation(result);

            if (result.valid && onTokenValidated) {
                onTokenValidated(token.trim(), result);
            }
        } catch (error) {
            setValidation({
                valid: false,
                error: 'Failed to validate token. Please try again.',
            });
        } finally {
            setIsValidating(false);
        }
    };

    const getPermissionIcon = (permission: TokenPermission) => {
        if (permission.granted) {
            return <CheckCircle className="h-4 w-4 text-green-600" />;
        }
        return <XCircle className="h-4 w-4 text-red-600" />;
    };

    const getPermissionStatus = (permission: TokenPermission) => {
        if (permission.granted) {
            return <Badge variant="secondary">✓ Granted</Badge>;
        }
        return <Badge variant="destructive">✗ Missing</Badge>;
    };

    const copyInstructionText = async () => {
        const text = `📋 CLOUDFLARE API TOKEN SETUP INSTRUCTIONS

🎯 PURPOSE: Create an API token for Cloudflare Access management and DNS control

📍 STEP-BY-STEP GUIDE:

1️⃣ GO TO CLOUDFLARE DASHBOARD
   • Visit: https://dash.cloudflare.com/profile/api-tokens
   • Click "Create Token"

2️⃣ SELECT CUSTOM TOKEN
   • Choose "Custom token" template
   • Click "Get started"

3️⃣ CONFIGURE PERMISSIONS (Copy/paste each permission exactly)
   
   🏢 ACCOUNT PERMISSIONS:
   • Account Settings:Read
   
   🛡️ ACCESS PERMISSIONS:
   • Access: Apps and Policies:Edit
   • Access: Audit Logs:Read
   • Access: SSH Auditing:Edit
   • Access: Custom Pages:Edit
   • Access: Device Posture:Edit
   • Access: Organizations, Identity Providers, and Groups:Edit
   
   🌐 ZONE PERMISSIONS:
   • Zone:Read
   • DNS:Edit

4️⃣ SET RESOURCES
   • Zone Resources: Select "Include - All zones"
   • Account Resources: Select "Include - All accounts"

5️⃣ CREATE TOKEN
   • Click "Continue to summary"
   • Review all permissions are correct
   • Click "Create Token"
   • ⚠️ IMPORTANT: Copy the token immediately - it won't be shown again!

🔒 SECURITY NOTES:
   • Store the token securely
   • Don't share the actual token value
   • The token provides full access to your Cloudflare account
   • You can always revoke it from the API tokens page

❓ NEED HELP?
   • These permissions are required for full Cloudflare Access management
   • If you're missing any zones or accounts, contact your Cloudflare admin
   • Problems? Check that you have the necessary account permissions

✅ Once created, paste the token into the application to complete setup.`;

        try {
            await navigator.clipboard.writeText(text);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
        } catch (err) {
            console.error('Failed to copy text: ', err);
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = text;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <div className="space-y-6">
            {showInstructions && (
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="text-lg">Setup Cloudflare API Token</CardTitle>
                                <CardDescription>Create a secure API token with the required permissions</CardDescription>
                            </div>
                            <Button variant="outline" size="sm" onClick={copyInstructionText} disabled={copied}>
                                {copied ? (
                                    <>
                                        <Check className="mr-2 h-4 w-4 text-green-600" />
                                        Copied!
                                    </>
                                ) : (
                                    <>
                                        <Copy className="mr-2 h-4 w-4" />
                                        Share Instructions
                                    </>
                                )}
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {instructions.map((step, index) => (
                            <div key={index} className="space-y-3">
                                <div className="flex items-start gap-3">
                                    <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-medium text-primary">
                                        {index + 1}
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-medium text-foreground">{step.title}</h4>
                                        <p className="mt-1 text-sm text-muted-foreground">{step.description}</p>
                                        {step.action && <p className="mt-1 text-sm font-medium text-primary">→ {step.action}</p>}
                                        {step.url && (
                                            <Button variant="outline" size="sm" className="mt-2" asChild>
                                                <a href={step.url} target="_blank" rel="noopener noreferrer">
                                                    <ExternalLink className="mr-2 h-4 w-4" />
                                                    Open Cloudflare Dashboard
                                                </a>
                                            </Button>
                                        )}
                                        {step.permissions && (
                                            <div className="mt-2 rounded-md bg-muted/50 p-3">
                                                <p className="mb-2 text-sm font-medium">Required Permissions:</p>
                                                <ul className="space-y-1 text-sm">
                                                    {step.permissions.map((permission, pIndex) => (
                                                        <li key={pIndex} className="flex items-center gap-2">
                                                            <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                                                            <code className="rounded bg-background px-1 py-0.5 text-xs">{permission}</code>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                {index < instructions.length - 1 && <Separator className="my-4" />}
                            </div>
                        ))}
                    </CardContent>
                </Card>
            )}

            {/* Token Input Section */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Enter Your API Token</CardTitle>
                    <CardDescription>Paste the token you created from the Cloudflare dashboard</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="token">Cloudflare API Token</Label>
                        <div className="relative">
                            <Input
                                id="token"
                                type={showToken ? 'text' : 'password'}
                                placeholder="Paste your Cloudflare API token here..."
                                value={token}
                                onChange={(e) => setToken(e.target.value)}
                                className="pr-10"
                            />
                            <Button variant="ghost" size="sm" className="absolute top-1 right-1 h-8 w-8 p-0" onClick={() => setShowToken(!showToken)}>
                                {showToken ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </Button>
                        </div>
                    </div>

                    <Button onClick={validateToken} disabled={!token.trim() || isValidating} className="w-full">
                        {isValidating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {isValidating ? 'Validating Token...' : 'Validate Token'}
                    </Button>

                    {/* Validation Results */}
                    {validation && (
                        <div className="space-y-4">
                            {validation.valid ? (
                                <Alert>
                                    <CheckCircle className="h-4 w-4" />
                                    <AlertDescription>Token is valid! All required permissions are granted.</AlertDescription>
                                </Alert>
                            ) : (
                                <Alert variant="destructive">
                                    <AlertTriangle className="h-4 w-4" />
                                    <AlertDescription>{validation.error || 'Token validation failed'}</AlertDescription>
                                </Alert>
                            )}

                            {/* Permission Details */}
                            {validation.permissions && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-base">Permission Check</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-3">
                                        {Object.entries(validation.permissions).map(([key, permission]) => (
                                            <div key={key} className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    {getPermissionIcon(permission)}
                                                    <div>
                                                        <p className="text-sm font-medium">{permission.description}</p>
                                                        {permission.error && <p className="text-xs text-red-600">{permission.error}</p>}
                                                    </div>
                                                </div>
                                                {getPermissionStatus(permission)}
                                            </div>
                                        ))}
                                    </CardContent>
                                </Card>
                            )}

                            {/* Account Access */}
                            {validation.account_access && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-base">Account Access</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        {validation.account_access.has_access ? (
                                            <div className="space-y-2">
                                                <p className="flex items-center gap-2 text-sm text-green-600">
                                                    <CheckCircle className="h-4 w-4" />
                                                    Token can access {validation.account_access.accounts.length} account(s)
                                                </p>
                                                {validation.account_access.accounts.map((account) => (
                                                    <div key={account.id} className="rounded bg-muted/50 p-2 text-sm">
                                                        <strong>{account.name}</strong> ({account.type})
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="flex items-center gap-2 text-sm text-red-600">
                                                <XCircle className="h-4 w-4" />
                                                No account access - please check token permissions
                                            </p>
                                        )}
                                    </CardContent>
                                </Card>
                            )}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

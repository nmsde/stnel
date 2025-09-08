import { CloudflareTokenSetup } from '@/components/cloudflare-token-setup';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { router } from '@inertiajs/react';
import { AlertTriangle, CheckCircle, Clock, ExternalLink, RefreshCw, Shield, XCircle } from 'lucide-react';
import { useState } from 'react';

interface TokenStatusCardProps {
    organisation: {
        id: number;
        name: string;
        has_token?: boolean;
        api_token?: string;
        encrypted_api_token?: string;
        token_last_validated_at?: string;
        token_status?: string;
        token_expires_at?: string;
        token_last_checked?: string;
        token_permissions?: Record<string, any>;
    };
    className?: string;
}

export function TokenStatusCard({ organisation, className = '' }: TokenStatusCardProps) {
    const [showRenewalFlow, setShowRenewalFlow] = useState(false);
    const [isChecking, setIsChecking] = useState(false);

    const getTokenStatus = () => {
        // For legacy tokens, check if we have token_last_validated_at or if we have the new token fields
        const hasNewTokenData = organisation.token_expires_at || organisation.token_last_checked || organisation.token_permissions;
        const hasLegacyToken = organisation.token_last_validated_at;

        // If no token data at all, it's missing
        if (!hasNewTokenData && !hasLegacyToken) {
            return {
                status: 'missing',
                text: 'No Token',
                variant: 'destructive' as const,
                icon: XCircle,
                description: 'API token required for Cloudflare integration',
                color: 'text-red-600',
            };
        }

        // If we have legacy validation date but no new data, the token may be missing
        if (hasLegacyToken && !hasNewTokenData) {
            return {
                status: 'missing',
                text: 'Token Missing',
                variant: 'destructive' as const,
                icon: XCircle,
                description: 'API token was validated before but is now missing - please re-add',
                color: 'text-red-600',
            };
        }

        const expiresAt = organisation.token_expires_at ? new Date(organisation.token_expires_at) : null;
        const now = new Date();
        const daysUntilExpiration = expiresAt ? Math.ceil((expiresAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)) : null;

        if (expiresAt && expiresAt < now) {
            return {
                status: 'expired',
                text: 'Expired',
                variant: 'destructive' as const,
                icon: XCircle,
                description: `Token expired on ${expiresAt.toLocaleDateString()}`,
                color: 'text-red-600',
            };
        }

        if (daysUntilExpiration !== null && daysUntilExpiration <= 7) {
            return {
                status: 'expiring',
                text: `Expires in ${daysUntilExpiration} day${daysUntilExpiration === 1 ? '' : 's'}`,
                variant: 'destructive' as const,
                icon: AlertTriangle,
                description: 'Token needs renewal soon',
                color: 'text-red-600',
            };
        }

        if (daysUntilExpiration !== null && daysUntilExpiration <= 30) {
            return {
                status: 'warning',
                text: `Expires in ${daysUntilExpiration} days`,
                variant: 'outline' as const,
                icon: Clock,
                description: 'Consider renewing your token',
                color: 'text-amber-600',
            };
        }

        return {
            status: 'valid',
            text: 'Active',
            variant: 'secondary' as const,
            icon: CheckCircle,
            description: expiresAt
                ? `Expires ${expiresAt.toLocaleDateString()}`
                : organisation.token_last_validated_at
                  ? `Last validated ${new Date(organisation.token_last_validated_at).toLocaleDateString()}`
                  : 'Token is active (click "Check Health" to verify)',
            color: 'text-green-600',
        };
    };

    const checkTokenHealth = async () => {
        setIsChecking(true);

        try {
            const response = await fetch(`/organisations/${organisation.id}/check-token-health`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || '',
                },
            });

            const result = await response.json();

            if (result.success) {
                // Reload the page to show updated token status
                router.reload({ only: ['organisation'] });
            } else {
                // Show error - token might be invalid
                console.error('Token health check failed:', result.error);
            }
        } catch (error) {
            console.error('Failed to check token health:', error);
        } finally {
            setIsChecking(false);
        }
    };

    const handleTokenRenewed = () => {
        setShowRenewalFlow(false);
        router.reload({ only: ['organisation'] });
    };

    const tokenStatus = getTokenStatus();
    const StatusIcon = tokenStatus.icon;

    if (showRenewalFlow) {
        return (
            <div className={`space-y-6 ${className}`}>
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="text-lg">Renew API Token</CardTitle>
                                <CardDescription>Update your Cloudflare API token for {organisation.name}</CardDescription>
                            </div>
                            <Button variant="ghost" onClick={() => setShowRenewalFlow(false)}>
                                Cancel
                            </Button>
                        </div>
                    </CardHeader>
                </Card>

                <CloudflareTokenSetup organisationId={organisation.id} onTokenValidated={handleTokenRenewed} showInstructions={true} />
            </div>
        );
    }

    return (
        <Card className={className}>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Shield className="h-5 w-5 text-muted-foreground" />
                        <div>
                            <CardTitle className="text-base">Cloudflare Integration</CardTitle>
                            <CardDescription>API token status and health</CardDescription>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <Badge variant={tokenStatus.variant}>
                            <StatusIcon className="mr-1 h-3 w-3" />
                            {tokenStatus.text}
                        </Badge>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                    <StatusIcon className={`mt-0.5 h-5 w-5 ${tokenStatus.color}`} />
                    <div className="flex-1">
                        <p className="text-sm font-medium text-foreground">
                            {tokenStatus.status === 'missing' && 'No API Token Configured'}
                            {tokenStatus.status === 'expired' && 'API Token Has Expired'}
                            {tokenStatus.status === 'expiring' && 'API Token Expiring Soon'}
                            {tokenStatus.status === 'warning' && 'API Token Expires Soon'}
                            {tokenStatus.status === 'valid' && 'API Token Active'}
                        </p>
                        <p className="mt-1 text-sm text-muted-foreground">{tokenStatus.description}</p>

                        {organisation.token_last_checked && (
                            <p className="mt-2 text-xs text-muted-foreground">
                                Last checked: {new Date(organisation.token_last_checked).toLocaleString()}
                            </p>
                        )}
                    </div>
                </div>

                {/* Action based on token status */}
                <div className="flex items-center justify-between border-t pt-2">
                    <div className="flex items-center gap-2">
                        {tokenStatus.status !== 'missing' && (
                            <Button variant="outline" size="sm" onClick={checkTokenHealth} disabled={isChecking}>
                                {isChecking ? <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCw className="mr-2 h-4 w-4" />}
                                {isChecking ? 'Checking...' : 'Check Health'}
                            </Button>
                        )}
                    </div>

                    <div className="flex items-center gap-2">
                        {(tokenStatus.status === 'missing' || tokenStatus.status === 'expired') && (
                            <Button onClick={() => setShowRenewalFlow(true)}>
                                {tokenStatus.status === 'missing' ? 'Add Token' : 'Replace Token'}
                            </Button>
                        )}

                        {(tokenStatus.status === 'expiring' || tokenStatus.status === 'warning') && (
                            <>
                                <Button variant="outline" size="sm" onClick={() => setShowRenewalFlow(true)}>
                                    Renew Token
                                </Button>
                                <Button size="sm" asChild>
                                    <a href="https://dash.cloudflare.com/profile/api-tokens" target="_blank" rel="noopener noreferrer">
                                        <ExternalLink className="mr-2 h-4 w-4" />
                                        Cloudflare Dashboard
                                    </a>
                                </Button>
                            </>
                        )}
                    </div>
                </div>

                {/* Show permissions if available */}
                {organisation.token_permissions && Object.keys(organisation.token_permissions).length > 0 && (
                    <div className="border-t pt-2">
                        <p className="mb-2 text-xs font-medium text-muted-foreground">Token Permissions:</p>
                        <div className="flex flex-wrap gap-1">
                            {Object.entries(organisation.token_permissions).map(([key, permission]: [string, any]) => (
                                <Badge key={key} variant={permission.granted ? 'secondary' : 'destructive'} className="text-xs">
                                    {permission.granted ? '✓' : '✗'} {key}
                                </Badge>
                            ))}
                        </div>
                    </div>
                )}

                {/* Critical alerts */}
                {(tokenStatus.status === 'expired' || tokenStatus.status === 'expiring') && (
                    <Alert variant="destructive">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription>
                            {tokenStatus.status === 'expired'
                                ? 'Your Cloudflare integration is not working. Protected applications may be inaccessible.'
                                : 'Your Cloudflare integration will stop working soon. Renew your token to avoid disruption.'}
                        </AlertDescription>
                    </Alert>
                )}
            </CardContent>
        </Card>
    );
}

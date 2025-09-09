import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import { Copy, CheckCircle2, AlertTriangle, Eye, EyeOff, RefreshCw, Code2 } from 'lucide-react';
import { useState } from 'react';
import { useCopyToClipboard } from '@/lib/clipboard';

interface TokenInfo {
    id: string;
    name: string;
    organization: string;
    scopes: string[];
    expires_at: string | null;
}

interface Props {
    token: string;
    tokenInfo: TokenInfo;
}

export default function ApiTokenRegenerated({ token, tokenInfo }: Props) {
    const { copied, copy } = useCopyToClipboard();
    const [showToken, setShowToken] = useState(true);

    const maskedToken = token.replace(/^(stnel_)(.{8})(.+)(.{8})$/, '$1$2***$4');

    return (
        <AppLayout>
            <Head title="API Token Regenerated" />

            <div className="space-y-6">
                {/* Header */}
                <div className="text-center space-y-2">
                    <div className="flex items-center justify-center mb-4">
                        <div className="flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full">
                            <RefreshCw className="w-8 h-8 text-blue-600" />
                        </div>
                    </div>
                    <h1 className="text-2xl font-bold">API Token Regenerated Successfully!</h1>
                    <p className="text-muted-foreground">
                        A new token has been generated for "{tokenInfo.name}" in {tokenInfo.organization}
                    </p>
                </div>

                {/* Critical Warning */}
                <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription className="space-y-2">
                        <p className="font-medium">
                            <strong>Important:</strong> The old token is now invalid and will no longer work.
                        </p>
                        <p>
                            Update your CI/CD pipelines and applications with this new token immediately.
                            This is the only time you'll see this token.
                        </p>
                    </AlertDescription>
                </Alert>

                {/* Token Display */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                            New API Token
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setShowToken(!showToken)}
                            >
                                {showToken ? (
                                    <>
                                        <EyeOff className="mr-2 h-4 w-4" />
                                        Hide
                                    </>
                                ) : (
                                    <>
                                        <Eye className="mr-2 h-4 w-4" />
                                        Show
                                    </>
                                )}
                            </Button>
                        </CardTitle>
                        <CardDescription>
                            Copy this token and update your environment variables
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="relative">
                            <div className="flex items-center p-3 bg-muted rounded-lg font-mono text-sm break-all">
                                {showToken ? token : maskedToken}
                            </div>
                            <Button
                                variant="outline"
                                size="sm"
                                className="absolute right-2 top-2"
                                onClick={() => copy(token)}
                            >
                                {copied ? (
                                    <>
                                        <CheckCircle2 className="mr-2 h-3 w-3" />
                                        Copied!
                                    </>
                                ) : (
                                    <>
                                        <Copy className="mr-2 h-3 w-3" />
                                        Copy
                                    </>
                                )}
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Token Details */}
                <Card>
                    <CardHeader>
                        <CardTitle>Token Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm font-medium text-muted-foreground">Name</label>
                                <p className="font-medium">{tokenInfo.name}</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-muted-foreground">Organization</label>
                                <p className="font-medium">{tokenInfo.organization}</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-muted-foreground">Expires</label>
                                <p className="font-medium">{tokenInfo.expires_at || 'Never'}</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-muted-foreground">Permissions</label>
                                <div className="flex flex-wrap gap-1 mt-1">
                                    {tokenInfo.scopes.map((scope) => (
                                        <Badge key={scope} variant="outline" className="text-xs">
                                            {scope}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Update Instructions */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <AlertTriangle className="h-5 w-5 text-amber-500" />
                            Update Your Applications
                        </CardTitle>
                        <CardDescription>
                            Replace the old token in these locations immediately
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-3">
                            <div className="flex items-center justify-between p-3 bg-amber-50 border border-amber-200 rounded-lg">
                                <div className="space-y-1">
                                    <p className="font-medium text-amber-800">GitHub Actions</p>
                                    <p className="text-sm text-amber-700">Update repository secrets</p>
                                </div>
                                <Badge variant="outline" className="bg-amber-100">Action Required</Badge>
                            </div>
                            
                            <div className="flex items-center justify-between p-3 bg-amber-50 border border-amber-200 rounded-lg">
                                <div className="space-y-1">
                                    <p className="font-medium text-amber-800">CI/CD Pipelines</p>
                                    <p className="text-sm text-amber-700">Update environment variables</p>
                                </div>
                                <Badge variant="outline" className="bg-amber-100">Action Required</Badge>
                            </div>
                            
                            <div className="flex items-center justify-between p-3 bg-amber-50 border border-amber-200 rounded-lg">
                                <div className="space-y-1">
                                    <p className="font-medium text-amber-800">Scripts & Applications</p>
                                    <p className="text-sm text-amber-700">Update hardcoded tokens</p>
                                </div>
                                <Badge variant="outline" className="bg-amber-100">Action Required</Badge>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Actions */}
                <div className="flex items-center justify-center gap-4 pt-6">
                    <Link href="/api-tokens">
                        <Button variant="outline">
                            View All Tokens
                        </Button>
                    </Link>
                    <Link href={`/api-tokens/${tokenInfo.id}`}>
                        <Button>
                            <Code2 className="mr-2 h-4 w-4" />
                            View Token Details
                        </Button>
                    </Link>
                </div>
            </div>
        </AppLayout>
    );
}
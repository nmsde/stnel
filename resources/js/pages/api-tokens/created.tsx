import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import { Copy, CheckCircle2, AlertTriangle, Eye, EyeOff, Terminal, Code2 } from 'lucide-react';
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

export default function ApiTokenCreated({ token, tokenInfo }: Props) {
    const { copied, copy } = useCopyToClipboard();
    const [showToken, setShowToken] = useState(true);

    const maskedToken = token.replace(/^(stnel_)(.{8})(.+)(.{8})$/, '$1$2***$4');

    return (
        <AppLayout>
            <Head title="API Token Created" />

            <div className="space-y-6">
                {/* Header */}
                <div className="text-center space-y-2">
                    <div className="flex items-center justify-center mb-4">
                        <div className="flex items-center justify-center w-16 h-16 bg-green-100 rounded-full">
                            <CheckCircle2 className="w-8 h-8 text-green-600" />
                        </div>
                    </div>
                    <h1 className="text-2xl font-bold">API Token Created Successfully!</h1>
                    <p className="text-muted-foreground">
                        Your API token "{tokenInfo.name}" has been created for {tokenInfo.organization}
                    </p>
                </div>

                {/* Critical Warning */}
                <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription className="font-medium">
                        <strong>Important:</strong> This is the only time you'll see this token. Copy it now and store it securely.
                        If you lose it, you'll need to regenerate a new token.
                    </AlertDescription>
                </Alert>

                {/* Token Display */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                            API Token
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
                            Copy this token and store it in your CI/CD environment variables
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

                {/* Usage Examples */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Terminal className="h-5 w-5" />
                            Usage Examples
                        </CardTitle>
                        <CardDescription>
                            How to use your API token in different environments
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-3">
                            <h4 className="font-medium">cURL Example</h4>
                            <div className="bg-muted p-3 rounded-lg font-mono text-sm overflow-x-auto">
                                <code>{`curl -H "Authorization: Bearer ${showToken ? token : 'YOUR_TOKEN_HERE'}" \\
  https://stnel.com/api/v1/policies`}</code>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <h4 className="font-medium">GitHub Actions</h4>
                            <div className="bg-muted p-3 rounded-lg font-mono text-sm overflow-x-auto">
                                <code>{`# Add to your repository secrets as STNEL_API_TOKEN
- name: Deploy Access Policy
  run: |
    curl -X POST https://stnel.com/api/v1/policies \\
      -H "Authorization: Bearer \${{ secrets.STNEL_API_TOKEN }}" \\
      -H "Content-Type: application/json" \\
      -d '{"name": "App Access", "domain": "app.example.com", "rules": [...]}'`}</code>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <h4 className="font-medium">Environment Variable</h4>
                            <div className="bg-muted p-3 rounded-lg font-mono text-sm overflow-x-auto">
                                <code>{`export STNEL_API_TOKEN="${showToken ? token : 'YOUR_TOKEN_HERE'}"`}</code>
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
                            View Documentation
                        </Button>
                    </Link>
                </div>
            </div>
        </AppLayout>
    );
}
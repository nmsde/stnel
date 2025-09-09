import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import { Key, Code2, Book, Terminal, ExternalLink } from 'lucide-react';

const endpoints = [
    {
        method: 'GET',
        path: '/api/v1/organizations',
        description: 'List organizations',
        scopes: ['organizations:read'],
    },
    {
        method: 'GET',
        path: '/api/v1/organizations/{id}',
        description: 'Get organization details',
        scopes: ['organizations:read'],
    },
    {
        method: 'GET',
        path: '/api/v1/policies',
        description: 'List access policies',
        scopes: ['policies:read'],
    },
    {
        method: 'POST',
        path: '/api/v1/policies',
        description: 'Create new access policy',
        scopes: ['policies:write'],
    },
    {
        method: 'PUT',
        path: '/api/v1/policies/{id}',
        description: 'Update access policy',
        scopes: ['policies:write'],
    },
    {
        method: 'DELETE',
        path: '/api/v1/policies/{id}',
        description: 'Delete access policy',
        scopes: ['policies:delete'],
    },
    {
        method: 'POST',
        path: '/api/v1/policies/bulk',
        description: 'Bulk operations on policies',
        scopes: ['policies:read', 'policies:write'],
    },
    {
        method: 'POST',
        path: '/api/v1/policies/check',
        description: 'Check if policy exists and compare configuration',
        scopes: ['policies:read'],
    },
    {
        method: 'POST',
        path: '/api/v1/policies/upsert',
        description: 'Create or update policy (idempotent for CI/CD)',
        scopes: ['policies:write'],
    },
    {
        method: 'GET',
        path: '/api/v1/applications',
        description: 'List applications/zones',
        scopes: ['applications:read'],
    },
];

const examples = {
    auth: `curl -H "Authorization: Bearer stnel_your_token_here" \\
  https://stnel.com/api/v1/policies`,
    
    createPolicy: `curl -X POST https://stnel.com/api/v1/policies \\
  -H "Authorization: Bearer stnel_your_token_here" \\
  -H "Content-Type: application/json" \\
  -d '{
    "name": "Production App Access",
    "domain": "app.example.com",
    "cloudflare_zone_id": 123,
    "session_duration": 60,
    "require_mfa": true,
    "rules": [
      {
        "type": "email",
        "value": "admin@example.com",
        "action": "allow"
      },
      {
        "type": "email_domain", 
        "value": "@company.com",
        "action": "allow"
      }
    ]
  }'`,
    
    listPolicies: `curl -H "Authorization: Bearer stnel_your_token_here" \\
  "https://stnel.com/api/v1/policies?status=active&per_page=50"`,
    
    checkPolicy: `curl -X POST https://stnel.com/api/v1/policies/check \\
  -H "Authorization: Bearer stnel_your_token_here" \\
  -H "Content-Type: application/json" \\
  -d '{
    "domain": "app.example.com",
    "path": "/admin",
    "name": "Admin Access",
    "require_mfa": true,
    "rules": [
      {
        "type": "email_domain",
        "value": "@company.com",
        "action": "allow"
      }
    ]
  }'`,
    
    upsertPolicy: `curl -X POST https://stnel.com/api/v1/policies/upsert \\
  -H "Authorization: Bearer stnel_your_token_here" \\
  -H "Content-Type: application/json" \\
  -d '{
    "name": "Production App Access",
    "domain": "app.example.com",
    "path": "/",
    "cloudflare_zone_id": 123,
    "session_duration": 60,
    "require_mfa": true,
    "rules": [
      {
        "type": "email_domain",
        "value": "@company.com",
        "action": "allow"
      }
    ]
  }'`,
    
    githubAction: `name: Deploy Access Policy
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Deploy to Stnel (Idempotent)
        run: |
          curl -X POST https://stnel.com/api/v1/policies/upsert \\
            -H "Authorization: Bearer \${{ secrets.STNEL_API_TOKEN }}" \\
            -H "Content-Type: application/json" \\
            -d @policy.json`,
};

export default function ApiDocumentation() {
    const getMethodColor = (method: string) => {
        switch (method) {
            case 'GET': return 'bg-blue-100 text-blue-800';
            case 'POST': return 'bg-green-100 text-green-800';
            case 'PUT': return 'bg-orange-100 text-orange-800';
            case 'PATCH': return 'bg-orange-100 text-orange-800';
            case 'DELETE': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <AppLayout>
            <Head title="API Documentation" />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">API Documentation</h1>
                        <p className="text-muted-foreground">
                            Programmatically manage Cloudflare Access policies
                        </p>
                    </div>
                    <Link href="/api-tokens">
                        <Button>
                            <Key className="mr-2 h-4 w-4" />
                            Manage API Tokens
                        </Button>
                    </Link>
                </div>

                {/* Overview */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Book className="h-5 w-5" />
                            Getting Started
                        </CardTitle>
                        <CardDescription>
                            The Stnel API lets you manage Cloudflare Access policies from your CI/CD pipelines, scripts, and applications.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid gap-4 md:grid-cols-2">
                            <div>
                                <h4 className="font-medium mb-2">Base URL</h4>
                                <code className="bg-muted px-3 py-2 rounded text-sm block">https://stnel.com/api/v1</code>
                            </div>
                            <div>
                                <h4 className="font-medium mb-2">Authentication</h4>
                                <code className="bg-muted px-3 py-2 rounded text-sm block">Bearer stnel_your_token_here</code>
                            </div>
                            <div>
                                <h4 className="font-medium mb-2">Content Type</h4>
                                <code className="bg-muted px-3 py-2 rounded text-sm block">application/json</code>
                            </div>
                            <div>
                                <h4 className="font-medium mb-2">Rate Limit</h4>
                                <code className="bg-muted px-3 py-2 rounded text-sm block">1000 requests/hour</code>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Tabs defaultValue="endpoints" className="space-y-6">
                    <TabsList>
                        <TabsTrigger value="endpoints">Endpoints</TabsTrigger>
                        <TabsTrigger value="examples">Examples</TabsTrigger>
                        <TabsTrigger value="cicd">CI/CD Integration</TabsTrigger>
                    </TabsList>

                    <TabsContent value="endpoints" className="space-y-6">
                        {/* Endpoints */}
                        <Card>
                            <CardHeader>
                                <CardTitle>API Endpoints</CardTitle>
                                <CardDescription>
                                    Available endpoints and required permissions
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    {endpoints.map((endpoint, index) => (
                                        <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                                            <div className="flex items-center gap-3">
                                                <Badge className={`${getMethodColor(endpoint.method)} text-xs font-mono`}>
                                                    {endpoint.method}
                                                </Badge>
                                                <code className="text-sm">{endpoint.path}</code>
                                                <span className="text-muted-foreground text-sm">{endpoint.description}</span>
                                            </div>
                                            <div className="flex gap-1">
                                                {endpoint.scopes.map((scope) => (
                                                    <Badge key={scope} variant="outline" className="text-xs">
                                                        {scope}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="examples" className="space-y-6">
                        {/* Authentication Example */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Authentication</CardTitle>
                                <CardDescription>All API requests require a Bearer token</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto">
                                    <code>{examples.auth}</code>
                                </pre>
                            </CardContent>
                        </Card>

                        {/* Create Policy Example */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Create Access Policy</CardTitle>
                                <CardDescription>Create a new Cloudflare Access policy</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto">
                                    <code>{examples.createPolicy}</code>
                                </pre>
                            </CardContent>
                        </Card>

                        {/* List Policies Example */}
                        <Card>
                            <CardHeader>
                                <CardTitle>List Policies</CardTitle>
                                <CardDescription>Retrieve access policies with filtering and pagination</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto">
                                    <code>{examples.listPolicies}</code>
                                </pre>
                            </CardContent>
                        </Card>

                        {/* Check Policy Example */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Check Policy Existence</CardTitle>
                                <CardDescription>Check if a policy exists and compare configuration (for CI/CD)</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto">
                                    <code>{examples.checkPolicy}</code>
                                </pre>
                                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                    <p className="text-sm text-blue-800">
                                        <strong>Response:</strong> Returns whether policy exists, current configuration, and what action should be taken (create/update/skip).
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Upsert Policy Example */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Upsert Policy (Recommended for CI/CD)</CardTitle>
                                <CardDescription>Create or update a policy idempotently</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto">
                                    <code>{examples.upsertPolicy}</code>
                                </pre>
                                <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                                    <p className="text-sm text-green-800">
                                        <strong>Idempotent:</strong> This endpoint creates a new policy or updates an existing one based on domain+path. 
                                        If no changes are detected, it skips the operation, making it perfect for CI/CD pipelines.
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="cicd" className="space-y-6">
                        {/* GitHub Actions Example */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Terminal className="h-5 w-5" />
                                    GitHub Actions
                                </CardTitle>
                                <CardDescription>
                                    Deploy access policies automatically with GitHub Actions
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto">
                                    <code>{examples.githubAction}</code>
                                </pre>
                                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                    <p className="text-sm text-blue-800">
                                        <strong>Tip:</strong> Add your API token as a repository secret named <code>STNEL_API_TOKEN</code>
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Environment Variables */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Environment Variables</CardTitle>
                                <CardDescription>Store your API token securely</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    <div>
                                        <h4 className="font-medium mb-2">Shell</h4>
                                        <pre className="bg-muted p-3 rounded text-sm">
                                            <code>export STNEL_API_TOKEN="stnel_your_token_here"</code>
                                        </pre>
                                    </div>
                                    <div>
                                        <h4 className="font-medium mb-2">.env file</h4>
                                        <pre className="bg-muted p-3 rounded text-sm">
                                            <code>STNEL_API_TOKEN=stnel_your_token_here</code>
                                        </pre>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Best Practices */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Best Practices</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    <div className="flex items-start gap-3">
                                        <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                                        <p className="text-sm">Use environment variables to store API tokens</p>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                                        <p className="text-sm">Grant minimal required permissions to tokens</p>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                                        <p className="text-sm">Set expiration dates on tokens when possible</p>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                                        <p className="text-sm">Monitor API usage and rotate tokens regularly</p>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                                        <p className="text-sm">Handle rate limits gracefully in your applications</p>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                                        <p className="text-sm">Use /upsert endpoint for CI/CD to ensure idempotent deployments</p>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                                        <p className="text-sm">Use /check endpoint to validate configurations before deployment</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>

                {/* Quick Actions */}
                <div className="flex items-center justify-center gap-4 pt-6">
                    <Link href="/api-tokens/create">
                        <Button>
                            <Key className="mr-2 h-4 w-4" />
                            Create API Token
                        </Button>
                    </Link>
                    <Button variant="outline" asChild>
                        <a href="https://stnel.com/api/v1" target="_blank" rel="noopener noreferrer">
                            <Code2 className="mr-2 h-4 w-4" />
                            Test API
                            <ExternalLink className="ml-2 h-3 w-3" />
                        </a>
                    </Button>
                </div>
            </div>
        </AppLayout>
    );
}
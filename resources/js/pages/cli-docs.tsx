import Footer from '@/components/footer';
import Navigation from '@/components/navigation';
import { Head, Link } from '@inertiajs/react';
import { 
    ArrowRight, 
    Code, 
    Download, 
    FileText, 
    GitBranch, 
    Shield, 
    Terminal, 
    Zap,
    CheckCircle2,
    Copy,
    ExternalLink
} from 'lucide-react';
import { useCopyToClipboard } from '@/lib/clipboard';

export default function CliDocumentation() {
    const { copied, copy } = useCopyToClipboard();

    const CodeBlock = ({ code, language = 'bash', id }: { code: string; language?: string; id: string }) => (
        <div className="relative">
            <div className="overflow-hidden rounded-lg bg-gray-900 p-4">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-gray-400 font-mono">{language}</span>
                    <button
                        onClick={() => copy(code, id)}
                        className="text-gray-400 hover:text-white text-xs flex items-center gap-1"
                    >
                        {copied === id ? (
                            <>
                                <CheckCircle2 className="h-3 w-3" />
                                Copied!
                            </>
                        ) : (
                            <>
                                <Copy className="h-3 w-3" />
                                Copy
                            </>
                        )}
                    </button>
                </div>
                <pre className="text-sm text-gray-300 overflow-x-auto">
                    <code>{code}</code>
                </pre>
            </div>
        </div>
    );

    return (
        <>
            <Head title="Stnel CLI - Deploy Cloudflare Access Policies with Code">
                <meta
                    name="description"
                    content="Deploy Cloudflare Access policies directly from your CI/CD pipeline with the Stnel CLI. Store policies as code, deploy with Git, and manage access control alongside your applications."
                />
                <meta
                    name="keywords"
                    content="Stnel CLI, Cloudflare Access CLI, CI/CD Access Policies, Infrastructure as Code, DevOps Security, Access Control Automation"
                />
            </Head>

            <div className="bg-white min-h-screen">
                <Navigation currentPage="cli-docs" />

                {/* Hero Section */}
                <section className="relative overflow-hidden pt-24 pb-16">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#FFCD45]/5 via-white to-[#FFCD45]/3" />
                    
                    <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
                        <div className="mx-auto max-w-4xl text-center">
                            <div className="mb-8 inline-flex items-center rounded-full border border-[#FFCD45]/20 bg-[#FFCD45]/10 px-6 py-3 text-sm text-[#343434]">
                                <Terminal className="mr-2 h-4 w-4 text-[#FFCD45]" />
                                Access Policies as Code
                            </div>

                            <h1 className="mb-6 text-4xl font-bold tracking-tight text-[#343434] sm:text-6xl">
                                <span className="block">Deploy Access Policies</span>
                                <span className="block text-[#FFCD45]">with Your Code</span>
                            </h1>

                            <p className="mx-auto mb-8 max-w-3xl text-xl leading-relaxed text-gray-600">
                                Manage Cloudflare Access policies directly from your CI/CD pipeline. Store access rules as code, 
                                deploy with Git, and keep your security configuration in sync with your applications.
                            </p>

                            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                                <a
                                    href="#installation"
                                    className="inline-flex items-center rounded-2xl bg-[#FFCD45] px-6 py-3 text-base font-semibold text-[#343434] transition-all duration-200 hover:bg-[#FFD700]"
                                >
                                    Get Started
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </a>
                                
                                <a
                                    href="#examples"
                                    className="inline-flex items-center font-medium text-[#343434]/70 hover:text-[#343434]"
                                >
                                    <Code className="mr-2 h-5 w-5 text-[#FFCD45]" />
                                    View Examples
                                </a>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Features Overview */}
                <section className="py-16 bg-gray-50">
                    <div className="mx-auto max-w-7xl px-6 lg:px-8">
                        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                            <div className="text-center">
                                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#FFCD45]">
                                    <FileText className="h-8 w-8 text-[#343434]" />
                                </div>
                                <h3 className="mb-2 text-lg font-semibold text-[#343434]">Policy Configuration</h3>
                                <p className="text-gray-600">Define access policies in a simple JSON file alongside your code</p>
                            </div>
                            
                            <div className="text-center">
                                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#FFCD45]">
                                    <GitBranch className="h-8 w-8 text-[#343434]" />
                                </div>
                                <h3 className="mb-2 text-lg font-semibold text-[#343434]">Version Control</h3>
                                <p className="text-gray-600">Track policy changes with Git and review access rule modifications</p>
                            </div>
                            
                            <div className="text-center">
                                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#FFCD45]">
                                    <Zap className="h-8 w-8 text-[#343434]" />
                                </div>
                                <h3 className="mb-2 text-lg font-semibold text-[#343434]">Automated Deployment</h3>
                                <p className="text-gray-600">Deploy policies automatically with GitHub Actions, GitLab CI, or any CI/CD platform</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Installation */}
                <section id="installation" className="py-20">
                    <div className="mx-auto max-w-4xl px-6 lg:px-8">
                        <h2 className="mb-8 text-3xl font-bold text-[#343434]">Installation</h2>
                        
                        <div className="space-y-6">
                            <div>
                                <h3 className="mb-4 text-xl font-semibold text-[#343434]">Install via npm</h3>
                                <CodeBlock 
                                    code="npm install -g @stnel/cli" 
                                    id="install-npm" 
                                />
                            </div>
                            
                            <div>
                                <h3 className="mb-4 text-xl font-semibold text-[#343434]">Verify Installation</h3>
                                <CodeBlock 
                                    code="stnel --version" 
                                    id="verify-install" 
                                />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Quick Start */}
                <section className="py-20 bg-gray-50">
                    <div className="mx-auto max-w-4xl px-6 lg:px-8">
                        <h2 className="mb-8 text-3xl font-bold text-[#343434]">Quick Start</h2>
                        
                        <div className="space-y-8">
                            <div>
                                <h3 className="mb-4 text-xl font-semibold text-[#343434] flex items-center">
                                    <span className="mr-3 flex h-8 w-8 items-center justify-center rounded-full bg-[#FFCD45] text-sm font-bold text-[#343434]">1</span>
                                    Initialize your project
                                </h3>
                                <CodeBlock 
                                    code="cd your-project
stnel init" 
                                    id="init-project" 
                                />
                                <p className="mt-3 text-sm text-gray-600">
                                    This creates a <code className="bg-gray-200 px-2 py-1 rounded text-xs">policy.json</code> file in your project root.
                                </p>
                            </div>

                            <div>
                                <h3 className="mb-4 text-xl font-semibold text-[#343434] flex items-center">
                                    <span className="mr-3 flex h-8 w-8 items-center justify-center rounded-full bg-[#FFCD45] text-sm font-bold text-[#343434]">2</span>
                                    Configure your API token
                                </h3>
                                <CodeBlock 
                                    code={'export STNEL_API_TOKEN="stnel_your_token_here"'} 
                                    id="set-token" 
                                />
                                <p className="mt-3 text-sm text-gray-600">
                                    Get your API token from the <Link href="/dashboard" className="text-[#FFCD45] hover:underline">Stnel dashboard</Link>.
                                </p>
                            </div>

                            <div>
                                <h3 className="mb-4 text-xl font-semibold text-[#343434] flex items-center">
                                    <span className="mr-3 flex h-8 w-8 items-center justify-center rounded-full bg-[#FFCD45] text-sm font-bold text-[#343434]">3</span>
                                    Deploy your policies
                                </h3>
                                <CodeBlock 
                                    code="stnel deploy" 
                                    id="deploy-policies" 
                                />
                                <p className="mt-3 text-sm text-gray-600">
                                    Deploys policies defined in your <code className="bg-gray-200 px-2 py-1 rounded text-xs">policy.json</code> file.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Configuration */}
                <section id="examples" className="py-20">
                    <div className="mx-auto max-w-4xl px-6 lg:px-8">
                        <h2 className="mb-8 text-3xl font-bold text-[#343434]">Policy Configuration</h2>
                        
                        <div className="space-y-8">
                            <div>
                                <h3 className="mb-4 text-xl font-semibold text-[#343434]">Basic policy.json Structure</h3>
                                <CodeBlock 
                                    language="json"
                                    code={`{
  "organization_id": 123,
  "policies": [
    {
      "name": "Staging App Access",
      "domain": "staging.myapp.com",
      "cloudflare_zone_id": 456,
      "session_duration": 60,
      "require_mfa": true,
      "rules": [
        {
          "type": "email_domain",
          "value": "@mycompany.com",
          "action": "allow"
        }
      ]
    }
  ]
}`}
                                    id="basic-config" 
                                />
                            </div>

                            <div>
                                <h3 className="mb-4 text-xl font-semibold text-[#343434]">Multiple Environment Example</h3>
                                <CodeBlock 
                                    language="json"
                                    code={`{
  "organization_id": 123,
  "policies": [
    {
      "name": "Production API",
      "domain": "api.myapp.com",
      "path": "/admin",
      "cloudflare_zone_id": 456,
      "session_duration": 30,
      "require_mfa": true,
      "rules": [
        {
          "type": "email",
          "value": "admin@mycompany.com",
          "action": "allow"
        },
        {
          "type": "email_domain", 
          "value": "@mycompany.com",
          "action": "allow"
        }
      ]
    },
    {
      "name": "Staging Access",
      "domain": "staging.myapp.com",
      "cloudflare_zone_id": 789,
      "session_duration": 120,
      "require_mfa": false,
      "rules": [
        {
          "type": "email_domain",
          "value": "@mycompany.com", 
          "action": "allow"
        },
        {
          "type": "email_domain",
          "value": "@contractor.com",
          "action": "allow"
        }
      ]
    }
  ]
}`}
                                    id="multi-env-config" 
                                />
                            </div>

                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                                <h4 className="font-semibold text-blue-800 mb-2">💡 Pro Tip</h4>
                                <p className="text-blue-700 text-sm">
                                    The CLI uses the <strong>domain + path</strong> combination to identify policies. 
                                    If a policy already exists for the same domain/path, it will be updated only if the configuration has changed.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CI/CD Integration */}
                <section className="py-20 bg-gray-50">
                    <div className="mx-auto max-w-4xl px-6 lg:px-8">
                        <h2 className="mb-8 text-3xl font-bold text-[#343434]">CI/CD Integration</h2>
                        
                        <div className="space-y-8">
                            <div>
                                <h3 className="mb-4 text-xl font-semibold text-[#343434]">GitHub Actions</h3>
                                <p className="mb-4 text-gray-600">Add this workflow to <code className="bg-gray-200 px-2 py-1 rounded text-xs">.github/workflows/deploy-policies.yml</code>:</p>
                                <CodeBlock 
                                    language="yaml"
                                    code={`name: Deploy Access Policies

on:
  push:
    branches: [main]
    paths: ['policy.json']

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          
      - name: Install Stnel CLI
        run: npm install -g @stnel/cli
        
      - name: Deploy Policies
        env:
          STNEL_API_TOKEN: $\{{ secrets.STNEL_API_TOKEN }}
        run: stnel deploy`}
                                    id="github-actions" 
                                />
                            </div>

                            <div>
                                <h3 className="mb-4 text-xl font-semibold text-[#343434]">GitLab CI</h3>
                                <p className="mb-4 text-gray-600">Add this job to your <code className="bg-gray-200 px-2 py-1 rounded text-xs">.gitlab-ci.yml</code>:</p>
                                <CodeBlock 
                                    language="yaml"
                                    code={`deploy-policies:
  stage: deploy
  image: node:18
  script:
    - npm install -g @stnel/cli
    - stnel deploy
  variables:
    STNEL_API_TOKEN: $STNEL_API_TOKEN
  only:
    changes:
      - policy.json
    refs:
      - main`}
                                    id="gitlab-ci" 
                                />
                            </div>

                            <div>
                                <h3 className="mb-4 text-xl font-semibold text-[#343434]">Docker</h3>
                                <CodeBlock 
                                    language="dockerfile"
                                    code={`FROM node:18-alpine

RUN npm install -g @stnel/cli

WORKDIR /app
COPY policy.json .

CMD ["stnel", "deploy"]`}
                                    id="docker-example" 
                                />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Commands */}
                <section className="py-20">
                    <div className="mx-auto max-w-4xl px-6 lg:px-8">
                        <h2 className="mb-8 text-3xl font-bold text-[#343434]">CLI Commands</h2>
                        
                        <div className="space-y-6">
                            <div className="border border-gray-200 rounded-lg p-6">
                                <h4 className="mb-2 text-lg font-semibold text-[#343434] font-mono">stnel init</h4>
                                <p className="text-gray-600 mb-3">Initialize a new policy configuration file in the current directory.</p>
                                <div className="text-sm text-gray-500">
                                    <strong>Options:</strong>
                                    <ul className="ml-4 mt-1 list-disc">
                                        <li><code className="bg-gray-100 px-1 rounded">--force</code> - Overwrite existing policy.json</li>
                                    </ul>
                                </div>
                            </div>

                            <div className="border border-gray-200 rounded-lg p-6">
                                <h4 className="mb-2 text-lg font-semibold text-[#343434] font-mono">stnel deploy</h4>
                                <p className="text-gray-600 mb-3">Deploy policies from policy.json to Stnel. Creates new policies or updates existing ones.</p>
                                <div className="text-sm text-gray-500">
                                    <strong>Options:</strong>
                                    <ul className="ml-4 mt-1 list-disc">
                                        <li><code className="bg-gray-100 px-1 rounded">--config</code> - Specify custom config file path</li>
                                        <li><code className="bg-gray-100 px-1 rounded">--dry-run</code> - Preview changes without applying</li>
                                        <li><code className="bg-gray-100 px-1 rounded">--verbose</code> - Detailed output</li>
                                    </ul>
                                </div>
                            </div>

                            <div className="border border-gray-200 rounded-lg p-6">
                                <h4 className="mb-2 text-lg font-semibold text-[#343434] font-mono">stnel validate</h4>
                                <p className="text-gray-600 mb-3">Validate policy.json configuration without deploying.</p>
                            </div>

                            <div className="border border-gray-200 rounded-lg p-6">
                                <h4 className="mb-2 text-lg font-semibold text-[#343434] font-mono">stnel status</h4>
                                <p className="text-gray-600 mb-3">Compare local policies with deployed policies to see what would change.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Best Practices */}
                <section className="py-20 bg-gray-50">
                    <div className="mx-auto max-w-4xl px-6 lg:px-8">
                        <h2 className="mb-8 text-3xl font-bold text-[#343434]">Best Practices</h2>
                        
                        <div className="space-y-6">
                            <div className="flex items-start gap-4">
                                <CheckCircle2 className="h-6 w-6 text-green-500 mt-0.5 flex-shrink-0" />
                                <div>
                                    <h4 className="font-semibold text-[#343434]">Store API tokens as secrets</h4>
                                    <p className="text-gray-600">Never commit API tokens to your repository. Use CI/CD secret management.</p>
                                </div>
                            </div>
                            
                            <div className="flex items-start gap-4">
                                <CheckCircle2 className="h-6 w-6 text-green-500 mt-0.5 flex-shrink-0" />
                                <div>
                                    <h4 className="font-semibold text-[#343434]">Use environment-specific configs</h4>
                                    <p className="text-gray-600">Separate configurations for staging, production, and development environments.</p>
                                </div>
                            </div>
                            
                            <div className="flex items-start gap-4">
                                <CheckCircle2 className="h-6 w-6 text-green-500 mt-0.5 flex-shrink-0" />
                                <div>
                                    <h4 className="font-semibold text-[#343434]">Review policy changes</h4>
                                    <p className="text-gray-600">Use pull requests to review access policy changes before deployment.</p>
                                </div>
                            </div>
                            
                            <div className="flex items-start gap-4">
                                <CheckCircle2 className="h-6 w-6 text-green-500 mt-0.5 flex-shrink-0" />
                                <div>
                                    <h4 className="font-semibold text-[#343434]">Test with --dry-run</h4>
                                    <p className="text-gray-600">Always preview changes with <code className="bg-gray-200 px-2 py-1 rounded text-xs">stnel deploy --dry-run</code> first.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Get Started CTA */}
                <section className="py-20 bg-[#FFCD45]">
                    <div className="mx-auto max-w-4xl px-6 lg:px-8 text-center">
                        <h2 className="mb-6 text-3xl font-bold text-[#343434]">Ready to Deploy Policies as Code?</h2>
                        <p className="mb-8 text-xl text-[#343434]/80">
                            Get your API token from the dashboard and start managing access policies with your codebase.
                        </p>
                        
                        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                            <Link
                                href="/dashboard"
                                className="inline-flex items-center rounded-2xl bg-[#343434] px-6 py-3 text-base font-semibold text-white transition-all duration-200 hover:bg-[#343434]/90"
                            >
                                Get API Token
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                            
                            <a
                                href="https://github.com/stnel/cli"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center font-medium text-[#343434]/70 hover:text-[#343434]"
                            >
                                <Download className="mr-2 h-5 w-5" />
                                View on GitHub
                                <ExternalLink className="ml-1 h-4 w-4" />
                            </a>
                        </div>
                    </div>
                </section>

                <Footer />
            </div>
        </>
    );
}
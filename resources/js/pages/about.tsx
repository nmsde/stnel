import Footer from '@/components/footer';
import Navigation from '@/components/navigation';
import { dashboard, login } from '@/routes';
import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { ArrowRight, CheckCircle, Clock, Code, Shield, UserCheck, Users, Zap } from 'lucide-react';

export default function About() {
    const { auth } = usePage<SharedData>().props;

    return (
        <>
            <Head title="About Stnel | Professional Cloudflare Access Management Platform">
                <meta
                    name="description"
                    content="Learn how Stnel transforms complex Cloudflare Access APIs into an intuitive visual dashboard. Built by security professionals for streamlined zero trust access management, policy configuration, and user authentication monitoring."
                />
                <meta
                    name="keywords"
                    content="Stnel About, Cloudflare Access Management Platform, Zero Trust Interface, Security Dashboard, Access Policy Management, Identity Access Management, ZTNA Platform, Enterprise Security Tools, Cloudflare Access GUI, Authentication Management"
                />
                <meta property="og:title" content="About Stnel - Professional Cloudflare Access Management" />
                <meta
                    property="og:description"
                    content="Discover how Stnel simplifies Cloudflare Access management with professional-grade dashboard tools for zero trust security and access control."
                />
                <meta property="og:type" content="website" />
                <meta property="og:image" content="/app-show.png" />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content="About Stnel - Cloudflare Access Dashboard Platform" />
                <meta
                    name="twitter:description"
                    content="Professional platform that transforms complex Cloudflare Access APIs into intuitive visual management tools for enterprise security teams."
                />
                <meta name="twitter:image" content="/app-show.png" />
                <meta name="robots" content="index, follow" />
                <link rel="canonical" href="https://stnel.com/about" />
            </Head>

            <div className="bg-white">
                <Navigation currentPage="about" />

                {/* Hero Section */}
                <section className="relative overflow-hidden pt-20 pb-20">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#343434]/5 via-white to-[#FFCD45]/10" />

                    {/* Background Pattern */}
                    <div className="absolute inset-0 overflow-hidden">
                        <div className="absolute top-20 right-20 h-72 w-72 rounded-full bg-[#FFCD45]/10 blur-3xl"></div>
                        <div className="absolute bottom-20 left-20 h-72 w-72 rounded-full bg-[#343434]/5 blur-3xl"></div>
                        <div className="absolute top-1/2 right-1/3 h-40 w-40 rounded-full bg-[#F38020]/10 blur-2xl"></div>
                    </div>

                    <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
                        <div className="grid min-h-[600px] items-center gap-16 lg:grid-cols-2">
                            <div>
                                <div className="mb-8 inline-flex items-center rounded-full bg-[#343434]/10 px-4 py-2">
                                    <Code className="mr-2 h-4 w-4 text-[#343434]" />
                                    <span className="text-sm font-semibold text-[#343434]">BUILT BY DEVELOPERS, FOR EVERYONE</span>
                                </div>

                                <h1 className="mb-6 text-5xl font-bold tracking-tight text-[#343434] sm:text-6xl">
                                    <span className="block">The Missing</span>
                                    <span className="block text-[#F38020]">Interface</span>
                                    <span className="block">for Cloudflare Access</span>
                                </h1>

                                <p className="mb-6 text-xl leading-8 text-gray-600">
                                    Cloudflare Access is incredibly powerful. Managing it shouldn't be incredibly painful.
                                </p>

                                <p className="mb-8 text-lg text-gray-600">
                                    We got tired of writing JSON policies, memorizing API endpoints, and explaining to teammates why they couldn't
                                    manage access to their own applications.
                                </p>

                                <div className="flex flex-col gap-4 sm:flex-row">
                                    <Link
                                        href={auth.user ? dashboard() : login()}
                                        className="inline-flex items-center rounded-2xl bg-[#FFCD45] px-6 py-3 text-base font-semibold text-[#343434] transition-all duration-200 hover:bg-[#FFD700]"
                                    >
                                        {auth.user ? 'Go to Dashboard' : 'Try the Interface'}
                                        <ArrowRight className="ml-2 h-4 w-4" />
                                    </Link>
                                    <Link
                                        href="/use-cases"
                                        className="inline-flex items-center rounded-2xl border-2 border-gray-200 bg-white px-6 py-3 text-base font-semibold text-[#343434] transition-all duration-200 hover:border-[#FFCD45]"
                                    >
                                        See Real Examples
                                    </Link>
                                </div>
                            </div>

                            <div className="relative">
                                {/* Before/After Comparison */}
                                <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-2xl">
                                    <div className="grid grid-cols-2 gap-6">
                                        <div>
                                            <h3 className="mb-4 flex items-center text-sm font-semibold text-red-600">
                                                <div className="mr-2 h-2 w-2 rounded-full bg-red-500"></div>
                                                WITHOUT STNEL
                                            </h3>
                                            <div className="space-y-3">
                                                <div className="rounded-lg border border-red-200 bg-red-50 p-3">
                                                    <div className="font-mono text-xs leading-tight text-red-700">
                                                        <div>curl -X POST \</div>
                                                        <div>"https://api.cloudflare.com/..." \</div>
                                                        <div>-H "Content-Type: application/json" \</div>
                                                        <div>-d '{`{"rules": [{"include": [...]}]}`}'</div>
                                                    </div>
                                                </div>
                                                <div className="space-y-1 text-xs text-gray-600">
                                                    <div className="flex items-center">
                                                        <Clock className="mr-2 h-3 w-3 text-red-500" />
                                                        <span>2-4 hours per policy</span>
                                                    </div>
                                                    <div className="flex items-center">
                                                        <Users className="mr-2 h-3 w-3 text-red-500" />
                                                        <span>Technical expertise required</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div>
                                            <h3 className="mb-4 flex items-center text-sm font-semibold text-green-600">
                                                <div className="mr-2 h-2 w-2 rounded-full bg-green-500"></div>
                                                WITH STNEL
                                            </h3>
                                            <div className="space-y-3">
                                                <div className="rounded-lg border border-green-200 bg-green-50 p-3">
                                                    <div className="space-y-2">
                                                        <div className="flex items-center justify-between">
                                                            <span className="text-xs font-medium text-gray-700">Add User</span>
                                                            <CheckCircle className="h-4 w-4 text-green-500" />
                                                        </div>
                                                        <div className="h-1 w-full rounded-full bg-gray-200">
                                                            <div className="h-1 w-full rounded-full bg-green-500"></div>
                                                        </div>
                                                        <div className="text-xs text-green-700">john@company.com added</div>
                                                    </div>
                                                </div>
                                                <div className="space-y-1 text-xs text-gray-600">
                                                    <div className="flex items-center">
                                                        <Zap className="mr-2 h-3 w-3 text-green-500" />
                                                        <span>30 seconds per policy</span>
                                                    </div>
                                                    <div className="flex items-center">
                                                        <UserCheck className="mr-2 h-3 w-3 text-green-500" />
                                                        <span>Anyone can manage access</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-6 border-t border-gray-200 pt-6">
                                        <div className="flex items-center justify-between text-center">
                                            <div>
                                                <div className="text-2xl font-bold text-red-600">240x</div>
                                                <div className="text-xs text-gray-600">Time difference</div>
                                            </div>
                                            <ArrowRight className="h-6 w-6 text-[#FFCD45]" />
                                            <div>
                                                <div className="text-2xl font-bold text-green-600">Faster</div>
                                                <div className="text-xs text-gray-600">With Stnel</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Floating Stats */}
                                <div className="absolute -top-4 -right-4 rounded-2xl bg-[#FFCD45] p-4 shadow-lg">
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-[#343434]">0</div>
                                        <div className="text-xs text-[#343434]">JSON Required</div>
                                    </div>
                                </div>

                                <div className="absolute -bottom-4 -left-4 rounded-2xl bg-[#F38020] p-4 shadow-lg">
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-white">100%</div>
                                        <div className="text-xs text-white">Visual</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* The Reality */}
                <section className="bg-gray-50 py-20">
                    <div className="mx-auto max-w-7xl px-6 lg:px-8">
                        <div className="mx-auto max-w-5xl">
                            <div className="mb-16 text-center">
                                <h2 className="mb-4 text-3xl font-bold text-[#343434]">The Reality of Cloudflare Access Management</h2>
                                <p className="text-lg text-gray-600">Every developer knows this pain</p>
                            </div>

                            <div className="mb-16 rounded-3xl bg-[#343434] p-8">
                                <div className="grid items-center gap-12 lg:grid-cols-2">
                                    <div>
                                        <h3 className="mb-6 text-xl font-semibold text-white">What it takes to add one user:</h3>
                                        <div className="space-y-4 text-gray-300">
                                            <div className="flex items-start">
                                                <div className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-[#FFCD45] text-sm font-bold text-[#343434]">
                                                    1
                                                </div>
                                                <div className="ml-3">
                                                    <p>Find the Cloudflare API documentation</p>
                                                </div>
                                            </div>
                                            <div className="flex items-start">
                                                <div className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-[#FFCD45] text-sm font-bold text-[#343434]">
                                                    2
                                                </div>
                                                <div className="ml-3">
                                                    <p>Generate API tokens with correct permissions</p>
                                                </div>
                                            </div>
                                            <div className="flex items-start">
                                                <div className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-[#FFCD45] text-sm font-bold text-[#343434]">
                                                    3
                                                </div>
                                                <div className="ml-3">
                                                    <p>Write JSON policy with exact syntax</p>
                                                </div>
                                            </div>
                                            <div className="flex items-start">
                                                <div className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-[#FFCD45] text-sm font-bold text-[#343434]">
                                                    4
                                                </div>
                                                <div className="ml-3">
                                                    <p>Test policy via command line or Postman</p>
                                                </div>
                                            </div>
                                            <div className="flex items-start">
                                                <div className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-[#FFCD45] text-sm font-bold text-[#343434]">
                                                    5
                                                </div>
                                                <div className="ml-3">
                                                    <p>Deploy and hope it works</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="mt-6 rounded-lg border border-red-800/30 bg-red-900/20 p-4">
                                            <p className="text-sm text-red-300">
                                                <strong>Time invested:</strong> 2-4 hours for experienced developers
                                            </p>
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="mb-6 text-xl font-semibold text-white">What it takes with Stnel:</h3>
                                        <div className="space-y-4 text-gray-300">
                                            <div className="flex items-start">
                                                <div className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-[#FFCD45] text-sm font-bold text-[#343434]">
                                                    1
                                                </div>
                                                <div className="ml-3">
                                                    <p>Enter user's email address</p>
                                                </div>
                                            </div>
                                            <div className="flex items-start">
                                                <div className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-[#FFCD45] text-sm font-bold text-[#343434]">
                                                    2
                                                </div>
                                                <div className="ml-3">
                                                    <p>Select applications from dropdown</p>
                                                </div>
                                            </div>
                                            <div className="flex items-start">
                                                <div className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-[#FFCD45] text-sm font-bold text-[#343434]">
                                                    3
                                                </div>
                                                <div className="ml-3">
                                                    <p>Click "Add User"</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="mt-6 rounded-lg border border-green-800/30 bg-green-900/20 p-4">
                                            <p className="text-sm text-green-300">
                                                <strong>Time invested:</strong> 30 seconds for anyone on your team
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="text-center">
                                <p className="text-lg font-medium text-[#343434]">This isn't about being lazy. It's about being productive.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Who Built This */}
                <section className="bg-white py-20">
                    <div className="mx-auto max-w-7xl px-6 lg:px-8">
                        <div className="mx-auto max-w-4xl">
                            <div className="mb-16 text-center">
                                <h2 className="mb-4 text-3xl font-bold text-[#343434]">Built by People Who Feel Your Pain</h2>
                                <p className="text-lg text-gray-600">We've been in your shoes</p>
                            </div>

                            <div className="rounded-3xl bg-white p-8 shadow-lg">
                                <div className="prose prose-lg max-w-none text-gray-600">
                                    <p className="mb-6 text-xl leading-relaxed">Stnel was born from frustration. Real frustration.</p>

                                    <p className="mb-6">
                                        We spent years working at companies where security was critical, but the tools to manage it were built for
                                        security engineers, not the teams who actually needed to use them every day.
                                    </p>

                                    <p className="mb-6">
                                        Product managers couldn't grant access to staging environments. Designers couldn't test protected features.
                                        Support teams couldn't help customers with login issues. Everything required a developer, a ticket, and way
                                        too much time.
                                    </p>

                                    <p className="mb-6">
                                        Cloudflare Access solved the security problem beautifully. But it created a new problem:
                                        <strong> complexity</strong>. We decided to solve that too.
                                    </p>

                                    <div className="rounded-2xl border border-[#FFCD45]/20 bg-[#FFCD45]/10 p-6">
                                        <p className="mb-2 font-medium text-[#343434]">Our mission is simple:</p>
                                        <p className="mb-0">
                                            Make enterprise-grade security accessible to teams of all sizes, without compromising on power or
                                            flexibility.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* What Makes Us Different */}
                <section className="bg-gray-50 py-20">
                    <div className="mx-auto max-w-7xl px-6 lg:px-8">
                        <div className="mb-16 text-center">
                            <h2 className="mb-4 text-3xl font-bold text-[#343434]">What Makes Stnel Different</h2>
                            <p className="text-lg text-gray-600">We're not just another security tool</p>
                        </div>

                        <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-3">
                            <div className="text-center">
                                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100">
                                    <Users className="h-8 w-8 text-[#F38020]" />
                                </div>
                                <h3 className="mb-4 text-xl font-semibold text-[#343434]">Built for Humans</h3>
                                <p className="leading-relaxed text-gray-600">
                                    Every feature is designed for the person using it, not the person building it. If your product manager can't use
                                    it, we haven't finished it.
                                </p>
                            </div>

                            <div className="text-center">
                                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100">
                                    <Zap className="h-8 w-8 text-[#F38020]" />
                                </div>
                                <h3 className="mb-4 text-xl font-semibold text-[#343434]">Obsessively Fast</h3>
                                <p className="leading-relaxed text-gray-600">
                                    We measure success in seconds saved, not features shipped. Every click matters, every page load counts.
                                </p>
                            </div>

                            <div className="text-center">
                                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100">
                                    <Shield className="h-8 w-8 text-[#F38020]" />
                                </div>
                                <h3 className="mb-4 text-xl font-semibold text-[#343434]">Never Compromises</h3>
                                <p className="leading-relaxed text-gray-600">
                                    Simple doesn't mean limited. You get all the power of Cloudflare Access, just without the complexity.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* The Technical Reality */}
                <section className="bg-white py-20">
                    <div className="mx-auto max-w-7xl px-6 lg:px-8">
                        <div className="mx-auto max-w-4xl">
                            <div className="mb-16 text-center">
                                <h2 className="mb-4 text-3xl font-bold text-[#343434]">The Technical Reality</h2>
                                <p className="text-lg text-gray-600">What we are and what we aren't</p>
                            </div>

                            <div className="grid gap-8 lg:grid-cols-2">
                                <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                                    <h3 className="mb-4 flex items-center font-semibold text-[#343434]">
                                        <CheckCircle className="mr-2 h-5 w-5 text-green-500" />
                                        What Stnel Is
                                    </h3>
                                    <ul className="space-y-3 text-gray-600">
                                        <li>• A visual interface for Cloudflare Access</li>
                                        <li>• An API wrapper that makes complex operations simple</li>
                                        <li>• A notification system for access events</li>
                                        <li>• A team collaboration tool for security management</li>
                                        <li>• A way to delegate access control without technical knowledge</li>
                                    </ul>
                                </div>

                                <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                                    <h3 className="mb-4 font-semibold text-[#343434]">What Stnel Isn't</h3>
                                    <ul className="space-y-3 text-gray-600">
                                        <li>• A replacement for Cloudflare Access</li>
                                        <li>• A security product (we rely on Cloudflare for that)</li>
                                        <li>• A Cloudflare product (we're completely independent)</li>
                                        <li>• A way to avoid paying Cloudflare (you still need their account)</li>
                                        <li>• Magic (everything we do, you could do manually)</li>
                                    </ul>
                                </div>
                            </div>

                            <div className="mt-12 rounded-2xl border border-blue-200 bg-blue-50 p-8">
                                <div className="text-center">
                                    <h3 className="mb-4 font-semibold text-blue-900">Complete Transparency</h3>
                                    <p className="mb-6 text-blue-800">
                                        Stnel is an independent tool built to make Cloudflare Access easier to use. We are not affiliated with,
                                        endorsed by, or partnered with Cloudflare. We're just developers who got tired of writing JSON policies.
                                    </p>
                                    <p className="text-sm text-blue-700">
                                        You need an active Cloudflare account and Cloudflare Access subscription to use Stnel.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Try It Yourself */}
                <section className="bg-gray-50 py-20">
                    <div className="mx-auto max-w-7xl px-6 lg:px-8">
                        <div className="mx-auto max-w-3xl text-center">
                            <h2 className="mb-8 text-3xl font-bold text-[#343434]">See the Difference Yourself</h2>
                            <p className="mb-12 text-lg text-gray-600">
                                Don't take our word for it. Connect your Cloudflare account and see how much time you can save.
                            </p>

                            <div className="mb-8 flex flex-col justify-center gap-4 sm:flex-row">
                                <Link
                                    href={auth.user ? dashboard() : login()}
                                    className="inline-flex items-center rounded-2xl bg-[#FFCD45] px-8 py-4 text-lg font-semibold text-[#343434] shadow-lg transition-all duration-200 hover:bg-[#FFD700] hover:shadow-xl"
                                >
                                    {auth.user ? 'Go to Dashboard' : 'Start Free Trial'}
                                    <ArrowRight className="ml-2 h-5 w-5" />
                                </Link>
                                <Link
                                    href="/why-cloudflare"
                                    className="inline-flex items-center rounded-2xl border-2 border-gray-200 bg-white px-8 py-4 text-lg font-semibold text-[#343434] transition-all duration-200 hover:border-[#FFCD45]"
                                >
                                    Learn About Cloudflare
                                </Link>
                            </div>

                            <p className="text-sm text-gray-500">
                                Free forever for up to 50 users • No credit card required • Connect in under 2 minutes
                            </p>
                        </div>
                    </div>
                </section>

                <Footer />
            </div>
        </>
    );
}

import Footer from '@/components/footer';
import Navigation from '@/components/navigation';
import { dashboard, login } from '@/routes';
import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { ArrowRight, Building, CheckCircle, Code, Database, Eye, Globe, Settings, Shield, Users } from 'lucide-react';

export default function UseCases() {
    const { auth } = usePage<SharedData>().props;

    return (
        <>
            <Head title="Use Cases - How Teams Use Stnel to Protect Their Applications">
                <meta
                    name="description"
                    content="See how businesses protect internal CRMs, WordPress admin panels, and development environments with Cloudflare Access through Stnel's simple interface."
                />
                <meta name="keywords" content="Cloudflare Access Use Cases, CRM Protection, WordPress Security, Development Environment Access" />
            </Head>

            <div className="bg-white">
                <Navigation currentPage="use-cases" />

                {/* Hero Section */}
                <section className="relative overflow-hidden pt-20 pb-20">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#FFCD45]/10 via-white to-[#F38020]/5" />

                    {/* Floating Elements */}
                    <div className="absolute inset-0 overflow-hidden">
                        <div className="absolute -top-20 -right-20 h-96 w-96 rounded-full bg-[#FFCD45]/20 blur-3xl"></div>
                        <div className="absolute -bottom-20 -left-20 h-96 w-96 rounded-full bg-[#F38020]/20 blur-3xl"></div>
                        <div className="absolute top-1/2 left-1/4 h-32 w-32 rounded-full bg-[#343434]/5 blur-2xl"></div>
                    </div>

                    <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
                        <div className="grid min-h-[500px] items-center gap-12 lg:grid-cols-2">
                            <div>
                                <div className="mb-8 inline-flex items-center rounded-full bg-[#F38020]/10 px-4 py-2">
                                    <Shield className="mr-2 h-4 w-4 text-[#F38020]" />
                                    <span className="text-sm font-semibold text-[#F38020]">REAL PROTECTION SCENARIOS</span>
                                </div>

                                <h1 className="mb-6 text-5xl font-bold tracking-tight text-[#343434] sm:text-6xl">
                                    <span className="block">Stop Wondering</span>
                                    <span className="block text-[#F38020]">"Will This Work</span>
                                    <span className="block">For My Business?"</span>
                                </h1>

                                <p className="mb-8 text-xl leading-8 text-gray-600">
                                    See exactly how businesses like yours protect their most critical applications. No guessing, no uncertainty - just
                                    proven results.
                                </p>

                                <div className="flex items-center gap-8">
                                    <div className="text-center">
                                        <div className="text-3xl font-bold text-[#343434]">15min</div>
                                        <div className="text-sm text-gray-600">Average setup</div>
                                    </div>
                                    <div className="h-12 w-1 bg-gray-200"></div>
                                    <div className="text-center">
                                        <div className="text-3xl font-bold text-[#343434]">$0</div>
                                        <div className="text-sm text-gray-600">For most teams</div>
                                    </div>
                                    <div className="h-12 w-1 bg-gray-200"></div>
                                    <div className="text-center">
                                        <div className="text-3xl font-bold text-[#343434]">100%</div>
                                        <div className="text-sm text-gray-600">Attack prevention</div>
                                    </div>
                                </div>
                            </div>

                            <div className="relative">
                                <div className="grid grid-cols-2 gap-4">
                                    {/* Application Cards */}
                                    <div className="transform rounded-2xl border border-gray-100 bg-white p-4 shadow-lg transition-transform duration-300 hover:scale-105">
                                        <div className="mb-3 flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100">
                                            <Database className="h-4 w-4 text-blue-600" />
                                        </div>
                                        <h3 className="mb-1 text-sm font-semibold text-[#343434]">CRM Dashboard</h3>
                                        <p className="text-xs text-gray-600">client-data.com</p>
                                        <div className="mt-2 flex items-center">
                                            <div className="mr-2 h-2 w-2 rounded-full bg-green-500"></div>
                                            <span className="text-xs text-green-600">Protected</span>
                                        </div>
                                    </div>

                                    <div className="mt-8 transform rounded-2xl border border-gray-100 bg-white p-4 shadow-lg transition-transform duration-300 hover:scale-105">
                                        <div className="mb-3 flex h-8 w-8 items-center justify-center rounded-lg bg-orange-100">
                                            <Globe className="h-4 w-4 text-orange-600" />
                                        </div>
                                        <h3 className="mb-1 text-sm font-semibold text-[#343434]">WordPress</h3>
                                        <p className="text-xs text-gray-600">blog.com/wp-admin</p>
                                        <div className="mt-2 flex items-center">
                                            <div className="mr-2 h-2 w-2 rounded-full bg-green-500"></div>
                                            <span className="text-xs text-green-600">Protected</span>
                                        </div>
                                    </div>

                                    <div className="transform rounded-2xl border border-gray-100 bg-white p-4 shadow-lg transition-transform duration-300 hover:scale-105">
                                        <div className="mb-3 flex h-8 w-8 items-center justify-center rounded-lg bg-purple-100">
                                            <Code className="h-4 w-4 text-purple-600" />
                                        </div>
                                        <h3 className="mb-1 text-sm font-semibold text-[#343434]">Staging</h3>
                                        <p className="text-xs text-gray-600">staging.app.com</p>
                                        <div className="mt-2 flex items-center">
                                            <div className="mr-2 h-2 w-2 rounded-full bg-green-500"></div>
                                            <span className="text-xs text-green-600">Protected</span>
                                        </div>
                                    </div>

                                    <div className="mt-8 transform rounded-2xl border border-gray-100 bg-white p-4 shadow-lg transition-transform duration-300 hover:scale-105">
                                        <div className="mb-3 flex h-8 w-8 items-center justify-center rounded-lg bg-green-100">
                                            <Settings className="h-4 w-4 text-green-600" />
                                        </div>
                                        <h3 className="mb-1 text-sm font-semibold text-[#343434]">Admin Panel</h3>
                                        <p className="text-xs text-gray-600">admin.service.com</p>
                                        <div className="mt-2 flex items-center">
                                            <div className="mr-2 h-2 w-2 rounded-full bg-green-500"></div>
                                            <span className="text-xs text-green-600">Protected</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Connection Lines */}
                                <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#FFCD45] shadow-lg">
                                        <Shield className="h-8 w-8 text-[#343434]" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Use Case 1: Internal Business Applications */}
                <section className="bg-white py-20">
                    <div className="mx-auto max-w-7xl px-6 lg:px-8">
                        <div className="mx-auto max-w-5xl">
                            <div className="mb-12 text-center">
                                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100">
                                    <Building className="h-8 w-8 text-[#F38020]" />
                                </div>
                                <h2 className="mb-4 text-3xl font-bold text-[#343434]">Internal Business Applications</h2>
                                <p className="text-lg text-gray-600">Protect your CRM, accounting software, and internal dashboards</p>
                            </div>

                            <div className="grid items-center gap-12 lg:grid-cols-2">
                                <div>
                                    <h3 className="mb-6 text-xl font-semibold text-[#343434]">The Challenge</h3>
                                    <div className="mb-8 space-y-4 text-gray-600">
                                        <p>
                                            Small businesses rely on cloud applications like HubSpot, QuickBooks, and custom dashboards that contain
                                            sensitive client and financial data.
                                        </p>
                                        <p>
                                            These applications are often protected by simple passwords, making them vulnerable to unauthorized access.
                                        </p>
                                    </div>

                                    <div className="space-y-3">
                                        <div className="flex items-start">
                                            <div className="mt-2 mr-3 h-2 w-2 flex-shrink-0 rounded-full bg-red-500"></div>
                                            <p className="text-gray-600">Anyone with the URL can attempt access</p>
                                        </div>
                                        <div className="flex items-start">
                                            <div className="mt-2 mr-3 h-2 w-2 flex-shrink-0 rounded-full bg-red-500"></div>
                                            <p className="text-gray-600">No visibility into who accessed what</p>
                                        </div>
                                        <div className="flex items-start">
                                            <div className="mt-2 mr-3 h-2 w-2 flex-shrink-0 rounded-full bg-red-500"></div>
                                            <p className="text-gray-600">Difficult to manage team access</p>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="mb-6 text-xl font-semibold text-[#343434]">The Solution</h3>
                                    <div className="rounded-2xl bg-gray-50 p-6">
                                        <div className="space-y-4">
                                            <div className="flex items-start">
                                                <CheckCircle className="mt-0.5 mr-3 h-5 w-5 flex-shrink-0 text-green-500" />
                                                <div>
                                                    <h4 className="font-medium text-[#343434]">Team-Based Access Control</h4>
                                                    <p className="text-sm text-gray-600">
                                                        Sales team accesses CRM, accounting team accesses QuickBooks, managers see everything.
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex items-start">
                                                <CheckCircle className="mt-0.5 mr-3 h-5 w-5 flex-shrink-0 text-green-500" />
                                                <div>
                                                    <h4 className="font-medium text-[#343434]">Instant Notifications</h4>
                                                    <p className="text-sm text-gray-600">
                                                        Get email or Slack alerts when someone accesses sensitive applications.
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex items-start">
                                                <CheckCircle className="mt-0.5 mr-3 h-5 w-5 flex-shrink-0 text-green-500" />
                                                <div>
                                                    <h4 className="font-medium text-[#343434]">Simple User Management</h4>
                                                    <p className="text-sm text-gray-600">Add new employees or remove access in seconds, not hours.</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-6 rounded-lg border border-[#FFCD45]/20 bg-[#FFCD45]/10 p-4">
                                        <p className="text-sm text-[#343434]">
                                            <strong>Perfect for:</strong> Small businesses, agencies, and growing teams that need enterprise security
                                            without complexity.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Use Case 2: WordPress Admin Protection */}
                <section className="bg-gray-50 py-20">
                    <div className="mx-auto max-w-7xl px-6 lg:px-8">
                        <div className="mx-auto max-w-5xl">
                            <div className="mb-12 text-center">
                                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100">
                                    <Globe className="h-8 w-8 text-[#F38020]" />
                                </div>
                                <h2 className="mb-4 text-3xl font-bold text-[#343434]">WordPress Admin Protection</h2>
                                <p className="text-lg text-gray-600">Stop brute force attacks on /wp-admin before they reach your server</p>
                            </div>

                            <div className="grid items-center gap-12 lg:grid-cols-2">
                                <div className="order-2 lg:order-1">
                                    <h3 className="mb-6 text-xl font-semibold text-[#343434]">The Problem</h3>
                                    <div className="mb-8 space-y-4 text-gray-600">
                                        <p>
                                            WordPress powers 43% of all websites, making /wp-admin the most targeted URL on the internet for brute
                                            force attacks.
                                        </p>
                                        <p>
                                            Traditional solutions like security plugins can slow down your site, while IP restrictions break remote
                                            work flexibility.
                                        </p>
                                    </div>

                                    <div className="rounded-2xl bg-[#343434] p-6">
                                        <h4 className="mb-3 font-medium text-white">Daily Attack Reality</h4>
                                        <div className="space-y-1 font-mono text-xs text-gray-300">
                                            <div>Failed login attempts: 3,847</div>
                                            <div>Unique IP addresses: 1,203</div>
                                            <div>Server resources wasted: High</div>
                                            <div>Security risk: Ongoing</div>
                                        </div>
                                    </div>
                                </div>

                                <div className="order-1 lg:order-2">
                                    <h3 className="mb-6 text-xl font-semibold text-[#343434]">The Protection</h3>
                                    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                                        <div className="mb-6 text-center">
                                            <div className="rounded-lg bg-green-50 p-4">
                                                <div className="font-mono text-sm text-green-700">yoursite.com/wp-admin</div>
                                                <div className="mt-1 text-xs text-green-600">Protected by Cloudflare Access</div>
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            <div className="flex items-center">
                                                <Shield className="mr-3 h-4 w-4 text-green-500" />
                                                <span className="text-sm text-gray-600">Zero attacks reach your server</span>
                                            </div>
                                            <div className="flex items-center">
                                                <Users className="mr-3 h-4 w-4 text-green-500" />
                                                <span className="text-sm text-gray-600">Team access without shared passwords</span>
                                            </div>
                                            <div className="flex items-center">
                                                <Globe className="mr-3 h-4 w-4 text-green-500" />
                                                <span className="text-sm text-gray-600">Works from anywhere</span>
                                            </div>
                                            <div className="flex items-center">
                                                <Eye className="mr-3 h-4 w-4 text-green-500" />
                                                <span className="text-sm text-gray-600">See who accessed admin panel</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-6 rounded-lg border border-[#FFCD45]/20 bg-[#FFCD45]/10 p-4">
                                        <p className="text-sm text-[#343434]">
                                            <strong>Setup time:</strong> 3 minutes. <strong>Cost:</strong> Free for most WordPress sites.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Use Case 3: Development Environments */}
                <section className="bg-white py-20">
                    <div className="mx-auto max-w-7xl px-6 lg:px-8">
                        <div className="mx-auto max-w-5xl">
                            <div className="mb-12 text-center">
                                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100">
                                    <Code className="h-8 w-8 text-[#F38020]" />
                                </div>
                                <h2 className="mb-4 text-3xl font-bold text-[#343434]">Development & Staging Environments</h2>
                                <p className="text-lg text-gray-600">Share work-in-progress with stakeholders without exposing it to the world</p>
                            </div>

                            <div className="grid items-center gap-12 lg:grid-cols-2">
                                <div>
                                    <h3 className="mb-6 text-xl font-semibold text-[#343434]">Common Challenges</h3>
                                    <div className="mb-8 space-y-4 text-gray-600">
                                        <p>
                                            Development teams need to share staging sites with designers, clients, and stakeholders while keeping them
                                            private from competitors and search engines.
                                        </p>
                                        <p>
                                            Traditional solutions like HTTP Basic Auth break applications, while IP restrictions don't work for remote
                                            teams.
                                        </p>
                                    </div>

                                    <div className="space-y-3">
                                        <div className="flex items-start">
                                            <div className="mt-2 mr-3 h-2 w-2 flex-shrink-0 rounded-full bg-red-500"></div>
                                            <p className="text-gray-600">Staging sites indexed by Google</p>
                                        </div>
                                        <div className="flex items-start">
                                            <div className="mt-2 mr-3 h-2 w-2 flex-shrink-0 rounded-full bg-red-500"></div>
                                            <p className="text-gray-600">Competitors discover unreleased features</p>
                                        </div>
                                        <div className="flex items-start">
                                            <div className="mt-2 mr-3 h-2 w-2 flex-shrink-0 rounded-full bg-red-500"></div>
                                            <p className="text-gray-600">Complex user management for temporary access</p>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="mb-6 text-xl font-semibold text-[#343434]">Team Access Management</h3>
                                    <div className="rounded-2xl bg-gray-50 p-6">
                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-3">
                                                <div>
                                                    <div className="text-sm font-medium text-[#343434]">dev.project.com</div>
                                                    <div className="text-xs text-gray-500">Developers only</div>
                                                </div>
                                                <div className="flex items-center">
                                                    <div className="mr-2 h-2 w-2 rounded-full bg-red-500"></div>
                                                    <span className="text-xs text-gray-600">Restricted</span>
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-3">
                                                <div>
                                                    <div className="text-sm font-medium text-[#343434]">staging.project.com</div>
                                                    <div className="text-xs text-gray-500">Team + clients</div>
                                                </div>
                                                <div className="flex items-center">
                                                    <div className="mr-2 h-2 w-2 rounded-full bg-yellow-500"></div>
                                                    <span className="text-xs text-gray-600">Limited</span>
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-3">
                                                <div>
                                                    <div className="text-sm font-medium text-[#343434]">demo.project.com</div>
                                                    <div className="text-xs text-gray-500">Presentations only</div>
                                                </div>
                                                <div className="flex items-center">
                                                    <div className="mr-2 h-2 w-2 rounded-full bg-green-500"></div>
                                                    <span className="text-xs text-gray-600">Temporary</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-6 rounded-lg border border-[#FFCD45]/20 bg-[#FFCD45]/10 p-4">
                                        <p className="text-sm text-[#343434]">
                                            <strong>Result:</strong> Perfect for remote teams that need flexible, secure access to development
                                            environments.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Additional Use Cases */}
                <section className="bg-gray-50 py-20">
                    <div className="mx-auto max-w-7xl px-6 lg:px-8">
                        <div className="mb-16 text-center">
                            <h2 className="mb-4 text-3xl font-bold text-[#343434]">More Applications You Can Protect</h2>
                            <p className="text-lg text-gray-600">If it's accessible via a URL, Stnel can protect it</p>
                        </div>

                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                                <Database className="mb-4 h-8 w-8 text-[#F38020]" />
                                <h3 className="mb-2 font-semibold text-[#343434]">Analytics Dashboards</h3>
                                <p className="text-sm text-gray-600">Grafana, Metabase, custom analytics</p>
                            </div>

                            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                                <Settings className="mb-4 h-8 w-8 text-[#F38020]" />
                                <h3 className="mb-2 font-semibold text-[#343434]">Admin Panels</h3>
                                <p className="text-sm text-gray-600">Laravel Nova, Django Admin, custom backends</p>
                            </div>

                            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                                <Users className="mb-4 h-8 w-8 text-[#F38020]" />
                                <h3 className="mb-2 font-semibold text-[#343434]">Client Portals</h3>
                                <p className="text-sm text-gray-600">Project updates, file sharing, invoicing</p>
                            </div>

                            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                                <Globe className="mb-4 h-8 w-8 text-[#F38020]" />
                                <h3 className="mb-2 font-semibold text-[#343434]">Documentation</h3>
                                <p className="text-sm text-gray-600">Internal wikis, API docs, knowledge bases</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="bg-white py-20">
                    <div className="mx-auto max-w-7xl px-6 lg:px-8">
                        <div className="mx-auto max-w-3xl text-center">
                            <h2 className="mb-8 text-3xl font-bold text-[#343434]">Ready to Protect Your Applications?</h2>
                            <p className="mb-12 text-lg text-gray-600">
                                Join businesses that trust Stnel to make Cloudflare Access simple and secure.
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
                                    href="/about"
                                    className="inline-flex items-center rounded-2xl border-2 border-gray-200 bg-white px-8 py-4 text-lg font-semibold text-[#343434] transition-all duration-200 hover:border-[#FFCD45]"
                                >
                                    Learn How It Works
                                </Link>
                            </div>

                            <p className="text-sm text-gray-500">Free forever for up to 50 users • No credit card required • Setup in minutes</p>
                        </div>
                    </div>
                </section>

                <Footer />
            </div>
        </>
    );
}

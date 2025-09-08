import CloudflareAccessManagementDemo from '@/components/cloudflare-access-management-demo';
import Footer from '@/components/footer';
import Navigation from '@/components/navigation';
import { dashboard, login } from '@/routes';
import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { ArrowRight, Code, GitBranch, Play, Shield, Terminal, Users, Zap } from 'lucide-react';
import { useEffect, useState } from 'react';

const useCases = [
    {
        icon: Code,
        title: 'Development Environments',
        subtitle: 'Manage access to your staging and dev sites',
        description: 'Easily configure Cloudflare Access policies for your development environments. Simple interface for complex access rules.',
        animation: 'dev',
        features: ['Visual policy builder', 'Team access management', 'One-click policy deployment'],
    },
    {
        icon: Users,
        title: 'Client & Freelancer Access',
        subtitle: 'Streamlined external collaborator management',
        description: 'Configure temporary access policies for clients and freelancers through an intuitive dashboard interface.',
        animation: 'client',
        features: ['Time-based access rules', 'Project-specific permissions', 'Access request workflows'],
    },
    {
        icon: Shield,
        title: 'Business Applications',
        subtitle: 'Centralized access policy management',
        description: 'Manage Cloudflare Access policies for admin panels and internal tools from one unified dashboard.',
        animation: 'business',
        features: ['Multi-application policies', 'Team-based rule sets', 'Access audit logs'],
    },
];

const AnimatedUseCase = ({ useCase, index, isVisible }: { useCase: (typeof useCases)[0]; index: number; isVisible: boolean }) => {
    const [animate, setAnimate] = useState(false);

    useEffect(() => {
        if (isVisible) {
            const timer = setTimeout(() => setAnimate(true), index * 200);
            return () => clearTimeout(timer);
        }
    }, [isVisible, index]);

    return (
        <div className={`transition-all duration-700 ${animate ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
            <div className="group relative">
                {/* Animated background */}
                <div className="absolute inset-0 transform rounded-3xl bg-gradient-to-br from-[#FFCD45]/5 to-transparent transition-transform duration-500 group-hover:scale-105" />

                <div className="relative p-12">
                    {/* Icon with animation */}
                    <div className="relative mb-8">
                        <div className="flex h-16 w-16 transform items-center justify-center rounded-2xl bg-[#FFCD45] transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
                            <useCase.icon className="h-8 w-8 text-[#343434]" />
                        </div>
                        {animate && <div className="absolute inset-0 h-16 w-16 animate-pulse rounded-2xl bg-[#FFCD45]/30" />}
                    </div>

                    <h3 className="mb-2 text-2xl font-semibold text-[#343434]">{useCase.title}</h3>
                    <p className="mb-4 text-lg font-medium text-[#FFCD45]">{useCase.subtitle}</p>
                    <p className="mb-6 leading-relaxed text-gray-600">{useCase.description}</p>

                    <div className="space-y-3">
                        {useCase.features.map((feature, idx) => (
                            <div
                                key={idx}
                                className={`flex items-center transition-all duration-500 ${animate ? 'translate-x-0 opacity-100' : 'translate-x-4 opacity-0'}`}
                                style={{ transitionDelay: `${index * 200 + idx * 100}ms` }}
                            >
                                <div className="mr-3 h-2 w-2 flex-shrink-0 rounded-full bg-[#FFCD45]" />
                                <span className="text-gray-700">{feature}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default function Welcome() {
    const { auth } = usePage<SharedData>().props;
    const [isLoaded, setIsLoaded] = useState(false);
    const [visibleSections, setVisibleSections] = useState<Record<string, boolean>>({});

    useEffect(() => {
        setIsLoaded(true);

        // Intersection Observer for scroll animations
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setVisibleSections((prev) => ({
                            ...prev,
                            [entry.target.id]: true,
                        }));
                    }
                });
            },
            { threshold: 0.2 },
        );

        // Observe sections
        const sections = document.querySelectorAll('[data-observe]');
        sections.forEach((section) => observer.observe(section));

        return () => observer.disconnect();
    }, []);

    return (
        <>
            <Head title="Stnel - Easy Cloudflare Access Management">
                <meta
                    name="description"
                    content="Streamline your Cloudflare Access policies with an intuitive dashboard. Manage users, configure rules, and monitor access across all your domains."
                />
                <meta
                    name="keywords"
                    content="Cloudflare Access Management, Access Policy Dashboard, Zero Trust Management, Cloudflare Interface, Access Control"
                />
                <meta property="og:title" content="Stnel - Easy Cloudflare Access Management" />
                <meta property="og:description" content="The intuitive dashboard for managing your Cloudflare Access policies and users." />
                <meta property="og:type" content="website" />
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=inter:400,500,600,700" rel="stylesheet" />
            </Head>

            <div className="overflow-hidden bg-white">
                <Navigation currentPage="home" />

                {/* Hero Section */}
                <section className="relative overflow-hidden pt-24 pb-32">
                    <div className="absolute inset-0">
                        <div className="absolute inset-0 bg-gradient-to-br from-[#FFCD45]/3 via-white to-[#FFCD45]/1" />
                        <div className="absolute top-1/4 left-1/4 h-96 w-96 animate-pulse rounded-full bg-[#FFCD45]/5 blur-3xl" />
                        <div
                            className="absolute right-1/4 bottom-1/4 h-96 w-96 animate-pulse rounded-full bg-[#FFCD45]/3 blur-3xl"
                            style={{ animationDelay: '2s' }}
                        />
                    </div>

                    <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
                        <div className="mx-auto max-w-4xl text-center">
                            <div className={`transition-all duration-1000 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
                                <div className="mb-8 inline-flex items-center rounded-full border border-[#FFCD45]/20 bg-[#FFCD45]/10 px-6 py-3 text-sm text-[#343434]">
                                    <Shield className="mr-2 h-4 w-4 text-[#FFCD45]" />
                                    Built for Cloudflare users
                                </div>

                                <h1 className="mb-8 text-5xl font-bold tracking-tight text-[#343434] sm:text-7xl lg:text-8xl">
                                    <span className="block">Manage</span>
                                    <span className="block text-[#FFCD45]">Cloudflare Access</span>
                                    <span className="block">Effortlessly</span>
                                </h1>

                                <p className="mx-auto mb-12 max-w-3xl text-xl leading-relaxed text-gray-600">
                                    The intuitive dashboard for managing your Cloudflare Access policies. Configure access rules, manage users, and
                                    monitor activity across all your Cloudflare-protected domains from one unified interface.
                                </p>

                                <div className="mb-12 flex flex-col items-center justify-center gap-6 sm:flex-row">
                                    <Link
                                        href={auth.user ? dashboard() : login()}
                                        className="group inline-flex transform items-center rounded-2xl bg-[#FFCD45] px-6 py-3 text-base font-semibold text-[#343434] shadow-lg transition-all duration-200 hover:scale-105 hover:bg-[#FFD700] hover:shadow-xl"
                                    >
                                        {auth.user ? 'Go to Dashboard' : 'Start Managing Access'}
                                        <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                                    </Link>

                                    <button className="group inline-flex items-center font-medium text-[#343434]/70 hover:text-[#343434]">
                                        <Play className="mr-2 h-5 w-5 text-[#FFCD45]" />
                                        See how it works
                                    </button>
                                </div>

                                <div className="text-sm text-gray-500">
                                    Free forever • 1 organization + 5 managed policies • No credit card required
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <CloudflareAccessManagementDemo visibleSections={visibleSections} />

                {/* Use Cases Section */}
                <section id="use-cases" className="bg-gradient-to-b from-white to-[#FFCD45]/3 py-32" data-observe>
                    <div className="mx-auto max-w-7xl px-6 lg:px-8">
                        <div className="mx-auto mb-20 max-w-3xl text-center">
                            <h2 className="mb-6 text-4xl font-bold text-[#343434]">Built for Real Management Needs</h2>
                            <p className="text-xl leading-relaxed text-gray-600">
                                Whether you're managing development access, configuring client permissions, or organizing business application
                                policies, Stnel simplifies your Cloudflare Access workflow.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                            {useCases.map((useCase, index) => (
                                <AnimatedUseCase
                                    key={useCase.title}
                                    useCase={useCase}
                                    index={index}
                                    isVisible={visibleSections['use-cases'] || false}
                                />
                            ))}
                        </div>
                    </div>
                </section>

                {/* CI/CD CLI Tool Section - Coming Soon */}
                <section className="relative overflow-hidden bg-gradient-to-b from-gray-50 to-white py-20">
                    <div className="mx-auto max-w-7xl px-6 lg:px-8">
                        {/* Coming Soon Badge */}
                        <div className="mb-8 flex justify-center">
                            <div className="inline-flex items-center rounded-full bg-[#F38020]/10 px-4 py-2">
                                <Zap className="mr-2 h-4 w-4 text-[#F38020]" />
                                <span className="text-sm font-semibold text-[#F38020]">COMING SOON</span>
                            </div>
                        </div>

                        <div className="mb-16 text-center">
                            <h2 className="mb-4 text-4xl font-bold text-[#343434]">Deploy with Confidence</h2>
                            <p className="mx-auto max-w-3xl text-xl text-gray-600">
                                Integrate Cloudflare Access policies directly into your CI/CD pipeline. Configure protection rules alongside your code
                                deployments.
                            </p>
                        </div>

                        <div className="mx-auto max-w-5xl">
                            <div className="relative rounded-3xl bg-gradient-to-br from-[#343434] to-[#1a1a1a] p-12 shadow-2xl">
                                {/* Terminal Window */}
                                <div className="overflow-hidden rounded-xl bg-black/90">
                                    {/* Terminal Header */}
                                    <div className="flex items-center gap-2 bg-gray-800 px-4 py-2">
                                        <div className="flex gap-2">
                                            <div className="h-3 w-3 rounded-full bg-red-500"></div>
                                            <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                                            <div className="h-3 w-3 rounded-full bg-green-500"></div>
                                        </div>
                                        <div className="flex-1 text-center">
                                            <span className="font-mono text-sm text-gray-400">stnel-cli</span>
                                        </div>
                                    </div>

                                    {/* Terminal Content */}
                                    <div className="p-6 font-mono text-sm">
                                        <div className="mb-2 text-gray-400">$ npm install -g @stnel/cli</div>
                                        <div className="mb-4 text-gray-400">$ stnel init</div>

                                        <div className="mb-2 text-green-400"># Deploy protection policies with your code</div>
                                        <div className="mb-2 text-white">$ stnel deploy --env staging</div>

                                        <div className="mt-4 space-y-1">
                                            <div className="text-gray-500">Applying Cloudflare Access policies...</div>
                                            <div className="text-yellow-400">→ Configuring staging.awesomeapp.com</div>
                                            <div className="text-yellow-400">→ Setting up authentication rules</div>
                                            <div className="text-yellow-400">→ Applying team access permissions</div>
                                            <div className="text-green-400">✓ Protection deployed successfully!</div>
                                        </div>
                                    </div>
                                </div>

                                {/* Feature Grid */}
                                <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
                                    <div className="rounded-xl bg-white/10 p-6 backdrop-blur">
                                        <Terminal className="mb-3 h-8 w-8 text-[#FFCD45]" />
                                        <h3 className="mb-2 font-semibold text-white">CLI Integration</h3>
                                        <p className="text-sm text-gray-300">Simple commands to manage access policies from your terminal</p>
                                    </div>

                                    <div className="rounded-xl bg-white/10 p-6 backdrop-blur">
                                        <GitBranch className="mb-3 h-8 w-8 text-[#FFCD45]" />
                                        <h3 className="mb-2 font-semibold text-white">Version Control</h3>
                                        <p className="text-sm text-gray-300">Store access policies as code in your repository</p>
                                    </div>

                                    <div className="rounded-xl bg-white/10 p-6 backdrop-blur">
                                        <Zap className="mb-3 h-8 w-8 text-[#FFCD45]" />
                                        <h3 className="mb-2 font-semibold text-white">Auto Deploy</h3>
                                        <p className="text-sm text-gray-300">Automatically apply policies on every deployment</p>
                                    </div>
                                </div>

                                {/* Early Access CTA */}
                                <div className="mt-8 text-center">
                                    <p className="mb-4 text-gray-300">Want early access to the CLI tool?</p>
                                    <a
                                        href="mailto:hello@stnel.com?subject=CLI%20Early%20Access"
                                        className="inline-flex items-center rounded-2xl bg-[#FFCD45] px-6 py-3 font-semibold text-[#343434] transition-all duration-200 hover:bg-[#FFD700]"
                                    >
                                        Join the Waitlist
                                        <ArrowRight className="ml-2 h-4 w-4" />
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Cloudflare Focus Section */}
                <section className="bg-gradient-to-b from-[#FFCD45]/3 to-white py-32">
                    <div className="mx-auto max-w-7xl px-6 lg:px-8">
                        <div className="mx-auto max-w-4xl text-center">
                            <h2 className="mb-6 text-4xl font-bold text-[#343434]">Made for Cloudflare Users</h2>
                            <p className="mb-12 text-xl leading-relaxed text-gray-600">
                                If you're already using Cloudflare for DNS, CDN, or other services, Stnel seamlessly integrates with your existing
                                setup to add powerful access control to any endpoint.
                            </p>

                            <div className="mb-12 grid grid-cols-1 gap-8 md:grid-cols-2">
                                <div className="rounded-3xl border border-[#FFCD45]/10 bg-white p-8 shadow-sm">
                                    <h3 className="mb-4 text-xl font-semibold text-[#343434]">Already using Cloudflare?</h3>
                                    <p className="mb-6 text-gray-600">Perfect! You can start protecting endpoints in minutes.</p>
                                    <Link
                                        href={auth.user ? dashboard() : login()}
                                        className="inline-flex items-center font-semibold text-[#FFCD45] transition-colors hover:text-[#FFCD45]/80"
                                    >
                                        Get started now <ArrowRight className="ml-2 h-4 w-4" />
                                    </Link>
                                </div>

                                <div className="rounded-3xl border border-[#FFCD45]/10 bg-white p-8 shadow-sm">
                                    <h3 className="mb-4 text-xl font-semibold text-[#343434]">New to Cloudflare?</h3>
                                    <p className="mb-6 text-gray-600">
                                        Learn why millions of websites trust Cloudflare for security and performance.
                                    </p>
                                    <Link
                                        href="/why-cloudflare"
                                        className="inline-flex items-center font-semibold text-[#FFCD45] transition-colors hover:text-[#FFCD45]/80"
                                    >
                                        Why Cloudflare? <ArrowRight className="ml-2 h-4 w-4" />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Pricing Section */}
                <section id="pricing" className="bg-white pt-8 pb-32" data-observe>
                    <div className="mx-auto max-w-7xl px-6 lg:px-8">
                        <div className="mx-auto mb-20 max-w-3xl text-center">
                            <h2 className="mb-6 text-4xl font-bold text-[#343434]">Simple, Honest Pricing</h2>
                            <p className="text-xl text-gray-600">Start free, upgrade when you need more</p>
                        </div>

                        <div className="mx-auto grid max-w-4xl grid-cols-1 gap-8 lg:grid-cols-2">
                            {/* Free Plan */}
                            <div className="relative overflow-hidden rounded-3xl border-2 border-[#FFCD45]/20 bg-white p-10 shadow-sm">
                                <div className="absolute inset-0 bg-gradient-to-br from-[#FFCD45]/5 to-transparent" />
                                <div className="relative">
                                    <h3 className="mb-2 text-2xl font-bold text-[#343434]">Free</h3>
                                    <p className="mb-6 text-gray-600">Perfect for getting started</p>
                                    <div className="mb-8">
                                        <span className="text-5xl font-bold text-[#343434]">$0</span>
                                        <span className="ml-2 text-gray-600">forever</span>
                                    </div>

                                    <div className="mb-8 space-y-4">
                                        <div className="flex items-center">
                                            <div className="mr-4 h-2 w-2 rounded-full bg-[#FFCD45]" />
                                            <span className="text-gray-700">1 Organization</span>
                                        </div>
                                        <div className="flex items-center">
                                            <div className="mr-4 h-2 w-2 rounded-full bg-[#FFCD45]" />
                                            <span className="text-gray-700">5 Protected Endpoints</span>
                                        </div>
                                        <div className="flex items-center">
                                            <div className="mr-4 h-2 w-2 rounded-full bg-[#FFCD45]" />
                                            <span className="text-gray-700">Basic Access Control</span>
                                        </div>
                                        <div className="flex items-center">
                                            <div className="mr-4 h-2 w-2 rounded-full bg-[#FFCD45]" />
                                            <span className="text-gray-700">Activity Monitoring</span>
                                        </div>
                                    </div>

                                    <Link
                                        href={auth.user ? dashboard() : login()}
                                        className="inline-flex w-full items-center justify-center rounded-xl border-2 border-[#FFCD45] px-6 py-3 text-sm font-semibold text-[#FFCD45] transition-all hover:bg-[#FFCD45] hover:text-[#343434]"
                                    >
                                        {auth.user ? 'Go to Dashboard' : 'Start Free'}
                                    </Link>
                                </div>
                            </div>

                            {/* Pro Plan */}
                            <div className="relative overflow-hidden rounded-3xl bg-[#343434] p-10 shadow-xl">
                                <div className="relative">
                                    <h3 className="mb-2 text-2xl font-bold text-white">Pro</h3>
                                    <p className="mb-6 text-gray-300">For growing teams</p>
                                    <div className="mb-8">
                                        <span className="text-5xl font-bold text-white">$15</span>
                                        <span className="ml-2 text-gray-300">/month</span>
                                    </div>

                                    <div className="mb-8 space-y-4">
                                        <div className="flex items-center">
                                            <div className="mr-4 h-2 w-2 rounded-full bg-[#FFCD45]" />
                                            <span className="text-gray-100">Unlimited Organizations</span>
                                        </div>
                                        <div className="flex items-center">
                                            <div className="mr-4 h-2 w-2 rounded-full bg-[#FFCD45]" />
                                            <span className="text-gray-100">Unlimited Protected Endpoints</span>
                                        </div>
                                        <div className="flex items-center">
                                            <div className="mr-4 h-2 w-2 rounded-full bg-[#FFCD45]" />
                                            <span className="text-gray-100">Advanced Access Management</span>
                                        </div>
                                        <div className="flex items-center">
                                            <div className="mr-4 h-2 w-2 rounded-full bg-[#FFCD45]" />
                                            <span className="text-gray-100">Email Notifications</span>
                                        </div>
                                    </div>

                                    <Link
                                        href={auth.user ? '/settings/billing' : `${login().url}?intent=subscribe`}
                                        className="inline-flex w-full items-center justify-center rounded-xl bg-[#FFCD45] px-6 py-3 text-sm font-semibold text-[#343434] transition-all hover:bg-[#FFCD45]/90"
                                    >
                                        {auth.user ? 'Upgrade to Pro' : 'Start Pro Trial'}
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="bg-gradient-to-br from-[#FFCD45] to-[#FFCD45]/80 py-32">
                    <div className="mx-auto max-w-7xl px-6 lg:px-8">
                        <div className="mx-auto max-w-3xl text-center">
                            <h2 className="mb-6 text-4xl font-bold text-[#343434]">Ready to Simplify Access Management?</h2>
                            <p className="mb-10 text-xl text-[#343434]/80">
                                Join developers and teams who use Stnel to streamline their Cloudflare Access workflows.
                            </p>
                            <div className="flex items-center justify-center">
                                <Link
                                    href={auth.user ? dashboard() : login()}
                                    className="group inline-flex transform items-center rounded-3xl bg-[#343434] px-12 py-6 text-lg font-semibold text-white transition-all duration-300 hover:scale-105 hover:bg-[#343434]/90 hover:shadow-2xl"
                                >
                                    {auth.user ? 'Go to Dashboard' : 'Start Free Now'}
                                    <ArrowRight className="ml-3 h-5 w-5 transition-transform group-hover:translate-x-1" />
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>

                <Footer />
            </div>
        </>
    );
}

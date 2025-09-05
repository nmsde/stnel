import { dashboard, login } from '@/routes';
import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { Shield, Zap, Globe, Users, ArrowRight, CheckCircle, Eye, TrendingUp, Clock, Server, Lock, Wifi } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

const benefits = [
    {
        icon: Globe,
        title: 'Global Network',
        description: 'Your content is delivered from 300+ cities worldwide, making your websites blazingly fast for users everywhere.',
        stats: '300+ Cities',
        color: 'from-blue-500 to-blue-600'
    },
    {
        icon: Shield,
        title: 'Built-in Security',
        description: 'DDoS protection, Web Application Firewall, and SSL certificates are included by default. No additional configuration needed.',
        stats: '76 Tbps Protection',
        color: 'from-green-500 to-green-600'
    },
    {
        icon: Zap,
        title: 'Performance Boost',
        description: 'Automatic optimization, caching, and compression make your websites up to 3x faster without any code changes.',
        stats: '3x Faster',
        color: 'from-yellow-500 to-yellow-600'
    },
    {
        icon: Server,
        title: 'Reliable Infrastructure',
        description: '99.99% uptime SLA backed by enterprise-grade infrastructure that never sleeps, so your business never stops.',
        stats: '99.99% Uptime',
        color: 'from-purple-500 to-purple-600'
    }
];

const features = [
    {
        icon: Lock,
        title: 'Zero Trust Access',
        description: 'Control who can access your applications with granular permissions and multi-factor authentication.'
    },
    {
        icon: Eye,
        title: 'Application Analytics',
        description: 'See exactly who is accessing your applications and when, with detailed audit logs and insights.'
    },
    {
        icon: Wifi,
        title: 'Seamless Integration',
        description: 'Works with any application or website. No code changes required - just point your DNS to Cloudflare.'
    },
    {
        icon: Clock,
        title: 'Instant Deployment',
        description: 'Get started in minutes, not hours. Our simple setup gets you protected and accelerated immediately.'
    }
];

function AnimatedCard({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
    const [isVisible, setIsVisible] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setTimeout(() => setIsVisible(true), delay);
                }
            },
            { threshold: 0.1 }
        );

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => observer.disconnect();
    }, [delay]);

    return (
        <div
            ref={ref}
            className={`transition-all duration-700 ${
                isVisible 
                    ? 'opacity-100 translate-y-0' 
                    : 'opacity-0 translate-y-8'
            }`}
        >
            {children}
        </div>
    );
}

export default function WhyCloudflare() {
    const { auth } = usePage<SharedData>().props;

    return (
        <>
            <Head title="Why Use Cloudflare? - Essential for Modern Web Security">
                <meta name="description" content="Discover why Cloudflare is essential for modern websites. From global performance to enterprise security, learn how Cloudflare transforms your web presence." />
                <meta name="keywords" content="Why Cloudflare, Web Performance, Website Security, CDN, DDoS Protection, SSL, Global Network" />
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=inter:400,500,600,700" rel="stylesheet" />
            </Head>

            <div className="bg-white">
                {/* Navigation */}
                <nav className="relative z-50 bg-white/95 backdrop-blur-md border-b border-gray-100">
                    <div className="mx-auto max-w-7xl px-6 lg:px-8">
                        <div className="flex h-16 items-center justify-between">
                            <div className="flex items-center">
                                <Link href="/" className="flex-shrink-0">
                                    <img
                                        className="h-8 w-auto"
                                        src="/stnel-logo.svg"
                                        alt="Stnel"
                                    />
                                </Link>
                                <div className="ml-8 hidden md:block">
                                    <div className="flex items-baseline space-x-8">
                                        <Link href="/" className="text-gray-600 hover:text-[#343434] px-3 py-2 text-sm font-medium transition-colors">
                                            Home
                                        </Link>
                                        <Link href="/#use-cases" className="text-gray-600 hover:text-[#343434] px-3 py-2 text-sm font-medium transition-colors">
                                            Use Cases
                                        </Link>
                                        <Link href="/about" className="text-gray-600 hover:text-[#343434] px-3 py-2 text-sm font-medium transition-colors">
                                            About
                                        </Link>
                                        <Link href="/why-cloudflare" className="text-[#343434] px-3 py-2 text-sm font-medium">
                                            Why Cloudflare?
                                        </Link>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center space-x-4">
                                {auth.user ? (
                                    <Link
                                        href={dashboard()}
                                        className="inline-flex items-center rounded-xl bg-[#343434] px-6 py-2.5 text-sm font-medium text-white shadow-lg hover:bg-[#2a2a2a] transition-all duration-200 hover:shadow-xl"
                                    >
                                        Dashboard
                                        <ArrowRight className="ml-2 h-4 w-4" />
                                    </Link>
                                ) : (
                                    <>
                                        <Link
                                            href={login()}
                                            className="text-gray-600 hover:text-[#343434] px-4 py-2 text-sm font-medium transition-colors"
                                        >
                                            Sign in
                                        </Link>
                                        <Link
                                            href={login()}
                                            className="inline-flex items-center rounded-xl bg-[#FFCD45] px-6 py-2.5 text-sm font-medium text-[#343434] shadow-lg hover:bg-[#FFD700] transition-all duration-200 hover:shadow-xl transform hover:scale-105"
                                        >
                                            Get Started
                                            <ArrowRight className="ml-2 h-4 w-4" />
                                        </Link>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </nav>

                {/* Hero Section */}
                <section className="relative pt-20 pb-16 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#FFCD45]/5 via-white to-[#343434]/5" />
                    
                    <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
                        <AnimatedCard>
                            <div className="mx-auto max-w-4xl text-center">
                                <h1 className="text-4xl font-bold tracking-tight text-[#343434] sm:text-6xl">
                                    <span className="block">Why Every Modern Website</span>
                                    <span className="block bg-gradient-to-r from-[#FFCD45] to-[#FFD700] bg-clip-text text-transparent">
                                        Needs Cloudflare
                                    </span>
                                </h1>
                                
                                <p className="mt-8 text-xl leading-8 text-gray-600 max-w-3xl mx-auto">
                                    Your website deserves enterprise-grade performance and security. 
                                    Cloudflare provides both, automatically, so you can focus on what matters most - your business.
                                </p>

                                <div className="mt-10">
                                    <a
                                        href="https://dash.cloudflare.com/sign-up"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center rounded-2xl bg-[#343434] px-8 py-4 text-lg font-semibold text-white shadow-xl hover:bg-[#2a2a2a] transition-all duration-200 transform hover:scale-105"
                                    >
                                        Start with Cloudflare (Free)
                                        <ArrowRight className="ml-3 h-5 w-5" />
                                    </a>
                                    <p className="mt-3 text-sm text-gray-500">Free plan includes everything to get started</p>
                                </div>
                            </div>
                        </AnimatedCard>
                    </div>
                </section>

                {/* Benefits Section */}
                <section className="py-24 bg-gray-50">
                    <div className="mx-auto max-w-7xl px-6 lg:px-8">
                        <AnimatedCard>
                            <div className="mx-auto max-w-3xl text-center mb-16">
                                <h2 className="text-3xl font-bold tracking-tight text-[#343434]">
                                    Transform Your Website Instantly
                                </h2>
                                <p className="mt-6 text-lg leading-8 text-gray-600">
                                    The moment you switch your DNS to Cloudflare, you get enterprise-grade infrastructure 
                                    that fortune 500 companies rely on. No technical expertise required.
                                </p>
                            </div>
                        </AnimatedCard>

                        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                            {benefits.map((benefit, index) => (
                                <AnimatedCard key={benefit.title} delay={index * 100}>
                                    <div className="group relative overflow-hidden rounded-3xl bg-white p-8 shadow-lg ring-1 ring-gray-200 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                                        <div className={`absolute inset-0 bg-gradient-to-br ${benefit.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
                                        
                                        <div className="flex items-start space-x-4">
                                            <div className={`flex-shrink-0 rounded-2xl bg-gradient-to-br ${benefit.color} p-3`}>
                                                <benefit.icon className="h-6 w-6 text-white" />
                                            </div>
                                            
                                            <div className="flex-1">
                                                <div className="flex items-center justify-between mb-2">
                                                    <h3 className="text-xl font-semibold text-[#343434]">
                                                        {benefit.title}
                                                    </h3>
                                                    <span className={`text-sm font-bold bg-gradient-to-r ${benefit.color} bg-clip-text text-transparent`}>
                                                        {benefit.stats}
                                                    </span>
                                                </div>
                                                <p className="text-gray-600 leading-relaxed">
                                                    {benefit.description}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </AnimatedCard>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Features Grid */}
                <section className="py-24">
                    <div className="mx-auto max-w-7xl px-6 lg:px-8">
                        <AnimatedCard>
                            <div className="mx-auto max-w-3xl text-center mb-16">
                                <h2 className="text-3xl font-bold tracking-tight text-[#343434]">
                                    What You Get With Cloudflare
                                </h2>
                                <p className="mt-6 text-lg leading-8 text-gray-600">
                                    Everything you need for a modern, secure, and fast website. 
                                    No complex configurations, no hidden costs.
                                </p>
                            </div>
                        </AnimatedCard>

                        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                            {features.map((feature, index) => (
                                <AnimatedCard key={feature.title} delay={index * 150}>
                                    <div className="flex items-start space-x-4 p-6 rounded-2xl bg-white border border-gray-200 hover:border-[#FFCD45] hover:shadow-lg transition-all duration-300">
                                        <div className="flex-shrink-0 rounded-xl bg-[#FFCD45]/10 p-3">
                                            <feature.icon className="h-6 w-6 text-[#343434]" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-semibold text-[#343434] mb-2">
                                                {feature.title}
                                            </h3>
                                            <p className="text-gray-600 leading-relaxed">
                                                {feature.description}
                                            </p>
                                        </div>
                                    </div>
                                </AnimatedCard>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Simple Setup Section */}
                <section className="py-24 bg-gradient-to-br from-[#FFCD45]/10 via-white to-[#343434]/5">
                    <div className="mx-auto max-w-7xl px-6 lg:px-8">
                        <AnimatedCard>
                            <div className="mx-auto max-w-4xl text-center">
                                <h2 className="text-3xl font-bold tracking-tight text-[#343434] mb-8">
                                    Getting Started is Simple
                                </h2>
                                
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
                                    <div className="text-center">
                                        <div className="mx-auto w-16 h-16 bg-[#343434] rounded-2xl flex items-center justify-center text-white text-2xl font-bold mb-4">1</div>
                                        <h3 className="text-lg font-semibold text-[#343434] mb-2">Sign Up (Free)</h3>
                                        <p className="text-gray-600">Create your Cloudflare account - no credit card required</p>
                                    </div>
                                    
                                    <div className="text-center">
                                        <div className="mx-auto w-16 h-16 bg-[#FFCD45] rounded-2xl flex items-center justify-center text-[#343434] text-2xl font-bold mb-4">2</div>
                                        <h3 className="text-lg font-semibold text-[#343434] mb-2">Add Your Site</h3>
                                        <p className="text-gray-600">Enter your website domain and let Cloudflare scan your DNS</p>
                                    </div>
                                    
                                    <div className="text-center">
                                        <div className="mx-auto w-16 h-16 bg-[#343434] rounded-2xl flex items-center justify-center text-white text-2xl font-bold mb-4">3</div>
                                        <h3 className="text-lg font-semibold text-[#343434] mb-2">Update Nameservers</h3>
                                        <p className="text-gray-600">Point your domain to Cloudflare's nameservers and you're done</p>
                                    </div>
                                </div>

                                <div className="mt-12 p-8 bg-white rounded-3xl shadow-lg border border-gray-100">
                                    <p className="text-lg text-[#343434] font-medium mb-4">
                                        ✨ That's it! Your website is now protected and accelerated.
                                    </p>
                                    <p className="text-gray-600">
                                        Once you have Cloudflare set up, you can use Stnel to add advanced access controls, 
                                        protect specific pages, and manage who can access your applications.
                                    </p>
                                </div>
                            </div>
                        </AnimatedCard>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-24 bg-[#343434]">
                    <div className="mx-auto max-w-7xl px-6 lg:px-8">
                        <AnimatedCard>
                            <div className="mx-auto max-w-3xl text-center">
                                <h2 className="text-3xl font-bold tracking-tight text-white">
                                    Ready to Transform Your Website?
                                </h2>
                                <p className="mt-6 text-lg leading-8 text-gray-300">
                                    Join millions of websites already using Cloudflare. Get started for free today, 
                                    then come back to Stnel to add powerful access controls.
                                </p>
                                <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                                    <a
                                        href="https://dash.cloudflare.com/sign-up"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="group inline-flex items-center rounded-2xl bg-[#FFCD45] px-8 py-4 text-lg font-semibold text-[#343434] shadow-xl hover:bg-[#FFD700] transition-all duration-200 transform hover:scale-105"
                                    >
                                        Set Up Cloudflare (Free)
                                        <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                                    </a>
                                    <Link
                                        href="/"
                                        className="inline-flex items-center rounded-2xl bg-white/10 px-8 py-4 text-lg font-semibold text-white shadow-xl hover:bg-white/20 transition-all duration-200"
                                    >
                                        Learn About Stnel
                                    </Link>
                                </div>
                                <p className="mt-6 text-sm text-gray-400">
                                    Already using Cloudflare? Perfect! You're ready to use Stnel.
                                </p>
                            </div>
                        </AnimatedCard>
                    </div>
                </section>

                {/* Footer */}
                <footer className="bg-white border-t border-gray-200">
                    <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
                            {/* Brand Column */}
                            <div className="md:col-span-2">
                                <div className="flex items-center mb-4">
                                    <img className="h-8 w-auto" src="/stnel-logo.svg" alt="Stnel" />
                                </div>
                                <p className="text-gray-600 max-w-md mb-6">
                                    Simple endpoint protection powered by Cloudflare's global network. 
                                    Secure your applications in minutes, not hours.
                                </p>
                                <div className="flex items-center space-x-4">
                                    <a href="mailto:hello@stnel.com" className="text-[#FFCD45] hover:text-[#FFD700] font-medium transition-colors">
                                        hello@stnel.com
                                    </a>
                                </div>
                            </div>

                            {/* Navigation Column */}
                            <div>
                                <h3 className="text-[#343434] font-semibold mb-4">Navigation</h3>
                                <ul className="space-y-3 text-sm">
                                    <li><Link href="/#use-cases" className="text-gray-600 hover:text-[#343434] transition-colors">Use Cases</Link></li>
                                    <li><Link href="/#how-it-works" className="text-gray-600 hover:text-[#343434] transition-colors">How It Works</Link></li>
                                    <li><Link href="/#pricing" className="text-gray-600 hover:text-[#343434] transition-colors">Pricing</Link></li>
                                    <li><Link href="/about" className="text-gray-600 hover:text-[#343434] transition-colors">About</Link></li>
                                    <li><Link href="/why-cloudflare" className="text-gray-600 hover:text-[#343434] transition-colors">Why Cloudflare?</Link></li>
                                </ul>
                            </div>

                            {/* Legal Column */}
                            <div>
                                <h3 className="text-[#343434] font-semibold mb-4">Legal</h3>
                                <ul className="space-y-3 text-sm">
                                    <li><Link href="/privacy-policy" className="text-gray-600 hover:text-[#343434] transition-colors">Privacy Policy</Link></li>
                                    <li><Link href="/terms-of-service" className="text-gray-600 hover:text-[#343434] transition-colors">Terms of Service</Link></li>
                                    <li><a href="mailto:support@stnel.com" className="text-gray-600 hover:text-[#343434] transition-colors">Support</a></li>
                                    <li><a href="https://status.stnel.com" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-[#343434] transition-colors">Status</a></li>
                                </ul>
                            </div>
                        </div>

                        <div className="pt-8 border-t border-gray-200">
                            <p className="text-center text-sm text-gray-500">
                                &copy; 2025 Stnel. Making Cloudflare Access simple for everyone.
                            </p>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}
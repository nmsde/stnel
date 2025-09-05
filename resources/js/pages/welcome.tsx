import { dashboard, login } from '@/routes';
import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { Shield, Lock, Users, Code, ArrowRight, Play, CheckCircle, ExternalLink } from 'lucide-react';
import { useState, useEffect } from 'react';

const useCases = [
    {
        icon: Code,
        title: 'Development Environments',
        subtitle: 'Keep your staging and dev sites private',
        description: 'Instantly protect your development environments from public access. Share with your team securely.',
        animation: 'dev',
        features: ['Password or MFA protection', 'Team member access only', 'Instant deployment protection']
    },
    {
        icon: Users,
        title: 'Client & Freelancer Access',
        subtitle: 'Controlled access for external collaborators',
        description: 'Give clients and freelancers temporary access to specific projects without compromising security.',
        animation: 'client',
        features: ['Time-limited access', 'Project-specific permissions', 'Easy access management']
    },
    {
        icon: Shield,
        title: 'Business Applications',
        subtitle: 'Secure your internal tools and dashboards',
        description: 'Protect admin panels, internal tools, and business applications with enterprise-grade security.',
        animation: 'business',
        features: ['Multi-factor authentication', 'Team-based access control', 'Activity monitoring']
    },
];

const AnimatedUseCase = ({ useCase, index, isVisible }: { useCase: typeof useCases[0]; index: number; isVisible: boolean }) => {
    const [animate, setAnimate] = useState(false);

    useEffect(() => {
        if (isVisible) {
            const timer = setTimeout(() => setAnimate(true), index * 200);
            return () => clearTimeout(timer);
        }
    }, [isVisible, index]);

    return (
        <div className={`transition-all duration-700 ${animate ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div className="group relative">
                {/* Animated background */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#FFCD45]/5 to-transparent rounded-3xl transform transition-transform duration-500 group-hover:scale-105" />
                
                <div className="relative p-12">
                    {/* Icon with animation */}
                    <div className="relative mb-8">
                        <div className="w-16 h-16 bg-[#FFCD45] rounded-2xl flex items-center justify-center transform transition-all duration-300 group-hover:rotate-3 group-hover:scale-110">
                            <useCase.icon className="w-8 h-8 text-[#343434]" />
                        </div>
                        {animate && (
                            <div className="absolute inset-0 w-16 h-16 bg-[#FFCD45]/30 rounded-2xl animate-pulse" />
                        )}
                    </div>

                    <h3 className="text-2xl font-semibold text-[#343434] mb-2">
                        {useCase.title}
                    </h3>
                    <p className="text-lg text-[#FFCD45] font-medium mb-4">
                        {useCase.subtitle}
                    </p>
                    <p className="text-gray-600 leading-relaxed mb-6">
                        {useCase.description}
                    </p>

                    <div className="space-y-3">
                        {useCase.features.map((feature, idx) => (
                            <div 
                                key={idx} 
                                className={`flex items-center transition-all duration-500 ${animate ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'}`}
                                style={{ transitionDelay: `${(index * 200) + (idx * 100)}ms` }}
                            >
                                <div className="w-2 h-2 bg-[#FFCD45] rounded-full mr-3 flex-shrink-0" />
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
                        setVisibleSections(prev => ({
                            ...prev,
                            [entry.target.id]: true
                        }));
                    }
                });
            },
            { threshold: 0.2 }
        );

        // Observe sections
        const sections = document.querySelectorAll('[data-observe]');
        sections.forEach(section => observer.observe(section));

        return () => observer.disconnect();
    }, []);


    return (
        <>
            <Head title="Stnel - Protect Any Endpoint with Cloudflare">
                <meta name="description" content="Instantly protect your websites, dev environments, and applications with Cloudflare's Zero Trust security. Simple setup, powerful protection." />
                <meta name="keywords" content="Cloudflare Access, Website Protection, Development Environment Security, Zero Trust, Endpoint Protection" />
                <meta property="og:title" content="Stnel - Protect Any Endpoint with Cloudflare" />
                <meta property="og:description" content="Turn any website or application into a protected, secure environment in minutes." />
                <meta property="og:type" content="website" />
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=inter:400,500,600,700" rel="stylesheet" />
            </Head>

            <div className="bg-white overflow-hidden">
                {/* Navigation */}
                <nav className="relative z-50 bg-white/95 backdrop-blur-md border-b border-gray-100">
                    <div className="mx-auto max-w-7xl px-6 lg:px-8">
                        <div className="flex h-16 items-center justify-between">
                            <div className="flex items-center">
                                <Link href="/" className="flex-shrink-0">
                                    <img className="h-8 w-auto" src="/stnel-logo.svg" alt="Stnel" />
                                </Link>
                                <div className="ml-8 hidden md:block">
                                    <div className="flex items-baseline space-x-8">
                                        <a href="#use-cases" className="text-gray-600 hover:text-[#343434] px-3 py-2 text-sm font-medium transition-colors">
                                            Use Cases
                                        </a>
                                        <a href="#how-it-works" className="text-gray-600 hover:text-[#343434] px-3 py-2 text-sm font-medium transition-colors">
                                            How It Works
                                        </a>
                                        <a href="#pricing" className="text-gray-600 hover:text-[#343434] px-3 py-2 text-sm font-medium transition-colors">
                                            Pricing
                                        </a>
                                        <Link href="/about" className="text-gray-600 hover:text-[#343434] px-3 py-2 text-sm font-medium transition-colors">
                                            About
                                        </Link>
                                        <Link href="/why-cloudflare" className="text-gray-600 hover:text-[#343434] px-3 py-2 text-sm font-medium transition-colors">
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
                <section className="relative pt-24 pb-32 overflow-hidden">
                    <div className="absolute inset-0">
                        <div className="absolute inset-0 bg-gradient-to-br from-[#FFCD45]/3 via-white to-[#FFCD45]/1" />
                        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#FFCD45]/5 rounded-full blur-3xl animate-pulse" />
                        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#FFCD45]/3 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
                    </div>

                    <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
                        <div className="mx-auto max-w-4xl text-center">
                            <div className={`transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                                <div className="inline-flex items-center rounded-full bg-[#FFCD45]/10 px-6 py-3 text-sm text-[#343434] mb-8 border border-[#FFCD45]/20">
                                    <Shield className="mr-2 h-4 w-4 text-[#FFCD45]" />
                                    Built for Cloudflare users
                                </div>
                                
                                <h1 className="text-5xl font-bold tracking-tight text-[#343434] sm:text-7xl lg:text-8xl mb-8">
                                    <span className="block">Protect</span>
                                    <span className="block text-[#FFCD45]">Any Endpoint</span>
                                    <span className="block">Instantly</span>
                                </h1>
                                
                                <p className="text-xl leading-relaxed text-gray-600 max-w-3xl mx-auto mb-12">
                                    Turn any website, development environment, or application into a 
                                    secure, password-protected space in minutes. No complex setup, 
                                    just simple protection powered by Cloudflare.
                                </p>
                                
                                <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-12">
                                    <Link
                                        href={auth.user ? dashboard() : login()}
                                        className="group inline-flex items-center rounded-3xl bg-[#FFCD45] px-10 py-5 text-lg font-semibold text-[#343434] hover:bg-[#FFCD45]/90 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl"
                                    >
                                        {auth.user ? 'Go to Dashboard' : 'Start Protecting Now'}
                                        <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                                    </Link>
                                    
                                    <button className="group inline-flex items-center text-[#343434]/70 hover:text-[#343434] font-medium">
                                        <Play className="mr-2 h-5 w-5 text-[#FFCD45]" />
                                        See how it works
                                    </button>
                                </div>
                                
                                <div className="text-sm text-gray-500">
                                    Free forever • 1 organization + 5 protected endpoints • No credit card required
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Use Cases Section */}
                <section id="use-cases" className="py-32 bg-gradient-to-b from-white to-[#FFCD45]/3" data-observe>
                    <div className="mx-auto max-w-7xl px-6 lg:px-8">
                        <div className="mx-auto max-w-3xl text-center mb-20">
                            <h2 className="text-4xl font-bold text-[#343434] mb-6">
                                Built for Real Scenarios
                            </h2>
                            <p className="text-xl text-gray-600 leading-relaxed">
                                Whether you're protecting development environments, managing client access, 
                                or securing business applications, Stnel adapts to your needs.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
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

                {/* How It Works Section */}
                <section id="how-it-works" className="py-32 bg-white relative" data-observe>
                    <div className="mx-auto max-w-7xl px-6 lg:px-8">
                        <div className="mx-auto max-w-3xl text-center mb-20">
                            <h2 className="text-4xl font-bold text-[#343434] mb-6">
                                From Exposed to Protected
                            </h2>
                            <p className="text-xl text-gray-600">
                                Watch how Stnel protects your development sites from accidental access
                            </p>
                        </div>

                        {/* Story Animation */}
                        <div className="max-w-5xl mx-auto">
                            {/* Step 1: Unprotected Access */}
                            <div className={`mb-16 transition-all duration-1000 ${visibleSections['how-it-works'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                                <div className="text-center mb-8">
                                    <div className="inline-flex items-center bg-gray-100 px-6 py-3 rounded-full text-[#343434] font-semibold mb-6">
                                        Problem: Accidental Discovery
                                    </div>
                                    <h3 className="text-2xl font-semibold text-[#343434] mb-2">Someone finds your staging site</h3>
                                    <p className="text-gray-600">A user accidentally discovers your development URL</p>
                                </div>
                                
                                <div className="bg-gray-50 rounded-3xl p-8 border border-gray-200">
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                                        {/* User */}
                                        <div className="text-center">
                                            <div className="w-20 h-20 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                                                <Users className="w-8 h-8 text-gray-500" />
                                            </div>
                                            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                                                <div className="text-sm text-gray-500 mb-2">Random User</div>
                                                <div className="font-medium text-[#343434]">"I wonder if staging.coolapp.com exists?"</div>
                                            </div>
                                        </div>

                                        {/* Browser/Site */}
                                        <div>
                                            <div className="bg-white rounded-2xl border border-gray-200 shadow-lg">
                                                <div className="flex items-center justify-between px-4 py-3 bg-gray-50 rounded-t-2xl border-b border-gray-100">
                                                    <div className="flex space-x-2">
                                                        <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
                                                        <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
                                                        <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
                                                    </div>
                                                    <div className="text-sm text-gray-600 font-mono">staging.coolapp.com</div>
                                                    <div className="w-16"></div>
                                                </div>
                                                <div className="p-6">
                                                    {/* Website Layout Mock */}
                                                    <div className="bg-gray-100 rounded-lg p-4 mb-4">
                                                        <div className="flex items-center justify-between mb-3">
                                                            <div className="flex space-x-2">
                                                                <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                                                                <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                                                                <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                                                            </div>
                                                            <div className="text-xs text-gray-500">CoolApp</div>
                                                        </div>
                                                        <div className="space-y-2">
                                                            <div className="h-2 bg-gray-300 rounded w-3/4"></div>
                                                            <div className="h-2 bg-gray-300 rounded w-1/2"></div>
                                                            <div className="h-2 bg-gray-300 rounded w-2/3"></div>
                                                        </div>
                                                        <div className="mt-4 text-center">
                                                            <div className="inline-flex items-center bg-[#FFCD45] px-3 py-1 rounded-full">
                                                                <div className="text-xs font-medium text-[#343434]">Under Development</div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    
                                                    <div className="text-center">
                                                        <h4 className="font-semibold text-[#343434] mb-3">Full Access Granted</h4>
                                                        <p className="text-gray-600 mb-4 leading-relaxed text-sm">Complete access to your development environment, database, and sensitive data</p>
                                                        <div className="bg-gray-100 text-[#343434] px-4 py-2 rounded-xl text-xs font-medium">
                                                            API Keys • Database • Source Code Exposed
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Transformation Arrow */}
                            <div className={`flex justify-center mb-16 transition-all duration-1000 delay-1000 ${visibleSections['how-it-works'] ? 'opacity-100 scale-100' : 'opacity-0 scale-75'}`}>
                                <div className="border-4 border-[#FFCD45]/20 rounded-3xl p-8">
                                    <div className="text-center">
                                        <img className="h-8 w-auto mx-auto mb-2" src="/stnel-logo.svg" alt="Stnel" />
                                        <div className="text-[#343434] font-semibold text-sm">Activated</div>
                                    </div>
                                </div>
                            </div>

                            {/* Step 2: Protected Access Flow */}
                            <div className={`transition-all duration-1000 delay-1500 ${visibleSections['how-it-works'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                                <div className="text-center mb-8">
                                    <div className="inline-flex items-center bg-[#FFCD45]/10 px-6 py-3 rounded-full text-[#343434] font-semibold mb-6">
                                        Solution: Stnel Protected
                                    </div>
                                    <h3 className="text-2xl font-semibold text-[#343434] mb-2">Now the same user tries to access</h3>
                                    <p className="text-gray-600">Cloudflare Access challenges unauthorized visitors</p>
                                </div>

                                <div className="space-y-12">
                                    {/* Access Challenge */}
                                    <div className="bg-gray-50 rounded-3xl p-8 border border-gray-200">
                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                                            {/* User */}
                                            <div className="text-center">
                                                <div className="w-20 h-20 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                                                    <Users className="w-8 h-8 text-gray-500" />
                                                </div>
                                                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                                                    <div className="text-sm text-gray-500 mb-2">Same Random User</div>
                                                    <div className="font-medium text-[#343434]">"Hmm, it's asking for verification..."</div>
                                                </div>
                                            </div>

                                            {/* Access Challenge Screen */}
                                            <div>
                                                <div className="bg-white rounded-2xl border border-gray-200 shadow-lg">
                                                    <div className="flex items-center justify-between px-4 py-3 bg-gray-50 rounded-t-2xl border-b border-gray-100">
                                                        <div className="flex space-x-2">
                                                            <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
                                                            <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
                                                            <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
                                                        </div>
                                                        <div className="text-sm text-gray-600 font-mono">staging.coolapp.com</div>
                                                        <div className="w-16"></div>
                                                    </div>
                                                    <div className="p-8">
                                                        <div className="text-center">
                                                            <div className="w-16 h-16 bg-[#FFCD45]/10 rounded-2xl mx-auto mb-6 flex items-center justify-center">
                                                                <Shield className="w-8 h-8 text-[#FFCD45]" />
                                                            </div>
                                                            <h4 className="font-semibold text-[#343434] mb-6">Access Verification Required</h4>
                                                            <div className="space-y-4 max-w-sm mx-auto">
                                                                <div className="bg-gray-50 rounded-xl p-4">
                                                                    <input type="email" placeholder="Enter your email" className="w-full bg-transparent text-sm text-gray-600" disabled />
                                                                </div>
                                                                <button className="w-full bg-[#FFCD45] text-[#343434] py-3 rounded-xl font-medium text-sm hover:bg-[#FFD700] transition-colors">
                                                                    Send Verification Code
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Authorized Access */}
                                    <div className={`bg-[#FFCD45]/5 rounded-3xl p-8 border border-[#FFCD45]/20 transition-all duration-1000 delay-2500 ${visibleSections['how-it-works'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                                            {/* Authorized User */}
                                            <div className="text-center">
                                                <div className="w-20 h-20 bg-[#FFCD45] rounded-full mx-auto mb-4 flex items-center justify-center">
                                                    <Users className="w-10 h-10 text-[#343434]" />
                                                </div>
                                                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                                                    <div className="text-sm text-[#FFCD45] mb-2 font-medium">Authorized User</div>
                                                    <div className="font-medium text-[#343434]">"Let me check the staging site"</div>
                                                </div>
                                            </div>

                                            {/* Successful Access */}
                                            <div>
                                                <div className="bg-white rounded-2xl border border-gray-200 shadow-lg">
                                                    <div className="flex items-center justify-between px-4 py-3 bg-[#FFCD45]/10 rounded-t-2xl border-b border-gray-100">
                                                        <div className="flex space-x-2">
                                                            <div className="w-3 h-3 bg-[#FFCD45] rounded-full"></div>
                                                            <div className="w-3 h-3 bg-[#FFCD45] rounded-full"></div>
                                                            <div className="w-3 h-3 bg-[#FFCD45] rounded-full"></div>
                                                        </div>
                                                        <div className="text-sm text-gray-600 font-mono">staging.coolapp.com</div>
                                                        <div className="w-16"></div>
                                                    </div>
                                                    <div className="p-8">
                                                        <div className="text-center">
                                                            <div className="w-12 h-12 bg-[#FFCD45]/20 rounded-xl mx-auto mb-4 flex items-center justify-center">
                                                                <CheckCircle className="w-6 h-6 text-[#FFCD45]" />
                                                            </div>
                                                            <h4 className="font-semibold text-[#343434] mb-3">Access Granted</h4>
                                                            <p className="text-gray-600 mb-4 leading-relaxed">Authorized team member verified via email</p>
                                                            <div className="bg-[#FFCD45]/10 text-[#343434] px-4 py-2 rounded-xl text-sm font-medium border border-[#FFCD45]/20">
                                                                Secure Access • Activity Logged • Time Limited
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Summary */}
                            <div className={`text-center mt-20 transition-all duration-1000 delay-3000 ${visibleSections['how-it-works'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                                <div className="">
                                    <h3 className="text-3xl font-bold text-[#343434] mb-6">That's the power of Stnel</h3>
                                    <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                                        Transform any website into a secure, protected environment where only authorized users can access your sensitive development work.
                                    </p>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
                                        <div>
                                            <div className="text-3xl font-bold text-[#FFCD45] mb-2">5min</div>
                                            <div className="text-sm text-gray-600">Setup time</div>
                                        </div>
                                        <div>
                                            <div className="text-3xl font-bold text-[#FFCD45] mb-2">Email + SMS</div>
                                            <div className="text-sm text-gray-600">Multi-factor authentication</div>
                                        </div>
                                        <div>
                                            <div className="text-3xl font-bold text-[#FFCD45] mb-2">100%</div>
                                            <div className="text-sm text-gray-600">Protection coverage</div>
                                        </div>
                                    </div>

                                    <Link
                                        href={auth.user ? dashboard() : login()}
                                        className="group inline-flex items-center rounded-2xl bg-[#FFCD45] px-8 py-4 text-lg font-semibold text-[#343434] hover:bg-[#FFD700] transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
                                    >
                                        Protect Your Sites Now
                                        <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Cloudflare Focus Section */}
                <section className="py-32 bg-gradient-to-b from-[#FFCD45]/3 to-white">
                    <div className="mx-auto max-w-7xl px-6 lg:px-8">
                        <div className="mx-auto max-w-4xl text-center">
                            <h2 className="text-4xl font-bold text-[#343434] mb-6">
                                Made for Cloudflare Users
                            </h2>
                            <p className="text-xl text-gray-600 leading-relaxed mb-12">
                                If you're already using Cloudflare for DNS, CDN, or other services, 
                                Stnel seamlessly integrates with your existing setup to add powerful 
                                access control to any endpoint.
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                                <div className="bg-white rounded-3xl p-8 shadow-sm border border-[#FFCD45]/10">
                                    <h3 className="text-xl font-semibold text-[#343434] mb-4">Already using Cloudflare?</h3>
                                    <p className="text-gray-600 mb-6">Perfect! You can start protecting endpoints in minutes.</p>
                                    <Link
                                        href={auth.user ? dashboard() : login()}
                                        className="inline-flex items-center text-[#FFCD45] font-semibold hover:text-[#FFCD45]/80 transition-colors"
                                    >
                                        Get started now <ArrowRight className="ml-2 h-4 w-4" />
                                    </Link>
                                </div>

                                <div className="bg-white rounded-3xl p-8 shadow-sm border border-[#FFCD45]/10">
                                    <h3 className="text-xl font-semibold text-[#343434] mb-4">New to Cloudflare?</h3>
                                    <p className="text-gray-600 mb-6">Learn why millions of websites trust Cloudflare for security and performance.</p>
                                    <Link
                                        href="/why-cloudflare"
                                        className="inline-flex items-center text-[#FFCD45] font-semibold hover:text-[#FFCD45]/80 transition-colors"
                                    >
                                        Why Cloudflare? <ExternalLink className="ml-2 h-4 w-4" />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Pricing Section */}
                <section id="pricing" className="py-32 bg-white" data-observe>
                    <div className="mx-auto max-w-7xl px-6 lg:px-8">
                        <div className="mx-auto max-w-3xl text-center mb-20">
                            <h2 className="text-4xl font-bold text-[#343434] mb-6">
                                Simple, Honest Pricing
                            </h2>
                            <p className="text-xl text-gray-600">
                                Start free, upgrade when you need more
                            </p>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
                            {/* Free Plan */}
                            <div className="bg-white rounded-3xl p-10 shadow-sm border-2 border-[#FFCD45]/20 relative overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-br from-[#FFCD45]/5 to-transparent" />
                                <div className="relative">
                                    <h3 className="text-2xl font-bold text-[#343434] mb-2">Free</h3>
                                    <p className="text-gray-600 mb-6">Perfect for getting started</p>
                                    <div className="mb-8">
                                        <span className="text-5xl font-bold text-[#343434]">$0</span>
                                        <span className="text-gray-600 ml-2">forever</span>
                                    </div>
                                    
                                    <div className="space-y-4 mb-8">
                                        <div className="flex items-center">
                                            <div className="w-2 h-2 bg-[#FFCD45] rounded-full mr-4" />
                                            <span className="text-gray-700">1 Organization</span>
                                        </div>
                                        <div className="flex items-center">
                                            <div className="w-2 h-2 bg-[#FFCD45] rounded-full mr-4" />
                                            <span className="text-gray-700">5 Protected Endpoints</span>
                                        </div>
                                        <div className="flex items-center">
                                            <div className="w-2 h-2 bg-[#FFCD45] rounded-full mr-4" />
                                            <span className="text-gray-700">Basic Access Control</span>
                                        </div>
                                        <div className="flex items-center">
                                            <div className="w-2 h-2 bg-[#FFCD45] rounded-full mr-4" />
                                            <span className="text-gray-700">Activity Monitoring</span>
                                        </div>
                                    </div>

                                    <Link
                                        href={login()}
                                        className="w-full inline-flex justify-center items-center rounded-2xl border-2 border-[#FFCD45] px-8 py-4 text-sm font-semibold text-[#FFCD45] hover:bg-[#FFCD45] hover:text-[#343434] transition-all"
                                    >
                                        Start Free
                                    </Link>
                                </div>
                            </div>

                            {/* Pro Plan */}
                            <div className="relative bg-[#343434] rounded-3xl p-10 shadow-xl overflow-hidden">
                                
                                <div className="relative">
                                    <h3 className="text-2xl font-bold text-white mb-2">Pro</h3>
                                    <p className="text-gray-300 mb-6">For growing teams</p>
                                    <div className="mb-8">
                                        <span className="text-5xl font-bold text-white">$15</span>
                                        <span className="text-gray-300 ml-2">/month</span>
                                    </div>
                                    
                                    <div className="space-y-4 mb-8">
                                        <div className="flex items-center">
                                            <div className="w-2 h-2 bg-[#FFCD45] rounded-full mr-4" />
                                            <span className="text-gray-100">Unlimited Organizations</span>
                                        </div>
                                        <div className="flex items-center">
                                            <div className="w-2 h-2 bg-[#FFCD45] rounded-full mr-4" />
                                            <span className="text-gray-100">Unlimited Protected Endpoints</span>
                                        </div>
                                        <div className="flex items-center">
                                            <div className="w-2 h-2 bg-[#FFCD45] rounded-full mr-4" />
                                            <span className="text-gray-100">Advanced Access Management</span>
                                        </div>
                                        <div className="flex items-center">
                                            <div className="w-2 h-2 bg-[#FFCD45] rounded-full mr-4" />
                                            <span className="text-gray-100">Email Notifications</span>
                                        </div>
                                    </div>

                                    <Link
                                        href={login()}
                                        className="w-full inline-flex justify-center items-center rounded-2xl bg-[#FFCD45] px-8 py-4 text-sm font-semibold text-[#343434] hover:bg-[#FFCD45]/90 transition-all"
                                    >
                                        Start Pro Trial
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-32 bg-gradient-to-br from-[#FFCD45] to-[#FFCD45]/80">
                    <div className="mx-auto max-w-7xl px-6 lg:px-8">
                        <div className="mx-auto max-w-3xl text-center">
                            <h2 className="text-4xl font-bold text-[#343434] mb-6">
                                Ready to Protect Your Endpoints?
                            </h2>
                            <p className="text-xl text-[#343434]/80 mb-10">
                                Join developers and teams who trust Stnel to secure their applications.
                            </p>
                            <div className="flex items-center justify-center">
                                <Link
                                    href={auth.user ? dashboard() : login()}
                                    className="group inline-flex items-center rounded-3xl bg-[#343434] px-12 py-6 text-lg font-semibold text-white hover:bg-[#343434]/90 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl"
                                >
                                    {auth.user ? 'Go to Dashboard' : 'Start Free Now'}
                                    <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                                </Link>
                            </div>
                        </div>
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
                                    <li><a href="#use-cases" className="text-gray-600 hover:text-[#343434] transition-colors">Use Cases</a></li>
                                    <li><a href="#how-it-works" className="text-gray-600 hover:text-[#343434] transition-colors">How It Works</a></li>
                                    <li><a href="#pricing" className="text-gray-600 hover:text-[#343434] transition-colors">Pricing</a></li>
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
import { dashboard, login } from '@/routes';
import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { Shield, Zap, Globe, Users, ArrowRight, CheckCircle, Eye, TrendingUp, Clock, Mail, Star, Target, Award, Heart } from 'lucide-react';

const team = [
    {
        name: 'Sarah Chen',
        role: 'Chief Executive Officer',
        bio: 'Former security architect at CloudFlare with 10+ years in Zero Trust security.',
        avatar: 'SC',
    },
    {
        name: 'Marcus Rodriguez',
        role: 'Chief Technology Officer',
        bio: 'Ex-Google Cloud engineer specializing in enterprise security infrastructure.',
        avatar: 'MR',
    },
    {
        name: 'Emily Watson',
        role: 'Head of Product',
        bio: 'Product leader with expertise in developer tools and security platforms.',
        avatar: 'EW',
    },
];

const values = [
    {
        icon: Shield,
        title: 'Security First',
        description: 'We prioritize security in everything we build, ensuring your applications are protected with enterprise-grade Zero Trust principles.',
        color: 'text-blue-600',
    },
    {
        icon: Target,
        title: 'Simple Solutions',
        description: 'Complex security shouldn\'t require complex tools. We make enterprise security accessible to organizations of all sizes.',
        color: 'text-green-600',
    },
    {
        icon: Heart,
        title: 'Customer Success',
        description: 'Your success is our success. We\'re committed to helping you achieve your security goals with outstanding support.',
        color: 'text-red-600',
    },
    {
        icon: Award,
        title: 'Innovation',
        description: 'We continuously innovate to stay ahead of emerging threats and provide cutting-edge security solutions.',
        color: 'text-purple-600',
    },
];

export default function About() {
    const { auth } = usePage<SharedData>().props;

    return (
        <>
            <Head title="About Stnel - Cloudflare Access Management">
                <meta name="description" content="Learn about Stnel's mission to simplify enterprise security through innovative Cloudflare Access management solutions." />
                <meta name="keywords" content="About Stnel, Cloudflare Access, Zero Trust, Security Team, Company Mission" />
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=inter:400,500,600,700" rel="stylesheet" />
            </Head>

            <div className="bg-white dark:bg-gray-900">
                {/* Navigation */}
                <nav className="relative z-50">
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
                                        <Link href="/" className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white px-3 py-2 text-sm font-medium transition-colors">
                                            Home
                                        </Link>
                                        <Link href="/#features" className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white px-3 py-2 text-sm font-medium transition-colors">
                                            Features
                                        </Link>
                                        <Link href="/#pricing" className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white px-3 py-2 text-sm font-medium transition-colors">
                                            Pricing
                                        </Link>
                                        <Link href="/about" className="text-blue-600 dark:text-blue-400 px-3 py-2 text-sm font-medium">
                                            About
                                        </Link>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center space-x-4">
                                {auth.user ? (
                                    <Link
                                        href={dashboard()}
                                        className="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 transition-colors"
                                    >
                                        Dashboard
                                        <ArrowRight className="ml-2 h-4 w-4" />
                                    </Link>
                                ) : (
                                    <>
                                        <Link
                                            href={login()}
                                            className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white px-3 py-2 text-sm font-medium transition-colors"
                                        >
                                            Sign in
                                        </Link>
                                        <Link
                                            href={login()}
                                            className="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 transition-colors"
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
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-blue-900/20" />
                    
                    <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
                        <div className="mx-auto max-w-3xl text-center">
                            <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-6xl">
                                <span className="block">Securing the Future</span>
                                <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent">
                                    One App at a Time
                                </span>
                            </h1>
                            
                            <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
                                At Stnel, we believe that enterprise security shouldn't be complicated. 
                                We're on a mission to make Zero Trust security accessible to every organization, 
                                regardless of size or technical expertise.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Mission Section */}
                <section className="py-24 bg-gray-50 dark:bg-gray-800/50">
                    <div className="mx-auto max-w-7xl px-6 lg:px-8">
                        <div className="mx-auto max-w-3xl text-center mb-16">
                            <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                                Our Mission
                            </h2>
                            <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
                                We're building the bridge between complex enterprise security and simple, intuitive management. 
                                Our goal is to empower organizations to protect their most valuable assets without the complexity traditionally associated with enterprise security.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
                            <div className="text-center">
                                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-xl bg-blue-100 dark:bg-blue-900/30">
                                    <Shield className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                                </div>
                                <h3 className="mt-6 text-lg font-semibold text-gray-900 dark:text-white">10,000+</h3>
                                <p className="text-gray-600 dark:text-gray-400">Applications Protected</p>
                            </div>
                            
                            <div className="text-center">
                                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-xl bg-green-100 dark:bg-green-900/30">
                                    <Users className="h-8 w-8 text-green-600 dark:text-green-400" />
                                </div>
                                <h3 className="mt-6 text-lg font-semibold text-gray-900 dark:text-white">500+</h3>
                                <p className="text-gray-600 dark:text-gray-400">Organizations Secured</p>
                            </div>
                            
                            <div className="text-center">
                                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-xl bg-purple-100 dark:bg-purple-900/30">
                                    <Globe className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                                </div>
                                <h3 className="mt-6 text-lg font-semibold text-gray-900 dark:text-white">50+</h3>
                                <p className="text-gray-600 dark:text-gray-400">Countries Served</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Values Section */}
                <section className="py-24">
                    <div className="mx-auto max-w-7xl px-6 lg:px-8">
                        <div className="mx-auto max-w-2xl text-center mb-16">
                            <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                                Our Values
                            </h2>
                            <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
                                The principles that guide everything we do at Stnel.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                            {values.map((value, index) => (
                                <div key={value.title} className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-gray-200 dark:bg-gray-900 dark:ring-gray-800">
                                    <div className={`inline-flex rounded-xl p-3 ${value.color} bg-opacity-10`}>
                                        <value.icon className={`h-6 w-6 ${value.color}`} />
                                    </div>
                                    <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">
                                        {value.title}
                                    </h3>
                                    <p className="mt-2 text-gray-600 dark:text-gray-400 leading-relaxed">
                                        {value.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Team Section */}
                <section className="py-24 bg-gray-50 dark:bg-gray-800/50">
                    <div className="mx-auto max-w-7xl px-6 lg:px-8">
                        <div className="mx-auto max-w-2xl text-center mb-16">
                            <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                                Meet Our Team
                            </h2>
                            <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
                                Security experts, engineers, and innovators working together to protect your digital assets.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                            {team.map((member) => (
                                <div key={member.name} className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-gray-200 dark:bg-gray-900 dark:ring-gray-800 text-center">
                                    <div className="mx-auto h-20 w-20 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-xl mb-4">
                                        {member.avatar}
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                        {member.name}
                                    </h3>
                                    <p className="text-sm text-blue-600 dark:text-blue-400 mt-1 mb-3">
                                        {member.role}
                                    </p>
                                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                                        {member.bio}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Story Section */}
                <section className="py-24">
                    <div className="mx-auto max-w-7xl px-6 lg:px-8">
                        <div className="mx-auto max-w-3xl">
                            <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white mb-8">
                                Our Story
                            </h2>
                            
                            <div className="prose prose-lg prose-gray dark:prose-invert">
                                <p>
                                    Stnel was born from a simple observation: while Cloudflare Access provides world-class Zero Trust security, 
                                    managing it across multiple applications and organizations was unnecessarily complex.
                                </p>
                                
                                <p>
                                    Our founders, having worked at some of the world's largest technology companies, witnessed firsthand how 
                                    security teams struggled with fragmented tools, manual processes, and lack of visibility into their 
                                    access management infrastructure.
                                </p>
                                
                                <p>
                                    We set out to build something different. A platform that would make enterprise security accessible to 
                                    organizations of all sizes, without compromising on the robust security features that enterprises require.
                                </p>
                                
                                <p>
                                    Today, Stnel serves hundreds of organizations worldwide, from startups to Fortune 500 companies, 
                                    helping them secure their most valuable digital assets with confidence and simplicity.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-24 bg-gray-50 dark:bg-gray-800/50">
                    <div className="mx-auto max-w-7xl px-6 lg:px-8">
                        <div className="mx-auto max-w-2xl text-center">
                            <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                                Join Our Mission
                            </h2>
                            <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
                                Ready to transform your organization's security posture? Start your free trial today.
                            </p>
                            <div className="mt-10 flex items-center justify-center gap-4">
                                <Link
                                    href={auth.user ? dashboard() : login()}
                                    className="group inline-flex items-center rounded-xl bg-blue-600 px-8 py-4 text-lg font-semibold text-white shadow-lg hover:bg-blue-700 hover:shadow-xl transition-all duration-200 transform hover:scale-105"
                                >
                                    {auth.user ? 'Go to Dashboard' : 'Start Free Trial'}
                                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Footer */}
                <footer className="bg-gray-900">
                    <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
                        <div className="flex flex-col items-center justify-between lg:flex-row">
                            <div className="flex items-center">
                                <img
                                    className="h-8 w-auto"
                                    src="/stnel-logo.svg"
                                    alt="Stnel"
                                />
                                <span className="ml-3 text-white font-semibold">Stnel</span>
                            </div>
                            <div className="mt-8 lg:mt-0">
                                <p className="text-center text-sm text-gray-400 lg:text-left">
                                    &copy; 2025 Stnel. All rights reserved. Cloudflare Access management made simple.
                                </p>
                            </div>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}
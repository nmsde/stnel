import Footer from '@/components/footer';
import Navigation from '@/components/navigation';
import { dashboard, login } from '@/routes';
import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { ArrowRight, Check, ChevronRight, Globe, Shield, Zap } from 'lucide-react';

export default function WhyCloudflare() {
    const { auth } = usePage<SharedData>().props;

    return (
        <>
            <Head title="Why Cloudflare? - The Foundation for Modern Web Infrastructure">
                <meta
                    name="description"
                    content="Cloudflare powers 20% of the internet. Learn why businesses choose Cloudflare for performance, security, and reliability - including free access control for up to 50 users."
                />
                <meta name="keywords" content="Cloudflare, CDN, Web Security, DDoS Protection, Cloudflare Access, Zero Trust" />
            </Head>

            <div className="bg-white">
                <Navigation currentPage="why-cloudflare" />

                {/* Hero Section */}
                <section className="relative overflow-hidden pt-32 pb-20">
                    <div className="absolute inset-0 bg-gradient-to-b from-gray-50 to-white" />

                    <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
                        <div className="mx-auto max-w-3xl text-center">
                            {/* Trust Badge */}
                            <div className="mb-8 inline-flex items-center rounded-full bg-[#F38020]/10 px-4 py-2">
                                <Globe className="mr-2 h-4 w-4 text-[#F38020]" />
                                <span className="text-sm font-semibold text-[#F38020]">POWERING 20% OF THE INTERNET</span>
                            </div>

                            <h1 className="mb-6 text-5xl font-bold tracking-tight text-[#343434] sm:text-6xl">Why Cloudflare?</h1>

                            <p className="mb-12 text-xl leading-8 text-gray-600">
                                The internet runs on Cloudflare. From Fortune 500 companies to personal blogs, millions trust Cloudflare to make their
                                websites faster, more secure, and always online.
                            </p>

                            <div className="flex flex-col justify-center gap-4 sm:flex-row">
                                <a
                                    href="https://www.cloudflare.com/plans/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center rounded-2xl bg-[#F38020] px-6 py-3 text-base font-semibold text-white transition-all duration-200 hover:bg-[#E57010]"
                                >
                                    View Cloudflare Plans
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </a>
                                <Link
                                    href="/"
                                    className="inline-flex items-center rounded-2xl border-2 border-gray-200 bg-white px-6 py-3 text-base font-semibold text-[#343434] transition-all duration-200 hover:border-[#FFCD45]"
                                >
                                    How Stnel Helps
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Core Benefits */}
                <section className="bg-white py-20">
                    <div className="mx-auto max-w-7xl px-6 lg:px-8">
                        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                            <div className="text-center">
                                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100">
                                    <Zap className="h-8 w-8 text-[#F38020]" />
                                </div>
                                <h3 className="mb-2 text-xl font-semibold text-[#343434]">Performance</h3>
                                <p className="text-gray-600">Serve content from 300+ cities worldwide. Your site loads instantly, everywhere.</p>
                            </div>

                            <div className="text-center">
                                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100">
                                    <Shield className="h-8 w-8 text-[#F38020]" />
                                </div>
                                <h3 className="mb-2 text-xl font-semibold text-[#343434]">Security</h3>
                                <p className="text-gray-600">Enterprise-grade DDoS protection and Web Application Firewall included free.</p>
                            </div>

                            <div className="text-center">
                                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100">
                                    <Globe className="h-8 w-8 text-[#F38020]" />
                                </div>
                                <h3 className="mb-2 text-xl font-semibold text-[#343434]">Reliability</h3>
                                <p className="text-gray-600">100% uptime SLA. When your origin goes down, Cloudflare keeps serving your site.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* The Numbers Section */}
                <section className="bg-gray-50 py-20">
                    <div className="mx-auto max-w-7xl px-6 lg:px-8">
                        <div className="mb-16 text-center">
                            <h2 className="mb-4 text-3xl font-bold text-[#343434]">Trusted by the Internet</h2>
                            <p className="text-lg text-gray-600">These aren't just numbers. They're proof of reliability at scale.</p>
                        </div>

                        <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
                            <div className="rounded-2xl bg-white p-6 text-center">
                                <div className="mb-2 text-3xl font-bold text-[#F38020]">20%</div>
                                <div className="text-sm text-gray-600">of all internet requests</div>
                            </div>
                            <div className="rounded-2xl bg-white p-6 text-center">
                                <div className="mb-2 text-3xl font-bold text-[#F38020]">300+</div>
                                <div className="text-sm text-gray-600">cities worldwide</div>
                            </div>
                            <div className="rounded-2xl bg-white p-6 text-center">
                                <div className="mb-2 text-3xl font-bold text-[#F38020]">192 Tbps</div>
                                <div className="text-sm text-gray-600">network capacity</div>
                            </div>
                            <div className="rounded-2xl bg-white p-6 text-center">
                                <div className="mb-2 text-3xl font-bold text-[#F38020]">50ms</div>
                                <div className="text-sm text-gray-600">from 95% of users</div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* How Stnel Fits In */}
                <section className="bg-gray-50 bg-white py-20">
                    <div className="mx-auto max-w-7xl px-6 lg:px-8">
                        <div className="mx-auto max-w-4xl">
                            <div className="mb-12 text-center">
                                <h2 className="mb-4 text-3xl font-bold text-[#343434]">Where Stnel Fits In</h2>
                                <p className="text-lg text-gray-600">We make Cloudflare Access simple to manage</p>
                            </div>

                            <div className="rounded-3xl bg-white p-8 shadow-lg">
                                <div className="grid items-center gap-8 lg:grid-cols-2">
                                    <div>
                                        <h3 className="mb-4 text-xl font-semibold text-[#343434]">The Challenge</h3>
                                        <p className="mb-4 text-gray-600">
                                            Cloudflare Access is powerful but can be complex to configure. Managing policies across multiple
                                            applications requires technical expertise and constant maintenance.
                                        </p>
                                        <ul className="space-y-2 text-gray-600">
                                            <li className="flex items-start">
                                                <ChevronRight className="mt-0.5 mr-2 h-4 w-4 flex-shrink-0 text-gray-400" />
                                                Complex policy syntax
                                            </li>
                                            <li className="flex items-start">
                                                <ChevronRight className="mt-0.5 mr-2 h-4 w-4 flex-shrink-0 text-gray-400" />
                                                No visual management interface
                                            </li>
                                            <li className="flex items-start">
                                                <ChevronRight className="mt-0.5 mr-2 h-4 w-4 flex-shrink-0 text-gray-400" />
                                                Limited notification options
                                            </li>
                                        </ul>
                                    </div>

                                    <div>
                                        <h3 className="mb-4 text-xl font-semibold text-[#343434]">Our Solution</h3>
                                        <p className="mb-4 text-gray-600">
                                            Stnel provides an intuitive interface for Cloudflare Access. We don't replace Cloudflare - we make it
                                            easier to use.
                                        </p>
                                        <ul className="space-y-2 text-gray-600">
                                            <li className="flex items-start">
                                                <Check className="mt-0.5 mr-2 h-4 w-4 flex-shrink-0 text-green-500" />
                                                Visual policy builder
                                            </li>
                                            <li className="flex items-start">
                                                <Check className="mt-0.5 mr-2 h-4 w-4 flex-shrink-0 text-green-500" />
                                                One-click deployment
                                            </li>
                                            <li className="flex items-start">
                                                <Check className="mt-0.5 mr-2 h-4 w-4 flex-shrink-0 text-green-500" />
                                                Email & Slack notifications
                                            </li>
                                        </ul>
                                    </div>
                                </div>

                                <div className="mt-8 rounded-2xl bg-gray-50 p-6">
                                    <p className="text-center text-sm text-gray-600">
                                        <strong>Important:</strong> Stnel is an independent tool that helps you manage Cloudflare Access. We are not
                                        affiliated with Cloudflare. You need a Cloudflare account to use Stnel.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Getting Started */}
                <section className="bg-[#343434] py-20 text-white">
                    <div className="mx-auto max-w-7xl px-6 lg:px-8">
                        <div className="mx-auto max-w-3xl text-center">
                            <h2 className="mb-12 text-3xl font-bold text-white">Getting Started is Simple</h2>

                            <div className="space-y-8">
                                <div className="flex items-center">
                                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-[#F38020] font-bold text-white">
                                        1
                                    </div>
                                    <div className="ml-6 flex-1 text-left">
                                        <h3 className="font-semibold text-white">Set up Cloudflare (5 minutes)</h3>
                                        <p className="text-white">Add your domain and update nameservers</p>
                                    </div>
                                </div>

                                <div className="flex items-center">
                                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-[#F38020] font-bold text-white">
                                        2
                                    </div>
                                    <div className="ml-6 flex-1 text-left">
                                        <h3 className="font-semibold text-white">Connect Stnel (2 minutes)</h3>
                                        <p className="text-white">Link your Cloudflare account with Stnel</p>
                                    </div>
                                </div>

                                <div className="flex items-center">
                                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-[#F38020] font-bold text-white">
                                        3
                                    </div>
                                    <div className="ml-6 flex-1 text-left">
                                        <h3 className="font-semibold text-white">Configure Access (30 seconds)</h3>
                                        <p className="text-white">Use our visual interface to protect your apps</p>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-12 flex flex-col justify-center gap-4 sm:flex-row">
                                <a
                                    href="https://dash.cloudflare.com/sign-up"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center rounded-2xl bg-[#F38020] px-6 py-3 text-base font-semibold text-white transition-all duration-200 hover:bg-[#E57010]"
                                >
                                    Start with Cloudflare
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </a>
                                <Link
                                    href={auth.user ? dashboard() : login()}
                                    className="inline-flex items-center rounded-2xl bg-[#FFCD45] px-6 py-3 text-base font-semibold text-[#343434] transition-all duration-200 hover:bg-[#FFD700]"
                                >
                                    Then Add Stnel
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Trust Section */}
                {/* <section className="py-20 bg-[#343434]">
                    <div className="mx-auto max-w-7xl px-6 lg:px-8">
                        <div className="mx-auto max-w-3xl text-center">
                            <h2 className="text-3xl font-bold text-white mb-8">
                                Join the Best Companies on the Internet
                            </h2>
                            <p className="text-lg text-gray-300 mb-12">
                                From startups to Fortune 500, the world's best companies trust Cloudflare
                            </p>
                            
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
                                <div className="flex items-center justify-center">
                                    <Building className="w-12 h-12 text-gray-500" />
                                </div>
                                <div className="flex items-center justify-center">
                                    <Building className="w-12 h-12 text-gray-500" />
                                </div>
                                <div className="flex items-center justify-center">
                                    <Building className="w-12 h-12 text-gray-500" />
                                </div>
                                <div className="flex items-center justify-center">
                                    <Building className="w-12 h-12 text-gray-500" />
                                </div>
                            </div>
                            
                            <p className="text-sm text-gray-400">
                                Discord, Shopify, DoorDash, Garmin, and 20% of the entire internet run on Cloudflare
                            </p>
                        </div>
                    </div>
                </section> */}

                <Footer />
            </div>
        </>
    );
}

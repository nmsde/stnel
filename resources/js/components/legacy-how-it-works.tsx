import { dashboard, login } from '@/routes';
import { type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { ArrowRight, CheckCircle, Shield, Users } from 'lucide-react';

interface LegacyHowItWorksProps {
    visibleSections: Record<string, boolean>;
}

export default function LegacyHowItWorks({ visibleSections }: LegacyHowItWorksProps) {
    const { auth } = usePage<SharedData>().props;

    return (
        <section id="how-it-works" className="relative bg-white py-20" data-observe>
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="mx-auto mb-12 max-w-3xl text-center">
                    <h2 className="mb-4 text-4xl font-bold text-[#343434]">Simplified Access Management</h2>
                    <p className="text-lg text-gray-600">See how Stnel makes configuring Cloudflare Access policies intuitive and visual</p>
                </div>

                {/* Story Animation */}
                <div className="mx-auto max-w-6xl">
                    {/* Step 1: Unprotected Access */}
                    <div
                        className={`mb-8 transition-all duration-1000 ${visibleSections['how-it-works'] ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}
                    >
                        <div className="mb-6 text-center">
                            <div className="mb-3 inline-flex items-center rounded-full bg-gray-100 px-4 py-2 text-sm font-medium text-[#343434]">
                                Challenge: Complex Access Management
                            </div>
                            <h3 className="mb-1 text-xl font-semibold text-[#343434]">You need to configure access rules</h3>
                            <p className="text-sm text-gray-600">Setting up Cloudflare Access policies can be complex and time-consuming</p>
                        </div>

                        <div className="rounded-2xl border border-gray-200 bg-gray-50 p-6">
                            <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2">
                                {/* User */}
                                <div className="text-center">
                                    <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-gray-200">
                                        <Users className="h-6 w-6 text-gray-500" />
                                    </div>
                                    <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
                                        <div className="mb-1 text-xs text-gray-500">Random User</div>
                                        <div className="text-sm font-medium text-[#343434]">"I wonder if staging.coolapp.com exists?"</div>
                                    </div>
                                </div>

                                {/* Browser/Site */}
                                <div>
                                    <div className="rounded-2xl border border-gray-200 bg-white shadow-lg">
                                        <div className="flex items-center justify-between rounded-t-2xl border-b border-gray-100 bg-gray-50 px-4 py-3">
                                            <div className="flex space-x-2">
                                                <div className="h-3 w-3 rounded-full bg-gray-300"></div>
                                                <div className="h-3 w-3 rounded-full bg-gray-300"></div>
                                                <div className="h-3 w-3 rounded-full bg-gray-300"></div>
                                            </div>
                                            <div className="font-mono text-sm text-gray-600">staging.coolapp.com</div>
                                            <div className="w-16"></div>
                                        </div>
                                        <div className="p-6">
                                            {/* Website Layout Mock */}
                                            <div className="mb-4 rounded-lg bg-gray-100 p-4">
                                                <div className="mb-3 flex items-center justify-between">
                                                    <div className="flex space-x-2">
                                                        <div className="h-2 w-2 rounded-full bg-gray-300"></div>
                                                        <div className="h-2 w-2 rounded-full bg-gray-300"></div>
                                                        <div className="h-2 w-2 rounded-full bg-gray-300"></div>
                                                    </div>
                                                    <div className="text-xs text-gray-500">CoolApp</div>
                                                </div>
                                                <div className="space-y-2">
                                                    <div className="h-2 w-3/4 rounded bg-gray-300"></div>
                                                    <div className="h-2 w-1/2 rounded bg-gray-300"></div>
                                                    <div className="h-2 w-2/3 rounded bg-gray-300"></div>
                                                </div>
                                                <div className="mt-4 text-center">
                                                    <div className="inline-flex items-center rounded-full bg-[#FFCD45] px-3 py-1">
                                                        <div className="text-xs font-medium text-[#343434]">Under Development</div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="text-center">
                                                <h4 className="mb-3 font-semibold text-[#343434]">Full Access Granted</h4>
                                                <p className="mb-4 text-sm leading-relaxed text-gray-600">
                                                    Complete access to your development environment, database, and sensitive data
                                                </p>
                                                <div className="rounded-xl bg-gray-100 px-4 py-2 text-xs font-medium text-[#343434]">
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
                    <div
                        className={`my-8 flex justify-center transition-all delay-1000 duration-1000 ${visibleSections['how-it-works'] ? 'scale-100 opacity-100' : 'scale-75 opacity-0'}`}
                    >
                        <div className="relative">
                            {/* Animated Shield Rings */}
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="h-32 w-32 animate-ping rounded-full border-2 border-[#FFCD45]/30"></div>
                            </div>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div
                                    className="h-24 w-24 animate-pulse rounded-full border-2 border-[#FFCD45]/50"
                                    style={{ animationDelay: '0.5s' }}
                                ></div>
                            </div>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div
                                    className="h-40 w-40 animate-pulse rounded-full border border-[#FFCD45]/20"
                                    style={{ animationDelay: '1s' }}
                                ></div>
                            </div>

                            {/* Central Protection Core */}
                            <div className="relative rounded-3xl border-4 border-[#FFCD45]/30 p-8 px-16 shadow-2xl">
                                {/* Shield Icon Background */}
                                <div className="absolute inset-0 flex items-center justify-center opacity-10">
                                    <Shield className="h-20 w-20 text-[#343434]" />
                                </div>

                                <div className="relative text-center">
                                    <img className="mx-auto mb-2 h-8 w-auto drop-shadow-sm" src="/stnel-logo.svg" alt="Stnel" />
                                    <div className="text-sm font-bold text-[#343434]">ACTIVATED</div>
                                </div>

                                {/* Scanning Line Effect */}
                                <div className="absolute inset-0 overflow-hidden rounded-3xl">
                                    <div
                                        className="absolute inset-x-0 h-1 -translate-y-4 transform animate-pulse bg-gradient-to-r from-transparent via-white/40 to-transparent"
                                        style={{
                                            animation: 'scan 2s ease-in-out infinite',
                                            animationDelay: '1.5s',
                                        }}
                                    ></div>
                                </div>
                            </div>

                            {/* Protective Barrier Indicators */}
                            <div className="absolute -top-2 -left-2 h-4 w-4 animate-pulse rounded-full bg-[#FFCD45]"></div>
                            <div
                                className="absolute -top-2 -right-2 h-4 w-4 animate-pulse rounded-full bg-[#FFCD45]"
                                style={{ animationDelay: '0.3s' }}
                            ></div>
                            <div
                                className="absolute -bottom-2 -left-2 h-4 w-4 animate-pulse rounded-full bg-[#FFCD45]"
                                style={{ animationDelay: '0.6s' }}
                            ></div>
                            <div
                                className="absolute -right-2 -bottom-2 h-4 w-4 animate-pulse rounded-full bg-[#FFCD45]"
                                style={{ animationDelay: '0.9s' }}
                            ></div>
                        </div>
                    </div>

                    {/* Add custom CSS for scanning effect */}
                    <style jsx>{`
                        @keyframes scan {
                            0% {
                                top: -10%;
                                opacity: 0;
                            }
                            10% {
                                opacity: 1;
                            }
                            90% {
                                opacity: 1;
                            }
                            100% {
                                top: 110%;
                                opacity: 0;
                            }
                        }
                    `}</style>

                    {/* Step 2: Protected Access Flow */}
                    <div
                        className={`transition-all delay-1500 duration-1000 ${visibleSections['how-it-works'] ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}
                    >
                        <div className="mb-6 text-center">
                            <div className="mb-3 inline-flex items-center rounded-full bg-[#FFCD45]/10 px-4 py-2 text-sm font-medium text-[#343434]">
                                Solution: Stnel Protected
                            </div>
                            <h3 className="mb-1 text-xl font-semibold text-[#343434]">Now the same user tries to access</h3>
                            <p className="text-sm text-gray-600">Cloudflare Access challenges unauthorized visitors</p>
                        </div>

                        <div className="space-y-8">
                            {/* Access Challenge */}
                            <div className="rounded-2xl border border-gray-200 bg-gray-50 p-6">
                                <div className="grid grid-cols-1 items-center gap-6 lg:grid-cols-2">
                                    {/* User */}
                                    <div className="text-center">
                                        <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-gray-200">
                                            <Users className="h-6 w-6 text-gray-500" />
                                        </div>
                                        <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
                                            <div className="mb-1 text-xs text-gray-500">Same Random User</div>
                                            <div className="text-sm font-medium text-[#343434]">"Hmm, it's asking for verification..."</div>
                                        </div>
                                    </div>

                                    {/* Access Challenge Screen */}
                                    <div>
                                        <div className="rounded-2xl border border-gray-200 bg-white shadow-lg">
                                            <div className="flex items-center justify-between rounded-t-2xl border-b border-gray-100 bg-gray-50 px-4 py-3">
                                                <div className="flex space-x-2">
                                                    <div className="h-3 w-3 rounded-full bg-gray-300"></div>
                                                    <div className="h-3 w-3 rounded-full bg-gray-300"></div>
                                                    <div className="h-3 w-3 rounded-full bg-gray-300"></div>
                                                </div>
                                                <div className="font-mono text-sm text-gray-600">staging.coolapp.com</div>
                                                <div className="w-16"></div>
                                            </div>
                                            <div className="p-8">
                                                <div className="text-center">
                                                    <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#FFCD45]/10">
                                                        <Shield className="h-8 w-8 text-[#FFCD45]" />
                                                    </div>
                                                    <h4 className="mb-6 font-semibold text-[#343434]">Access Verification Required</h4>
                                                    <div className="mx-auto max-w-sm space-y-4">
                                                        <div className="rounded-xl bg-gray-50 p-4">
                                                            <input
                                                                type="email"
                                                                placeholder="Enter your email"
                                                                className="w-full bg-transparent text-sm text-gray-600"
                                                                disabled
                                                            />
                                                        </div>
                                                        <button className="w-full rounded-xl bg-[#FFCD45] py-3 text-sm font-medium text-[#343434] transition-colors hover:bg-[#FFD700]">
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
                            <div
                                className={`rounded-3xl border border-[#FFCD45]/20 bg-[#FFCD45]/5 p-8 transition-all delay-2500 duration-1000 ${visibleSections['how-it-works'] ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}
                            >
                                <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2">
                                    {/* Authorized User */}
                                    <div className="text-center">
                                        <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-[#FFCD45]">
                                            <Users className="h-10 w-10 text-[#343434]" />
                                        </div>
                                        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                                            <div className="mb-2 text-sm font-medium text-[#FFCD45]">Authorized User</div>
                                            <div className="font-medium text-[#343434]">"Let me check the staging site"</div>
                                        </div>
                                    </div>

                                    {/* Successful Access */}
                                    <div>
                                        <div className="rounded-2xl border border-gray-200 bg-white shadow-lg">
                                            <div className="flex items-center justify-between rounded-t-2xl border-b border-gray-100 bg-[#FFCD45]/10 px-4 py-3">
                                                <div className="flex space-x-2">
                                                    <div className="h-3 w-3 rounded-full bg-[#FFCD45]"></div>
                                                    <div className="h-3 w-3 rounded-full bg-[#FFCD45]"></div>
                                                    <div className="h-3 w-3 rounded-full bg-[#FFCD45]"></div>
                                                </div>
                                                <div className="font-mono text-sm text-gray-600">staging.coolapp.com</div>
                                                <div className="w-16"></div>
                                            </div>
                                            <div className="p-8">
                                                <div className="text-center">
                                                    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#FFCD45]/20">
                                                        <CheckCircle className="h-6 w-6 text-[#FFCD45]" />
                                                    </div>
                                                    <h4 className="mb-3 font-semibold text-[#343434]">Access Granted</h4>
                                                    <p className="mb-4 leading-relaxed text-gray-600">Authorized team member verified via email</p>
                                                    <div className="rounded-xl border border-[#FFCD45]/20 bg-[#FFCD45]/10 px-4 py-2 text-sm font-medium text-[#343434]">
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
                    <div
                        className={`mt-12 text-center transition-all delay-3000 duration-1000 ${visibleSections['how-it-works'] ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}
                    >
                        <div className="rounded-2xl border border-[#FFCD45]/10 bg-[#FFCD45]/5 p-8">
                            <h3 className="mb-4 text-2xl font-bold text-[#343434]">That's the power of Stnel</h3>
                            <p className="mx-auto mb-6 max-w-2xl text-lg text-gray-600">
                                Transform any website into a secure, protected environment where only authorized users can access your sensitive
                                development work.
                            </p>

                            <div className="mb-8 grid grid-cols-3 gap-6">
                                <div>
                                    <div className="mb-1 text-2xl font-bold text-[#FFCD45]">5min</div>
                                    <div className="text-xs text-gray-600">Setup time</div>
                                </div>
                                <div>
                                    <div className="mb-1 text-2xl font-bold text-[#FFCD45]">Email + SMS</div>
                                    <div className="text-xs text-gray-600">Multi-factor auth</div>
                                </div>
                                <div>
                                    <div className="mb-1 text-2xl font-bold text-[#FFCD45]">100%</div>
                                    <div className="text-xs text-gray-600">Protection coverage</div>
                                </div>
                            </div>

                            <Link
                                href={auth.user ? dashboard() : login()}
                                className="group inline-flex transform items-center rounded-2xl bg-[#FFCD45] px-6 py-3 text-base font-semibold text-[#343434] shadow-lg transition-all duration-200 hover:scale-105 hover:bg-[#FFD700] hover:shadow-xl"
                            >
                                Protect Your Sites Now
                                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

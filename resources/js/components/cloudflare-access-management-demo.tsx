import { dashboard, login } from '@/routes';
import { type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { ArrowRight, Check, ChevronRight, Lock, Mail, MessageCircle, Settings } from 'lucide-react';
import { useEffect, useState } from 'react';

interface CloudflareAccessManagementDemoProps {
    visibleSections: Record<string, boolean>;
}

export default function CloudflareAccessManagementDemo({ visibleSections }: CloudflareAccessManagementDemoProps) {
    const { auth } = usePage<SharedData>().props;
    const [activeStep, setActiveStep] = useState(0);

    useEffect(() => {
        if (visibleSections['how-it-works']) {
            const interval = setInterval(() => {
                setActiveStep((prev) => (prev + 1) % 3);
            }, 3000);
            return () => clearInterval(interval);
        }
    }, [visibleSections]);

    return (
        <section id="how-it-works" className="relative bg-gradient-to-b from-white to-gray-50 py-20" data-observe>
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                {/* Header */}
                <div className="mx-auto mb-16 max-w-3xl text-center">
                    <h2 className="mb-4 text-4xl font-bold text-[#343434]">Your Cloudflare Access Control Center</h2>
                    <p className="text-lg text-gray-600">
                        Configure access policies, receive instant notifications, and apply protection to your websites through our intuitive
                        interface
                    </p>
                </div>

                {/* Main Animation Container */}
                <div className="mx-auto max-w-5xl">
                    <div
                        className={`transition-all duration-1000 ${visibleSections['how-it-works'] ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}
                    >
                        {/* Compact 3-Step Flow */}
                        <div className="mb-12 rounded-3xl border border-gray-200 bg-white p-8 shadow-lg">
                            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                                {/* Step 1: Configure */}
                                <div
                                    className={`relative transition-all duration-500 ${
                                        activeStep === 0 ? 'scale-105 opacity-100' : 'scale-100 opacity-70'
                                    }`}
                                >
                                    <div className="mb-4 text-center">
                                        <div
                                            className={`mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full transition-colors duration-500 ${
                                                activeStep === 0 ? 'bg-[#F38020] text-white' : 'bg-gray-200 text-gray-500'
                                            }`}
                                        >
                                            <span className="font-bold">1</span>
                                        </div>
                                        <h3 className="text-sm font-semibold text-[#343434]">Configure Protection</h3>
                                    </div>

                                    <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
                                        <div className="mb-3 flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-[#FFCD45]/20">
                                                    <Settings className="h-3 w-3 text-[#FFCD45]" />
                                                </div>
                                                <span className="text-xs font-medium text-gray-700">Stnel Dashboard</span>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between rounded-lg bg-white px-2 py-1">
                                                <span className="text-xs text-gray-600">staging.app.com</span>
                                                {activeStep === 0 ? (
                                                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-t-[#FFCD45] border-r-[#FFCD45] border-b-transparent border-l-transparent"></div>
                                                ) : (
                                                    <Check className="h-4 w-4 text-green-500" />
                                                )}
                                            </div>
                                        </div>
                                        <div className="mt-3 text-center text-xs text-gray-500">
                                            {activeStep === 0 ? 'Applying policy...' : 'Policy active'}
                                        </div>
                                    </div>

                                    {/* Arrow to next step */}
                                    <div className="absolute top-1/2 -right-6 z-10 hidden -translate-y-1/2 transform md:block">
                                        <ChevronRight
                                            className={`h-6 w-6 transition-colors duration-500 ${
                                                activeStep >= 1 ? 'text-[#F38020]' : 'text-gray-300'
                                            }`}
                                        />
                                    </div>
                                </div>

                                {/* Step 2: User Access */}
                                <div
                                    className={`relative transition-all duration-500 ${
                                        activeStep === 1 ? 'scale-105 opacity-100' : 'scale-100 opacity-70'
                                    }`}
                                >
                                    <div className="mb-4 text-center">
                                        <div
                                            className={`mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full transition-colors duration-500 ${
                                                activeStep === 1 ? 'bg-[#F38020] text-white' : 'bg-gray-200 text-gray-500'
                                            }`}
                                        >
                                            <span className="font-bold">2</span>
                                        </div>
                                        <h3 className="text-sm font-semibold text-[#343434]">User Authentication</h3>
                                    </div>

                                    <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
                                        <div className="text-center">
                                            <div className="mx-auto mb-2 flex h-8 w-8 items-center justify-center rounded-lg bg-[#F38020]/20">
                                                <Lock className="h-4 w-4 text-[#F38020]" />
                                            </div>
                                            <div className="mb-2 text-xs font-medium text-gray-700">staging.app.com</div>

                                            <div className="space-y-2 rounded-lg bg-white p-2">
                                                <input
                                                    type="text"
                                                    placeholder="Email"
                                                    className="w-full rounded border border-gray-200 px-2 py-1 text-xs"
                                                    disabled
                                                />
                                                <div className="flex justify-center gap-1">
                                                    {Array.from({ length: 6 }).map((_, i) => (
                                                        <div
                                                            key={i}
                                                            className={`h-1.5 w-1.5 rounded-full transition-colors duration-500 ${
                                                                activeStep === 1 ? 'bg-[#F38020]' : 'bg-gray-300'
                                                            }`}
                                                        ></div>
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="mt-2 text-xs text-gray-500">
                                                {activeStep === 1 ? 'Verifying credentials...' : 'Protected by Cloudflare'}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Arrow to next step */}
                                    <div className="absolute top-1/2 -right-6 z-10 hidden -translate-y-1/2 transform md:block">
                                        <ChevronRight
                                            className={`h-6 w-6 transition-colors duration-500 ${
                                                activeStep >= 2 ? 'text-[#F38020]' : 'text-gray-300'
                                            }`}
                                        />
                                    </div>
                                </div>

                                {/* Step 3: Notification */}
                                <div
                                    className={`relative transition-all duration-500 ${
                                        activeStep === 2 ? 'scale-105 opacity-100' : 'scale-100 opacity-70'
                                    }`}
                                >
                                    <div className="mb-4 text-center">
                                        <div
                                            className={`mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full transition-colors duration-500 ${
                                                activeStep === 2 ? 'bg-[#F38020] text-white' : 'bg-gray-200 text-gray-500'
                                            }`}
                                        >
                                            <span className="font-bold">3</span>
                                        </div>
                                        <h3 className="text-sm font-semibold text-[#343434]">Instant Notification</h3>
                                    </div>

                                    <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
                                        <div className="space-y-3">
                                            {/* Email notification */}
                                            <div
                                                className={`rounded-lg border-l-2 bg-white p-2 transition-all duration-500 ${
                                                    activeStep === 2 ? 'border-[#FFCD45] shadow-sm' : 'border-gray-200'
                                                }`}
                                            >
                                                <div className="flex items-center gap-2">
                                                    <Mail className="h-4 w-4 text-[#FFCD45]" />
                                                    <div className="flex-1">
                                                        <div className="text-xs font-medium text-gray-700">Email Alert</div>
                                                        <div className="text-xs text-gray-500">john@company.com accessed</div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Slack notification */}
                                            <div
                                                className={`rounded-lg border-l-2 bg-white p-2 transition-all duration-500 ${
                                                    activeStep === 2 ? 'border-[#FFCD45] shadow-sm' : 'border-gray-200'
                                                }`}
                                            >
                                                <div className="flex items-center gap-2">
                                                    <MessageCircle className="h-4 w-4 text-[#FFCD45]" />
                                                    <div className="flex-1">
                                                        <div className="text-xs font-medium text-gray-700">Slack</div>
                                                        <div className="text-xs text-gray-500">#security channel</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mt-3 text-center text-xs text-gray-500">
                                            {activeStep === 2 ? 'Notifications sent!' : 'Real-time alerts'}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Cloudflare Logo in center bottom */}
                            <div className="mt-6 flex justify-center border-t border-gray-100 pt-6">
                                <div className="flex items-center gap-2">
                                    <span className="text-xs text-gray-400">Powered by</span>
                                    <img src="/cloudflare-logo.svg" alt="Cloudflare" className="h-8 w-8" />
                                    <span className="text-xs text-gray-400">Access</span>
                                </div>
                            </div>
                        </div>

                        {/* Step Progress */}
                        <div className="flex items-center justify-center gap-4">
                            <div className="text-center">
                                <div className="flex items-center gap-3">
                                    {['Configure', 'Authenticate', 'Notify'].map((label, index) => (
                                        <div key={index} className="flex items-center">
                                            <div className={`transition-all duration-500 ${activeStep === index ? 'opacity-100' : 'opacity-50'}`}>
                                                <div className="text-xs text-gray-500">{label}</div>
                                                <div
                                                    className={`mt-1 h-1 w-16 rounded-full transition-all duration-500 ${
                                                        activeStep >= index ? 'bg-[#F38020]' : 'bg-gray-200'
                                                    }`}
                                                ></div>
                                            </div>
                                            {index < 2 && <ChevronRight className="mx-1 h-4 w-4 text-gray-300" />}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="mt-12 text-center">
                            <Link
                                href={auth.user ? dashboard() : login()}
                                className="group inline-flex transform items-center rounded-2xl bg-[#FFCD45] px-6 py-3 text-base font-semibold text-[#343434] shadow-lg transition-all duration-200 hover:scale-105 hover:bg-[#FFD700] hover:shadow-xl"
                            >
                                {auth.user ? 'Manage Your Access' : 'Start Managing Access'}
                                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Custom CSS for animations */}
            <style jsx>{`
                @keyframes scan-vertical {
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
        </section>
    );
}

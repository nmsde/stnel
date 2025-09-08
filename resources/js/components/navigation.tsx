import { dashboard, login } from '@/routes';
import { type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { ArrowRight } from 'lucide-react';

interface NavigationProps {
    currentPage?: string;
}

export default function Navigation({ currentPage }: NavigationProps) {
    const { auth } = usePage<SharedData>().props;

    return (
        <nav className="relative z-50 border-b border-gray-100 bg-white/95 backdrop-blur-md">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                    <div className="flex items-center">
                        <Link href="/" className="flex-shrink-0">
                            <img className="h-8 w-auto" src="/stnel-logo.svg" alt="Stnel" />
                        </Link>
                        <div className="ml-8 hidden md:block">
                            <div className="flex items-baseline space-x-8">
                                <Link
                                    href="/"
                                    className={`px-3 py-2 text-sm font-medium transition-colors ${
                                        currentPage === 'home' ? 'text-[#343434]' : 'text-gray-600 hover:text-[#343434]'
                                    }`}
                                >
                                    Home
                                </Link>
                                <Link
                                    href="/use-cases"
                                    className={`px-3 py-2 text-sm font-medium transition-colors ${
                                        currentPage === 'use-cases' ? 'text-[#343434]' : 'text-gray-600 hover:text-[#343434]'
                                    }`}
                                >
                                    Use Cases
                                </Link>
                                <Link
                                    href="/about"
                                    className={`px-3 py-2 text-sm font-medium transition-colors ${
                                        currentPage === 'about' ? 'text-[#343434]' : 'text-gray-600 hover:text-[#343434]'
                                    }`}
                                >
                                    About
                                </Link>
                                <Link
                                    href="/why-cloudflare"
                                    className={`px-3 py-2 text-sm font-medium transition-colors ${
                                        currentPage === 'why-cloudflare' ? 'text-[#343434]' : 'text-gray-600 hover:text-[#343434]'
                                    }`}
                                >
                                    Why Cloudflare?
                                </Link>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center space-x-4">
                        {auth.user ? (
                            <Link
                                href={dashboard()}
                                className="inline-flex items-center rounded-xl bg-[#343434] px-6 py-2.5 text-sm font-medium text-white shadow-lg transition-all duration-200 hover:bg-[#2a2a2a] hover:shadow-xl"
                            >
                                Dashboard
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                        ) : (
                            <>
                                <Link href={login()} className="px-4 py-2 text-sm font-medium text-gray-600 transition-colors hover:text-[#343434]">
                                    Sign in
                                </Link>
                                <Link
                                    href={login()}
                                    className="inline-flex transform items-center rounded-xl bg-[#FFCD45] px-6 py-2.5 text-sm font-medium text-[#343434] shadow-lg transition-all duration-200 hover:scale-105 hover:bg-[#FFD700] hover:shadow-xl"
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
    );
}

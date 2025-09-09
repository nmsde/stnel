import { Link } from '@inertiajs/react';

export default function Footer() {
    return (
        <footer className="border-t border-gray-200 bg-white">
            <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
                <div className="mb-12 grid grid-cols-1 gap-8 md:grid-cols-4">
                    {/* Brand Column */}
                    <div className="md:col-span-2">
                        <div className="mb-4 flex items-center">
                            <img className="h-8 w-auto" src="/stnel-logo.svg" alt="Stnel" />
                        </div>
                        <p className="mb-6 max-w-md text-gray-600">
                            Intuitive dashboard for managing your Cloudflare Access policies. Streamline access management across all your domains.
                        </p>
                        <div className="flex items-center space-x-4">
                            <a href="mailto:hello@stnel.com" className="font-medium text-[#FFCD45] transition-colors hover:text-[#FFD700]">
                                hello@stnel.com
                            </a>
                        </div>
                    </div>

                    {/* Navigation Column */}
                    <div>
                        <h3 className="mb-4 font-semibold text-[#343434]">Navigation</h3>
                        <ul className="space-y-3 text-sm">
                            <li>
                                <Link href="/use-cases" className="text-gray-600 transition-colors hover:text-[#343434]">
                                    Use Cases
                                </Link>
                            </li>
                            <li>
                                <Link href="/#how-it-works" className="text-gray-600 transition-colors hover:text-[#343434]">
                                    How It Works
                                </Link>
                            </li>
                            <li>
                                <Link href="/#pricing" className="text-gray-600 transition-colors hover:text-[#343434]">
                                    Pricing
                                </Link>
                            </li>
                            <li>
                                <Link href="/cli" className="text-gray-600 transition-colors hover:text-[#343434]">
                                    CLI
                                </Link>
                            </li>
                            <li>
                                <Link href="/about" className="text-gray-600 transition-colors hover:text-[#343434]">
                                    About
                                </Link>
                            </li>
                            <li>
                                <Link href="/why-cloudflare" className="text-gray-600 transition-colors hover:text-[#343434]">
                                    Why Cloudflare?
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Legal Column */}
                    <div>
                        <h3 className="mb-4 font-semibold text-[#343434]">Legal</h3>
                        <ul className="space-y-3 text-sm">
                            <li>
                                <Link href="/privacy-policy" className="text-gray-600 transition-colors hover:text-[#343434]">
                                    Privacy Policy
                                </Link>
                            </li>
                            <li>
                                <Link href="/terms-of-service" className="text-gray-600 transition-colors hover:text-[#343434]">
                                    Terms of Service
                                </Link>
                            </li>
                            <li>
                                <a href="mailto:support@stnel.com" className="text-gray-600 transition-colors hover:text-[#343434]">
                                    Support
                                </a>
                            </li>
                            <li>
                                <a
                                    href="https://status.stnel.com"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-gray-600 transition-colors hover:text-[#343434]"
                                >
                                    Status
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-gray-200 pt-8">
                    <p className="text-center text-sm text-gray-500">&copy; 2025 Stnel. Making Cloudflare Access simple for everyone.</p>
                </div>
            </div>
        </footer>
    );
}

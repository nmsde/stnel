import { dashboard, login } from '@/routes';
import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { ArrowRight, Shield, Eye, Lock } from 'lucide-react';

export default function PrivacyPolicy() {
    const { auth } = usePage<SharedData>().props;

    return (
        <>
            <Head title="Privacy Policy - Stnel">
                <meta name="description" content="Read Stnel's Privacy Policy to understand how we collect, use, and protect your personal information." />
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
                <section className="relative pt-16 pb-12">
                    <div className="mx-auto max-w-4xl px-6 lg:px-8">
                        <div className="text-center mb-12">
                            <h1 className="text-4xl font-bold tracking-tight text-[#343434] sm:text-5xl">
                                Privacy Policy
                            </h1>
                            <p className="mt-4 text-lg text-gray-600">
                                Last updated: January 5, 2025
                            </p>
                        </div>

                        {/* Privacy Principles */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
                            <div className="text-center p-6 rounded-2xl bg-gray-50">
                                <Shield className="w-8 h-8 text-[#FFCD45] mx-auto mb-3" />
                                <h3 className="font-semibold text-[#343434] mb-2">Data Protection</h3>
                                <p className="text-sm text-gray-600">We protect your data with enterprise-grade security</p>
                            </div>
                            <div className="text-center p-6 rounded-2xl bg-gray-50">
                                <Eye className="w-8 h-8 text-[#FFCD45] mx-auto mb-3" />
                                <h3 className="font-semibold text-[#343434] mb-2">Transparency</h3>
                                <p className="text-sm text-gray-600">Clear information about what we collect and why</p>
                            </div>
                            <div className="text-center p-6 rounded-2xl bg-gray-50">
                                <Lock className="w-8 h-8 text-[#FFCD45] mx-auto mb-3" />
                                <h3 className="font-semibold text-[#343434] mb-2">Your Control</h3>
                                <p className="text-sm text-gray-600">You control your data and can delete it anytime</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Content */}
                <section className="pt-16 pb-32">
                    <div className="mx-auto max-w-4xl px-6 lg:px-8">
                        <div className="prose prose-xl prose-gray max-w-none prose-headings:text-[#343434] prose-headings:font-bold prose-h2:text-3xl prose-h2:mt-16 prose-h2:mb-8 prose-h3:text-xl prose-h3:mt-12 prose-h3:mb-6 prose-p:mb-8 prose-p:leading-loose prose-p:text-gray-700 prose-ul:mb-8 prose-ul:space-y-3 prose-li:leading-relaxed prose-a:text-[#FFCD45] prose-a:no-underline prose-a:font-medium hover:prose-a:text-[#FFD700] prose-strong:text-[#343434] prose-strong:font-semibold">
                            <h2>1. Information We Collect</h2>
                            
                            <h3>Account Information</h3>
                            <p>
                                When you create a Stnel account, we collect your email address and name through our authentication provider (WorkOS). 
                                We do not store passwords directly - authentication is handled securely through WorkOS.
                            </p>

                            <h3>Cloudflare API Tokens</h3>
                            <p>
                                To provide our service, you provide us with Cloudflare API tokens. These are encrypted and stored securely in our database. 
                                We only use these tokens to manage your Cloudflare Access policies and retrieve access logs as requested by you.
                            </p>

                            <h3>Usage Data</h3>
                            <p>
                                We collect information about how you use Stnel, including:
                            </p>
                            <ul>
                                <li>Which features you access</li>
                                <li>When you log in and out</li>
                                <li>Error logs to help us improve the service</li>
                                <li>Basic analytics to understand usage patterns</li>
                            </ul>

                            <h3>Access Logs</h3>
                            <p>
                                When you request to view access logs from Cloudflare, we temporarily retrieve and display this information. 
                                We do not permanently store Cloudflare access logs - they are fetched in real-time from Cloudflare's API.
                            </p>

                            <h2>2. How We Use Your Information</h2>
                            
                            <p>We use your information to:</p>
                            <ul>
                                <li><strong>Provide the Service:</strong> Manage your Cloudflare Access policies and display access logs</li>
                                <li><strong>Account Management:</strong> Authenticate you and manage your account settings</li>
                                <li><strong>Communication:</strong> Send important updates about the service</li>
                                <li><strong>Improvement:</strong> Analyze usage patterns to improve Stnel</li>
                                <li><strong>Security:</strong> Monitor for unauthorized access and security threats</li>
                                <li><strong>Compliance:</strong> Meet legal obligations and enforce our terms</li>
                            </ul>

                            <h2>3. Information Sharing</h2>
                            
                            <p>
                                We do not sell, trade, or rent your personal information to third parties. We may share your information only in these limited circumstances:
                            </p>
                            
                            <h3>Service Providers</h3>
                            <ul>
                                <li><strong>WorkOS:</strong> For authentication and user management</li>
                                <li><strong>Cloudflare:</strong> Your API tokens are used to access your Cloudflare account as authorized by you</li>
                                <li><strong>Hosting Providers:</strong> Our infrastructure providers who help us deliver the service</li>
                            </ul>

                            <h3>Legal Requirements</h3>
                            <p>
                                We may disclose your information if required by law, such as in response to a subpoena or court order, 
                                or to protect our rights or the safety of others.
                            </p>

                            <h2>4. Data Security</h2>
                            
                            <p>We protect your information using industry-standard security measures:</p>
                            <ul>
                                <li><strong>Encryption:</strong> All API tokens are encrypted at rest using AES-256</li>
                                <li><strong>HTTPS:</strong> All data transmission uses TLS encryption</li>
                                <li><strong>Access Controls:</strong> Strict access controls limit who can access your data</li>
                                <li><strong>Regular Security Reviews:</strong> We regularly review and update our security practices</li>
                            </ul>

                            <h2>5. Data Retention</h2>
                            
                            <p>
                                We retain your information for as long as your account is active or as needed to provide the service. 
                                When you delete your account, we will delete your personal information within 30 days, except where we are required to retain it by law.
                            </p>

                            <h2>6. Your Rights</h2>
                            
                            <p>You have the following rights regarding your personal information:</p>
                            <ul>
                                <li><strong>Access:</strong> Request a copy of the personal information we have about you</li>
                                <li><strong>Correction:</strong> Update or correct inaccurate information</li>
                                <li><strong>Deletion:</strong> Request deletion of your account and personal information</li>
                                <li><strong>Portability:</strong> Request your data in a machine-readable format</li>
                                <li><strong>Withdrawal:</strong> Withdraw consent for processing (where consent is the legal basis)</li>
                            </ul>

                            <p>To exercise these rights, contact us at <a href="mailto:privacy@stnel.com">privacy@stnel.com</a>.</p>

                            <h2>7. Cookies and Tracking</h2>
                            
                            <p>
                                We use essential cookies to provide the service, including session cookies for authentication. 
                                We do not use third-party tracking cookies or analytics services that track users across websites.
                            </p>

                            <h2>8. International Transfers</h2>
                            
                            <p>
                                Your information may be processed in countries other than your own. We ensure appropriate safeguards are in place 
                                to protect your privacy when your information is transferred internationally.
                            </p>

                            <h2>9. Children's Privacy</h2>
                            
                            <p>
                                Stnel is not intended for children under 13. We do not knowingly collect personal information from children under 13. 
                                If you believe we have collected information from a child under 13, please contact us immediately.
                            </p>

                            <h2>10. Changes to This Policy</h2>
                            
                            <p>
                                We may update this Privacy Policy from time to time. We will notify you of any material changes by email 
                                or by posting a notice on our website. Your continued use of Stnel after changes are posted constitutes acceptance of the updated policy.
                            </p>

                            <h2>11. Contact Us</h2>
                            
                            <p>
                                If you have questions about this Privacy Policy or our privacy practices, please contact us at:
                            </p>
                            <ul>
                                <li>Email: <a href="mailto:privacy@stnel.com">privacy@stnel.com</a></li>
                                <li>General inquiries: <a href="mailto:hello@stnel.com">hello@stnel.com</a></li>
                            </ul>
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
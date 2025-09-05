import { dashboard, login } from '@/routes';
import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { ArrowRight, FileText, Scale, AlertTriangle } from 'lucide-react';

export default function TermsOfService() {
    const { auth } = usePage<SharedData>().props;

    return (
        <>
            <Head title="Terms of Service - Stnel">
                <meta name="description" content="Read Stnel's Terms of Service to understand your rights and responsibilities when using our Cloudflare Access management platform." />
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
                                Terms of Service
                            </h1>
                            <p className="mt-4 text-lg text-gray-600">
                                Last updated: January 5, 2025
                            </p>
                        </div>

                        {/* Key Points */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
                            <div className="text-center p-6 rounded-2xl bg-gray-50">
                                <FileText className="w-8 h-8 text-[#FFCD45] mx-auto mb-3" />
                                <h3 className="font-semibold text-[#343434] mb-2">Clear Terms</h3>
                                <p className="text-sm text-gray-600">Straightforward terms without legal jargon</p>
                            </div>
                            <div className="text-center p-6 rounded-2xl bg-gray-50">
                                <Scale className="w-8 h-8 text-[#FFCD45] mx-auto mb-3" />
                                <h3 className="font-semibold text-[#343434] mb-2">Fair Usage</h3>
                                <p className="text-sm text-gray-600">Reasonable limits designed for real use cases</p>
                            </div>
                            <div className="text-center p-6 rounded-2xl bg-gray-50">
                                <AlertTriangle className="w-8 h-8 text-[#FFCD45] mx-auto mb-3" />
                                <h3 className="font-semibold text-[#343434] mb-2">Your Rights</h3>
                                <p className="text-sm text-gray-600">Know your rights and our responsibilities</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Content */}
                <section className="pt-16 pb-32">
                    <div className="mx-auto max-w-4xl px-6 lg:px-8">
                        <div className="prose prose-xl prose-gray max-w-none prose-headings:text-[#343434] prose-headings:font-bold prose-h2:text-3xl prose-h2:mt-16 prose-h2:mb-8 prose-h3:text-xl prose-h3:mt-12 prose-h3:mb-6 prose-p:mb-8 prose-p:leading-loose prose-p:text-gray-700 prose-ul:mb-8 prose-ul:space-y-3 prose-li:leading-relaxed prose-a:text-[#FFCD45] prose-a:no-underline prose-a:font-medium hover:prose-a:text-[#FFD700] prose-strong:text-[#343434] prose-strong:font-semibold">
                            <h2>1. Agreement to Terms</h2>
                            
                            <p>
                                By accessing or using Stnel, you agree to be bound by these Terms of Service ("Terms"). 
                                If you disagree with any part of these terms, then you may not access the service.
                            </p>

                            <h2>2. Description of Service</h2>
                            
                            <p>
                                Stnel is a web-based platform that simplifies the management of Cloudflare Access policies. 
                                Our service allows you to:
                            </p>
                            <ul>
                                <li>Manage Cloudflare Access applications and policies</li>
                                <li>Monitor access logs and user activity</li>
                                <li>Configure security settings for your applications</li>
                                <li>Organize multiple Cloudflare organizations</li>
                            </ul>

                            <p>
                                <strong>Important:</strong> Stnel is a third-party service that integrates with Cloudflare. 
                                We are not affiliated with or endorsed by Cloudflare Inc.
                            </p>

                            <h2>3. Account Registration</h2>
                            
                            <h3>Account Requirements</h3>
                            <p>To use Stnel, you must:</p>
                            <ul>
                                <li>Be at least 18 years old</li>
                                <li>Provide accurate and complete registration information</li>
                                <li>Have a valid Cloudflare account with appropriate permissions</li>
                                <li>Maintain the security of your account credentials</li>
                            </ul>

                            <h3>Account Responsibility</h3>
                            <p>
                                You are responsible for all activities that occur under your account. 
                                You must immediately notify us of any unauthorized use of your account.
                            </p>

                            <h2>4. API Token Usage</h2>
                            
                            <p>
                                To provide our service, you grant us permission to use your Cloudflare API tokens to:
                            </p>
                            <ul>
                                <li>Read and modify your Cloudflare Access policies</li>
                                <li>Retrieve access logs from your Cloudflare account</li>
                                <li>Access zone and application information</li>
                                <li>Validate token permissions and health</li>
                            </ul>

                            <p>
                                We will only use your API tokens as necessary to provide the service. 
                                You may revoke access at any time by deleting your API token from Stnel or revoking it in Cloudflare.
                            </p>

                            <h2>5. Acceptable Use Policy</h2>
                            
                            <h3>Permitted Use</h3>
                            <p>You may use Stnel for legitimate business purposes, including:</p>
                            <ul>
                                <li>Managing access to your own applications and websites</li>
                                <li>Providing security services to your clients (with their consent)</li>
                                <li>Testing and development of security configurations</li>
                            </ul>

                            <h3>Prohibited Activities</h3>
                            <p>You may not:</p>
                            <ul>
                                <li>Use the service for any illegal or unauthorized purpose</li>
                                <li>Attempt to gain unauthorized access to other users' accounts or data</li>
                                <li>Reverse engineer, decompile, or attempt to extract source code</li>
                                <li>Use the service to spam, phish, or distribute malware</li>
                                <li>Interfere with or disrupt the service or servers</li>
                                <li>Share your account credentials with others</li>
                                <li>Use the service to manage Cloudflare accounts you don't own or have permission to manage</li>
                            </ul>

                            <h2>6. Service Availability</h2>
                            
                            <p>
                                We strive to maintain high availability but cannot guarantee uninterrupted service. 
                                Stnel may be temporarily unavailable due to maintenance, updates, or unforeseen issues.
                            </p>

                            <p>
                                We will provide reasonable notice for planned maintenance when possible.
                            </p>

                            <h2>7. Data and Privacy</h2>
                            
                            <p>
                                Your privacy is important to us. Our collection and use of your information is governed by our 
                                <Link href="/privacy-policy" className="text-[#FFCD45] hover:text-[#FFD700]">Privacy Policy</Link>, 
                                which is incorporated into these Terms by reference.
                            </p>

                            <h2>8. Payment and Billing</h2>
                            
                            <p>
                                Stnel currently operates on a free tier. If we introduce paid plans in the future:
                            </p>
                            <ul>
                                <li>We will provide 30 days' notice before charging existing users</li>
                                <li>All charges are non-refundable unless required by law</li>
                                <li>Billing disputes must be reported within 60 days</li>
                                <li>We may suspend service for non-payment after reasonable notice</li>
                            </ul>

                            <h2>9. Intellectual Property</h2>
                            
                            <h3>Our Rights</h3>
                            <p>
                                Stnel and its original content, features, and functionality are owned by us and are protected by 
                                international copyright, trademark, patent, trade secret, and other intellectual property laws.
                            </p>

                            <h3>Your Rights</h3>
                            <p>
                                You retain all rights to your data and content. By using Stnel, you grant us a limited license to 
                                use your data solely to provide the service.
                            </p>

                            <h2>10. Limitation of Liability</h2>
                            
                            <p>
                                <strong>TO THE MAXIMUM EXTENT PERMITTED BY LAW:</strong>
                            </p>
                            <ul>
                                <li>Stnel is provided "as is" without warranties of any kind</li>
                                <li>We are not liable for any indirect, incidental, or consequential damages</li>
                                <li>Our total liability is limited to the amount you paid us in the 12 months preceding the claim</li>
                                <li>We are not responsible for data loss due to your actions or third-party services</li>
                            </ul>

                            <h2>11. Indemnification</h2>
                            
                            <p>
                                You agree to indemnify and hold us harmless from claims arising from:
                            </p>
                            <ul>
                                <li>Your use of the service</li>
                                <li>Your violation of these Terms</li>
                                <li>Your violation of any third-party rights</li>
                                <li>Your use of Cloudflare services through Stnel</li>
                            </ul>

                            <h2>12. Termination</h2>
                            
                            <h3>By You</h3>
                            <p>
                                You may terminate your account at any time by deleting it from your account settings. 
                                Upon termination, we will delete your data within 30 days.
                            </p>

                            <h3>By Us</h3>
                            <p>
                                We may terminate your account immediately if you:
                            </p>
                            <ul>
                                <li>Violate these Terms</li>
                                <li>Use the service for illegal activities</li>
                                <li>Pose a security risk to other users</li>
                                <li>Fail to pay fees (when applicable)</li>
                            </ul>

                            <h2>13. Changes to Terms</h2>
                            
                            <p>
                                We may modify these Terms at any time. We will notify you of material changes by:
                            </p>
                            <ul>
                                <li>Sending an email to your registered email address</li>
                                <li>Posting a notice on our website</li>
                                <li>Displaying a notification in the application</li>
                            </ul>

                            <p>
                                Your continued use of Stnel after changes are posted constitutes acceptance of the new Terms.
                            </p>

                            <h2>14. Dispute Resolution</h2>
                            
                            <p>
                                If you have a dispute with us, please contact us first at <a href="mailto:legal@stnel.com">legal@stnel.com</a>. 
                                We will attempt to resolve disputes through good faith negotiation.
                            </p>

                            <h2>15. Governing Law</h2>
                            
                            <p>
                                These Terms are governed by the laws of the jurisdiction in which Stnel operates, 
                                without regard to conflict of law principles.
                            </p>

                            <h2>16. Severability</h2>
                            
                            <p>
                                If any provision of these Terms is found to be unenforceable, the remaining provisions will remain in full force and effect.
                            </p>

                            <h2>17. Entire Agreement</h2>
                            
                            <p>
                                These Terms, together with our Privacy Policy, constitute the entire agreement between you and Stnel 
                                regarding the use of our service.
                            </p>

                            <h2>18. Contact Information</h2>
                            
                            <p>
                                If you have questions about these Terms, please contact us:
                            </p>
                            <ul>
                                <li>Email: <a href="mailto:legal@stnel.com">legal@stnel.com</a></li>
                                <li>General inquiries: <a href="mailto:hello@stnel.com">hello@stnel.com</a></li>
                            </ul>

                            <div className="mt-16 p-6 bg-[#FFCD45]/10 rounded-2xl border border-[#FFCD45]/20">
                                <h3 className="text-lg font-semibold text-[#343434] mb-3">
                                    Questions About These Terms?
                                </h3>
                                <p className="text-gray-700 mb-4">
                                    We believe in transparency. If anything in these Terms is unclear or you have questions, 
                                    we're happy to explain in plain language.
                                </p>
                                <a 
                                    href="mailto:legal@stnel.com" 
                                    className="inline-flex items-center text-[#343434] font-medium hover:text-[#FFCD45] transition-colors"
                                >
                                    Contact Legal Team
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </a>
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
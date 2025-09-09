import Footer from '@/components/footer';
import Navigation from '@/components/navigation';
import { type SharedData } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { Eye, Lock, Shield } from 'lucide-react';

export default function PrivacyPolicy() {
    const { auth } = usePage<SharedData>().props;

    return (
        <>
            <Head title="Privacy Policy | Data Protection & Security - Stnel Cloudflare Access Management">
                <meta
                    name="description"
                    content="Comprehensive privacy policy for Stnel's Cloudflare Access management platform. Learn how we protect your data, handle API tokens securely, and maintain enterprise-grade security for zero trust access management."
                />
                <meta
                    name="keywords"
                    content="Privacy Policy, Data Protection, Cloudflare API Token Security, Zero Trust Privacy, Enterprise Security Privacy, GDPR Compliance, Data Encryption, Access Management Privacy, Security Policy, User Data Protection, API Token Encryption, Privacy Rights, Data Retention Policy"
                />
                <meta property="og:title" content="Stnel Privacy Policy | Enterprise Data Protection Standards" />
                <meta
                    property="og:description"
                    content="Transparent privacy practices for Cloudflare Access management. Enterprise-grade data protection with encrypted API tokens and strict security controls."
                />
                <meta property="og:type" content="website" />
                <meta property="og:image" content="/logo-cloud.svg" />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content="Privacy Policy - Enterprise Data Protection | Stnel" />
                <meta
                    name="twitter:description"
                    content="Read how Stnel protects your Cloudflare Access data with enterprise security, encrypted storage, and transparent privacy practices."
                />
                <meta name="twitter:image" content="/logo-cloud.svg" />
                <meta name="robots" content="index, follow" />
                <link rel="canonical" href="https://stnel.com/privacy-policy" />
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=inter:400,500,600,700" rel="stylesheet" />
            </Head>

            <div className="bg-white">
                <Navigation />

                {/* Hero Section */}
                <section className="relative pt-16 pb-12">
                    <div className="mx-auto max-w-4xl px-6 lg:px-8">
                        <div className="mb-12 text-center">
                            <h1 className="text-4xl font-bold tracking-tight text-[#343434] sm:text-5xl">Privacy Policy</h1>
                            <p className="mt-4 text-lg text-gray-600">Last updated: January 5, 2025</p>
                        </div>

                        {/* Privacy Principles */}
                        <div className="mb-16 grid grid-cols-1 gap-6 md:grid-cols-3">
                            <div className="rounded-2xl bg-gray-50 p-6 text-center">
                                <Shield className="mx-auto mb-3 h-8 w-8 text-[#FFCD45]" />
                                <h3 className="mb-2 font-semibold text-[#343434]">Data Protection</h3>
                                <p className="text-sm text-gray-600">We protect your data with enterprise-grade security</p>
                            </div>
                            <div className="rounded-2xl bg-gray-50 p-6 text-center">
                                <Eye className="mx-auto mb-3 h-8 w-8 text-[#FFCD45]" />
                                <h3 className="mb-2 font-semibold text-[#343434]">Transparency</h3>
                                <p className="text-sm text-gray-600">Clear information about what we collect and why</p>
                            </div>
                            <div className="rounded-2xl bg-gray-50 p-6 text-center">
                                <Lock className="mx-auto mb-3 h-8 w-8 text-[#FFCD45]" />
                                <h3 className="mb-2 font-semibold text-[#343434]">Your Control</h3>
                                <p className="text-sm text-gray-600">You control your data and can delete it anytime</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Content */}
                <section className="pt-16 pb-32">
                    <div className="mx-auto max-w-4xl px-6 lg:px-8">
                        <div className="prose prose-xl prose-gray prose-headings:text-[#343434] prose-headings:font-bold prose-h2:text-3xl prose-h2:mt-16 prose-h2:mb-8 prose-h3:text-xl prose-h3:mt-12 prose-h3:mb-6 prose-p:mb-8 prose-p:leading-loose prose-p:text-gray-700 prose-ul:mb-8 prose-ul:space-y-3 prose-li:leading-relaxed prose-a:text-[#FFCD45] prose-a:no-underline prose-a:font-medium hover:prose-a:text-[#FFD700] prose-strong:text-[#343434] prose-strong:font-semibold max-w-none">
                            <h2>1. Information We Collect</h2>

                            <h3>Account Information</h3>
                            <p>
                                When you create a Stnel account, we collect your email address and name through our authentication provider (WorkOS).
                                We do not store passwords directly - authentication is handled securely through WorkOS.
                            </p>

                            <h3>Cloudflare API Tokens</h3>
                            <p>
                                To provide our service, you provide us with Cloudflare API tokens. These are encrypted and stored securely in our
                                database. We only use these tokens to manage your Cloudflare Access policies and retrieve access logs as requested by
                                you.
                            </p>

                            <h3>Usage Data</h3>
                            <p>We collect information about how you use Stnel, including:</p>
                            <ul>
                                <li>Which features you access</li>
                                <li>When you log in and out</li>
                                <li>Error logs to help us improve the service</li>
                                <li>Basic analytics to understand usage patterns</li>
                            </ul>

                            <h3>Access Logs</h3>
                            <p>
                                When you request to view access logs from Cloudflare, we temporarily retrieve and display this information. We do not
                                permanently store Cloudflare access logs - they are fetched in real-time from Cloudflare's API.
                            </p>

                            <h2>2. How We Use Your Information</h2>

                            <p>We use your information to:</p>
                            <ul>
                                <li>
                                    <strong>Provide the Service:</strong> Manage your Cloudflare Access policies and display access logs
                                </li>
                                <li>
                                    <strong>Account Management:</strong> Authenticate you and manage your account settings
                                </li>
                                <li>
                                    <strong>Communication:</strong> Send important updates about the service
                                </li>
                                <li>
                                    <strong>Improvement:</strong> Analyze usage patterns to improve Stnel
                                </li>
                                <li>
                                    <strong>Security:</strong> Monitor for unauthorized access and security threats
                                </li>
                                <li>
                                    <strong>Compliance:</strong> Meet legal obligations and enforce our terms
                                </li>
                            </ul>

                            <h2>3. Information Sharing</h2>

                            <p>
                                We do not sell, trade, or rent your personal information to third parties. We may share your information only in these
                                limited circumstances:
                            </p>

                            <h3>Service Providers</h3>
                            <ul>
                                <li>
                                    <strong>WorkOS:</strong> For authentication and user management
                                </li>
                                <li>
                                    <strong>Cloudflare:</strong> Your API tokens are used to access your Cloudflare account as authorized by you
                                </li>
                                <li>
                                    <strong>Hosting Providers:</strong> Our infrastructure providers who help us deliver the service
                                </li>
                            </ul>

                            <h3>Legal Requirements</h3>
                            <p>
                                We may disclose your information if required by law, such as in response to a subpoena or court order, or to protect
                                our rights or the safety of others.
                            </p>

                            <h2>4. Data Security</h2>

                            <p>We protect your information using industry-standard security measures:</p>
                            <ul>
                                <li>
                                    <strong>Encryption:</strong> All API tokens are encrypted at rest using AES-256
                                </li>
                                <li>
                                    <strong>HTTPS:</strong> All data transmission uses TLS encryption
                                </li>
                                <li>
                                    <strong>Access Controls:</strong> Strict access controls limit who can access your data
                                </li>
                                <li>
                                    <strong>Regular Security Reviews:</strong> We regularly review and update our security practices
                                </li>
                            </ul>

                            <h2>5. Data Retention</h2>

                            <p>
                                We retain your information for as long as your account is active or as needed to provide the service. When you delete
                                your account, we will delete your personal information within 30 days, except where we are required to retain it by
                                law.
                            </p>

                            <h2>6. Your Rights</h2>

                            <p>You have the following rights regarding your personal information:</p>
                            <ul>
                                <li>
                                    <strong>Access:</strong> Request a copy of the personal information we have about you
                                </li>
                                <li>
                                    <strong>Correction:</strong> Update or correct inaccurate information
                                </li>
                                <li>
                                    <strong>Deletion:</strong> Request deletion of your account and personal information
                                </li>
                                <li>
                                    <strong>Portability:</strong> Request your data in a machine-readable format
                                </li>
                                <li>
                                    <strong>Withdrawal:</strong> Withdraw consent for processing (where consent is the legal basis)
                                </li>
                            </ul>

                            <p>
                                To exercise these rights, contact us at <a href="mailto:privacy@stnel.com">privacy@stnel.com</a>.
                            </p>

                            <h2>7. Cookies and Tracking</h2>

                            <p>
                                We use essential cookies to provide the service, including session cookies for authentication. We do not use
                                third-party tracking cookies or analytics services that track users across websites.
                            </p>

                            <h2>8. International Transfers</h2>

                            <p>
                                Your information may be processed in countries other than your own. We ensure appropriate safeguards are in place to
                                protect your privacy when your information is transferred internationally.
                            </p>

                            <h2>9. Children's Privacy</h2>

                            <p>
                                Stnel is not intended for children under 13. We do not knowingly collect personal information from children under 13.
                                If you believe we have collected information from a child under 13, please contact us immediately.
                            </p>

                            <h2>10. Changes to This Policy</h2>

                            <p>
                                We may update this Privacy Policy from time to time. We will notify you of any material changes by email or by posting
                                a notice on our website. Your continued use of Stnel after changes are posted constitutes acceptance of the updated
                                policy.
                            </p>

                            <h2>11. Contact Us</h2>

                            <p>If you have questions about this Privacy Policy or our privacy practices, please contact us at:</p>
                            <ul>
                                <li>
                                    Email: <a href="mailto:privacy@stnel.com">privacy@stnel.com</a>
                                </li>
                                <li>
                                    General inquiries: <a href="mailto:hello@stnel.com">hello@stnel.com</a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </section>

                <Footer />
            </div>
        </>
    );
}

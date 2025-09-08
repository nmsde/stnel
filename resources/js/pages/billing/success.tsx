import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { index as billing } from '@/routes/billing';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { ArrowRight, CheckCircle } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Billing',
        href: '/settings/billing',
    },
    {
        title: 'Success',
        href: '/billing/success',
    },
];

export default function BillingSuccess() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Subscription Successful" />

            <div className="flex min-h-screen items-center justify-center px-4">
                <Card className="w-full max-w-md">
                    <CardHeader className="text-center">
                        <div className="mb-4 flex justify-center">
                            <div className="rounded-full bg-green-100 p-3">
                                <CheckCircle className="h-8 w-8 text-green-600" />
                            </div>
                        </div>
                        <CardTitle className="text-2xl">Subscription Successful!</CardTitle>
                        <CardDescription>Welcome to Stnel Pro! Your subscription is now active.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2 text-center">
                            <p className="text-sm text-muted-foreground">You now have access to:</p>
                            <ul className="space-y-1 text-sm">
                                <li>• Unlimited organizations</li>
                                <li>• Unlimited protected endpoints</li>
                                <li>• Priority support</li>
                                <li>• Advanced features</li>
                            </ul>
                        </div>

                        <div className="flex flex-col gap-3">
                            <Button asChild>
                                <Link href={dashboard()}>
                                    Go to Dashboard
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Link>
                            </Button>

                            <Button variant="outline" asChild>
                                <Link href={billing().url}>View Billing Settings</Link>
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}

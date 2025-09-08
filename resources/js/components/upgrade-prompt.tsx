import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { index as billing } from '@/routes/billing';
import { Link } from '@inertiajs/react';
import { AlertTriangle, ArrowRight, Zap } from 'lucide-react';

interface UpgradePromptProps {
    type: 'organizations' | 'endpoints';
    current: number;
    limit: number;
    unlimited?: boolean;
    variant?: 'warning' | 'limit-reached' | 'suggestion';
    className?: string;
}

export default function UpgradePrompt({ type, current, limit, unlimited = false, variant = 'suggestion', className }: UpgradePromptProps) {
    if (unlimited || limit === -1) {
        return null;
    }

    const percentage = Math.min((current / limit) * 100, 100);
    const isAtLimit = current >= limit;
    const isNearLimit = percentage >= 80;

    // Don't show suggestion variant if not near limit
    if (variant === 'suggestion' && !isNearLimit && !isAtLimit) {
        return null;
    }

    const getVariantConfig = () => {
        switch (variant) {
            case 'limit-reached':
                return {
                    cardClass: 'border-red-200 bg-red-50',
                    icon: <AlertTriangle className="h-5 w-5 text-red-600" />,
                    titleClass: 'text-red-900',
                    title: `${type === 'organizations' ? 'Organization' : 'Endpoint'} Limit Reached`,
                    description: `You've reached your limit of ${limit} ${type === 'organizations' ? 'organizations' : 'protected endpoints'}. Upgrade to Pro for unlimited access.`,
                    buttonText: 'Upgrade Now',
                    buttonVariant: 'default' as const,
                };
            case 'warning':
                return {
                    cardClass: 'border-orange-200 bg-orange-50',
                    icon: <AlertTriangle className="h-5 w-5 text-orange-600" />,
                    titleClass: 'text-orange-900',
                    title: `Approaching ${type === 'organizations' ? 'Organization' : 'Endpoint'} Limit`,
                    description: `You're using ${current} of ${limit} ${type === 'organizations' ? 'organizations' : 'protected endpoints'}. Consider upgrading for unlimited access.`,
                    buttonText: 'View Plans',
                    buttonVariant: 'outline' as const,
                };
            default: // suggestion
                return {
                    cardClass: 'border-blue-200 bg-blue-50',
                    icon: <Zap className="h-5 w-5 text-blue-600" />,
                    titleClass: 'text-blue-900',
                    title: 'Unlock More with Pro',
                    description: `Get unlimited ${type === 'organizations' ? 'organizations' : 'protected endpoints'} and advanced features with Stnel Pro.`,
                    buttonText: 'Learn More',
                    buttonVariant: 'outline' as const,
                };
        }
    };

    const config = getVariantConfig();

    return (
        <Card className={`${config.cardClass} ${className || ''}`}>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        {config.icon}
                        <CardTitle className={`${config.titleClass} text-lg`}>{config.title}</CardTitle>
                    </div>
                    {variant !== 'suggestion' && (
                        <Badge variant="outline" className="text-xs">
                            {current}/{limit}
                        </Badge>
                    )}
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                <CardDescription className={config.titleClass.replace('900', '800')}>{config.description}</CardDescription>

                {variant !== 'suggestion' && (
                    <div>
                        <div className="mb-2 flex items-center justify-between">
                            <span className="text-sm font-medium">{type === 'organizations' ? 'Organizations' : 'Protected Endpoints'}</span>
                            <span className="text-sm text-muted-foreground">
                                {current} of {limit}
                            </span>
                        </div>
                        <Progress value={percentage} className="h-2" />
                    </div>
                )}

                <div className="flex items-center gap-3">
                    <Button asChild variant={config.buttonVariant} size="sm">
                        <Link href={billing().url}>
                            {config.buttonText}
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                    </Button>

                    {variant === 'suggestion' && <div className="text-sm text-muted-foreground">Starting at $15/month</div>}
                </div>
            </CardContent>
        </Card>
    );
}

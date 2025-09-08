import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type SharedData } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { AlertTriangle, Bell, Mail, MessageSquare, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';

interface NotificationSetting {
    id?: number;
    organisation_id: number;
    notification_emails: string[];
    triggers: string[];
    frequency: 'immediate' | 'hourly' | 'daily';
    enabled: boolean;
    slack_enabled: boolean;
    slack_webhook_url?: string;
    slack_channel?: string;
    last_notification_sent_at?: string;
}

interface Organisation {
    id: number;
    name: string;
    slug: string;
}

interface NotificationSettingsPageProps extends SharedData {
    organisation: Organisation;
    notificationSetting: NotificationSetting;
    availableTriggers: Record<string, string>;
    availableFrequencies: Record<string, string>;
}

export default function NotificationSettingsPage({
    organisation,
    notificationSetting,
    availableTriggers,
    availableFrequencies,
}: NotificationSettingsPageProps) {
    const [newEmail, setNewEmail] = useState('');

    const { data, setData, post, processing, errors, recentlySuccessful } = useForm({
        notification_emails: notificationSetting.notification_emails || [],
        triggers: notificationSetting.triggers || ['access_allowed', 'access_blocked'],
        frequency: notificationSetting.frequency || 'immediate',
        enabled: notificationSetting.enabled || false,
        slack_enabled: notificationSetting.slack_enabled || false,
        slack_webhook_url: notificationSetting.slack_webhook_url || '',
        slack_channel: notificationSetting.slack_channel || '',
    });

    const addEmail = () => {
        if (newEmail && !data.notification_emails.includes(newEmail)) {
            setData('notification_emails', [...data.notification_emails, newEmail]);
            setNewEmail('');
        }
    };

    const removeEmail = (emailToRemove: string) => {
        setData(
            'notification_emails',
            data.notification_emails.filter((email) => email !== emailToRemove),
        );
    };

    const toggleTrigger = (trigger: string, checked: boolean) => {
        if (checked) {
            setData('triggers', [...data.triggers, trigger]);
        } else {
            setData(
                'triggers',
                data.triggers.filter((t) => t !== trigger),
            );
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(`/organisations/${organisation.id}/notification-settings`, {
            preserveScroll: true,
        });
    };

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Organizations',
            href: '/organisations',
        },
        {
            title: organisation.name,
            href: `/organisations/${organisation.id}`,
        },
        {
            title: 'Notification Settings',
            href: `/organisations/${organisation.id}/notification-settings`,
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Notification Settings - ${organisation.name}`} />

            <div className="mx-auto max-w-4xl py-6">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Notification Settings</h1>
                    <p className="mt-2 text-gray-600">Configure email notifications for access events in {organisation.name}</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Enable/Disable Notifications */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Bell className="h-5 w-5" />
                                Enable Notifications
                            </CardTitle>
                            <CardDescription>Turn on email notifications for access events</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    id="enabled"
                                    checked={data.enabled}
                                    onChange={(e) => setData('enabled', e.target.checked)}
                                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                                />
                                <Label htmlFor="enabled">{data.enabled ? 'Notifications Enabled' : 'Notifications Disabled'}</Label>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Email Recipients */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Mail className="h-5 w-5" />
                                Email Recipients
                            </CardTitle>
                            <CardDescription>Add email addresses that should receive notifications</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {/* Add new email */}
                            <div className="flex gap-2">
                                <Input
                                    type="email"
                                    placeholder="Enter email address"
                                    value={newEmail}
                                    onChange={(e) => setNewEmail(e.target.value)}
                                    onKeyPress={(e) => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault();
                                            addEmail();
                                        }
                                    }}
                                />
                                <Button type="button" onClick={addEmail} disabled={!newEmail} variant="outline">
                                    <Plus className="h-4 w-4" />
                                </Button>
                            </div>

                            {/* Email list */}
                            {data.notification_emails.length > 0 ? (
                                <div className="space-y-2">
                                    {data.notification_emails.map((email, index) => (
                                        <div key={index} className="flex items-center justify-between rounded-lg bg-gray-50 p-3">
                                            <span className="text-sm font-medium">{email}</span>
                                            <Button type="button" variant="ghost" size="sm" onClick={() => removeEmail(email)}>
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <Alert>
                                    <AlertTriangle className="h-4 w-4" />
                                    <AlertDescription>Add at least one email address to receive notifications.</AlertDescription>
                                </Alert>
                            )}

                            {errors.notification_emails && <p className="text-sm text-red-600">{errors.notification_emails}</p>}
                        </CardContent>
                    </Card>

                    {/* Slack Configuration */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <MessageSquare className="h-5 w-5" />
                                Slack Notifications
                            </CardTitle>
                            <CardDescription>Send notifications to a Slack channel via webhook</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {/* Enable Slack */}
                            <div className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    id="slack_enabled"
                                    checked={data.slack_enabled}
                                    onChange={(e) => setData('slack_enabled', e.target.checked)}
                                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                                />
                                <Label htmlFor="slack_enabled">Enable Slack notifications</Label>
                            </div>

                            {data.slack_enabled && (
                                <>
                                    {/* Webhook URL */}
                                    <div>
                                        <Label htmlFor="slack_webhook_url" className="text-sm font-medium">
                                            Slack Webhook URL
                                        </Label>
                                        <Input
                                            id="slack_webhook_url"
                                            type="url"
                                            placeholder="https://hooks.slack.com/services/..."
                                            value={data.slack_webhook_url}
                                            onChange={(e) => setData('slack_webhook_url', e.target.value)}
                                            className="mt-1"
                                        />
                                        <p className="mt-1 text-xs text-gray-500">Create a webhook in your Slack workspace and paste the URL here</p>
                                    </div>

                                    {/* Channel */}
                                    <div>
                                        <Label htmlFor="slack_channel" className="text-sm font-medium">
                                            Channel (optional)
                                        </Label>
                                        <Input
                                            id="slack_channel"
                                            type="text"
                                            placeholder="#security-alerts"
                                            value={data.slack_channel}
                                            onChange={(e) => setData('slack_channel', e.target.value)}
                                            className="mt-1"
                                        />
                                        <p className="mt-1 text-xs text-gray-500">
                                            Override the default channel (include # for channels, @ for users)
                                        </p>
                                    </div>
                                </>
                            )}

                            {errors.slack_webhook_url && <p className="text-sm text-red-600">{errors.slack_webhook_url}</p>}
                        </CardContent>
                    </Card>

                    {/* Notification Triggers */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Notification Triggers</CardTitle>
                            <CardDescription>Choose which events should trigger email notifications</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {Object.entries(availableTriggers).map(([trigger, label]) => (
                                <div key={trigger} className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        id={trigger}
                                        checked={data.triggers.includes(trigger)}
                                        onChange={(e) => toggleTrigger(trigger, e.target.checked)}
                                        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                                    />
                                    <Label htmlFor={trigger} className="flex-1">
                                        {label}
                                    </Label>
                                </div>
                            ))}

                            {errors.triggers && <p className="text-sm text-red-600">{errors.triggers}</p>}
                        </CardContent>
                    </Card>

                    {/* Notification Frequency */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Notification Frequency</CardTitle>
                            <CardDescription>How often should notifications be sent?</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {Object.entries(availableFrequencies).map(([frequency, label]) => (
                                    <div key={frequency} className="flex items-center space-x-2">
                                        <input
                                            type="radio"
                                            name="frequency"
                                            value={frequency}
                                            id={frequency}
                                            checked={data.frequency === frequency}
                                            onChange={(e) => setData('frequency', e.target.value as any)}
                                            className="h-4 w-4 border-gray-300 text-primary focus:ring-primary"
                                        />
                                        <Label htmlFor={frequency}>{label}</Label>
                                    </div>
                                ))}
                            </div>

                            {errors.frequency && <p className="text-sm text-red-600">{errors.frequency}</p>}
                        </CardContent>
                    </Card>

                    {/* Status */}
                    {notificationSetting.last_notification_sent_at && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Status</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center gap-2">
                                    <Badge variant="secondary">
                                        Last notification sent: {new Date(notificationSetting.last_notification_sent_at).toLocaleString()}
                                    </Badge>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Save Button */}
                    <div className="flex justify-end">
                        <Button type="submit" disabled={processing} className="min-w-[120px]">
                            {processing ? 'Saving...' : 'Save Settings'}
                        </Button>
                    </div>

                    {recentlySuccessful && (
                        <Alert className="border-green-200 bg-green-50">
                            <AlertDescription className="text-green-800">Notification settings updated successfully.</AlertDescription>
                        </Alert>
                    )}
                </form>
            </div>
        </AppLayout>
    );
}

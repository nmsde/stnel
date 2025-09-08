<?php

namespace App\Http\Controllers;

use App\Models\NotificationSetting;
use App\Models\Organisation;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class NotificationSettingsController extends Controller
{
    use AuthorizesRequests;

    public function show(Organisation $organisation): Response
    {
        $this->authorize('view', $organisation);

        $notificationSetting = $organisation->notificationSetting;

        if (! $notificationSetting) {
            $notificationSetting = new NotificationSetting([
                'organisation_id' => $organisation->id,
                'notification_emails' => [],
                'triggers' => ['access_allowed', 'access_blocked'],
                'frequency' => 'immediate',
                'enabled' => false,
                'slack_enabled' => false,
                'slack_webhook_url' => '',
                'slack_channel' => '',
            ]);
        }

        return Inertia::render('organisations/notification-settings', [
            'organisation' => $organisation,
            'notificationSetting' => $notificationSetting,
            'availableTriggers' => [
                'access_allowed' => 'Successful Access Attempts',
                'access_blocked' => 'Blocked Access Attempts',
                'new_user_access' => 'First-time User Access',
                'suspicious_activity' => 'Suspicious Activity Detected',
            ],
            'availableFrequencies' => [
                'immediate' => 'Immediate (Real-time)',
                'hourly' => 'Hourly Digest',
                'daily' => 'Daily Digest',
            ],
        ]);
    }

    public function update(Request $request, Organisation $organisation)
    {
        $this->authorize('update', $organisation);

        $validated = $request->validate([
            'notification_emails' => 'nullable|array',
            'notification_emails.*' => 'required|email|max:255',
            'triggers' => 'required|array|min:1',
            'triggers.*' => Rule::in(['access_allowed', 'access_blocked', 'new_user_access', 'suspicious_activity']),
            'frequency' => 'required|in:immediate,hourly,daily',
            'enabled' => 'required|boolean',
            'slack_enabled' => 'required|boolean',
            'slack_webhook_url' => 'nullable|url|max:500',
            'slack_channel' => 'nullable|string|max:100',
        ]);

        // At least one notification method must be enabled with proper configuration
        if ($validated['enabled'] && empty($validated['notification_emails']) &&
            (! $validated['slack_enabled'] || empty($validated['slack_webhook_url']))) {
            return back()->withErrors(['notification_emails' => 'At least one notification method (email or Slack) must be properly configured when notifications are enabled.']);
        }

        $organisation->notificationSetting()->updateOrCreate(
            ['organisation_id' => $organisation->id],
            $validated
        );

        return back()->with('success', 'Notification settings updated successfully.');
    }
}

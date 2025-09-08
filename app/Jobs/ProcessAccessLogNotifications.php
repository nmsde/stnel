<?php

namespace App\Jobs;

use App\Mail\AccessNotificationMail;
use App\Models\NotificationSetting;
use App\Models\Organisation;
use App\Services\CloudflareAccessLogsService;
use App\Services\SlackNotificationService;
use Carbon\Carbon;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class ProcessAccessLogNotifications implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function __construct(
        public Organisation $organisation
    ) {}

    public function handle(): void
    {
        $notificationSetting = $this->organisation->notificationSetting;

        if (! $notificationSetting ||
            (! $notificationSetting->canSendEmailNotification() && ! $notificationSetting->canSendSlackNotification())) {
            return;
        }

        try {
            $logsService = new CloudflareAccessLogsService($this->organisation);

            $since = $this->getSinceTime($notificationSetting);
            $filters = [
                'since' => $since->format(\DateTime::RFC3339),
                'limit' => 1000, // Increased limit for batch processing
            ];

            $result = $logsService->getAccessLogs($filters);

            if (! $result['success'] || empty($result['logs'])) {
                Log::info("No new access logs found for organization: {$this->organisation->name}");

                return;
            }

            $transformedLogs = $logsService->transformLogs($result['logs']);

            // Group events by triggers
            $eventGroups = $this->groupEventsByTriggers($transformedLogs, $notificationSetting);

            if (empty($eventGroups)) {
                Log::info("No events matching notification triggers for organization: {$this->organisation->name}");

                return;
            }

            // Send notifications for each event type
            foreach ($eventGroups as $eventType => $events) {
                $this->sendNotification($notificationSetting, $events, $eventType);
            }

            // Update last notification timestamp
            $notificationSetting->update([
                'last_notification_sent_at' => now(),
            ]);

        } catch (\Exception $e) {
            Log::error("Failed to process access log notifications for organization {$this->organisation->name}: ".$e->getMessage());
            throw $e;
        }
    }

    private function getSinceTime(NotificationSetting $notificationSetting): Carbon
    {
        $lastSent = $notificationSetting->last_notification_sent_at;

        if (! $lastSent) {
            // First time running - check last hour only to avoid spam
            return now()->subHour();
        }

        return match ($notificationSetting->frequency) {
            'immediate' => $lastSent,
            'hourly' => now()->subHour(),
            'daily' => now()->subDay(),
            default => $lastSent,
        };
    }

    private function groupEventsByTriggers(array $logs, NotificationSetting $notificationSetting): array
    {
        $groups = [];
        $seenUsers = collect(); // For tracking new users

        foreach ($logs as $log) {
            foreach ($notificationSetting->triggers as $trigger) {
                switch ($trigger) {
                    case 'access_allowed':
                        if ($log['allowed']) {
                            $groups['access_allowed'][] = $log;
                        }
                        break;

                    case 'access_blocked':
                        if (! $log['allowed']) {
                            $groups['access_blocked'][] = $log;
                        }
                        break;

                    case 'new_user_access':
                        if ($log['allowed'] && ! $seenUsers->contains($log['user_email'])) {
                            // Simple heuristic: if this is the first time we see this user in this batch
                            $seenUsers->push($log['user_email']);
                            $groups['new_user_access'][] = $log;
                        }
                        break;

                    case 'suspicious_activity':
                        if ($this->isSuspiciousActivity($log)) {
                            $groups['suspicious_activity'][] = $log;
                        }
                        break;
                }
            }
        }

        return $groups;
    }

    private function isSuspiciousActivity(array $log): bool
    {
        // Simple suspicious activity detection
        // You can expand this with more sophisticated rules

        // Multiple blocked attempts from same IP/user
        // Failed login with unusual user agent
        // Access from unusual country

        return ! $log['allowed'] && (
            strpos($log['user_agent'] ?? '', 'bot') !== false ||
            strpos($log['user_agent'] ?? '', 'crawler') !== false ||
            $log['country'] === 'Unknown'
        );
    }

    private function sendNotification(NotificationSetting $notificationSetting, array $events, string $eventType): void
    {
        if (empty($events)) {
            return;
        }

        $emailSent = false;
        $slackSent = false;

        try {
            // Send email notifications
            if ($notificationSetting->canSendEmailNotification()) {
                $mail = new AccessNotificationMail(
                    $this->organisation,
                    $events,
                    $eventType,
                    $notificationSetting->frequency
                );

                foreach ($notificationSetting->notification_emails as $email) {
                    Mail::to($email)->queue($mail);
                }

                $emailSent = true;
                Log::info("Sent {$eventType} email notification for organization {$this->organisation->name} to ".count($notificationSetting->notification_emails).' recipients');
            }

            // Send Slack notifications
            if ($notificationSetting->canSendSlackNotification()) {
                $slackService = new SlackNotificationService;

                $success = $slackService->sendAccessNotification(
                    $this->organisation,
                    $events,
                    $eventType,
                    $notificationSetting->slack_webhook_url,
                    $notificationSetting->slack_channel,
                    $notificationSetting->frequency
                );

                if ($success) {
                    $slackSent = true;
                }
            }

            if (! $emailSent && ! $slackSent) {
                Log::warning("No notifications sent for organization {$this->organisation->name} - no valid notification methods configured");
            }

        } catch (\Exception $e) {
            Log::error("Failed to send notification for organization {$this->organisation->name}: ".$e->getMessage());
        }
    }
}

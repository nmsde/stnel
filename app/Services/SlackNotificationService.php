<?php

namespace App\Services;

use App\Models\Organisation;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class SlackNotificationService
{
    public function sendAccessNotification(
        Organisation $organisation,
        array $accessEvents,
        string $eventType,
        string $webhookUrl,
        ?string $channel = null,
        string $frequency = 'immediate'
    ): bool {
        try {
            $message = $this->formatSlackMessage($organisation, $accessEvents, $eventType, $frequency);

            $payload = [
                'text' => $message['text'],
                'attachments' => $message['attachments'],
            ];

            // Override channel if specified
            if ($channel) {
                $payload['channel'] = $channel;
            }

            $response = Http::timeout(10)->post($webhookUrl, $payload);

            if ($response->successful()) {
                Log::info("Sent Slack notification for organization {$organisation->name}", [
                    'event_type' => $eventType,
                    'event_count' => count($accessEvents),
                ]);

                return true;
            } else {
                Log::error("Failed to send Slack notification for organization {$organisation->name}", [
                    'status' => $response->status(),
                    'body' => $response->body(),
                ]);

                return false;
            }

        } catch (\Exception $e) {
            Log::error("Exception sending Slack notification for organization {$organisation->name}: ".$e->getMessage());

            return false;
        }
    }

    private function formatSlackMessage(
        Organisation $organisation,
        array $accessEvents,
        string $eventType,
        string $frequency = 'immediate'
    ): array {
        $orgName = $organisation->name;
        $count = count($accessEvents);

        if ($frequency === 'immediate') {
            $title = match ($eventType) {
                'access_allowed' => "Access Granted to {$orgName} Application",
                'access_blocked' => "Access Blocked for {$orgName} Application",
                'new_user_access' => "New User Accessed {$orgName} Application",
                'suspicious_activity' => "Suspicious Activity Detected in {$orgName}",
                default => "Access Event in {$orgName}",
            };

            $color = match ($eventType) {
                'access_allowed' => 'good',
                'access_blocked' => 'danger',
                'new_user_access' => 'warning',
                'suspicious_activity' => 'danger',
                default => '#36a64f',
            };

            $description = match ($eventType) {
                'access_allowed' => "A user successfully accessed a protected application in *{$orgName}*.",
                'access_blocked' => "An access attempt to a protected application in *{$orgName}* was blocked.",
                'new_user_access' => "A new user accessed a protected application in *{$orgName}* for the first time.",
                'suspicious_activity' => "Suspicious activity was detected in *{$orgName}*.",
                default => "An access event occurred in *{$orgName}*.",
            };

            // Format event details
            $fields = [];
            foreach (array_slice($accessEvents, 0, 5) as $event) { // Show max 5 events
                $status = $event['allowed'] ? 'Allowed' : 'Blocked';
                $fields[] = [
                    'title' => $event['user_email'] ?? 'Unknown User',
                    'value' => "*App:* {$event['application']}\n*Status:* {$status}\n*Time:* ".
                              \Carbon\Carbon::parse($event['timestamp'])->format('M j, Y g:i A')."\n*Location:* {$event['country']}",
                    'short' => true,
                ];
            }

            if ($count > 5) {
                $fields[] = [
                    'title' => 'Additional Events',
                    'value' => '... and '.($count - 5).' more events',
                    'short' => false,
                ];
            }

            return [
                'text' => $title,
                'attachments' => [
                    [
                        'color' => $color,
                        'title' => $title,
                        'text' => $description,
                        'fields' => $fields,
                        'footer' => config('app.name').' Security Team',
                        'ts' => now()->timestamp,
                    ],
                ],
            ];

        } else {
            // Digest format
            $period = match ($frequency) {
                'hourly' => 'Hourly',
                'daily' => 'Daily',
                default => 'Access'
            };

            $title = "{$period} Access Report for {$orgName}";
            $uniqueUsers = collect($accessEvents)->pluck('user_email')->unique()->count();
            $uniqueApps = collect($accessEvents)->pluck('application')->unique()->count();
            $allowed = collect($accessEvents)->where('allowed', true)->count();
            $blocked = collect($accessEvents)->where('allowed', false)->count();

            $summary = "Here's your {$frequency} access report for *{$orgName}*.\n\n".
                      "*Total Events:* {$count}\n".
                      "*Unique Users:* {$uniqueUsers}\n".
                      "*Unique Applications:* {$uniqueApps}\n".
                      "*Allowed:* {$allowed} | *Blocked:* {$blocked}";

            return [
                'text' => $title,
                'attachments' => [
                    [
                        'color' => '#36a64f',
                        'title' => $title,
                        'text' => $summary,
                        'footer' => config('app.name').' Security Team',
                        'ts' => now()->timestamp,
                    ],
                ],
            ];
        }
    }
}

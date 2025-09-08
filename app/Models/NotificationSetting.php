<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class NotificationSetting extends Model
{
    protected $fillable = [
        'organisation_id',
        'notification_emails',
        'triggers',
        'frequency',
        'enabled',
        'slack_enabled',
        'slack_webhook_url',
        'slack_channel',
        'last_notification_sent_at',
    ];

    protected $casts = [
        'notification_emails' => 'array',
        'triggers' => 'array',
        'enabled' => 'boolean',
        'slack_enabled' => 'boolean',
        'last_notification_sent_at' => 'datetime',
    ];

    public function organisation(): BelongsTo
    {
        return $this->belongsTo(Organisation::class);
    }

    public function shouldTriggerFor(string $eventType): bool
    {
        return $this->enabled && in_array($eventType, $this->triggers);
    }

    public function canSendNotification(): bool
    {
        if (! $this->enabled || empty($this->notification_emails)) {
            return false;
        }

        if ($this->frequency === 'immediate') {
            return true;
        }

        $lastSent = $this->last_notification_sent_at;
        if (! $lastSent) {
            return true;
        }

        $threshold = match ($this->frequency) {
            'hourly' => now()->subHour(),
            'daily' => now()->subDay(),
            default => now(),
        };

        return $lastSent->lt($threshold);
    }

    public function canSendSlackNotification(): bool
    {
        return $this->slack_enabled &&
               ! empty($this->slack_webhook_url) &&
               $this->canSendNotification();
    }

    public function canSendEmailNotification(): bool
    {
        return $this->enabled &&
               ! empty($this->notification_emails) &&
               $this->canSendNotification();
    }
}

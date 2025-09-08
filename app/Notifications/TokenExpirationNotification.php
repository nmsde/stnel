<?php

namespace App\Notifications;

use App\Models\Organisation;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class TokenExpirationNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(
        public Organisation $organisation,
        public int $daysUntilExpiration
    ) {}

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail', 'database'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        $urgency = $this->getUrgencyLevel();

        $subject = match ($urgency) {
            'critical' => '🚨 Urgent: Cloudflare API Token Expired',
            'high' => '⚠️  Action Required: API Token Expires Today',
            'medium' => '🔔 Reminder: API Token Expires Soon',
            default => '📋 Scheduled: API Token Renewal Needed'
        };

        $greeting = match ($urgency) {
            'critical' => 'URGENT: Your Cloudflare integration has stopped working!',
            'high' => 'ACTION REQUIRED: Your API token expires today!',
            'medium' => 'Your Cloudflare API token expires soon.',
            default => 'Time to renew your Cloudflare API token.'
        };

        $message = new MailMessage;
        $message->subject($subject)
            ->greeting("Hi {$notifiable->name}!")
            ->line($greeting)
            ->line("**Organization:** {$this->organisation->name}")
            ->line('**Status:** '.$this->getStatusMessage());

        if ($this->daysUntilExpiration <= 0) {
            $message->line('🚨 **Your protected applications may be inaccessible until you renew your token.**');
        } elseif ($this->daysUntilExpiration <= 3) {
            $message->line('⚠️  **Action needed within the next few days to avoid service disruption.**');
        } else {
            $message->line('🔔 **Plan to renew your token to ensure uninterrupted service.**');
        }

        $message->line('')
            ->line('**What you need to do:**')
            ->line('1. Go to your organization settings')
            ->line('2. Click "Renew Token" or "Token Status"')
            ->line('3. Follow the guided setup to create a new token')
            ->line('4. The new token will replace your existing one automatically');

        $message->action('Renew API Token', url("/organisations/{$this->organisation->id}/edit"));

        $message->line('')
            ->line('**Need help?**')
            ->line('Our guided setup makes token renewal simple - no technical expertise required!')
            ->line('')
            ->line('Questions? Just reply to this email.')
            ->salutation('Best regards, The Security Team');

        return $message;
    }

    /**
     * Get the database representation of the notification.
     */
    public function toArray(object $notifiable): array
    {
        return [
            'type' => 'token_expiration',
            'organisation_id' => $this->organisation->id,
            'organisation_name' => $this->organisation->name,
            'days_until_expiration' => $this->daysUntilExpiration,
            'urgency' => $this->getUrgencyLevel(),
            'message' => $this->getStatusMessage(),
            'action_url' => url("/organisations/{$this->organisation->id}/edit"),
            'expires_at' => $this->organisation->token_expires_at,
        ];
    }

    /**
     * Get urgency level based on days until expiration
     */
    private function getUrgencyLevel(): string
    {
        if ($this->daysUntilExpiration <= 0) {
            return 'critical';
        } elseif ($this->daysUntilExpiration <= 1) {
            return 'high';
        } elseif ($this->daysUntilExpiration <= 7) {
            return 'medium';
        } else {
            return 'low';
        }
    }

    /**
     * Get human-readable status message
     */
    private function getStatusMessage(): string
    {
        if ($this->daysUntilExpiration <= 0) {
            return 'Token has expired';
        } elseif ($this->daysUntilExpiration === 1) {
            return 'Token expires in 1 day';
        } else {
            return "Token expires in {$this->daysUntilExpiration} days";
        }
    }
}

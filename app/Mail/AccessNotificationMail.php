<?php

namespace App\Mail;

use App\Models\Organisation;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class AccessNotificationMail extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public function __construct(
        public Organisation $organisation,
        public array $accessEvents,
        public string $eventType,
        public string $frequency = 'immediate'
    ) {}

    public function envelope(): Envelope
    {
        $subject = $this->getSubject();

        return new Envelope(
            subject: $subject,
            from: config('mail.from.address'),
        );
    }

    public function content(): Content
    {
        return new Content(
            markdown: 'emails.access-notification',
            with: [
                'organisation' => $this->organisation,
                'accessEvents' => $this->accessEvents,
                'eventType' => $this->eventType,
                'frequency' => $this->frequency,
                'eventCount' => count($this->accessEvents),
                'uniqueUsers' => collect($this->accessEvents)->pluck('user_email')->unique()->count(),
                'uniqueApps' => collect($this->accessEvents)->pluck('application')->unique()->count(),
            ]
        );
    }

    private function getSubject(): string
    {
        $orgName = $this->organisation->name;
        $count = count($this->accessEvents);

        if ($this->frequency === 'immediate') {
            return match ($this->eventType) {
                'access_allowed' => "Access Granted to {$orgName} Application",
                'access_blocked' => "Access Blocked for {$orgName} Application",
                'new_user_access' => "New User Accessed {$orgName} Application",
                'suspicious_activity' => "Suspicious Activity Detected in {$orgName}",
                default => "Access Event in {$orgName}",
            };
        }

        $period = match ($this->frequency) {
            'hourly' => 'Hourly',
            'daily' => 'Daily',
            default => 'Access'
        };

        return "{$period} Access Report for {$orgName} ({$count} events)";
    }

    public function attachments(): array
    {
        return [];
    }
}

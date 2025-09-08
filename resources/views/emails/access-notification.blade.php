@component('mail::message')

@if($frequency === 'immediate')
# {{ $eventType === 'access_allowed' ? 'Access Granted' : ($eventType === 'access_blocked' ? 'Access Blocked' : ($eventType === 'new_user_access' ? 'New User Access' : 'Security Alert')) }}

@if($eventType === 'access_allowed')
A user successfully accessed a protected application in **{{ $organisation->name }}**.
@elseif($eventType === 'access_blocked')
An access attempt to a protected application in **{{ $organisation->name }}** was blocked.
@elseif($eventType === 'new_user_access')
A new user accessed a protected application in **{{ $organisation->name }}** for the first time.
@else
Suspicious activity was detected in **{{ $organisation->name }}**.
@endif

## Event Details

@foreach($accessEvents as $event)
- **User:** {{ $event['user_email'] ?? 'Unknown' }}
- **Application:** {{ $event['application'] ?? 'Unknown' }}
- **Time:** {{ \Carbon\Carbon::parse($event['timestamp'])->format('M j, Y g:i A') }}
- **Location:** {{ $event['country'] ?? 'Unknown' }}
- **IP Address:** {{ $event['ip_address'] ?? 'Unknown' }}
- **Action:** {{ ucfirst($event['action'] ?? 'unknown') }}
- **Status:** @if($event['allowed']) Allowed @else Blocked @endif

---
@endforeach

@else

# {{ ucfirst($frequency) }} Access Report

Here's your {{ $frequency }} access report for **{{ $organisation->name }}**.

## Summary
- **Total Events:** {{ $eventCount }}
- **Unique Users:** {{ $uniqueUsers }}
- **Unique Applications:** {{ $uniqueApps }}
- **Period:** {{ $frequency === 'hourly' ? 'Last Hour' : 'Last 24 Hours' }}

## Recent Events

@foreach($accessEvents->take(10) as $event)
**{{ \Carbon\Carbon::parse($event['timestamp'])->format('g:i A') }}** - {{ $event['user_email'] ?? 'Unknown' }} 
@if($event['allowed'])accessed @else was blocked from @endif {{ $event['application'] ?? 'Unknown' }}

@endforeach

@if($eventCount > 10)
*... and {{ $eventCount - 10 }} more events*
@endif

@endif

## Additional Information

For detailed access logs and to manage your notification preferences, please visit your organization's security dashboard.

## Support

If you have any questions about these access events or need assistance with your security configuration, please contact our support team.

Best regards,<br>
**{{ config('app.name') }} Security Team**

---

*You're receiving this email because you've configured notifications for {{ $organisation->name }}. To modify your notification preferences, please visit your organization settings.*

@endcomponent

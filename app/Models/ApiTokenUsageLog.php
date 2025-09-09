<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ApiTokenUsageLog extends Model
{
    // Only use created_at, not updated_at since logs are immutable
    public const UPDATED_AT = null;

    protected $fillable = [
        'api_token_id',
        'endpoint',
        'method',
        'ip_address',
        'user_agent',
        'response_status',
        'response_time_ms',
        'payload_size',
    ];

    protected $casts = [
        'response_time_ms' => 'float',
        'payload_size' => 'integer',
        'response_status' => 'integer',
    ];

    // Relationships
    public function apiToken(): BelongsTo
    {
        return $this->belongsTo(ApiToken::class);
    }

    // Utility methods
    public function isSuccessful(): bool
    {
        return $this->response_status >= 200 && $this->response_status < 300;
    }

    public function isClientError(): bool
    {
        return $this->response_status >= 400 && $this->response_status < 500;
    }

    public function isServerError(): bool
    {
        return $this->response_status >= 500;
    }

    // Scopes
    public function scopeSuccessful($query)
    {
        return $query->whereBetween('response_status', [200, 299]);
    }

    public function scopeClientErrors($query)
    {
        return $query->whereBetween('response_status', [400, 499]);
    }

    public function scopeServerErrors($query)
    {
        return $query->where('response_status', '>=', 500);
    }

    public function scopeByMethod($query, string $method)
    {
        return $query->where('method', strtoupper($method));
    }

    public function scopeByEndpoint($query, string $endpoint)
    {
        return $query->where('endpoint', $endpoint);
    }

    public function scopeInDateRange($query, $startDate, $endDate)
    {
        return $query->whereBetween('created_at', [$startDate, $endDate]);
    }

    public function scopeSlowRequests($query, float $thresholdMs = 1000.0)
    {
        return $query->where('response_time_ms', '>', $thresholdMs);
    }

    public function scopeRecentActivity($query, int $hours = 24)
    {
        return $query->where('created_at', '>=', now()->subHours($hours));
    }

    // Static methods
    public static function logApiRequest(
        ApiToken $token,
        string $endpoint,
        string $method,
        string $ipAddress,
        int $responseStatus,
        ?string $userAgent = null,
        ?float $responseTimeMs = null,
        ?int $payloadSize = null
    ): self {
        return self::create([
            'api_token_id' => $token->id,
            'endpoint' => $endpoint,
            'method' => strtoupper($method),
            'ip_address' => $ipAddress,
            'user_agent' => $userAgent,
            'response_status' => $responseStatus,
            'response_time_ms' => $responseTimeMs,
            'payload_size' => $payloadSize,
        ]);
    }
}

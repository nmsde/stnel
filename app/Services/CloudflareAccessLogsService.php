<?php

namespace App\Services;

use App\Models\Organisation;
use Exception;
use Illuminate\Support\Facades\Http;

class CloudflareAccessLogsService
{
    protected Organisation $organisation;

    protected string $baseUrl;

    protected array $headers;

    public function __construct(Organisation $organisation)
    {
        $this->organisation = $organisation;
        $this->baseUrl = 'https://api.cloudflare.com/client/v4';

        if (! $organisation->api_token) {
            throw new Exception('Organization does not have an API token configured.');
        }

        $this->headers = [
            'Authorization' => 'Bearer '.$organisation->api_token,
            'Content-Type' => 'application/json',
        ];
    }

    /**
     * Get Access authentication logs
     */
    public function getAccessLogs(array $filters = []): array
    {
        try {
            // Get account ID first if not cached
            $accountId = $this->organisation->cloudflare_account_id ?? $this->getAccountId();

            $url = "{$this->baseUrl}/accounts/{$accountId}/access/logs/access_requests";

            $queryParams = array_merge([
                'limit' => $filters['limit'] ?? 100,
                'direction' => 'desc', // Most recent first
            ], $this->buildFilters($filters));

            $response = Http::withHeaders($this->headers)
                ->timeout(30)
                ->get($url, $queryParams);

            if ($response->successful()) {
                $data = $response->json();

                return [
                    'success' => true,
                    'logs' => $data['result'] ?? [],
                    'result_info' => $data['result_info'] ?? [],
                ];
            }

            return [
                'success' => false,
                'error' => 'Failed to fetch access logs: '.$response->body(),
                'logs' => [],
            ];

        } catch (Exception $e) {
            return [
                'success' => false,
                'error' => $e->getMessage(),
                'logs' => [],
            ];
        }
    }

    /**
     * Get Access logs for a specific application/policy
     */
    public function getApplicationLogs(string $applicationId, array $filters = []): array
    {
        $filters['app_uid'] = $applicationId;

        return $this->getAccessLogs($filters);
    }

    /**
     * Get logs filtered by user email
     */
    public function getUserLogs(string $userEmail, array $filters = []): array
    {
        $filters['user_email'] = $userEmail;

        return $this->getAccessLogs($filters);
    }

    /**
     * Get logs for a specific time range
     */
    public function getLogsInRange(\DateTime $since, ?\DateTime $until = null, array $filters = []): array
    {
        $filters['since'] = $since->format(\DateTime::RFC3339);
        if ($until) {
            $filters['until'] = $until->format(\DateTime::RFC3339);
        }

        return $this->getAccessLogs($filters);
    }

    /**
     * Build query filters for Cloudflare API
     */
    protected function buildFilters(array $filters): array
    {
        $queryParams = [];

        // Time range filters
        if (isset($filters['since'])) {
            $queryParams['since'] = $filters['since'];
        }
        if (isset($filters['until'])) {
            $queryParams['until'] = $filters['until'];
        }

        // Application filter
        if (isset($filters['app_uid'])) {
            $queryParams['app_uid'] = $filters['app_uid'];
        }

        // User email filter
        if (isset($filters['user_email'])) {
            $queryParams['user_email'] = $filters['user_email'];
        }

        // Action filter (allow, block, etc.)
        if (isset($filters['action'])) {
            $queryParams['action'] = $filters['action'];
        }

        // Country filter
        if (isset($filters['country'])) {
            $queryParams['country'] = $filters['country'];
        }

        return $queryParams;
    }

    /**
     * Get account ID for API calls
     */
    protected function getAccountId(): string
    {
        if ($this->organisation->cloudflare_account_id) {
            return $this->organisation->cloudflare_account_id;
        }

        $response = Http::withHeaders($this->headers)
            ->get("{$this->baseUrl}/accounts");

        if ($response->successful()) {
            $accounts = $response->json()['result'] ?? [];
            if (! empty($accounts)) {
                $accountId = $accounts[0]['id'];

                // Cache the account ID
                $this->organisation->update(['cloudflare_account_id' => $accountId]);

                return $accountId;
            }
        }

        throw new Exception('Could not retrieve Cloudflare account ID. Please ensure your API token has "Account:Account:Read" permission.');
    }

    /**
     * Transform raw log data for display
     */
    public function transformLogs(array $logs): array
    {
        return array_map(function ($log) {
            // Use the correct boolean field from Cloudflare API
            $allowed = (bool) ($log['allowed'] ?? false);

            return [
                'id' => $log['ray_id'] ?? uniqid(),
                'timestamp' => $log['created_at'] ?? now()->toISOString(),
                'user_email' => $log['user_email'] ?? 'Unknown',
                'user_name' => $log['user_name'] ?? null,
                'application' => $log['app_domain'] ?? 'Unknown Application',
                'application_uid' => $log['app_uid'] ?? null,
                'action' => $log['action'] ?? 'unknown',
                'allowed' => $allowed,
                'ip_address' => $log['ip_address'] ?? 'Unknown',
                'country' => $log['country'] ?? 'Unknown',
                'user_agent' => $log['user_agent'] ?? null,
                'ray_id' => $log['ray_id'] ?? null,
                'session_id' => $log['session_id'] ?? null,
                'purpose' => $log['purpose'] ?? 'login',
                'app_type' => $log['app_type'] ?? 'web',
                'created_at' => $log['created_at'] ?? now()->toISOString(),
            ];
        }, $logs);
    }

    /**
     * Get log statistics
     */
    public function getLogStats(array $logs): array
    {
        $stats = [
            'total' => count($logs),
            'allowed' => 0,
            'blocked' => 0,
            'unique_users' => 0,
            'unique_applications' => 0,
            'countries' => [],
        ];

        $users = [];
        $applications = [];
        $countries = [];

        foreach ($logs as $log) {
            // Count allowed vs blocked using the correct boolean field
            if ((bool) ($log['allowed'] ?? false)) {
                $stats['allowed']++;
            } else {
                $stats['blocked']++;
            }

            // Track unique users
            if (isset($log['user_email']) && ! in_array($log['user_email'], $users)) {
                $users[] = $log['user_email'];
            }

            // Track unique applications
            if (isset($log['app_domain']) && ! in_array($log['app_domain'], $applications)) {
                $applications[] = $log['app_domain'];
            }

            // Track countries
            $country = $log['country'] ?? 'Unknown';
            $countries[$country] = ($countries[$country] ?? 0) + 1;
        }

        $stats['unique_users'] = count($users);
        $stats['unique_applications'] = count($applications);
        $stats['countries'] = $countries;

        return $stats;
    }
}

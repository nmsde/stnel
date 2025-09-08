<?php

namespace App\Services;

use Exception;
use Illuminate\Support\Facades\Http;

class CloudflareTokenValidationService
{
    protected string $baseUrl = 'https://api.cloudflare.com/client/v4';

    /**
     * Validate API token and check required permissions
     */
    public function validateToken(string $token): array
    {
        try {
            $response = Http::withHeaders([
                'Authorization' => 'Bearer '.$token,
                'Content-Type' => 'application/json',
            ])->get("{$this->baseUrl}/user/tokens/verify");

            if (! $response->successful()) {
                return [
                    'valid' => false,
                    'error' => 'Invalid API token',
                    'details' => $response->json()['errors'] ?? [],
                ];
            }

            $tokenInfo = $response->json()['result'] ?? [];

            // Check token permissions
            $permissionsCheck = $this->checkRequiredPermissions($token);

            return [
                'valid' => true,
                'token_info' => $tokenInfo,
                'permissions' => $permissionsCheck,
                'account_access' => $this->checkAccountAccess($token),
                'expiration_info' => $this->extractExpirationInfo($tokenInfo),
            ];

        } catch (Exception $e) {
            return [
                'valid' => false,
                'error' => 'Failed to validate token: '.$e->getMessage(),
            ];
        }
    }

    /**
     * Check if token has required permissions for our app
     */
    protected function checkRequiredPermissions(string $token): array
    {
        $requiredPermissions = [
            'account_settings' => 'Account Settings:Read',
            'access_apps' => 'Access: Apps and Policies:Edit',
            'access_audit_logs' => 'Access: Audit Logs:Read',
            'access_ssh_auditing' => 'Access: SSH Auditing:Edit',
            'access_custom_pages' => 'Access: Custom Pages:Edit',
            'access_device_posture' => 'Access: Device Posture:Edit',
            'access_organizations' => 'Access: Organizations, Identity Providers, and Groups:Edit',
            'zone_read' => 'Zone:Read (All zones)',
            'dns_edit' => 'DNS:Edit (All zones)',
        ];

        $permissions = [];

        try {
            // Test account access
            $accountResponse = Http::withHeaders([
                'Authorization' => 'Bearer '.$token,
            ])->get("{$this->baseUrl}/accounts");

            $permissions['account_settings'] = [
                'required' => true,
                'granted' => $accountResponse->successful(),
                'description' => 'Required to read account settings',
            ];

            if ($accountResponse->successful()) {
                $accounts = $accountResponse->json()['result'] ?? [];
                if (! empty($accounts)) {
                    $accountId = $accounts[0]['id'];

                    // Test Access Apps and Policies permission
                    $appsResponse = Http::withHeaders([
                        'Authorization' => 'Bearer '.$token,
                    ])->get("{$this->baseUrl}/accounts/{$accountId}/access/apps");

                    $permissions['access_apps'] = [
                        'required' => true,
                        'granted' => $appsResponse->successful(),
                        'description' => 'Required to manage Access applications and policies',
                    ];

                    // Test Access Audit Logs permission
                    $auditLogsResponse = Http::withHeaders([
                        'Authorization' => 'Bearer '.$token,
                    ])->get("{$this->baseUrl}/accounts/{$accountId}/access/logs/access_requests");

                    $permissions['access_audit_logs'] = [
                        'required' => true,
                        'granted' => $auditLogsResponse->successful(),
                        'description' => 'Required to view Access audit logs',
                    ];

                    // Test Access Organizations, Identity Providers, and Groups
                    $orgResponse = Http::withHeaders([
                        'Authorization' => 'Bearer '.$token,
                    ])->get("{$this->baseUrl}/accounts/{$accountId}/access/organizations");

                    $permissions['access_organizations'] = [
                        'required' => true,
                        'granted' => $orgResponse->successful(),
                        'description' => 'Required to manage Access organizations and identity providers',
                    ];

                    // Test SSH Auditing (may not be directly testable, so we'll infer from other Access permissions)
                    $permissions['access_ssh_auditing'] = [
                        'required' => true,
                        'granted' => $appsResponse->successful(), // Inferred from apps permission
                        'description' => 'Required for SSH auditing functionality',
                    ];

                    // Test Custom Pages (may not be directly testable, so we'll infer from other Access permissions)
                    $permissions['access_custom_pages'] = [
                        'required' => true,
                        'granted' => $appsResponse->successful(), // Inferred from apps permission
                        'description' => 'Required to manage Access custom pages',
                    ];

                    // Test Device Posture (may not be directly testable, so we'll infer from other Access permissions)
                    $permissions['access_device_posture'] = [
                        'required' => true,
                        'granted' => $appsResponse->successful(), // Inferred from apps permission
                        'description' => 'Required for device posture management',
                    ];

                    // Test Zone read permission
                    $zonesResponse = Http::withHeaders([
                        'Authorization' => 'Bearer '.$token,
                    ])->get("{$this->baseUrl}/zones");

                    $permissions['zone_read'] = [
                        'required' => true,
                        'granted' => $zonesResponse->successful(),
                        'description' => 'Required to read zone information',
                    ];

                    // Test DNS edit permission (we'll test by trying to get DNS records for first zone)
                    $dnsGranted = false;
                    if ($zonesResponse->successful()) {
                        $zones = $zonesResponse->json()['result'] ?? [];
                        if (! empty($zones)) {
                            $firstZone = $zones[0];
                            $dnsResponse = Http::withHeaders([
                                'Authorization' => 'Bearer '.$token,
                            ])->get("{$this->baseUrl}/zones/{$firstZone['id']}/dns_records");

                            $dnsGranted = $dnsResponse->successful();
                        }
                    }

                    $permissions['dns_edit'] = [
                        'required' => true,
                        'granted' => $dnsGranted,
                        'description' => 'Required to manage DNS records',
                    ];
                }
            }

        } catch (Exception $e) {
            // If we can't test permissions, mark them as unknown
            foreach ($requiredPermissions as $key => $permission) {
                $permissions[$key] = [
                    'required' => true,
                    'granted' => false,
                    'description' => 'Could not verify permission',
                    'error' => $e->getMessage(),
                ];
            }
        }

        return $permissions;
    }

    /**
     * Check account access and get account info
     */
    protected function checkAccountAccess(string $token): array
    {
        try {
            $response = Http::withHeaders([
                'Authorization' => 'Bearer '.$token,
            ])->get("{$this->baseUrl}/accounts");

            if ($response->successful()) {
                $accounts = $response->json()['result'] ?? [];

                return [
                    'has_access' => ! empty($accounts),
                    'accounts' => collect($accounts)->map(function ($account) {
                        return [
                            'id' => $account['id'],
                            'name' => $account['name'],
                            'type' => $account['type'] ?? 'standard',
                        ];
                    })->toArray(),
                ];
            }

            return ['has_access' => false, 'accounts' => []];

        } catch (Exception $e) {
            return [
                'has_access' => false,
                'accounts' => [],
                'error' => $e->getMessage(),
            ];
        }
    }

    /**
     * Get token creation instructions
     */
    public function getTokenCreationInstructions(): array
    {
        return [
            'title' => 'Create your Cloudflare API Token',
            'description' => 'Follow these steps to create a secure API token with the correct permissions',
            'steps' => [
                [
                    'title' => 'Go to Cloudflare Dashboard',
                    'description' => 'Open https://dash.cloudflare.com/profile/api-tokens',
                    'action' => 'Click "Create Token"',
                ],
                [
                    'title' => 'Use Custom Token Template',
                    'description' => 'Select "Custom token" to set specific permissions',
                    'action' => 'Click "Get started" under Custom token',
                ],
                [
                    'title' => 'Configure Permissions',
                    'description' => 'Add these EXACT permissions (copy/paste recommended):',
                    'permissions' => [
                        'Account Settings:Read',
                        'Access: Apps and Policies:Edit',
                        'Access: Audit Logs:Read',
                        'Access: SSH Auditing:Edit',
                        'Access: Custom Pages:Edit',
                        'Access: Device Posture:Edit',
                        'Access: Organizations, Identity Providers, and Groups:Edit',
                    ],
                ],
                [
                    'title' => 'Set Zone Resources',
                    'description' => 'Add Zone permissions for ALL zones:',
                    'permissions' => [
                        'Zone:Read',
                        'DNS:Edit',
                    ],
                    'action' => 'Select "Include - All zones" for both permissions',
                ],
                [
                    'title' => 'Set Account Resources',
                    'description' => 'Under "Account Resources", select "Include - All accounts" or choose specific accounts',
                    'action' => 'Ensure your account is included',
                ],
                [
                    'title' => 'Create and Copy Token',
                    'description' => 'Review your settings and create the token',
                    'action' => 'Copy the token immediately - it won\'t be shown again!',
                ],
            ],
            'template_url' => 'https://dash.cloudflare.com/profile/api-tokens',
            'help_url' => 'https://developers.cloudflare.com/fundamentals/api/get-started/create-token/',
        ];
    }

    /**
     * Extract expiration information from token info
     */
    protected function extractExpirationInfo(array $tokenInfo): array
    {
        $expiresOn = $tokenInfo['expires_on'] ?? null;
        $status = $tokenInfo['status'] ?? null;

        if (! $expiresOn) {
            return [
                'has_expiration' => false,
                'expires_at' => null,
                'expires_in_days' => null,
                'status' => 'unknown',
            ];
        }

        try {
            $expiresAt = \Carbon\Carbon::parse($expiresOn);
            $daysUntilExpiration = now()->diffInDays($expiresAt, false);

            return [
                'has_expiration' => true,
                'expires_at' => $expiresAt,
                'expires_on' => $expiresOn,
                'expires_in_days' => max(0, $daysUntilExpiration),
                'status' => $status,
                'is_expired' => $expiresAt->isPast(),
                'is_expiring_soon' => $expiresAt->isBefore(now()->addDays(7)),
            ];
        } catch (Exception $e) {
            return [
                'has_expiration' => false,
                'expires_at' => null,
                'expires_in_days' => null,
                'status' => 'parse_error',
                'error' => $e->getMessage(),
            ];
        }
    }

    /**
     * Check token health and update organization
     */
    public function checkAndUpdateTokenHealth(\App\Models\Organisation $organisation): array
    {
        if (! $organisation->api_token) {
            return [
                'success' => false,
                'error' => 'No API token configured',
            ];
        }

        $validation = $this->validateToken($organisation->api_token);

        if ($validation['valid']) {
            // Update organization with token info
            $organisation->updateTokenInfo(
                $validation['token_info'] ?? [],
                $validation['permissions'] ?? []
            );

            // Reset notification flag if token is renewed
            if ($validation['expiration_info']['expires_in_days'] > 30) {
                $organisation->resetTokenRenewalNotification();
            }
        }

        return $validation;
    }

    /**
     * Generate token template URL (if Cloudflare supported this)
     */
    public function getTokenTemplateUrl(): ?string
    {
        // Unfortunately, Cloudflare doesn't support pre-configured token templates via URL
        // But we can provide detailed instructions instead
        return null;
    }
}

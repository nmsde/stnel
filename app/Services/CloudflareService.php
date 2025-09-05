<?php

namespace App\Services;

use App\Models\Organisation;
use App\Models\CloudflareZone;
use App\Models\AccessPolicy;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Http\Client\PendingRequest;
use Illuminate\Http\Client\Response;
use Exception;

class CloudflareService
{
    protected Organisation $organisation;
    protected PendingRequest $client;
    protected string $baseUrl = 'https://api.cloudflare.com/client/v4';

    public function __construct(Organisation $organisation)
    {
        $this->organisation = $organisation;
        
        if (!$organisation->api_token) {
            throw new Exception('Organisation does not have an API token configured');
        }

        $this->client = Http::withHeaders([
            'Authorization' => 'Bearer ' . $organisation->api_token,
            'Content-Type' => 'application/json',
        ])->timeout(30)->retry(3, 100);
    }

    /**
     * Validate the API token.
     */
    public function validateToken(): array
    {
        try {
            $response = $this->client->get($this->baseUrl . '/user/tokens/verify');
            
            if ($response->successful()) {
                $this->organisation->update(['token_last_validated_at' => now()]);
                
                return [
                    'valid' => true,
                    'status' => $response->json('result.status'),
                    'expires_on' => $response->json('result.expires_on'),
                ];
            }

            return [
                'valid' => false,
                'error' => $response->json('errors.0.message', 'Invalid token'),
            ];
        } catch (Exception $e) {
            Log::error('Cloudflare token validation failed', [
                'organisation_id' => $this->organisation->id,
                'error' => $e->getMessage(),
            ]);

            return [
                'valid' => false,
                'error' => 'Failed to validate token: ' . $e->getMessage(),
            ];
        }
    }

    /**
     * List all zones (domains) for the account.
     */
    public function listZones(): array
    {
        try {
            $response = $this->client->get($this->baseUrl . '/zones');
            
            if ($response->successful()) {
                return $response->json('result', []);
            }

            throw new Exception($response->json('errors.0.message', 'Failed to fetch zones'));
        } catch (Exception $e) {
            Log::error('Failed to list Cloudflare zones', [
                'organisation_id' => $this->organisation->id,
                'error' => $e->getMessage(),
            ]);

            throw $e;
        }
    }

    /**
     * Sync zones with local database.
     */
    public function syncZones(): void
    {
        $zones = $this->listZones();
        
        foreach ($zones as $zoneData) {
            CloudflareZone::updateOrCreate(
                [
                    'organisation_id' => $this->organisation->id,
                    'zone_id' => $zoneData['id'],
                ],
                [
                    'name' => $zoneData['name'],
                    'status' => $zoneData['status'],
                    'metadata' => [
                        'plan' => $zoneData['plan']['name'] ?? null,
                        'name_servers' => $zoneData['name_servers'] ?? [],
                        'created_on' => $zoneData['created_on'] ?? null,
                    ],
                    'synced_at' => now(),
                ]
            );
        }
    }

    /**
     * List Access applications for a zone.
     */
    public function listApplications(string $zoneId): array
    {
        try {
            $response = $this->client->get($this->baseUrl . "/zones/{$zoneId}/access/apps");
            
            if ($response->successful()) {
                return $response->json('result', []);
            }

            throw new Exception($response->json('errors.0.message', 'Failed to fetch applications'));
        } catch (Exception $e) {
            Log::error('Failed to list Cloudflare applications', [
                'organisation_id' => $this->organisation->id,
                'zone_id' => $zoneId,
                'error' => $e->getMessage(),
            ]);

            throw $e;
        }
    }

    /**
     * Create an Access application.
     */
    public function createApplication(string $zoneId, array $data): array
    {
        try {
            $response = $this->client->post($this->baseUrl . "/zones/{$zoneId}/access/apps", $data);
            
            if ($response->successful()) {
                return $response->json('result');
            }

            throw new Exception($response->json('errors.0.message', 'Failed to create application'));
        } catch (Exception $e) {
            Log::error('Failed to create Cloudflare application', [
                'organisation_id' => $this->organisation->id,
                'zone_id' => $zoneId,
                'data' => $data,
                'error' => $e->getMessage(),
            ]);

            throw $e;
        }
    }

    /**
     * Update an Access application.
     */
    public function updateApplication(string $zoneId, string $appId, array $data): array
    {
        try {
            $response = $this->client->put($this->baseUrl . "/zones/{$zoneId}/access/apps/{$appId}", $data);
            
            if ($response->successful()) {
                return $response->json('result');
            }

            throw new Exception($response->json('errors.0.message', 'Failed to update application'));
        } catch (Exception $e) {
            Log::error('Failed to update Cloudflare application', [
                'organisation_id' => $this->organisation->id,
                'zone_id' => $zoneId,
                'app_id' => $appId,
                'data' => $data,
                'error' => $e->getMessage(),
            ]);

            throw $e;
        }
    }

    /**
     * Delete an Access application.
     */
    public function deleteApplication(string $zoneId, string $appId): bool
    {
        try {
            $response = $this->client->delete($this->baseUrl . "/zones/{$zoneId}/access/apps/{$appId}");
            
            if ($response->successful()) {
                return true;
            }

            throw new Exception($response->json('errors.0.message', 'Failed to delete application'));
        } catch (Exception $e) {
            Log::error('Failed to delete Cloudflare application', [
                'organisation_id' => $this->organisation->id,
                'zone_id' => $zoneId,
                'app_id' => $appId,
                'error' => $e->getMessage(),
            ]);

            throw $e;
        }
    }

    /**
     * Create or update an Access policy.
     */
    public function syncPolicy(AccessPolicy $policy): void
    {
        $zone = $policy->zone;
        $data = $policy->toCloudflarePayload();

        try {
            if ($policy->cf_application_id) {
                $result = $this->updateApplication($zone->zone_id, $policy->cf_application_id, $data);
            } else {
                $result = $this->createApplication($zone->zone_id, $data);
                $policy->update(['cf_application_id' => $result['id']]);
            }

            $policy->update(['status' => 'active']);
        } catch (Exception $e) {
            $policy->update(['status' => 'inactive']);
            throw $e;
        }
    }

    /**
     * Delete an Access policy from Cloudflare.
     */
    public function deletePolicy(AccessPolicy $policy): void
    {
        if (!$policy->cf_application_id) {
            return;
        }

        $zone = $policy->zone;
        
        try {
            $this->deleteApplication($zone->zone_id, $policy->cf_application_id);
            $policy->update(['status' => 'inactive', 'cf_application_id' => null]);
        } catch (Exception $e) {
            throw $e;
        }
    }

    /**
     * Test the connection to Cloudflare.
     */
    public function testConnection(): array
    {
        try {
            $tokenInfo = $this->validateToken();
            
            if (!$tokenInfo['valid']) {
                return [
                    'success' => false,
                    'error' => $tokenInfo['error'],
                ];
            }

            $zones = $this->listZones();

            return [
                'success' => true,
                'token_status' => $tokenInfo['status'] ?? 'active',
                'zones_count' => count($zones),
                'zones' => array_map(fn($z) => [
                    'id' => $z['id'],
                    'name' => $z['name'],
                    'status' => $z['status'],
                ], array_slice($zones, 0, 5)),
            ];
        } catch (Exception $e) {
            return [
                'success' => false,
                'error' => $e->getMessage(),
            ];
        }
    }

    /**
     * Handle rate limiting with exponential backoff.
     */
    protected function withRateLimit(callable $callback, int $retries = 3)
    {
        $attempt = 0;
        $lastException = null;

        while ($attempt < $retries) {
            try {
                return $callback();
            } catch (Exception $e) {
                $lastException = $e;
                
                if ($e->getCode() === 429) {
                    $delay = pow(2, $attempt) * 1000;
                    usleep($delay * 1000);
                    $attempt++;
                } else {
                    throw $e;
                }
            }
        }

        throw $lastException;
    }
}
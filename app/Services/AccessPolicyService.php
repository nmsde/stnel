<?php

namespace App\Services;

use App\Models\AccessPolicy;
use App\Models\Organisation;
use App\Models\User;
use App\Models\CloudflareZone;
use Illuminate\Support\Collection;
use Exception;

class AccessPolicyService
{
    public function __construct(
        protected AuditService $audit
    ) {}

    /**
     * Create a new access policy.
     */
    public function create(
        Organisation $organisation,
        User $user,
        array $data
    ): AccessPolicy {
        $zone = CloudflareZone::where('organisation_id', $organisation->id)
            ->where('id', $data['cloudflare_zone_id'])
            ->firstOrFail();

        $policy = AccessPolicy::create([
            'organisation_id' => $organisation->id,
            'cloudflare_zone_id' => $zone->id,
            'name' => $data['name'],
            'domain' => $data['domain'],
            'path' => $data['path'] ?? '/',
            'session_duration' => $data['session_duration'] ?? '24h',
            'require_mfa' => $data['require_mfa'] ?? false,
            'rules' => $this->formatRules($data['rules'] ?? []),
            'status' => 'pending',
            'created_by' => $user->id,
            'updated_by' => $user->id,
        ]);

        $this->audit->logCreate($organisation, $user, $policy, 'policy_created');

        try {
            if ($organisation->api_token) {
                $cloudflare = new CloudflareService($organisation);
                $this->sync($policy, $cloudflare);
            }
        } catch (Exception $e) {
            $this->audit->logPolicySync($organisation, $user, $policy->id, false, $e->getMessage());
            throw $e;
        }

        return $policy;
    }

    /**
     * Update an existing access policy.
     */
    public function update(
        AccessPolicy $policy,
        User $user,
        array $data
    ): AccessPolicy {
        $oldValues = $policy->getAttributes();

        $policy->update([
            'name' => $data['name'] ?? $policy->name,
            'domain' => $data['domain'] ?? $policy->domain,
            'path' => $data['path'] ?? $policy->path,
            'session_duration' => $data['session_duration'] ?? $policy->session_duration,
            'require_mfa' => $data['require_mfa'] ?? $policy->require_mfa,
            'rules' => isset($data['rules']) ? $this->formatRules($data['rules']) : $policy->rules,
            'updated_by' => $user->id,
        ]);

        $this->audit->logUpdate($policy->organisation, $user, $policy, $oldValues, 'policy_updated');

        try {
            if ($policy->organisation->api_token) {
                $cloudflare = new CloudflareService($policy->organisation);
                $this->sync($policy, $cloudflare);
            }
        } catch (Exception $e) {
            $this->audit->logPolicySync($policy->organisation, $user, $policy->id, false, $e->getMessage());
            throw $e;
        }

        return $policy;
    }

    /**
     * Delete an access policy.
     */
    public function delete(AccessPolicy $policy, User $user): bool
    {
        try {
            if ($policy->cf_application_id && $policy->organisation->api_token) {
                $cloudflare = new CloudflareService($policy->organisation);
                $cloudflare->deletePolicy($policy);
            }

            $this->audit->logDelete($policy->organisation, $user, $policy, 'policy_deleted');
            
            return $policy->delete();
        } catch (Exception $e) {
            $this->audit->logCustom(
                $policy->organisation,
                $user,
                'policy_delete_failed',
                'AccessPolicy',
                $policy->id,
                ['error' => $e->getMessage()]
            );
            throw $e;
        }
    }

    /**
     * Sync a policy with Cloudflare.
     */
    public function sync(AccessPolicy $policy, CloudflareService $cloudflare = null): bool
    {
        try {
            if (!$cloudflare) {
                $cloudflare = new CloudflareService($policy->organisation);
            }
            
            $cloudflare->syncPolicy($policy);
            
            $this->audit->logPolicySync(
                $policy->organisation,
                auth()->user(),
                $policy->id,
                true
            );

            return true;
        } catch (Exception $e) {
            $policy->update(['status' => 'inactive']);
            
            $this->audit->logPolicySync(
                $policy->organisation,
                auth()->user(),
                $policy->id,
                false,
                $e->getMessage()
            );

            throw $e;
        }
    }

    /**
     * Bulk create policies.
     */
    public function bulkCreate(
        Organisation $organisation,
        User $user,
        array $policies
    ): Collection {
        $created = collect();
        $errors = [];

        foreach ($policies as $policyData) {
            try {
                $policy = $this->create($organisation, $user, $policyData);
                $created->push($policy);
            } catch (Exception $e) {
                $errors[] = [
                    'data' => $policyData,
                    'error' => $e->getMessage(),
                ];
            }
        }

        $this->audit->logBulkOperation(
            $organisation,
            $user,
            'create',
            'AccessPolicy',
            $created->count(),
            ['errors' => $errors]
        );

        if (!empty($errors)) {
            throw new Exception('Some policies failed to create', 0, null);
        }

        return $created;
    }

    /**
     * Format rules for storage.
     */
    protected function formatRules(array $rules): array
    {
        $formatted = [];

        foreach ($rules as $rule) {
            if (!isset($rule['type']) || !isset($rule['value'])) {
                continue;
            }

            $formatted[] = [
                'type' => $rule['type'],
                'value' => $rule['value'],
            ];
        }

        return $formatted;
    }

    /**
     * Validate policy data.
     */
    public function validate(array $data): array
    {
        $errors = [];

        if (empty($data['name'])) {
            $errors['name'] = 'Policy name is required';
        }

        if (empty($data['domain'])) {
            $errors['domain'] = 'Domain is required';
        }

        if (empty($data['rules'])) {
            $errors['rules'] = 'At least one access rule is required';
        } else {
            foreach ($data['rules'] as $index => $rule) {
                if ($rule['type'] === 'email' && !filter_var($rule['value'], FILTER_VALIDATE_EMAIL)) {
                    $errors["rules.{$index}"] = 'Invalid email address';
                }
                
                if ($rule['type'] === 'domain' && !preg_match('/^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/', $rule['value'])) {
                    $errors["rules.{$index}"] = 'Invalid domain format';
                }
            }
        }

        return $errors;
    }
}
<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\AccessPolicy;
use App\Models\CloudflareZone;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;

class PoliciesController extends Controller
{
    /**
     * Display a listing of access policies for the organization.
     */
    public function index(Request $request): JsonResponse
    {
        $organization = $request->get('organization');

        if (!$organization) {
            return response()->json([
                'error' => 'No organization associated with this API token',
            ], 400);
        }

        $query = $organization->policies()->with(['zone', 'creator', 'updater']);

        // Apply filters
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        if ($request->has('domain')) {
            $query->where('domain', 'like', '%' . $request->domain . '%');
        }

        if ($request->has('zone_id')) {
            $query->where('cloudflare_zone_id', $request->zone_id);
        }

        // Pagination
        $perPage = min($request->get('per_page', 25), 100); // Max 100 items per page
        $policies = $query->paginate($perPage);

        return response()->json([
            'data' => $policies->items(),
            'pagination' => [
                'current_page' => $policies->currentPage(),
                'last_page' => $policies->lastPage(),
                'per_page' => $policies->perPage(),
                'total' => $policies->total(),
                'from' => $policies->firstItem(),
                'to' => $policies->lastItem(),
            ],
        ]);
    }

    /**
     * Store a newly created access policy.
     */
    public function store(Request $request): JsonResponse
    {
        $organization = $request->get('organization');
        $apiUser = $request->get('api_user');

        if (!$organization) {
            return response()->json([
                'error' => 'No organization associated with this API token',
            ], 400);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'domain' => 'required|string|max:255',
            'path' => 'nullable|string|max:500',
            'cloudflare_zone_id' => [
                'required',
                Rule::exists('cloudflare_zones', 'id')->where(function ($query) use ($organization) {
                    return $query->where('organisation_id', $organization->id);
                }),
            ],
            'session_duration' => 'nullable|integer|min:1|max:720', // Max 12 hours in minutes
            'require_mfa' => 'boolean',
            'rules' => 'required|array|min:1',
            'rules.*.type' => 'required|string|in:email,email_domain,group,country,ip,service_token',
            'rules.*.value' => 'required|string',
            'rules.*.action' => 'required|string|in:allow,deny',
            'status' => 'in:active,pending,disabled',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'error' => 'Validation failed',
                'details' => $validator->errors(),
            ], 422);
        }

        try {
            $policy = AccessPolicy::create([
                'organisation_id' => $organization->id,
                'name' => $request->name,
                'domain' => $request->domain,
                'path' => $request->path,
                'cloudflare_zone_id' => $request->cloudflare_zone_id,
                'session_duration' => $request->session_duration ?? 60, // Default 1 hour
                'require_mfa' => $request->require_mfa ?? false,
                'rules' => $request->rules,
                'status' => $request->status ?? 'active',
                'created_by' => $apiUser->id,
                'updated_by' => $apiUser->id,
            ]);

            $policy->load(['zone', 'creator', 'updater']);

            return response()->json([
                'data' => $this->formatPolicy($policy),
                'message' => 'Access policy created successfully',
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Failed to create access policy',
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Display the specified access policy.
     */
    public function show(Request $request, string $id): JsonResponse
    {
        $organization = $request->get('organization');

        if (!$organization) {
            return response()->json([
                'error' => 'No organization associated with this API token',
            ], 400);
        }

        $policy = $organization->policies()
            ->with(['zone', 'creator', 'updater'])
            ->find($id);

        if (!$policy) {
            return response()->json([
                'error' => 'Access policy not found',
            ], 404);
        }

        return response()->json([
            'data' => $this->formatPolicy($policy),
        ]);
    }

    /**
     * Update the specified access policy.
     */
    public function update(Request $request, string $id): JsonResponse
    {
        $organization = $request->get('organization');
        $apiUser = $request->get('api_user');

        if (!$organization) {
            return response()->json([
                'error' => 'No organization associated with this API token',
            ], 400);
        }

        $policy = $organization->policies()->find($id);

        if (!$policy) {
            return response()->json([
                'error' => 'Access policy not found',
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|required|string|max:255',
            'domain' => 'sometimes|required|string|max:255',
            'path' => 'nullable|string|max:500',
            'cloudflare_zone_id' => [
                'sometimes',
                'required',
                Rule::exists('cloudflare_zones', 'id')->where(function ($query) use ($organization) {
                    return $query->where('organisation_id', $organization->id);
                }),
            ],
            'session_duration' => 'nullable|integer|min:1|max:720',
            'require_mfa' => 'boolean',
            'rules' => 'sometimes|required|array|min:1',
            'rules.*.type' => 'required|string|in:email,email_domain,group,country,ip,service_token',
            'rules.*.value' => 'required|string',
            'rules.*.action' => 'required|string|in:allow,deny',
            'status' => 'in:active,pending,disabled',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'error' => 'Validation failed',
                'details' => $validator->errors(),
            ], 422);
        }

        try {
            $updateData = $request->only([
                'name', 'domain', 'path', 'cloudflare_zone_id', 
                'session_duration', 'require_mfa', 'rules', 'status'
            ]);
            
            $updateData['updated_by'] = $apiUser->id;

            $policy->update($updateData);
            $policy->load(['zone', 'creator', 'updater']);

            return response()->json([
                'data' => $this->formatPolicy($policy),
                'message' => 'Access policy updated successfully',
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Failed to update access policy',
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Remove the specified access policy.
     */
    public function destroy(Request $request, string $id): JsonResponse
    {
        $organization = $request->get('organization');

        if (!$organization) {
            return response()->json([
                'error' => 'No organization associated with this API token',
            ], 400);
        }

        $policy = $organization->policies()->find($id);

        if (!$policy) {
            return response()->json([
                'error' => 'Access policy not found',
            ], 404);
        }

        try {
            $policy->delete();

            return response()->json([
                'message' => 'Access policy deleted successfully',
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Failed to delete access policy',
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Bulk operations on access policies.
     */
    public function bulk(Request $request): JsonResponse
    {
        $organization = $request->get('organization');
        $apiUser = $request->get('api_user');

        if (!$organization) {
            return response()->json([
                'error' => 'No organization associated with this API token',
            ], 400);
        }

        $validator = Validator::make($request->all(), [
            'action' => 'required|in:enable,disable,delete',
            'policy_ids' => 'required|array|min:1|max:100', // Max 100 policies at once
            'policy_ids.*' => 'integer|exists:access_policies,id',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'error' => 'Validation failed',
                'details' => $validator->errors(),
            ], 422);
        }

        $policies = $organization->policies()
            ->whereIn('id', $request->policy_ids)
            ->get();

        if ($policies->count() !== count($request->policy_ids)) {
            return response()->json([
                'error' => 'Some policies were not found or do not belong to this organization',
            ], 404);
        }

        try {
            $updated = 0;

            foreach ($policies as $policy) {
                switch ($request->action) {
                    case 'enable':
                        $policy->update(['status' => 'active', 'updated_by' => $apiUser->id]);
                        $updated++;
                        break;
                    case 'disable':
                        $policy->update(['status' => 'disabled', 'updated_by' => $apiUser->id]);
                        $updated++;
                        break;
                    case 'delete':
                        $policy->delete();
                        $updated++;
                        break;
                }
            }

            return response()->json([
                'message' => "Successfully {$request->action}d {$updated} access policies",
                'updated_count' => $updated,
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'error' => "Failed to {$request->action} access policies",
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Check if a policy exists and compare with provided configuration.
     * This is useful for CI/CD deployments to avoid creating duplicate policies.
     */
    public function check(Request $request): JsonResponse
    {
        $organization = $request->get('organization');

        if (!$organization) {
            return response()->json([
                'error' => 'No organization associated with this API token',
            ], 400);
        }

        $validator = Validator::make($request->all(), [
            'domain' => 'required|string|max:255',
            'path' => 'nullable|string|max:500',
            'name' => 'sometimes|string|max:255',
            'session_duration' => 'sometimes|integer|min:1|max:720',
            'require_mfa' => 'sometimes|boolean',
            'rules' => 'sometimes|array',
            'rules.*.type' => 'required_with:rules|string|in:email,email_domain,group,country,ip,service_token',
            'rules.*.value' => 'required_with:rules|string',
            'rules.*.action' => 'required_with:rules|string|in:allow,deny',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'error' => 'Validation failed',
                'details' => $validator->errors(),
            ], 422);
        }

        $domain = $request->input('domain');
        $path = $request->input('path', '/');

        // Find existing policy by domain and path
        $existingPolicy = $organization->policies()
            ->where('domain', $domain)
            ->where('path', $path)
            ->with(['zone', 'creator', 'updater'])
            ->first();

        if (!$existingPolicy) {
            return response()->json([
                'exists' => false,
                'message' => 'Policy does not exist for this domain and path',
                'action' => 'create',
                'lookup' => [
                    'domain' => $domain,
                    'path' => $path,
                ],
            ]);
        }

        // Compare the existing policy with the provided configuration
        $comparison = $this->comparePolicy($existingPolicy, $request->only([
            'name', 'session_duration', 'require_mfa', 'rules'
        ]));

        return response()->json([
            'exists' => true,
            'id' => $existingPolicy->id,
            'current_policy' => $this->formatPolicy($existingPolicy),
            'has_changes' => $comparison['has_changes'],
            'changes' => $comparison['changes'],
            'action' => $comparison['has_changes'] ? 'update' : 'skip',
            'message' => $comparison['has_changes'] 
                ? 'Policy exists but has different configuration' 
                : 'Policy exists with identical configuration',
        ]);
    }

    /**
     * Upsert a policy (create or update based on domain/path).
     * This is the recommended endpoint for CI/CD deployments.
     */
    public function upsert(Request $request): JsonResponse
    {
        $organization = $request->get('organization');
        $apiUser = $request->get('api_user');

        if (!$organization) {
            return response()->json([
                'error' => 'No organization associated with this API token',
            ], 400);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'domain' => 'required|string|max:255',
            'path' => 'nullable|string|max:500',
            'cloudflare_zone_id' => [
                'required',
                Rule::exists('cloudflare_zones', 'id')->where(function ($query) use ($organization) {
                    return $query->where('organisation_id', $organization->id);
                }),
            ],
            'session_duration' => 'nullable|integer|min:1|max:720',
            'require_mfa' => 'boolean',
            'rules' => 'required|array|min:1',
            'rules.*.type' => 'required|string|in:email,email_domain,group,country,ip,service_token',
            'rules.*.value' => 'required|string',
            'rules.*.action' => 'required|string|in:allow,deny',
            'status' => 'in:active,pending,disabled',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'error' => 'Validation failed',
                'details' => $validator->errors(),
            ], 422);
        }

        $domain = $request->input('domain');
        $path = $request->input('path', '/');

        // Check if policy already exists
        $existingPolicy = $organization->policies()
            ->where('domain', $domain)
            ->where('path', $path)
            ->first();

        try {
            if ($existingPolicy) {
                // Update existing policy
                $comparison = $this->comparePolicy($existingPolicy, $request->only([
                    'name', 'session_duration', 'require_mfa', 'rules'
                ]));

                if (!$comparison['has_changes']) {
                    // No changes needed
                    $existingPolicy->load(['zone', 'creator', 'updater']);
                    return response()->json([
                        'data' => $this->formatPolicy($existingPolicy),
                        'action' => 'skipped',
                        'message' => 'Policy already exists with identical configuration',
                    ]);
                }

                // Update the policy
                $updateData = $request->only([
                    'name', 'cloudflare_zone_id', 'session_duration', 'require_mfa', 'rules', 'status'
                ]);
                $updateData['updated_by'] = $apiUser->id;

                $existingPolicy->update($updateData);
                $existingPolicy->load(['zone', 'creator', 'updater']);

                return response()->json([
                    'data' => $this->formatPolicy($existingPolicy),
                    'action' => 'updated',
                    'message' => 'Access policy updated successfully',
                    'changes' => $comparison['changes'],
                ]);
            } else {
                // Create new policy
                $policy = AccessPolicy::create([
                    'organisation_id' => $organization->id,
                    'name' => $request->name,
                    'domain' => $request->domain,
                    'path' => $request->path ?? '/',
                    'cloudflare_zone_id' => $request->cloudflare_zone_id,
                    'session_duration' => $request->session_duration ?? 60,
                    'require_mfa' => $request->require_mfa ?? false,
                    'rules' => $request->rules,
                    'status' => $request->status ?? 'active',
                    'created_by' => $apiUser->id,
                    'updated_by' => $apiUser->id,
                ]);

                $policy->load(['zone', 'creator', 'updater']);

                return response()->json([
                    'data' => $this->formatPolicy($policy),
                    'action' => 'created',
                    'message' => 'Access policy created successfully',
                ], 201);
            }
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Failed to upsert access policy',
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Compare existing policy with provided configuration and return detailed changes
     */
    private function comparePolicy(AccessPolicy $existingPolicy, array $newConfig): array
    {
        $changes = [];
        $hasChanges = false;

        // Compare name if provided
        if (isset($newConfig['name']) && $existingPolicy->name !== $newConfig['name']) {
            $changes['name'] = [
                'from' => $existingPolicy->name,
                'to' => $newConfig['name'],
            ];
            $hasChanges = true;
        }

        // Compare session duration if provided
        if (isset($newConfig['session_duration']) && $existingPolicy->session_duration !== $newConfig['session_duration']) {
            $changes['session_duration'] = [
                'from' => $existingPolicy->session_duration,
                'to' => $newConfig['session_duration'],
            ];
            $hasChanges = true;
        }

        // Compare MFA requirement if provided
        if (isset($newConfig['require_mfa']) && $existingPolicy->require_mfa !== $newConfig['require_mfa']) {
            $changes['require_mfa'] = [
                'from' => $existingPolicy->require_mfa,
                'to' => $newConfig['require_mfa'],
            ];
            $hasChanges = true;
        }

        // Compare rules if provided
        if (isset($newConfig['rules'])) {
            $existingRules = $existingPolicy->rules ?? [];
            $newRules = $newConfig['rules'];

            // Sort rules by type and value for consistent comparison
            $sortRules = function($rules) {
                usort($rules, fn($a, $b) => ($a['type'] ?? '') . ($a['value'] ?? '') <=> ($b['type'] ?? '') . ($b['value'] ?? ''));
                return $rules;
            };

            $sortedExisting = $sortRules($existingRules);
            $sortedNew = $sortRules($newRules);

            if (json_encode($sortedExisting) !== json_encode($sortedNew)) {
                $changes['rules'] = [
                    'from' => $existingRules,
                    'to' => $newRules,
                ];
                $hasChanges = true;
            }
        }

        return [
            'has_changes' => $hasChanges,
            'changes' => $changes,
        ];
    }

    /**
     * Format access policy for API response.
     */
    private function formatPolicy(AccessPolicy $policy): array
    {
        return [
            'id' => $policy->id,
            'name' => $policy->name,
            'domain' => $policy->domain,
            'path' => $policy->path,
            'full_url' => $policy->full_url,
            'cloudflare_zone_id' => $policy->cloudflare_zone_id,
            'zone' => $policy->zone ? [
                'id' => $policy->zone->id,
                'name' => $policy->zone->name,
                'zone_id' => $policy->zone->zone_id,
            ] : null,
            'cf_application_id' => $policy->cf_application_id,
            'session_duration' => $policy->session_duration,
            'require_mfa' => $policy->require_mfa,
            'rules' => $policy->rules,
            'email_rules' => $policy->getEmailRules(),
            'status' => $policy->status,
            'is_active' => $policy->isActive(),
            'created_by' => $policy->creator ? [
                'id' => $policy->creator->id,
                'name' => $policy->creator->name,
                'email' => $policy->creator->email,
            ] : null,
            'updated_by' => $policy->updater ? [
                'id' => $policy->updater->id,
                'name' => $policy->updater->name,
                'email' => $policy->updater->email,
            ] : null,
            'created_at' => $policy->created_at->toISOString(),
            'updated_at' => $policy->updated_at->toISOString(),
        ];
    }
}

<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Organisation;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class OrganizationsController extends Controller
{
    /**
     * Display a listing of organizations accessible to the API token.
     * Since API tokens are scoped to specific organizations, this typically returns one organization.
     */
    public function index(Request $request): JsonResponse
    {
        $organization = $request->get('organization');

        if (!$organization) {
            return response()->json([
                'error' => 'No organization associated with this API token',
            ], 400);
        }

        return response()->json([
            'data' => [
                'organizations' => [$this->formatOrganization($organization)],
            ],
        ]);
    }

    /**
     * Display the specified organization.
     */
    public function show(Request $request, string $id): JsonResponse
    {
        $organization = $request->get('organization');

        // Ensure the API token can only access its associated organization
        if (!$organization || $organization->id != $id) {
            return response()->json([
                'error' => 'Organization not found or access denied',
            ], 404);
        }

        return response()->json([
            'data' => $this->formatOrganization($organization),
        ]);
    }

    /**
     * Get organization statistics (policies, applications, etc.)
     */
    public function stats(Request $request, string $id): JsonResponse
    {
        $organization = $request->get('organization');

        if (!$organization || $organization->id != $id) {
            return response()->json([
                'error' => 'Organization not found or access denied',
            ], 404);
        }

        $stats = [
            'policies_count' => $organization->policies()->count(),
            'zones_count' => $organization->zones()->count(),
            'users_count' => $organization->users()->count() + 1, // +1 for owner
            'token_status' => $organization->getTokenStatus(),
            'token_expires_at' => $organization->token_expires_at?->toISOString(),
            'last_policy_update' => $organization->policies()
                ->orderBy('updated_at', 'desc')
                ->value('updated_at')?->toISOString(),
        ];

        return response()->json([
            'data' => $stats,
        ]);
    }

    /**
     * Format organization for API response
     */
    private function formatOrganization(Organisation $organization): array
    {
        return [
            'id' => $organization->uuid, // Use UUID for external API
            'uuid' => $organization->uuid, // Explicit UUID field
            'legacy_id' => $organization->id, // Keep numeric ID for backward compatibility
            'name' => $organization->name,
            'slug' => $organization->slug,
            'description' => $organization->description,
            'timezone' => $organization->timezone,
            'cloudflare_account_id' => $organization->cloudflare_account_id,
            'token_status' => $organization->getTokenStatus(),
            'token_expires_at' => $organization->token_expires_at?->toISOString(),
            'created_at' => $organization->created_at->toISOString(),
            'updated_at' => $organization->updated_at->toISOString(),
        ];
    }
}

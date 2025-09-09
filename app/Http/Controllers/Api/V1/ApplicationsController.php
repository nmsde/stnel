<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\CloudflareZone;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ApplicationsController extends Controller
{
    /**
     * Display a listing of Cloudflare zones/applications for the organization.
     */
    public function index(Request $request): JsonResponse
    {
        $organization = $request->get('organization');

        if (!$organization) {
            return response()->json([
                'error' => 'No organization associated with this API token',
            ], 400);
        }

        $query = $organization->zones()->with(['policies']);

        // Apply filters
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        if ($request->has('name')) {
            $query->where('name', 'like', '%' . $request->name . '%');
        }

        // Pagination
        $perPage = min($request->get('per_page', 25), 100);
        $zones = $query->paginate($perPage);

        return response()->json([
            'data' => $zones->items(),
            'pagination' => [
                'current_page' => $zones->currentPage(),
                'last_page' => $zones->lastPage(),
                'per_page' => $zones->perPage(),
                'total' => $zones->total(),
                'from' => $zones->firstItem(),
                'to' => $zones->lastItem(),
            ],
        ]);
    }

    /**
     * Display the specified Cloudflare zone/application.
     */
    public function show(Request $request, string $id): JsonResponse
    {
        $organization = $request->get('organization');

        if (!$organization) {
            return response()->json([
                'error' => 'No organization associated with this API token',
            ], 400);
        }

        $zone = $organization->zones()
            ->with(['policies'])
            ->find($id);

        if (!$zone) {
            return response()->json([
                'error' => 'Application/Zone not found',
            ], 404);
        }

        return response()->json([
            'data' => $this->formatZone($zone),
        ]);
    }

    /**
     * Get statistics for a specific zone/application.
     */
    public function stats(Request $request, string $id): JsonResponse
    {
        $organization = $request->get('organization');

        if (!$organization) {
            return response()->json([
                'error' => 'No organization associated with this API token',
            ], 400);
        }

        $zone = $organization->zones()->find($id);

        if (!$zone) {
            return response()->json([
                'error' => 'Application/Zone not found',
            ], 404);
        }

        $stats = [
            'policies_count' => $zone->policies()->count(),
            'active_policies_count' => $zone->policies()->where('status', 'active')->count(),
            'pending_policies_count' => $zone->policies()->where('status', 'pending')->count(),
            'disabled_policies_count' => $zone->policies()->where('status', 'disabled')->count(),
            'last_policy_update' => $zone->policies()
                ->orderBy('updated_at', 'desc')
                ->value('updated_at')?->toISOString(),
        ];

        return response()->json([
            'data' => $stats,
        ]);
    }

    /**
     * Format zone for API response.
     */
    private function formatZone(CloudflareZone $zone): array
    {
        return [
            'id' => $zone->id,
            'name' => $zone->name,
            'zone_id' => $zone->zone_id,
            'status' => $zone->status,
            'policies_count' => $zone->policies_count ?? $zone->policies()->count(),
            'created_at' => $zone->created_at->toISOString(),
            'updated_at' => $zone->updated_at->toISOString(),
        ];
    }
}

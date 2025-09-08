<?php

namespace App\Http\Controllers;

use App\Models\Organisation;
use App\Services\AuditService;
use App\Services\CloudflareAccessLogsService;
use App\Services\CloudflareService;
use App\Services\CloudflareTokenValidationService;
use App\Services\SubscriptionService;
use Exception;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class OrganisationController extends Controller
{
    use AuthorizesRequests;

    public function __construct(
        protected AuditService $auditService,
        protected SubscriptionService $subscriptionService
    ) {}

    /**
     * Display a listing of organisations.
     */
    public function index(Request $request): Response
    {
        $user = $request->user();

        $organisations = Organisation::where('user_id', $user->id)
            ->orWhereHas('users', function ($query) use ($user) {
                $query->where('user_id', $user->id);
            })
            ->with(['owner:id,name,email'])
            ->withCount(['zones', 'policies'])
            ->orderBy('created_at', 'desc')
            ->get();

        // Get subscription data
        $usageStats = $this->subscriptionService->getUserUsageStats($user);

        return Inertia::render('organisations/index', [
            'organisations' => $organisations,
            'subscriptionData' => [
                'current_plan' => $usageStats['plan'],
                'organizations_count' => $usageStats['organizations']['current'],
                'max_organizations' => $usageStats['organizations']['limit'],
                'endpoints_count' => $usageStats['endpoints']['current'],
                'max_endpoints' => $usageStats['endpoints']['limit'],
                'can_create_organization' => $user->canCreateOrganization(),
                'can_create_endpoint' => $user->canCreateProtectedEndpoint(),
            ],
        ]);
    }

    /**
     * Show the form for creating a new organisation.
     */
    public function create(Request $request): Response|RedirectResponse
    {
        $user = $request->user();

        // Check subscription limits
        if (! $this->subscriptionService->canUserCreateOrganization($user)) {
            return to_route('organisations.index')
                ->with('error', 'You have reached the maximum number of organizations for your plan. Please upgrade to create more organizations.');
        }

        return Inertia::render('organisations/create');
    }

    /**
     * Store a newly created organisation.
     */
    public function store(Request $request): RedirectResponse
    {
        // Check subscription limits before validation
        if (! $this->subscriptionService->canUserCreateOrganization($request->user())) {
            return back()
                ->withErrors(['subscription' => 'You have reached the maximum number of organizations for your plan. Please upgrade to create more organizations.'])
                ->withInput();
        }

        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string|max:1000',
            'timezone' => 'nullable|string|max:50',
            'api_token' => 'nullable|string',
        ]);

        DB::beginTransaction();

        try {
            $apiToken = null;
            if ($request->has('api_token') && ! empty(trim($request->api_token))) {
                $apiToken = trim($request->api_token);
            }

            $organisation = Organisation::create([
                'user_id' => $request->user()->id,
                'name' => $request->name,
                'description' => $request->description,
                'timezone' => $request->timezone ?? 'UTC',
                'api_token' => $apiToken,
            ]);

            $organisation->addUser($request->user(), 'admin');

            if ($apiToken) {
                $validationService = new CloudflareTokenValidationService;
                $validation = $validationService->checkAndUpdateTokenHealth($organisation);

                if (! $validation['valid']) {
                    throw new Exception('Invalid API token: '.$validation['error']);
                }

                // Sync zones using the CloudflareService
                $cloudflare = new CloudflareService($organisation);
                $cloudflare->syncZones();
            }

            $this->auditService->logCreate($organisation, $request->user(), $organisation, 'organisation_created');

            DB::commit();

            return to_route('organisations.show', $organisation)
                ->with('status', 'Organisation created successfully.');

        } catch (Exception $e) {
            DB::rollBack();

            return back()
                ->withErrors(['api_token' => $e->getMessage()])
                ->withInput();
        }
    }

    /**
     * Display the specified organisation.
     */
    public function show(Organisation $organisation): Response
    {
        $this->authorize('view', $organisation);

        $organisation->load([
            'owner:id,name,email',
            'users:id,name,email',
            'zones',
            'policies' => function ($query) {
                $query->with('zone:id,name')->latest();
            },
        ]);

        // Get recent access logs
        $recentLogs = [];
        $logStats = [
            'total' => 0,
            'allowed' => 0,
            'blocked' => 0,
            'unique_users' => 0,
        ];

        try {
            if ($organisation->api_token) {
                $logsService = new CloudflareAccessLogsService($organisation);
                $result = $logsService->getAccessLogs(['limit' => 10]);

                if ($result['success']) {
                    $recentLogs = $logsService->transformLogs($result['logs']);
                    $stats = $logsService->getLogStats($result['logs']);
                    $logStats = [
                        'total' => $stats['total'],
                        'allowed' => $stats['allowed'],
                        'blocked' => $stats['blocked'],
                        'unique_users' => $stats['unique_users'],
                    ];
                }
            }
        } catch (Exception $e) {
            // Silently handle access logs errors for now
        }

        return Inertia::render('organisations/show', [
            'organisation' => $organisation,
            'policies' => [
                'data' => $organisation->policies,
            ],
            'zones' => $organisation->zones,
            'recentLogs' => $recentLogs,
            'logStats' => $logStats,
        ]);
    }

    /**
     * Show the form for editing the organisation.
     */
    public function edit(Organisation $organisation): Response
    {
        $this->authorize('update', $organisation);

        return Inertia::render('organisations/edit', [
            'organisation' => $organisation,
        ]);
    }

    /**
     * Update the specified organisation.
     */
    public function update(Request $request, Organisation $organisation): RedirectResponse
    {
        $this->authorize('update', $organisation);

        $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string|max:1000',
            'timezone' => 'nullable|string|max:50',
            'api_token' => 'nullable|string',
        ]);

        DB::beginTransaction();

        try {
            $oldValues = $organisation->getAttributes();

            $organisation->update($request->only(['name', 'description', 'timezone']));

            if ($request->has('api_token')) {
                $organisation->api_token = $request->filled('api_token') ? $request->api_token : null;
                $organisation->save();

                if ($request->filled('api_token')) {
                    $validationService = new CloudflareTokenValidationService;
                    $validation = $validationService->checkAndUpdateTokenHealth($organisation);

                    if (! $validation['valid']) {
                        throw new Exception('Invalid API token: '.$validation['error']);
                    }

                    // Sync zones using the CloudflareService
                    $cloudflare = new CloudflareService($organisation);
                    $cloudflare->syncZones();
                }
            }

            $this->auditService->logUpdate($organisation, $request->user(), $organisation, $oldValues, 'organisation_updated');

            DB::commit();

            return to_route('organisations.show', $organisation)
                ->with('status', 'Organisation updated successfully.');

        } catch (Exception $e) {
            DB::rollBack();

            return back()
                ->withErrors(['api_token' => $e->getMessage()])
                ->withInput();
        }
    }

    /**
     * Remove the specified organisation.
     */
    public function destroy(Request $request, Organisation $organisation): RedirectResponse
    {
        $this->authorize('delete', $organisation);

        DB::beginTransaction();

        try {
            $this->auditService->logDelete($organisation, $request->user(), $organisation, 'organisation_deleted');

            $organisation->delete();

            DB::commit();

            return to_route('organisations.index')
                ->with('status', 'Organisation deleted successfully.');

        } catch (Exception $e) {
            DB::rollBack();

            return back()
                ->withErrors(['error' => 'Failed to delete organisation: '.$e->getMessage()]);
        }
    }

    /**
     * Validate API token for the organisation.
     */
    public function validateToken(Request $request, Organisation $organisation): RedirectResponse
    {
        $this->authorize('update', $organisation);

        $request->validate([
            'api_token' => 'required|string',
        ]);

        try {
            $organisation->api_token = $request->api_token;
            $organisation->save();

            $cloudflare = new CloudflareService($organisation);
            $result = $cloudflare->testConnection();

            if ($result['success']) {
                $cloudflare->syncZones();

                $this->auditService->logTokenValidation($organisation, $request->user(), true);

                return back()->with('status', 'API token validated and zones synced successfully.');
            } else {
                $this->auditService->logTokenValidation($organisation, $request->user(), false, $result['error']);

                return back()->withErrors(['api_token' => $result['error']]);
            }
        } catch (Exception $e) {
            $this->auditService->logTokenValidation($organisation, $request->user(), false, $e->getMessage());

            return back()->withErrors(['api_token' => $e->getMessage()]);
        }
    }

    /**
     * Sync zones from Cloudflare.
     */
    public function syncZones(Request $request, Organisation $organisation): RedirectResponse
    {
        $this->authorize('update', $organisation);

        try {
            $cloudflare = new CloudflareService($organisation);
            $cloudflare->syncZones();

            $this->auditService->logCustom(
                $organisation,
                $request->user(),
                'zones_synced',
                'Organisation',
                $organisation->id
            );

            return back()->with('status', 'Zones synced successfully.');
        } catch (Exception $e) {
            return back()->withErrors(['error' => 'Failed to sync zones: '.$e->getMessage()]);
        }
    }

    /**
     * Check token health and update organization
     */
    public function checkTokenHealth(Request $request, Organisation $organisation)
    {
        $this->authorize('update', $organisation);

        try {
            $validationService = new CloudflareTokenValidationService;
            $result = $validationService->checkAndUpdateTokenHealth($organisation);

            if ($result['valid']) {
                $this->auditService->logCustom(
                    $organisation,
                    $request->user(),
                    'token_health_checked',
                    'Organisation',
                    $organisation->id,
                    ['status' => 'valid']
                );

                return response()->json([
                    'success' => true,
                    'message' => 'Token health checked successfully',
                    'token_info' => $result,
                ]);
            } else {
                $this->auditService->logCustom(
                    $organisation,
                    $request->user(),
                    'token_health_check_failed',
                    'Organisation',
                    $organisation->id,
                    ['error' => $result['error']]
                );

                return response()->json([
                    'success' => false,
                    'error' => $result['error'],
                ], 422);
            }
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'error' => 'Failed to check token health: '.$e->getMessage(),
            ], 500);
        }
    }

    /**
     * Show audit logs for the organisation.
     */
    public function auditLogs(Organisation $organisation): Response
    {
        $this->authorize('view', $organisation);

        $logs = $organisation->auditLogs()
            ->with('user:id,name,email')
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        return Inertia::render('organisations/audit-logs', [
            'organisation' => $organisation,
            'logs' => $logs,
        ]);
    }
}

<?php

namespace App\Http\Controllers;

use App\Models\AccessPolicy;
use App\Models\Organisation;
use App\Services\AccessPolicyService;
use App\Services\AuditService;
use App\Services\SubscriptionService;
use Exception;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AccessPolicyController extends Controller
{
    use AuthorizesRequests;

    public function __construct(
        protected AuditService $auditService,
        protected SubscriptionService $subscriptionService
    ) {}

    /**
     * Display a listing of policies for the organisation.
     */
    public function index(Request $request, Organisation $organisation): Response
    {
        $this->authorize('view', $organisation);

        $policies = $organisation->policies()
            ->with(['zone:id,name,zone_id', 'creator:id,name,email'])
            ->when($request->zone_id, function ($query) use ($request) {
                $query->where('cloudflare_zone_id', $request->zone_id);
            })
            ->when($request->status, function ($query) use ($request) {
                $query->where('status', $request->status);
            })
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        return Inertia::render('organisations/policies/index', [
            'organisation' => $organisation,
            'policies' => $policies,
            'zones' => $organisation->zones,
            'filters' => [
                'zone_id' => $request->zone_id,
                'status' => $request->status,
            ],
        ]);
    }

    /**
     * Show the form for creating a new policy.
     */
    public function create(Organisation $organisation): Response
    {
        $this->authorize('update', $organisation);

        return Inertia::render('organisations/policies/create', [
            'organisation' => $organisation,
            'zones' => $organisation->zones,
        ]);
    }

    /**
     * Store a newly created policy.
     */
    public function store(Request $request, Organisation $organisation): RedirectResponse
    {
        $this->authorize('update', $organisation);

        // Check subscription limits before validation
        if (! $this->subscriptionService->canUserCreatePolicy($request->user())) {
            return back()
                ->withErrors(['subscription' => 'You have reached the maximum number of protected endpoints for your plan. Please upgrade to create more policies.'])
                ->withInput();
        }

        $request->validate([
            'cloudflare_zone_id' => 'required|exists:cloudflare_zones,id',
            'name' => 'required|string|max:255',
            'domain' => 'required|string|max:255',
            'path' => 'nullable|string|max:255',
            'session_duration' => 'nullable|string|in:30m,1h,2h,4h,8h,12h,24h,7d,30d',
            'require_mfa' => 'boolean',
            'rules' => 'required|array|min:1',
            'rules.*.type' => 'required|string|in:email,domain,group',
            'rules.*.value' => 'required|string',
        ]);

        try {
            $policyService = new AccessPolicyService($this->auditService);
            $policy = $policyService->create(
                $organisation,
                $request->user(),
                $request->all()
            );

            return to_route('organisations.policies.show', [$organisation, $policy])
                ->with('status', 'Policy created successfully.');

        } catch (Exception $e) {
            return back()
                ->withErrors(['error' => 'Failed to create policy: '.$e->getMessage()])
                ->withInput();
        }
    }

    /**
     * Display the specified policy.
     */
    public function show(Organisation $organisation, AccessPolicy $policy): Response
    {
        $this->authorize('view', $organisation);

        if ($policy->organisation_id !== $organisation->id) {
            abort(404);
        }

        $policy->load(['zone', 'creator', 'updater']);

        return Inertia::render('organisations/policies/show', [
            'organisation' => $organisation,
            'policy' => $policy,
        ]);
    }

    /**
     * Show the form for editing the specified policy.
     */
    public function edit(Organisation $organisation, AccessPolicy $policy): Response
    {
        $this->authorize('update', $organisation);

        if ($policy->organisation_id !== $organisation->id) {
            abort(404);
        }

        return Inertia::render('organisations/policies/edit', [
            'organisation' => $organisation,
            'policy' => $policy,
            'zones' => $organisation->zones,
        ]);
    }

    /**
     * Update the specified policy.
     */
    public function update(Request $request, Organisation $organisation, AccessPolicy $policy): RedirectResponse
    {
        $this->authorize('update', $organisation);

        if ($policy->organisation_id !== $organisation->id) {
            abort(404);
        }

        $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'domain' => 'sometimes|required|string|max:255',
            'path' => 'nullable|string|max:255',
            'session_duration' => 'nullable|string|in:30m,1h,2h,4h,8h,12h,24h,7d,30d',
            'require_mfa' => 'boolean',
            'rules' => 'sometimes|required|array|min:1',
            'rules.*.type' => 'required|string|in:email,domain,group',
            'rules.*.value' => 'required|string',
        ]);

        try {
            $policyService = new AccessPolicyService($this->auditService);
            $policy = $policyService->update(
                $policy,
                $request->user(),
                $request->all()
            );

            return to_route('organisations.policies.show', [$organisation, $policy])
                ->with('status', 'Policy updated successfully.');

        } catch (Exception $e) {
            return back()
                ->withErrors(['error' => 'Failed to update policy: '.$e->getMessage()])
                ->withInput();
        }
    }

    /**
     * Remove the specified policy.
     */
    public function destroy(Request $request, Organisation $organisation, AccessPolicy $policy): RedirectResponse
    {
        $this->authorize('update', $organisation);

        if ($policy->organisation_id !== $organisation->id) {
            abort(404);
        }

        try {
            $policyService = new AccessPolicyService($this->auditService);
            $policyService->delete($policy, $request->user());

            return to_route('organisations.policies.index', $organisation)
                ->with('status', 'Policy deleted successfully.');

        } catch (Exception $e) {
            return back()
                ->withErrors(['error' => 'Failed to delete policy: '.$e->getMessage()]);
        }
    }

    /**
     * Sync policy with Cloudflare.
     */
    public function sync(Request $request, Organisation $organisation, AccessPolicy $policy): RedirectResponse
    {
        $this->authorize('update', $organisation);

        if ($policy->organisation_id !== $organisation->id) {
            abort(404);
        }

        try {
            $policyService = new AccessPolicyService($this->auditService);
            $policyService->sync($policy);

            return back()->with('status', 'Policy synced successfully.');

        } catch (Exception $e) {
            return back()->withErrors(['error' => 'Failed to sync policy: '.$e->getMessage()]);
        }
    }
}

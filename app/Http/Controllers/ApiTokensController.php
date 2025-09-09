<?php

namespace App\Http\Controllers;

use App\Models\ApiToken;
use App\Models\Organisation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;
use Inertia\Response;

class ApiTokensController extends Controller
{
    /**
     * Display a listing of API tokens for the user.
     */
    public function index(Request $request): Response
    {
        $user = $request->user();
        
        $tokens = $user->apiTokens()
            ->with(['organisation', 'usageLogs' => function ($query) {
                $query->orderBy('created_at', 'desc')->limit(5);
            }])
            ->withCount(['usageLogs'])
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($token) {
                return [
                    'id' => $token->id,
                    'name' => $token->name,
                    'organization' => [
                        'id' => $token->organisation->id,
                        'name' => $token->organisation->name,
                    ],
                    'scopes' => $token->scopes,
                    'expires_at' => $token->expires_at?->format('M j, Y'),
                    'last_used_at' => $token->last_used_at?->diffForHumans(),
                    'usage_count' => $token->usage_logs_count,
                    'is_expired' => $token->isExpired(),
                    'created_at' => $token->created_at->format('M j, Y'),
                ];
            });

        $organizations = $user->allOrganisations()->map(function ($org) {
            return [
                'id' => $org->id,
                'name' => $org->name,
            ];
        });

        return Inertia::render('api-tokens/index', [
            'tokens' => $tokens,
            'organizations' => $organizations,
            'availableScopes' => ApiToken::AVAILABLE_SCOPES,
        ]);
    }

    /**
     * Show the form for creating a new API token.
     */
    public function create(Request $request): Response
    {
        $user = $request->user();
        
        $organizations = $user->allOrganisations()->map(function ($org) {
            return [
                'id' => $org->id,
                'name' => $org->name,
            ];
        });

        return Inertia::render('api-tokens/create', [
            'organizations' => $organizations,
            'availableScopes' => ApiToken::AVAILABLE_SCOPES,
        ]);
    }

    /**
     * Store a newly created API token.
     */
    public function store(Request $request)
    {
        $user = $request->user();

        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'organization_id' => [
                'required',
                'exists:organisations,id',
                function ($attribute, $value, $fail) use ($user) {
                    $organization = Organisation::find($value);
                    if (!$organization || !$user->canAccessOrganisation($organization)) {
                        $fail('You do not have access to this organization.');
                    }
                },
            ],
            'scopes' => 'required|array|min:1',
            'scopes.*' => 'required|string|in:' . implode(',', array_keys(ApiToken::AVAILABLE_SCOPES)),
            'expires_at' => 'nullable|date|after:today',
        ]);

        if ($validator->fails()) {
            return back()->withErrors($validator)->withInput();
        }

        try {
            $tokenData = ApiToken::generateToken();
            
            $apiToken = ApiToken::create([
                'user_id' => $user->id,
                'organization_id' => $request->organization_id,
                'name' => $request->name,
                'token_hash' => $tokenData['hash'],
                'scopes' => $request->scopes,
                'expires_at' => $request->expires_at ? now()->parse($request->expires_at) : null,
            ]);

            // Show the token only once
            return Inertia::render('api-tokens/created', [
                'token' => $tokenData['token'],
                'tokenInfo' => [
                    'id' => $apiToken->id,
                    'name' => $apiToken->name,
                    'organization' => $apiToken->organisation->name,
                    'scopes' => $apiToken->scopes,
                    'expires_at' => $apiToken->expires_at?->format('M j, Y'),
                ],
            ]);

        } catch (\Exception $e) {
            return back()->with('error', 'Failed to create API token. Please try again.');
        }
    }

    /**
     * Display the specified API token details.
     */
    public function show(Request $request, string $id): Response
    {
        $user = $request->user();
        
        $token = $user->apiTokens()
            ->with(['organisation'])
            ->findOrFail($id);

        // Get usage statistics
        $usageStats = [
            'total_requests' => $token->usageLogs()->count(),
            'successful_requests' => $token->usageLogs()->successful()->count(),
            'failed_requests' => $token->usageLogs()->where('response_status', '>=', 400)->count(),
            'last_24h_requests' => $token->usageLogs()->recentActivity(24)->count(),
            'average_response_time' => $token->usageLogs()->avg('response_time_ms'),
        ];

        // Get recent activity
        $recentActivity = $token->usageLogs()
            ->orderBy('created_at', 'desc')
            ->limit(50)
            ->get()
            ->map(function ($log) {
                return [
                    'endpoint' => $log->endpoint,
                    'method' => $log->method,
                    'response_status' => $log->response_status,
                    'response_time_ms' => $log->response_time_ms,
                    'ip_address' => $log->ip_address,
                    'created_at' => $log->created_at->format('M j, Y H:i:s'),
                ];
            });

        return Inertia::render('api-tokens/show', [
            'token' => [
                'id' => $token->id,
                'name' => $token->name,
                'organization' => [
                    'id' => $token->organisation->id,
                    'name' => $token->organisation->name,
                ],
                'scopes' => $token->scopes,
                'expires_at' => $token->expires_at?->format('M j, Y'),
                'last_used_at' => $token->last_used_at?->diffForHumans(),
                'is_expired' => $token->isExpired(),
                'created_at' => $token->created_at->format('M j, Y H:i:s'),
            ],
            'usageStats' => $usageStats,
            'recentActivity' => $recentActivity,
            'availableScopes' => ApiToken::AVAILABLE_SCOPES,
        ]);
    }

    /**
     * Show the form for editing the specified API token.
     */
    public function edit(Request $request, string $id): Response
    {
        $user = $request->user();
        
        $token = $user->apiTokens()
            ->with(['organisation'])
            ->findOrFail($id);

        $organizations = $user->allOrganisations()->map(function ($org) {
            return [
                'id' => $org->id,
                'name' => $org->name,
            ];
        });

        return Inertia::render('api-tokens/edit', [
            'token' => [
                'id' => $token->id,
                'name' => $token->name,
                'organization_id' => $token->organization_id,
                'scopes' => $token->scopes,
                'expires_at' => $token->expires_at?->format('Y-m-d'),
            ],
            'organizations' => $organizations,
            'availableScopes' => ApiToken::AVAILABLE_SCOPES,
        ]);
    }

    /**
     * Update the specified API token.
     */
    public function update(Request $request, string $id)
    {
        $user = $request->user();
        
        $token = $user->apiTokens()->findOrFail($id);

        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'scopes' => 'required|array|min:1',
            'scopes.*' => 'required|string|in:' . implode(',', array_keys(ApiToken::AVAILABLE_SCOPES)),
            'expires_at' => 'nullable|date|after:today',
        ]);

        if ($validator->fails()) {
            return back()->withErrors($validator)->withInput();
        }

        try {
            $token->update([
                'name' => $request->name,
                'scopes' => $request->scopes,
                'expires_at' => $request->expires_at ? now()->parse($request->expires_at) : null,
            ]);

            return to_route('api-tokens.show', $token->id)
                ->with('success', 'API token updated successfully.');

        } catch (\Exception $e) {
            return back()->with('error', 'Failed to update API token. Please try again.');
        }
    }

    /**
     * Remove the specified API token.
     */
    public function destroy(Request $request, string $id)
    {
        $user = $request->user();
        
        $token = $user->apiTokens()->findOrFail($id);

        try {
            $token->delete();

            return to_route('api-tokens.index')
                ->with('success', 'API token deleted successfully.');

        } catch (\Exception $e) {
            return back()->with('error', 'Failed to delete API token. Please try again.');
        }
    }

    /**
     * Regenerate the specified API token.
     */
    public function regenerate(Request $request, string $id)
    {
        $user = $request->user();
        
        $token = $user->apiTokens()->findOrFail($id);

        try {
            $tokenData = ApiToken::generateToken();
            
            $token->update([
                'token_hash' => $tokenData['hash'],
            ]);

            return Inertia::render('api-tokens/regenerated', [
                'token' => $tokenData['token'],
                'tokenInfo' => [
                    'id' => $token->id,
                    'name' => $token->name,
                    'organization' => $token->organisation->name,
                    'scopes' => $token->scopes,
                    'expires_at' => $token->expires_at?->format('M j, Y'),
                ],
            ]);

        } catch (\Exception $e) {
            return back()->with('error', 'Failed to regenerate API token. Please try again.');
        }
    }
}

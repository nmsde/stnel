<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\CloudflareTokenValidationService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class CloudflareTokenController extends Controller
{
    protected CloudflareTokenValidationService $validationService;

    public function __construct(CloudflareTokenValidationService $validationService)
    {
        $this->validationService = $validationService;
    }

    /**
     * Validate a Cloudflare API token
     */
    public function validate(Request $request): JsonResponse
    {
        $request->validate([
            'token' => 'required|string|min:10',
            'organisation_id' => 'sometimes|integer|exists:organisations,id'
        ]);

        $token = $request->input('token');
        $organisationId = $request->input('organisation_id');
        
        $validation = $this->validationService->validateToken($token);
        
        // If we have an organization ID and the token is valid, update the organization
        if ($organisationId && $validation['valid']) {
            $organisation = \App\Models\Organisation::find($organisationId);
            if ($organisation && $request->user()->can('update', $organisation)) {
                $organisation->updateTokenInfo(
                    $validation['token_info'] ?? [],
                    $validation['permissions'] ?? []
                );
                
                // Update the token if it's different
                if ($organisation->api_token !== $token) {
                    $organisation->api_token = $token;
                    $organisation->save();
                }
                
                // Reset notification flag for renewed tokens
                if (isset($validation['expiration_info']['expires_in_days']) && 
                    $validation['expiration_info']['expires_in_days'] > 30) {
                    $organisation->resetTokenRenewalNotification();
                }
            }
        }
        
        return response()->json($validation);
    }
}
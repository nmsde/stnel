<?php

use App\Http\Controllers\Api\CloudflareTokenController;
use App\Http\Controllers\Api\V1\ApplicationsController;
use App\Http\Controllers\Api\V1\OrganizationsController;
use App\Http\Controllers\Api\V1\PoliciesController;
use Illuminate\Support\Facades\Route;

Route::middleware(['web', 'auth'])->group(function () {
    Route::post('/cloudflare/validate-token', [CloudflareTokenController::class, 'validate'])
        ->name('api.cloudflare.validate-token');
});

/*
|--------------------------------------------------------------------------
| API v1 Routes (Token Authentication)
|--------------------------------------------------------------------------
|
| These routes are for external API access using API tokens.
| Each route is protected by the api.token middleware which validates
| the Bearer token and checks permissions.
|
*/

Route::prefix('v1')->name('api.v1.')->group(function () {
    
    // Organizations - Read-only access to organization info
    Route::middleware(['api.token:organizations:read'])->group(function () {
        Route::get('organizations', [OrganizationsController::class, 'index'])
            ->name('organizations.index');
        Route::get('organizations/{id}', [OrganizationsController::class, 'show'])
            ->name('organizations.show');
        Route::get('organizations/{id}/stats', [OrganizationsController::class, 'stats'])
            ->name('organizations.stats');
    });

    // Access Policies - Full CRUD with proper scoping
    Route::group(['prefix' => 'policies'], function () {
        // Read access policies
        Route::middleware(['api.token:policies:read'])->group(function () {
            Route::get('/', [PoliciesController::class, 'index'])
                ->name('policies.index');
            Route::get('/{id}', [PoliciesController::class, 'show'])
                ->name('policies.show');
            Route::post('/check', [PoliciesController::class, 'check'])
                ->name('policies.check');
        });

        // Write access policies (create and update)
        Route::middleware(['api.token:policies:write'])->group(function () {
            Route::post('/', [PoliciesController::class, 'store'])
                ->name('policies.store');
            Route::put('/{id}', [PoliciesController::class, 'update'])
                ->name('policies.update');
            Route::patch('/{id}', [PoliciesController::class, 'update'])
                ->name('policies.patch');
            Route::post('/upsert', [PoliciesController::class, 'upsert'])
                ->name('policies.upsert');
        });

        // Delete access policies
        Route::middleware(['api.token:policies:delete'])->group(function () {
            Route::delete('/{id}', [PoliciesController::class, 'destroy'])
                ->name('policies.destroy');
        });

        // Bulk operations (requires both read and write permissions)
        Route::middleware(['api.token:policies:read,policies:write'])->group(function () {
            Route::post('/bulk', [PoliciesController::class, 'bulk'])
                ->name('policies.bulk');
        });
    });

    // Applications/Zones - Read-only access to Cloudflare zones
    Route::middleware(['api.token:applications:read'])->group(function () {
        Route::get('applications', [ApplicationsController::class, 'index'])
            ->name('applications.index');
        Route::get('applications/{id}', [ApplicationsController::class, 'show'])
            ->name('applications.show');
        Route::get('applications/{id}/stats', [ApplicationsController::class, 'stats'])
            ->name('applications.stats');
    });

    // Health check endpoint (no authentication required)
    Route::get('health', function () {
        return response()->json([
            'status' => 'healthy',
            'version' => 'v1',
            'timestamp' => now()->toISOString(),
        ]);
    })->name('health');

    // API information endpoint (no authentication required)
    Route::get('/', function () {
        return response()->json([
            'name' => 'Stnel API',
            'version' => 'v1',
            'documentation' => url('/docs/api'),
            'endpoints' => [
                'organizations' => url('api/v1/organizations'),
                'policies' => url('api/v1/policies'),
                'applications' => url('api/v1/applications'),
                'health' => url('api/v1/health'),
            ],
            'authentication' => 'Bearer token required',
            'rate_limit' => '1000 requests per hour per token',
        ]);
    })->name('info');
});

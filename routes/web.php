<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\WorkOS\Http\Middleware\ValidateSessionWithWorkOS;
use App\Http\Controllers\OrganisationController;
use App\Http\Controllers\AccessPolicyController;
use App\Http\Controllers\AccessLogsController;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::get('/about', function () {
    return Inertia::render('about');
})->name('about');

Route::get('/why-cloudflare', function () {
    return Inertia::render('why-cloudflare');
})->name('why-cloudflare');

Route::get('/privacy-policy', function () {
    return Inertia::render('privacy-policy');
})->name('privacy-policy');

Route::get('/terms-of-service', function () {
    return Inertia::render('terms-of-service');
})->name('terms-of-service');

Route::middleware([
    'auth',
    ValidateSessionWithWorkOS::class,
])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    // Organisations
    Route::resource('organisations', OrganisationController::class);
    Route::post('organisations/{organisation}/validate-token', [OrganisationController::class, 'validateToken'])
        ->name('organisations.validate-token');
    Route::post('organisations/{organisation}/check-token-health', [OrganisationController::class, 'checkTokenHealth'])
        ->name('organisations.check-token-health');
    Route::post('organisations/{organisation}/sync-zones', [OrganisationController::class, 'syncZones'])
        ->name('organisations.sync-zones');
    Route::get('organisations/{organisation}/audit-logs', [OrganisationController::class, 'auditLogs'])
        ->name('organisations.audit-logs');

    // Access Policies
    Route::resource('organisations.policies', AccessPolicyController::class)->except(['index']);
    Route::post('organisations/{organisation}/policies/{policy}/sync', [AccessPolicyController::class, 'sync'])
        ->name('organisations.policies.sync');

    // Access Logs
    Route::get('organisations/{organisation}/access-logs', [AccessLogsController::class, 'index'])
        ->name('organisations.access-logs');
    Route::get('organisations/{organisation}/policies/{policy}/access-logs', [AccessLogsController::class, 'policy'])
        ->name('organisations.policies.access-logs');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';

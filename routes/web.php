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

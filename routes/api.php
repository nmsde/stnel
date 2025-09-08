<?php

use App\Http\Controllers\Api\CloudflareTokenController;
use Illuminate\Support\Facades\Route;

Route::middleware(['web', 'auth'])->group(function () {
    Route::post('/cloudflare/validate-token', [CloudflareTokenController::class, 'validate'])
        ->name('api.cloudflare.validate-token');
});

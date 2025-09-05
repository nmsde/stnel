<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\CloudflareTokenController;

Route::middleware(['web', 'auth'])->group(function () {
    Route::post('/cloudflare/validate-token', [CloudflareTokenController::class, 'validate'])
        ->name('api.cloudflare.validate-token');
});
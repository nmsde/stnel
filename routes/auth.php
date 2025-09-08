<?php

use App\Http\Controllers\AuthController;
use Illuminate\Support\Facades\Route;
use Laravel\WorkOS\Http\Requests\AuthKitLogoutRequest;

Route::get('login', [AuthController::class, 'login'])
    ->middleware(['guest'])
    ->name('login');

Route::get('authenticate', [AuthController::class, 'authenticate'])
    ->middleware(['guest']);

Route::post('logout', function (AuthKitLogoutRequest $request) {
    return $request->logout();
})->middleware(['auth'])->name('logout');

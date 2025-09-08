<?php

namespace App\Http\Controllers;

use Laravel\WorkOS\Http\Requests\AuthKitAuthenticationRequest;
use Laravel\WorkOS\Http\Requests\AuthKitLoginRequest;

class AuthController extends Controller
{
    public function login(AuthKitLoginRequest $request)
    {
        // Store subscription intent in session if present
        if ($request->has('intent') && $request->intent === 'subscribe') {
            session(['subscription_intent' => true]);
        }

        return $request->redirect();
    }

    public function authenticate(AuthKitAuthenticationRequest $request)
    {
        // Authenticate the user first
        $request->authenticate();

        // Check for subscription intent
        if (session('subscription_intent')) {
            session()->forget('subscription_intent');
            session(['subscription_intent_welcome' => true]);

            return redirect()->route('billing.index');
        }

        return redirect()->route('dashboard');
    }
}

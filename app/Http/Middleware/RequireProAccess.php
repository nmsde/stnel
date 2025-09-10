<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RequireProAccess
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if (!$user) {
            return redirect()->route('login');
        }

        if (!$user->hasProAccess()) {
            if ($request->expectsJson()) {
                return response()->json([
                    'message' => 'Pro subscription required to access this feature.',
                    'upgrade_url' => route('billing.index')
                ], 403);
            }

            return redirect()->route('billing.index')->with('error', 'Pro subscription required to access this feature.');
        }

        return $next($request);
    }
}

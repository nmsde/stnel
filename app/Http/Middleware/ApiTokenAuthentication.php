<?php

namespace App\Http\Middleware;

use App\Models\ApiToken;
use App\Models\ApiTokenUsageLog;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Symfony\Component\HttpFoundation\Response;

class ApiTokenAuthentication
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, string ...$requiredScopes): Response
    {
        $startTime = microtime(true);
        
        // Extract token from Authorization header
        $authHeader = $request->header('Authorization');
        
        if (!$authHeader || !str_starts_with($authHeader, 'Bearer ')) {
            return $this->unauthorizedResponse('Missing or invalid Authorization header');
        }
        
        $token = substr($authHeader, 7); // Remove 'Bearer ' prefix
        
        // Validate token format
        if (!str_starts_with($token, 'stnel_')) {
            return $this->unauthorizedResponse('Invalid token format');
        }
        
        // Find and validate the API token
        $apiToken = ApiToken::findByToken($token);
        
        if (!$apiToken) {
            return $this->unauthorizedResponse('Invalid API token');
        }
        
        if (!$apiToken->isValid()) {
            return $this->unauthorizedResponse('API token has expired');
        }
        
        // Check rate limits
        $rateLimitKey = 'api_rate_limit:' . $apiToken->id;
        $requestCount = Cache::get($rateLimitKey, 0);
        $rateLimit = 1000; // Requests per hour
        
        if ($requestCount >= $rateLimit) {
            return $this->rateLimitResponse();
        }
        
        // Validate required scopes
        if (!empty($requiredScopes) && !$apiToken->hasAnyScope($requiredScopes)) {
            return $this->forbiddenResponse('Insufficient permissions for this endpoint');
        }
        
        // Increment rate limit counter
        Cache::put($rateLimitKey, $requestCount + 1, now()->addHour());
        
        // Set API token and organization on request
        $request->merge([
            'api_token' => $apiToken,
            'organization' => $apiToken->organisation,
            'api_user' => $apiToken->user,
        ]);
        
        // Update last used timestamp (async)
        dispatch(function () use ($apiToken) {
            $apiToken->updateLastUsed();
        })->afterResponse();
        
        // Process the request
        $response = $next($request);
        
        // Log the API usage (async)
        $responseTime = (microtime(true) - $startTime) * 1000; // Convert to milliseconds
        
        dispatch(function () use ($apiToken, $request, $response, $responseTime) {
            ApiTokenUsageLog::logApiRequest(
                token: $apiToken,
                endpoint: $request->path(),
                method: $request->method(),
                ipAddress: $request->ip(),
                responseStatus: $response->getStatusCode(),
                userAgent: $request->userAgent(),
                responseTimeMs: $responseTime,
                payloadSize: strlen($request->getContent() ?: '')
            );
        })->afterResponse();
        
        // Add rate limit headers to response
        $response->headers->set('X-RateLimit-Limit', $rateLimit);
        $response->headers->set('X-RateLimit-Remaining', max(0, $rateLimit - $requestCount - 1));
        $response->headers->set('X-RateLimit-Reset', now()->addHour()->timestamp);
        
        return $response;
    }
    
    private function unauthorizedResponse(string $message): Response
    {
        return response()->json([
            'error' => 'Unauthorized',
            'message' => $message,
        ], 401);
    }
    
    private function forbiddenResponse(string $message): Response
    {
        return response()->json([
            'error' => 'Forbidden',
            'message' => $message,
        ], 403);
    }
    
    private function rateLimitResponse(): Response
    {
        return response()->json([
            'error' => 'Too Many Requests',
            'message' => 'Rate limit exceeded. Please try again later.',
        ], 429);
    }
}

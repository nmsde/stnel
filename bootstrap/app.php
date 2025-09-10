<?php

use App\Http\Middleware\ApiTokenAuthentication;
use App\Http\Middleware\HandleAppearance;
use App\Http\Middleware\HandleInertiaRequests;
use App\Http\Middleware\RequireProAccess;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        $middleware->encryptCookies(except: ['appearance', 'sidebar_state']);

        $middleware->web(append: [
            HandleAppearance::class,
            HandleInertiaRequests::class,
            AddLinkHeadersForPreloadedAssets::class,
        ]);

        $middleware->alias([
            'api.token' => ApiTokenAuthentication::class,
            'pro.access' => RequireProAccess::class,
        ]);
    })
    ->withSchedule(function ($schedule) {
        // Check token health twice daily - morning and evening
        $schedule->command('tokens:check-health')
            ->twiceDaily(9, 18) // 9 AM and 6 PM
            ->name('check-token-health')
            ->description('Check Cloudflare API token health and send renewal notifications');

        // Also run a more frequent check for critical expiring tokens (every 4 hours)
        $schedule->command('tokens:check-health --days=3')
            ->everyFourHours()
            ->between('6:00', '22:00') // Only during business hours
            ->name('check-critical-tokens')
            ->description('Check for critically expiring tokens (3 days or less)');

        // Check access logs for immediate notifications every 5 minutes
        $schedule->command('access-logs:check --frequency=immediate')
            ->everyFiveMinutes()
            ->name('check-immediate-notifications')
            ->description('Check for immediate access log notifications');

        // Hourly digest notifications
        $schedule->command('access-logs:check --frequency=hourly')
            ->hourly()
            ->name('check-hourly-notifications')
            ->description('Send hourly access log digest notifications');

        // Daily digest notifications (sent at 9 AM)
        $schedule->command('access-logs:check --frequency=daily')
            ->dailyAt('09:00')
            ->name('check-daily-notifications')
            ->description('Send daily access log digest notifications');
    })
    ->withExceptions(function (Exceptions $exceptions) {
        //
    })->create();

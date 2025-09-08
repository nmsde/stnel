<?php

namespace App\Http\Controllers;

use App\Services\DashboardService;
use App\Services\SubscriptionService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __construct(
        private DashboardService $dashboardService,
        private SubscriptionService $subscriptionService
    ) {}

    public function index(Request $request): Response
    {
        $user = $request->user();
        $dashboardData = $this->dashboardService->getDashboardData($user);

        // Add subscription information
        $usageStats = $this->subscriptionService->getUserUsageStats($user);
        $upgradeRecommendation = $this->subscriptionService->getUpgradeRecommendation($user);

        $dashboardData['subscription'] = [
            'plan' => $usageStats['plan'],
            'usage' => $usageStats,
            'canCreateOrganization' => $user->canCreateOrganization(),
            'canCreateEndpoint' => $user->canCreateProtectedEndpoint(),
            'needsUpgrade' => $user->needsUpgrade(),
            'upgradeRecommendation' => $upgradeRecommendation,
        ];

        return Inertia::render('dashboard', [
            'dashboard' => $dashboardData,
        ]);
    }
}

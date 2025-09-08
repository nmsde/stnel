<?php

namespace App\Services;

use App\Models\AccessPolicy;
use App\Models\Organisation;
use Exception;
use Illuminate\Support\Facades\Log;

class DashboardService
{
    public function getDashboardData($user): array
    {
        // Get user's organizations with related data
        $organisations = Organisation::where('user_id', $user->id)
            ->orWhereHas('users', function ($query) use ($user) {
                $query->where('user_id', $user->id);
            })
            ->with(['policies', 'notificationSetting'])
            ->withCount(['policies'])
            ->get();

        return [
            'overview' => $this->getOverviewMetrics($organisations, $user),
            'organisations' => $this->getOrganisationsData($organisations),
            'recentActivity' => $this->getRecentActivity($organisations),
            'healthAlerts' => $this->getHealthAlerts($organisations),
            'analytics' => $this->getAnalytics($organisations),
            'quickActions' => $this->getQuickActions($user),
        ];
    }

    private function getOverviewMetrics($organisations, $user): array
    {
        $totalOrganisations = $organisations->count();
        $totalPolicies = $organisations->sum('policies_count');
        $activeOrganisations = $organisations->filter(fn ($org) => $org->hasValidToken())->count();
        $activePolicies = AccessPolicy::whereIn('organisation_id', $organisations->pluck('id'))
            ->where('status', 'active')
            ->count();

        // Get recent activity (last 24 hours) - simplified for now
        $recentActivity = $this->getRecentActivityCount($organisations);

        // Calculate health score (0-100)
        $healthScore = $this->calculateOverallHealthScore($organisations);

        return [
            'organisations' => [
                'total' => $totalOrganisations,
                'active' => $activeOrganisations,
                'percentage' => $totalOrganisations > 0 ? round(($activeOrganisations / $totalOrganisations) * 100) : 0,
                'trend' => 'up', // Could be calculated from historical data
            ],
            'protectedApps' => [
                'total' => $totalPolicies,
                'active' => $activePolicies,
                'pending' => $totalPolicies - $activePolicies,
                'percentage' => $totalPolicies > 0 ? round(($activePolicies / $totalPolicies) * 100) : 0,
                'trend' => 'up',
            ],
            'recentActivity' => [
                'total' => $recentActivity['total'],
                'allowed' => $recentActivity['allowed'],
                'blocked' => $recentActivity['blocked'],
                'percentage' => $recentActivity['total'] > 0 ?
                    round(($recentActivity['allowed'] / $recentActivity['total']) * 100) : 100,
                'trend' => 'stable',
            ],
            'systemHealth' => [
                'score' => $healthScore,
                'status' => $this->getHealthStatus($healthScore),
                'trend' => 'up',
            ],
        ];
    }

    private function getOrganisationsData($organisations): array
    {
        return $organisations->map(function ($org) {
            $tokenStatus = $org->getTokenStatus();
            $activePolicies = $org->policies->where('status', 'active')->count();
            $totalPolicies = $org->policies->count();

            return [
                'id' => $org->id,
                'name' => $org->name,
                'slug' => $org->slug,
                'description' => $org->description,
                'protectedApps' => [
                    'total' => $totalPolicies,
                    'active' => $activePolicies,
                    'pending' => $totalPolicies - $activePolicies,
                ],
                'tokenStatus' => [
                    'status' => $tokenStatus,
                    'badge' => $org->getTokenStatusBadge()['text'],
                    'expiresInDays' => $org->getTokenExpiresInDays(),
                ],
                'notificationsEnabled' => $org->notificationSetting &&
                    ($org->notificationSetting->enabled || $org->notificationSetting->slack_enabled),
                'recentActivity' => $this->getOrganisationRecentActivity($org),
                'healthScore' => $this->calculateOrganisationHealthScore($org),
                'lastActivity' => $this->getLastActivity($org),
            ];
        })->values()->toArray();
    }

    private function getRecentActivity($organisations): array
    {
        $activities = collect();

        foreach ($organisations as $org) {
            if (! $org->hasValidToken() || $org->policies->count() === 0) {
                continue;
            }

            try {
                $logsService = new CloudflareAccessLogsService($org);
                $result = $logsService->getAccessLogs(['limit' => 50]);

                if ($result['success'] && ! empty($result['logs'])) {
                    $transformedLogs = $logsService->transformLogs($result['logs']);

                    foreach ($transformedLogs as $log) {
                        $activities->push([
                            'id' => $log['id'],
                            'type' => $log['allowed'] ? 'access_allowed' : 'access_blocked',
                            'organisation' => $org->name,
                            'organisation_id' => $org->id,
                            'user_email' => $log['user_email'],
                            'application' => $log['application'],
                            'timestamp' => $log['timestamp'],
                            'ip_address' => $log['ip_address'],
                            'country' => $log['country'],
                        ]);
                    }
                }
            } catch (Exception $e) {
                Log::warning("Failed to fetch access logs for organization {$org->name}: ".$e->getMessage());
                // Continue with other organizations even if one fails
            }
        }

        return $activities->sortByDesc('timestamp')->take(20)->values()->all();
    }

    private function getHealthAlerts($organisations): array
    {
        $alerts = collect();

        foreach ($organisations as $org) {
            // Token expiration alerts
            if ($org->isTokenExpiring(7)) {
                $alerts->push([
                    'type' => 'token_expiring',
                    'severity' => $org->isTokenExpiring(3) ? 'critical' : 'warning',
                    'title' => 'API Token Expiring Soon',
                    'message' => "Token for {$org->name} expires in {$org->getTokenExpiresInDays()} days",
                    'organisation_id' => $org->id,
                    'organisation_name' => $org->name,
                    'action_url' => "/organisations/{$org->id}/edit",
                    'created_at' => now(),
                ]);
            }

            // Missing token alerts
            if (! $org->hasValidToken()) {
                $alerts->push([
                    'type' => 'missing_token',
                    'severity' => 'critical',
                    'title' => 'Missing API Token',
                    'message' => "{$org->name} requires an API token to function properly",
                    'organisation_id' => $org->id,
                    'organisation_name' => $org->name,
                    'action_url' => "/organisations/{$org->id}/edit",
                    'created_at' => now(),
                ]);
            }

            // Notification setup alerts
            if (! $org->notificationSetting || (! $org->notificationSetting->enabled && ! $org->notificationSetting->slack_enabled)) {
                $alerts->push([
                    'type' => 'notifications_disabled',
                    'severity' => 'info',
                    'title' => 'Notifications Not Configured',
                    'message' => "Set up notifications for {$org->name} to stay informed",
                    'organisation_id' => $org->id,
                    'organisation_name' => $org->name,
                    'action_url' => "/organisations/{$org->id}/notification-settings",
                    'created_at' => now(),
                ]);
            }
        }

        return $alerts->sortBy('severity')->take(5)->values()->all();
    }

    private function getAnalytics($organisations): array
    {
        // Calculate analytics data
        $totalApps = $organisations->sum('policies_count');
        $activeApps = 0;
        $appsByType = ['web' => 0, 'api' => 0, 'spa' => 0];

        foreach ($organisations as $org) {
            $activeApps += $org->policies->where('status', 'active')->count();
        }

        return [
            'summary' => [
                'totalOrganisations' => $organisations->count(),
                'totalApps' => $totalApps,
                'activeApps' => $activeApps,
                'appUtilization' => $totalApps > 0 ? round(($activeApps / $totalApps) * 100) : 0,
            ],
            'trends' => [
                'daily' => $this->getDailyTrends(),
                'weekly' => $this->getWeeklyTrends(),
            ],
            'topApplications' => $this->getTopApplications($organisations),
            'geographicDistribution' => $this->getGeographicData(),
        ];
    }

    private function getQuickActions($user): array
    {
        return [
            [
                'title' => 'Create Organization',
                'description' => 'Set up a new organization',
                'icon' => 'building',
                'url' => '/organisations/create',
                'color' => 'primary',
            ],
            [
                'title' => 'Protect New App',
                'description' => 'Add security to an application',
                'icon' => 'shield',
                'url' => '/organisations', // User will select org first
                'color' => 'success',
            ],
            [
                'title' => 'View All Logs',
                'description' => 'Access comprehensive logs',
                'icon' => 'activity',
                'url' => '/organisations', // Aggregate logs view could be added
                'color' => 'info',
            ],
            [
                'title' => 'Manage Billing',
                'description' => 'View subscription and usage',
                'icon' => 'credit-card',
                'url' => '/settings/billing',
                'color' => 'warning',
            ],
        ];
    }

    // Helper methods
    private function getRecentActivityCount($organisations): array
    {
        $totalActivity = ['total' => 0, 'allowed' => 0, 'blocked' => 0];
        $since = now()->subHours(24); // Last 24 hours

        foreach ($organisations as $org) {
            if (! $org->hasValidToken()) {
                continue;
            }

            try {
                $logsService = new CloudflareAccessLogsService($org);
                $result = $logsService->getLogsInRange($since->toDateTime(), null, ['limit' => 1000]);

                if ($result['success'] && ! empty($result['logs'])) {
                    $stats = $logsService->getLogStats($result['logs']);
                    $totalActivity['total'] += $stats['total'];
                    $totalActivity['allowed'] += $stats['allowed'];
                    $totalActivity['blocked'] += $stats['blocked'];
                }
            } catch (Exception $e) {
                Log::warning("Failed to fetch activity count for organization {$org->name}: ".$e->getMessage());
            }
        }

        return $totalActivity;
    }

    private function calculateOverallHealthScore($organisations): int
    {
        if ($organisations->isEmpty()) {
            return 100;
        }

        $scores = $organisations->map(fn ($org) => $this->calculateOrganisationHealthScore($org));

        return round($scores->average());
    }

    private function calculateOrganisationHealthScore($org): int
    {
        $score = 100;

        // Token health (40% of score)
        if (! $org->hasValidToken()) {
            $score -= 40;
        } elseif ($org->isTokenExpiring(7)) {
            $score -= $org->isTokenExpiring(3) ? 30 : 15;
        }

        // Notification setup (20% of score)
        if (! $org->notificationSetting || (! $org->notificationSetting->enabled && ! $org->notificationSetting->slack_enabled)) {
            $score -= 20;
        }

        // Active policies (20% of score)
        $totalPolicies = $org->policies->count();
        if ($totalPolicies > 0) {
            $activePolicies = $org->policies->where('status', 'active')->count();
            $activeRatio = $activePolicies / $totalPolicies;
            $score -= (1 - $activeRatio) * 20;
        }

        // Recent activity (20% of score) - placeholder for now
        // In real implementation, check if there's been recent access

        return max(0, round($score));
    }

    private function getHealthStatus($score): string
    {
        return match (true) {
            $score >= 90 => 'excellent',
            $score >= 75 => 'good',
            $score >= 50 => 'fair',
            default => 'needs_attention',
        };
    }

    private function getOrganisationRecentActivity($org): array
    {
        if (! $org->hasValidToken()) {
            return ['total' => 0, 'allowed' => 0, 'blocked' => 0];
        }

        try {
            $logsService = new CloudflareAccessLogsService($org);
            $since = now()->subHours(24);
            $result = $logsService->getLogsInRange($since->toDateTime(), null, ['limit' => 500]);

            if ($result['success'] && ! empty($result['logs'])) {
                $stats = $logsService->getLogStats($result['logs']);

                return [
                    'total' => $stats['total'],
                    'allowed' => $stats['allowed'],
                    'blocked' => $stats['blocked'],
                ];
            }
        } catch (Exception $e) {
            Log::warning("Failed to fetch organization activity for {$org->name}: ".$e->getMessage());
        }

        return ['total' => 0, 'allowed' => 0, 'blocked' => 0];
    }

    private function getLastActivity($org): ?string
    {
        if (! $org->hasValidToken()) {
            return null;
        }

        try {
            $logsService = new CloudflareAccessLogsService($org);
            $result = $logsService->getAccessLogs(['limit' => 1]);

            if ($result['success'] && ! empty($result['logs'])) {
                $transformedLogs = $logsService->transformLogs($result['logs']);

                return $transformedLogs[0]['timestamp'] ?? null;
            }
        } catch (Exception $e) {
            Log::warning("Failed to fetch last activity for {$org->name}: ".$e->getMessage());
        }

        return null;
    }

    private function getDailyTrends(): array
    {
        // For now, return empty array - could be enhanced with daily aggregated data
        // This would require storing daily summaries or querying large datasets
        return [];
    }

    private function getWeeklyTrends(): array
    {
        // For now, return empty array - could be enhanced with weekly aggregated data
        // This would require storing weekly summaries or querying large datasets
        return [];
    }

    private function getTopApplications($organisations): array
    {
        $apps = collect();

        foreach ($organisations as $org) {
            if (! $org->hasValidToken()) {
                // Still include apps but with 0 access count
                foreach ($org->policies as $policy) {
                    $apps->push([
                        'name' => $policy->name,
                        'organisation' => $org->name,
                        'domain' => $policy->domain,
                        'access_count' => 0,
                        'status' => $policy->status,
                    ]);
                }

                continue;
            }

            foreach ($org->policies as $policy) {
                $accessCount = 0;

                try {
                    $logsService = new CloudflareAccessLogsService($org);
                    $since = now()->subDays(7); // Last 7 days
                    $result = $logsService->getLogsInRange($since->toDateTime(), null, ['limit' => 1000]);

                    if ($result['success'] && ! empty($result['logs'])) {
                        // Count logs for this specific policy/application
                        foreach ($result['logs'] as $log) {
                            if (($log['app_domain'] ?? '') === $policy->domain) {
                                $accessCount++;
                            }
                        }
                    }
                } catch (Exception $e) {
                    Log::warning("Failed to get access count for policy {$policy->name}: ".$e->getMessage());
                }

                $apps->push([
                    'name' => $policy->name,
                    'organisation' => $org->name,
                    'domain' => $policy->domain,
                    'access_count' => $accessCount,
                    'status' => $policy->status,
                ]);
            }
        }

        return $apps->sortByDesc('access_count')->take(5)->values()->all();
    }

    private function getGeographicData(): array
    {
        $countryCounts = [];
        $totalAccess = 0;

        // Get recent activity from all organizations
        $recentActivity = $this->getRecentActivity(Organisation::all());

        foreach ($recentActivity as $activity) {
            $country = $activity['country'] ?? 'Unknown';
            $countryCounts[$country] = ($countryCounts[$country] ?? 0) + 1;
            $totalAccess++;
        }

        $result = [];
        foreach ($countryCounts as $country => $count) {
            $percentage = $totalAccess > 0 ? round(($count / $totalAccess) * 100, 1) : 0;
            $result[] = [
                'country' => $country,
                'count' => $count,
                'percentage' => $percentage,
            ];
        }

        // Sort by count descending and take top 10
        return collect($result)->sortByDesc('count')->take(10)->values()->all();
    }
}

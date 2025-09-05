<?php

namespace App\Http\Controllers;

use App\Models\Organisation;
use App\Models\AccessPolicy;
use App\Services\CloudflareAccessLogsService;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Exception;

class AccessLogsController extends Controller
{
    use AuthorizesRequests;

    /**
     * Display Access logs for the organisation.
     */
    public function index(Request $request, Organisation $organisation): Response
    {
        $this->authorize('view', $organisation);

        $filters = [
            'limit' => $request->get('limit', 100),
            'since' => $request->get('since'),
            'until' => $request->get('until'),
            'app_uid' => $request->get('app_uid'),
            'user_email' => $request->get('user_email'),
            'action' => $request->get('action'),
            'country' => $request->get('country'),
        ];

        // Remove null filters
        $filters = array_filter($filters, fn($value) => !is_null($value) && $value !== '');

        try {
            $logsService = new CloudflareAccessLogsService($organisation);
            $result = $logsService->getAccessLogs($filters);
            
            if ($result['success']) {
                $transformedLogs = $logsService->transformLogs($result['logs']);
                $stats = $logsService->getLogStats($result['logs']);
                
                return Inertia::render('organisations/access-logs', [
                    'organisation' => $organisation,
                    'logs' => $transformedLogs,
                    'stats' => $stats,
                    'result_info' => $result['result_info'] ?? [],
                    'filters' => $filters,
                    'policies' => $organisation->policies()->with('zone:id,name')->get(),
                ]);
            } else {
                return Inertia::render('organisations/access-logs', [
                    'organisation' => $organisation,
                    'logs' => [],
                    'stats' => [
                        'total' => 0,
                        'allowed' => 0,
                        'blocked' => 0,
                        'unique_users' => 0,
                        'unique_applications' => 0,
                        'countries' => [],
                    ],
                    'error' => $result['error'],
                    'filters' => $filters,
                    'policies' => $organisation->policies()->with('zone:id,name')->get(),
                ]);
            }
            
        } catch (Exception $e) {
            return Inertia::render('organisations/access-logs', [
                'organisation' => $organisation,
                'logs' => [],
                'stats' => [
                    'total' => 0,
                    'allowed' => 0,
                    'blocked' => 0,
                    'unique_users' => 0,
                    'unique_applications' => 0,
                    'countries' => [],
                ],
                'error' => $e->getMessage(),
                'filters' => $filters,
                'policies' => [],
            ]);
        }
    }

    /**
     * Display Access logs for a specific policy.
     */
    public function policy(Request $request, Organisation $organisation, AccessPolicy $policy): Response
    {
        $this->authorize('view', $organisation);
        
        if ($policy->organisation_id !== $organisation->id) {
            abort(404);
        }

        $filters = [
            'limit' => $request->get('limit', 50),
            'since' => $request->get('since'),
            'until' => $request->get('until'),
            'user_email' => $request->get('user_email'),
            'action' => $request->get('action'),
        ];

        // Add application filter if policy has Cloudflare application ID
        if ($policy->cf_application_id) {
            $filters['app_uid'] = $policy->cf_application_id;
        }

        // Remove null filters
        $filters = array_filter($filters, fn($value) => !is_null($value) && $value !== '');

        try {
            $logsService = new CloudflareAccessLogsService($organisation);
            $result = $logsService->getAccessLogs($filters);
            
            if ($result['success']) {
                $transformedLogs = $logsService->transformLogs($result['logs']);
                $stats = $logsService->getLogStats($result['logs']);
                
                return Inertia::render('organisations/policies/access-logs', [
                    'organisation' => $organisation,
                    'policy' => $policy->load('zone'),
                    'logs' => $transformedLogs,
                    'stats' => $stats,
                    'result_info' => $result['result_info'] ?? [],
                    'filters' => $filters,
                ]);
            } else {
                return Inertia::render('organisations/policies/access-logs', [
                    'organisation' => $organisation,
                    'policy' => $policy->load('zone'),
                    'logs' => [],
                    'stats' => [
                        'total' => 0,
                        'allowed' => 0,
                        'blocked' => 0,
                        'unique_users' => 0,
                        'unique_applications' => 0,
                        'countries' => [],
                    ],
                    'error' => $result['error'],
                    'filters' => $filters,
                ]);
            }
            
        } catch (Exception $e) {
            return Inertia::render('organisations/policies/access-logs', [
                'organisation' => $organisation,
                'policy' => $policy->load('zone'),
                'logs' => [],
                'stats' => [
                    'total' => 0,
                    'allowed' => 0,
                    'blocked' => 0,
                    'unique_users' => 0,
                    'unique_applications' => 0,
                    'countries' => [],
                ],
                'error' => $e->getMessage(),
                'filters' => $filters,
            ]);
        }
    }
}
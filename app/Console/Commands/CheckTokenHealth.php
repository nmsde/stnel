<?php

namespace App\Console\Commands;

use App\Models\Organisation;
use App\Services\CloudflareTokenValidationService;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Notification;
use App\Notifications\TokenExpirationNotification;

class CheckTokenHealth extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'tokens:check-health 
                           {--days=7 : Number of days before expiration to trigger notifications}
                           {--force : Force check all tokens, even recently checked ones}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Check health of all Cloudflare API tokens and send renewal notifications';

    protected CloudflareTokenValidationService $validationService;

    public function __construct(CloudflareTokenValidationService $validationService)
    {
        parent::__construct();
        $this->validationService = $validationService;
    }

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $daysThreshold = (int) $this->option('days');
        $force = $this->option('force');
        
        $this->info("Checking token health for all organizations...");
        $this->info("Notification threshold: {$daysThreshold} days before expiration");
        
        // Get organizations with API tokens
        $query = Organisation::whereNotNull('encrypted_api_token')
            ->where('encrypted_api_token', '!=', '');
            
        if (!$force) {
            // Only check tokens that haven't been checked recently (last 4 hours)
            $query->where(function ($q) {
                $q->whereNull('token_last_checked')
                  ->orWhere('token_last_checked', '<', now()->subHours(4));
            });
        }
            
        $organisations = $query->get();
        
        if ($organisations->isEmpty()) {
            $this->info('No organizations with tokens found to check.');
            return Command::SUCCESS;
        }
        
        $this->info("Found {$organisations->count()} organizations to check");
        
        $checked = 0;
        $expired = 0;
        $expiring = 0;
        $notificationsSent = 0;
        
        $progressBar = $this->output->createProgressBar($organisations->count());
        $progressBar->start();
        
        foreach ($organisations as $organisation) {
            try {
                $result = $this->validationService->checkAndUpdateTokenHealth($organisation);
                $checked++;
                
                if ($result['valid'] && isset($result['expiration_info'])) {
                    $expInfo = $result['expiration_info'];
                    
                    if ($expInfo['is_expired']) {
                        $expired++;
                        $this->logTokenStatus($organisation, 'expired', $expInfo);
                    } elseif ($expInfo['is_expiring_soon'] || $expInfo['expires_in_days'] <= $daysThreshold) {
                        $expiring++;
                        $this->logTokenStatus($organisation, 'expiring', $expInfo);
                        
                        // Send notification if not already sent
                        if (!$organisation->token_renewal_notified) {
                            $this->sendExpirationNotification($organisation, $expInfo['expires_in_days']);
                            $notificationsSent++;
                        }
                    }
                } elseif (!$result['valid']) {
                    $this->logTokenStatus($organisation, 'invalid', null, $result['error']);
                }
                
            } catch (\Exception $e) {
                Log::error("Failed to check token health for organization {$organisation->id}: " . $e->getMessage());
                $this->error("Failed to check {$organisation->name}: " . $e->getMessage());
            }
            
            $progressBar->advance();
        }
        
        $progressBar->finish();
        $this->newLine(2);
        
        // Summary
        $this->info("Token Health Check Complete:");
        $this->table(['Status', 'Count'], [
            ['Checked', $checked],
            ['Expired', $expired],
            ['Expiring Soon', $expiring], 
            ['Notifications Sent', $notificationsSent]
        ]);
        
        if ($expired > 0) {
            $this->warn("⚠️  {$expired} organization(s) have expired tokens that need immediate attention!");
        }
        
        if ($expiring > 0) {
            $this->warn("🔔 {$expiring} organization(s) have tokens expiring within {$daysThreshold} days");
        }
        
        return Command::SUCCESS;
    }
    
    /**
     * Log token status for debugging
     */
    private function logTokenStatus(Organisation $organisation, string $status, ?array $expInfo, ?string $error = null)
    {
        $logData = [
            'organisation_id' => $organisation->id,
            'organisation_name' => $organisation->name,
            'status' => $status,
        ];
        
        if ($expInfo) {
            $logData['expires_in_days'] = $expInfo['expires_in_days'];
            $logData['expires_at'] = $expInfo['expires_at'];
        }
        
        if ($error) {
            $logData['error'] = $error;
        }
        
        Log::info('Token health check result', $logData);
    }
    
    /**
     * Send expiration notification to organization owner
     */
    private function sendExpirationNotification(Organisation $organisation, int $daysUntilExpiration)
    {
        try {
            // Get organization owner
            $owner = $organisation->owner;
            
            if ($owner) {
                $owner->notify(new TokenExpirationNotification($organisation, $daysUntilExpiration));
                $organisation->markTokenRenewalNotified();
                
                Log::info("Sent token expiration notification", [
                    'organisation_id' => $organisation->id,
                    'user_id' => $owner->id,
                    'days_until_expiration' => $daysUntilExpiration
                ]);
            }
            
        } catch (\Exception $e) {
            Log::error("Failed to send token expiration notification for organization {$organisation->id}: " . $e->getMessage());
        }
    }
}

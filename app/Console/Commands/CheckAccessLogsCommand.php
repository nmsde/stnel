<?php

namespace App\Console\Commands;

use App\Jobs\ProcessAccessLogNotifications;
use App\Models\Organisation;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;

class CheckAccessLogsCommand extends Command
{
    protected $signature = 'access-logs:check 
                           {--org-id= : Check specific organization ID}
                           {--frequency=immediate : Check for specific frequency (immediate, hourly, daily)}';

    protected $description = 'Check access logs and send notifications based on configured settings';

    public function handle(): int
    {
        $this->info('Starting access log notification check...');

        $query = Organisation::with('notificationSetting')
            ->whereHas('notificationSetting', function ($q) {
                $q->where('enabled', true);
            });

        // Filter by specific organization if provided
        if ($orgId = $this->option('org-id')) {
            $query->where('id', $orgId);
        }

        // Filter by frequency if provided
        if ($frequency = $this->option('frequency')) {
            $query->whereHas('notificationSetting', function ($q) use ($frequency) {
                $q->where('frequency', $frequency);
            });
        }

        $organisations = $query->get();

        if ($organisations->isEmpty()) {
            $this->info('No organizations found with enabled notifications.');

            return self::SUCCESS;
        }

        $this->info("Found {$organisations->count()} organization(s) with enabled notifications.");

        $processed = 0;
        $failed = 0;

        foreach ($organisations as $organisation) {
            try {
                $this->line("Processing {$organisation->name}...");

                ProcessAccessLogNotifications::dispatch($organisation);
                $processed++;

                $this->info("✓ Queued notification job for {$organisation->name}");

            } catch (\Exception $e) {
                $failed++;
                $this->error("✗ Failed to process {$organisation->name}: {$e->getMessage()}");
                Log::error("Failed to queue access log notifications for organization {$organisation->name}: ".$e->getMessage());
            }
        }

        $this->newLine();
        $this->info('Notification check completed:');
        $this->info("- Processed: {$processed}");
        if ($failed > 0) {
            $this->warn("- Failed: {$failed}");
        }

        return self::SUCCESS;
    }
}

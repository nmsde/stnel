<?php

namespace App\Console\Commands;

use App\Models\Organisation;
use App\Services\CloudflareTokenValidationService;
use Illuminate\Console\Command;

class ConvertLegacyTokens extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'tokens:convert-legacy 
                           {--dry-run : Show what would be converted without making changes}
                           {--force : Convert without confirmation}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Convert legacy API tokens to use the new token management system';

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
        $dryRun = $this->option('dry-run');
        $force = $this->option('force');

        $this->info('🔍 Scanning for organizations with legacy tokens...');

        // Find organizations that have tokens but are missing the new token fields
        $legacyOrgs = Organisation::whereNotNull('encrypted_api_token')
            ->where('encrypted_api_token', '!=', '')
            ->where(function ($query) {
                $query->whereNull('token_expires_at')
                    ->orWhereNull('token_last_checked')
                    ->orWhereNull('token_permissions');
            })
            ->get();

        if ($legacyOrgs->isEmpty()) {
            $this->info('✅ No legacy tokens found. All tokens are already using the new system.');

            return Command::SUCCESS;
        }

        $this->info("Found {$legacyOrgs->count()} organization(s) with legacy tokens:");

        // Show what we found
        $this->table(['ID', 'Name', 'Last Validated', 'Status'], $legacyOrgs->map(function ($org) {
            return [
                $org->id,
                $org->name,
                $org->token_last_validated_at ? $org->token_last_validated_at->format('Y-m-d H:i') : 'Never',
                $org->api_token ? 'Has Token' : 'No Token',
            ];
        }));

        if ($dryRun) {
            $this->info('🧪 DRY RUN MODE - No changes will be made');
            $this->info('These organizations would be converted to use the new token system.');

            return Command::SUCCESS;
        }

        if (! $force && ! $this->confirm('Convert these organizations to the new token system?')) {
            $this->info('Conversion cancelled.');

            return Command::SUCCESS;
        }

        $this->info('🔄 Converting legacy tokens...');

        $progressBar = $this->output->createProgressBar($legacyOrgs->count());
        $progressBar->start();

        $converted = 0;
        $failed = 0;

        foreach ($legacyOrgs as $org) {
            try {
                if ($org->api_token) {
                    // Validate the token and populate new fields
                    $result = $this->validationService->checkAndUpdateTokenHealth($org);

                    if ($result['valid']) {
                        $converted++;
                        $this->line("\n✅ Converted: {$org->name}");
                    } else {
                        $failed++;
                        $this->line("\n❌ Failed to validate token for: {$org->name} - {$result['error']}");
                    }
                } else {
                    // Organization has encrypted_api_token but api_token accessor failed
                    $this->line("\n⚠️  Skipped: {$org->name} - Token appears corrupted");
                    $failed++;
                }

            } catch (\Exception $e) {
                $failed++;
                $this->line("\n❌ Error converting {$org->name}: ".$e->getMessage());
            }

            $progressBar->advance();
        }

        $progressBar->finish();
        $this->newLine(2);

        // Summary
        $this->info('✅ Conversion Complete!');
        $this->table(['Result', 'Count'], [
            ['Successfully Converted', $converted],
            ['Failed/Skipped', $failed],
            ['Total Processed', $legacyOrgs->count()],
        ]);

        if ($converted > 0) {
            $this->info('🎉 Legacy tokens have been converted to the new system!');
            $this->info('📊 Organizations now have:');
            $this->info('   • Token expiration tracking');
            $this->info('   • Permission validation');
            $this->info('   • Health monitoring');
            $this->info('   • Renewal notifications');
        }

        if ($failed > 0) {
            $this->warn("⚠️  {$failed} organization(s) could not be converted.");
            $this->warn('Please check these manually - they may have invalid tokens.');
        }

        return Command::SUCCESS;
    }
}

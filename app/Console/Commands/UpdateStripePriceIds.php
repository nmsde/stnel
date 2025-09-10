<?php

namespace App\Console\Commands;

use App\Models\BillingPlan;
use Illuminate\Console\Command;

class UpdateStripePriceIds extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'stripe:update-price-ids 
                            {--plan= : The plan name (Free or Pro)}
                            {--price-id= : The Stripe price ID}
                            {--product-id= : The Stripe product ID}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Update Stripe price and product IDs for billing plans';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $planName = $this->option('plan');
        $priceId = $this->option('price-id');
        $productId = $this->option('product-id');

        if (!$planName) {
            $this->info('Current billing plans:');
            $plans = BillingPlan::all();
            
            $this->table(
                ['ID', 'Name', 'Price', 'Stripe Price ID', 'Stripe Product ID'],
                $plans->map(function ($plan) {
                    return [
                        $plan->id,
                        $plan->name,
                        '$' . $plan->price,
                        $plan->stripe_price_id,
                        $plan->stripe_product_id,
                    ];
                })
            );
            
            $this->newLine();
            $this->info('To update a plan, use:');
            $this->info('php artisan stripe:update-price-ids --plan=Pro --price-id=price_xxxxx --product-id=prod_xxxxx');
            $this->newLine();
            $this->warn('Note: You need to create products and prices in your Stripe dashboard first.');
            $this->warn('Visit: https://dashboard.stripe.com/products');
            
            return Command::SUCCESS;
        }

        $plan = BillingPlan::where('name', $planName)->first();

        if (!$plan) {
            $this->error("Plan '{$planName}' not found. Available plans: Free, Pro");
            return Command::FAILURE;
        }

        if ($priceId) {
            $plan->stripe_price_id = $priceId;
            $this->info("Updated Stripe price ID to: {$priceId}");
        }

        if ($productId) {
            $plan->stripe_product_id = $productId;
            $this->info("Updated Stripe product ID to: {$productId}");
        }

        if ($priceId || $productId) {
            $plan->save();
            $this->success("Plan '{$planName}' updated successfully!");
        } else {
            $this->warn("No updates made. Please provide --price-id and/or --product-id");
        }

        return Command::SUCCESS;
    }
}
<?php

namespace Database\Seeders;

use App\Models\BillingPlan;
use Illuminate\Database\Seeder;

class BillingPlansSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Free Plan
        BillingPlan::firstOrCreate(
            ['name' => 'Free'],
            [
                'stripe_price_id' => 'free', // Will need to be updated with actual Stripe price ID
                'stripe_product_id' => 'free', // Will need to be updated with actual Stripe product ID
                'price' => 0.00,
                'billing_interval' => 'month',
                'max_organizations' => 1,
                'max_protected_endpoints' => 5,
                'features' => [
                    'Basic Access Control',
                    'Activity Monitoring',
                ],
                'is_active' => true,
                'sort_order' => 1,
            ]
        );

        // Pro Plan
        BillingPlan::firstOrCreate(
            ['name' => 'Pro'],
            [
                'stripe_price_id' => 'price_pro', // Will need to be updated with actual Stripe price ID
                'stripe_product_id' => 'prod_pro', // Will need to be updated with actual Stripe product ID
                'price' => 15.00,
                'billing_interval' => 'month',
                'max_organizations' => -1, // Unlimited
                'max_protected_endpoints' => -1, // Unlimited
                'features' => [
                    'Advanced Access Management',
                    'Email Notifications',
                    'Priority Support',
                ],
                'is_active' => true,
                'sort_order' => 2,
            ]
        );
    }
}

<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('billing_plans', function (Blueprint $table) {
            $table->id();
            $table->string('name'); // Free, Pro
            $table->string('stripe_price_id')->unique(); // Stripe price ID
            $table->string('stripe_product_id'); // Stripe product ID
            $table->decimal('price', 8, 2); // Monthly price
            $table->string('billing_interval'); // month, year
            $table->integer('max_organizations'); // -1 for unlimited
            $table->integer('max_protected_endpoints'); // -1 for unlimited
            $table->json('features')->nullable(); // Additional features as JSON
            $table->boolean('is_active')->default(true);
            $table->integer('sort_order')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('billing_plans');
    }
};

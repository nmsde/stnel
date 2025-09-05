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
        Schema::create('access_policies', function (Blueprint $table) {
            $table->id();
            $table->foreignId('organisation_id')->constrained()->cascadeOnDelete();
            $table->foreignId('cloudflare_zone_id')->constrained('cloudflare_zones')->cascadeOnDelete();
            $table->string('cf_application_id')->nullable();
            $table->string('name');
            $table->string('domain');
            $table->string('path')->nullable();
            $table->string('session_duration', 50)->nullable();
            $table->boolean('require_mfa')->default(false);
            $table->json('rules')->nullable();
            $table->enum('status', ['active', 'inactive', 'pending'])->default('pending');
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('updated_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
            $table->softDeletes();
            
            $table->index('cf_application_id');
            $table->index(['organisation_id', 'status']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('access_policies');
    }
};

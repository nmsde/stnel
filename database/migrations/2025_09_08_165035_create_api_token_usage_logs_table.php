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
        Schema::create('api_token_usage_logs', function (Blueprint $table) {
            $table->id();
            $table->uuid('api_token_id');
            $table->foreign('api_token_id')->references('id')->on('api_tokens')->onDelete('cascade');
            $table->string('endpoint');
            $table->string('method', 10);
            $table->ipAddress('ip_address');
            $table->text('user_agent')->nullable();
            $table->unsignedSmallInteger('response_status');
            $table->float('response_time_ms', 8, 2)->nullable();
            $table->unsignedInteger('payload_size')->nullable();
            $table->timestamp('created_at');

            $table->index(['api_token_id', 'created_at']);
            $table->index('response_status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('api_token_usage_logs');
    }
};

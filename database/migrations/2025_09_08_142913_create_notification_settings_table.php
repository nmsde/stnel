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
        Schema::create('notification_settings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('organisation_id')->constrained('organisations')->onDelete('cascade');
            $table->json('notification_emails'); // Array of email addresses to notify
            $table->json('triggers')->default('["access_allowed", "access_blocked"]'); // What events trigger notifications
            $table->enum('frequency', ['immediate', 'hourly', 'daily'])->default('immediate');
            $table->boolean('enabled')->default(true);
            $table->timestamp('last_notification_sent_at')->nullable();
            $table->timestamps();

            $table->unique('organisation_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('notification_settings');
    }
};

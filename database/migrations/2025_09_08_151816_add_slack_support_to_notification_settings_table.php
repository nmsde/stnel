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
        Schema::table('notification_settings', function (Blueprint $table) {
            $table->boolean('slack_enabled')->default(false)->after('enabled');
            $table->text('slack_webhook_url')->nullable()->after('slack_enabled');
            $table->string('slack_channel')->nullable()->after('slack_webhook_url');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('notification_settings', function (Blueprint $table) {
            $table->dropColumn(['slack_enabled', 'slack_webhook_url', 'slack_channel']);
        });
    }
};

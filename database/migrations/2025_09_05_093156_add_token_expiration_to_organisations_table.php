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
        Schema::table('organisations', function (Blueprint $table) {
            $table->timestamp('token_expires_at')->nullable()->after('api_token');
            $table->timestamp('token_last_checked')->nullable()->after('token_expires_at');
            $table->json('token_permissions')->nullable()->after('token_last_checked');
            $table->boolean('token_renewal_notified')->default(false)->after('token_permissions');
            $table->timestamp('token_renewal_notified_at')->nullable()->after('token_renewal_notified');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('organisations', function (Blueprint $table) {
            $table->dropColumn([
                'token_expires_at',
                'token_last_checked', 
                'token_permissions',
                'token_renewal_notified',
                'token_renewal_notified_at'
            ]);
        });
    }
};

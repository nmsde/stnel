<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('access_policies', function (Blueprint $table) {
            $table->string('uuid', 36)->nullable()->after('id');
            $table->index('uuid');
        });

        // Generate UUIDs for existing records
        DB::table('access_policies')->whereNull('uuid')->chunkById(100, function ($policies) {
            foreach ($policies as $policy) {
                DB::table('access_policies')
                    ->where('id', $policy->id)
                    ->update([
                        'uuid' => (string) Str::uuid(),
                    ]);
            }
        });

        // Make UUID column unique after populating data
        Schema::table('access_policies', function (Blueprint $table) {
            $table->string('uuid', 36)->nullable(false)->unique()->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('access_policies', function (Blueprint $table) {
            $table->dropIndex(['uuid']);
            $table->dropColumn('uuid');
        });
    }
};

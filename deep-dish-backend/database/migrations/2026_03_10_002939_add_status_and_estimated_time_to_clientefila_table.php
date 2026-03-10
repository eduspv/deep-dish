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
        Schema::table('clientefila', function (Blueprint $table) {
            // Status: waiting, called, seated, cancelled
            $table->string('status', 20)->default('waiting')->after('position');
            $table->string('estimated_time')->nullable()->after('status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('clientefila', function (Blueprint $table) {
            $table->dropColumn(['status', 'estimated_time']);
        });
    }
};

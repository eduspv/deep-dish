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
        Schema::table('clientemesa', function (Blueprint $table) {
            $table->unsignedSmallInteger('party_size')->default(1)->after('horario_checkin');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('clientemesa', function (Blueprint $table) {
            $table->dropColumn('party_size');
        });
    }
};

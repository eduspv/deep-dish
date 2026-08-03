<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('restaurante', function (Blueprint $table) {
            $table->unsignedSmallInteger('intervalo_reserva')->nullable();
        });
    }

    public function down(): void
    {
        Schema::table('restaurante', function (Blueprint $table) {
            $table->dropColumn('intervalo_reserva');
        });
    }
};

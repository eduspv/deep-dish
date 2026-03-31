<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('fila', function (Blueprint $table) {
            $table->dateTime('horario_reserva')->nullable();
        });

        DB::table('fila')->whereIn('status', ['pendente', 'ativa'])->update(['status' => 'aberta']);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('fila', function (Blueprint $table) {
            $table->dropColumn('horario_reserva');
        });
    }
};

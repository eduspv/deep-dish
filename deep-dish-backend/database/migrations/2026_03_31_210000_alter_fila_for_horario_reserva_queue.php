<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Fila por horário (`horario_reserva` em `fila`).
     * Posição em `clientefila` é derivada de `created_at` (ver model ClienteFila).
     * Remove a tabela duplicada `cliente_fila` caso exista.
     */
    public function up(): void
    {
        Schema::dropIfExists('cliente_fila');

        Schema::table('fila', function (Blueprint $table) {
            if (! Schema::hasColumn('fila', 'horario_reserva')) {
                $table->dateTime('horario_reserva')->nullable();
            }
        });

        DB::table('fila')->whereIn('status', ['pendente', 'ativa'])->update(['status' => 'aberta']);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('fila', function (Blueprint $table) {
            if (Schema::hasColumn('fila', 'horario_reserva')) {
                $table->dropColumn('horario_reserva');
            }
        });

    }
};

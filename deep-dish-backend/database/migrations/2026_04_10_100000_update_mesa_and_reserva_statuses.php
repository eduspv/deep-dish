<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        // Atualiza status das mesas para o novo padrão
        DB::table('mesa')->where('status', 'disponível')->update(['status' => 'livre']);
        DB::table('mesa')->where('status', 'inativa')->update(['status' => 'bloqueada']);
        // 'ocupada' permanece igual

        // Adiciona coluna horario_checkin na clientemesa (para giro médio futuro)
        if (! \Schema::hasColumn('clientemesa', 'horario_checkin')) {
            \Schema::table('clientemesa', function ($table) {
                $table->timestamp('horario_checkin')->nullable()->after('horario_reserva');
            });
        }

        // Atualiza status 'pendente' para 'confirmada' em reservas existentes
        DB::table('clientemesa')->where('status', 'pendente')->update(['status' => 'confirmada']);
    }

    public function down(): void
    {
        DB::table('mesa')->where('status', 'livre')->update(['status' => 'disponível']);
        DB::table('mesa')->where('status', 'bloqueada')->update(['status' => 'inativa']);

        if (\Schema::hasColumn('clientemesa', 'horario_checkin')) {
            \Schema::table('clientemesa', function ($table) {
                $table->dropColumn('horario_checkin');
            });
        }
    }
};

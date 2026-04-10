<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Remove a constraint unique antiga de clientemesa (cliente_id, mesa_id)
        // pois mesa_id vai mudar de tipo
        Schema::table('clientemesa', function ($table) {
            $table->dropForeign(['mesa_id']);
            $table->dropUnique(['cliente_id', 'mesa_id']);
        });

        // Limpa dados existentes para evitar conflito na conversão
        // (mesas e reservas de teste serão recriadas)
        DB::table('clientemesa')->delete();
        DB::table('mesa')->delete();

        // Converte mesa.id de bigint para uuid
        Schema::table('mesa', function ($table) {
            $table->dropColumn('id');
        });
        Schema::table('mesa', function ($table) {
            $table->uuid('id')->primary()->first();
        });

        // Converte clientemesa.id e clientemesa.mesa_id
        Schema::table('clientemesa', function ($table) {
            $table->dropColumn('id');
            $table->dropColumn('mesa_id');
        });
        Schema::table('clientemesa', function ($table) {
            $table->uuid('id')->primary()->first();
            $table->uuid('mesa_id')->after('cliente_id');

            $table->foreign('mesa_id')->references('id')->on('mesa')->onDelete('cascade');
            $table->unique(['cliente_id', 'mesa_id']);
        });
    }

    public function down(): void
    {
        // Reverter para bigint não é prático — esta migration é irreversível em produção
    }
};

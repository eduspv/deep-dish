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
        Schema::table('restaurante', function (Blueprint $table) {
            $table->string('cidade')->nullable();
            $table->string('telefone')->nullable();
            $table->string('imagem_url')->nullable();
            $table->string('horario_funcionamento')->nullable();
            $table->boolean('fila_ativa')->default(false);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('restaurante', function (Blueprint $table) {
            $table->dropColumn(['cidade', 'telefone', 'imagem_url', 'horario_funcionamento', 'fila_ativa']);
        });
    }
};

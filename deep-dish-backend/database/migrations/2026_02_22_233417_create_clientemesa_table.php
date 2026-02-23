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
        // criando tabela de cliente_mesa para relacionar clientes e mesas
        Schema::create('clientemesa', function (Blueprint $table) {
            // id da tabela auto-incrementável
            $table->id();
            // chave estrangeira para cliente_id referenciando a tabela clientes, com exclusão em cascata
            $table->foreignId('cliente_id')->constrained('clientes')->onDelete('cascade');
            // chave estrangeira para mesa_id referenciando a tabela mesas, com exclusão em cascata
            $table->foreignId('mesa_id')->constrained('mesas')->onDelete('cascade');
            // campo de horário da reserva do tipo timestamp
            $table->timestamp('horario_reserva');
            // campo de status da reserva do tipo enum com os valores 'reservada', 'confirmada' e 'cancelada', com valor padrão 'reservada'
            $table->enum('status', ['reservada', 'confirmada', 'cancelada'])->default('reservada');
            // campo de Criado e atualizado do tipo timestamp
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('clientemesa');
    }
};

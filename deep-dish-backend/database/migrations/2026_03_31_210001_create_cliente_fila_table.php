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
        Schema::create('cliente_fila', function (Blueprint $table) {
            $table->id();
            $table->foreignId('id_fila')->constrained('fila')->onDelete('cascade');
            $table->foreignId('id_cliente')->constrained('cliente')->onDelete('cascade');
            $table->unsignedInteger('qntd_pessoas');
            $table->unsignedInteger('posicao');
            $table->string('status', 20)->default('aguardando');
            $table->timestamps();

            $table->index(['id_fila', 'status', 'posicao']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('cliente_fila');
    }
};

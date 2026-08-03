<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('restaurante', function (Blueprint $table) {
            $table->string('logradouro')->nullable()->after('tipo');
            $table->string('numero', 20)->nullable()->after('logradouro');
            $table->string('complemento')->nullable()->after('numero');
            $table->string('bairro')->nullable()->after('complemento');
            $table->string('estado', 2)->nullable()->after('cidade');
            $table->string('cep', 9)->nullable()->after('estado');
        });

        Schema::table('restaurante', function (Blueprint $table) {
            $table->dropColumn('endereco');
        });
    }

    public function down(): void
    {
        Schema::table('restaurante', function (Blueprint $table) {
            $table->string('endereco')->nullable()->after('tipo');
        });

        Schema::table('restaurante', function (Blueprint $table) {
            $table->dropColumn(['logradouro', 'numero', 'complemento', 'bairro', 'estado', 'cep']);
        });
    }
};

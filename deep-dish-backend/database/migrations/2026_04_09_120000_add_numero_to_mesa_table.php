<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('mesa', function (Blueprint $table) {
            $table->integer('numero')->after('restaurante_id')->nullable();
            $table->unique(['restaurante_id', 'numero']);
        });
    }

    public function down(): void
    {
        Schema::table('mesa', function (Blueprint $table) {
            $table->dropUnique(['restaurante_id', 'numero']);
            $table->dropColumn('numero');
        });
    }
};

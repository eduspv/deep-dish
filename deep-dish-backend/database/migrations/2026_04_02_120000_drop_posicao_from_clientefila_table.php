<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Posição na fila passa a ser calculada pela ordem de created_at (e desempate por id).
     */
    public function up(): void
    {
        if (! Schema::hasTable('clientefila')) {
            return;
        }

        Schema::table('clientefila', function (Blueprint $table) {
            if (Schema::hasColumn('clientefila', 'posicao')) {
                $table->dropColumn('posicao');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (! Schema::hasTable('clientefila')) {
            return;
        }

        Schema::table('clientefila', function (Blueprint $table) {
            if (! Schema::hasColumn('clientefila', 'posicao')) {
                $table->unsignedInteger('posicao')->default(1);
            }
        });
    }
};

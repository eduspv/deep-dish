<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Registros em clientefila representam apenas quem está na fila; cancelar/promover remove a linha.
     */
    public function up(): void
    {
        if (! Schema::hasTable('clientefila')) {
            return;
        }

        Schema::table('clientefila', function (Blueprint $table) {
            if (Schema::hasColumn('clientefila', 'status')) {
                $table->dropColumn('status');
            }
        });
    }

    public function down(): void
    {
        if (! Schema::hasTable('clientefila')) {
            return;
        }

        Schema::table('clientefila', function (Blueprint $table) {
            if (! Schema::hasColumn('clientefila', 'status')) {
                $table->string('status', 20)->default('aguardando');
            }
        });
    }
};

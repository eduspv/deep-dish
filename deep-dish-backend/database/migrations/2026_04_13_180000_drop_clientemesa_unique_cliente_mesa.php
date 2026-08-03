<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        DB::statement('ALTER TABLE clientemesa DROP CONSTRAINT IF EXISTS clientemesa_cliente_id_mesa_id_unique');
    }

    public function down(): void
    {
        Schema::table('clientemesa', function ($table) {
            $table->unique(['cliente_id', 'mesa_id']);
        });
    }
};

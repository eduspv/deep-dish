<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('restaurante', function (Blueprint $table) {
            $table->decimal('rating', 2, 1)->nullable();
            $table->tinyInteger('price_range')->nullable();
            $table->boolean('reservations_enabled')->default(false);
        });
    }

    public function down(): void
    {
        Schema::table('restaurante', function (Blueprint $table) {
            $table->dropColumn([
                'rating',
                'price_range',
                'reservations_enabled',
            ]);
        });
    }
};

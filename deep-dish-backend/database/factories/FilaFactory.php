<?php

namespace Database\Factories;

use App\Models\Fila;
use App\Models\Restaurante;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Fila>
 */
class FilaFactory extends Factory
{
    protected $model = Fila::class;

    public function definition(): array
    {
        return [
            'restaurante_id' => Restaurante::factory(),
            'horario_reserva' => now()->addHour(),
            'status' => Fila::STATUS_ABERTA,
        ];
    }
}

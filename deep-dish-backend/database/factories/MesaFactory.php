<?php

namespace Database\Factories;

use App\Models\Mesa;
use App\Models\Restaurante;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Mesa>
 */
class MesaFactory extends Factory
{
    protected $model = Mesa::class;

    public function definition(): array
    {
        return [
            'restaurante_id' => Restaurante::factory(),
            'numero' => fake()->unique()->numberBetween(1, 900000),
            'status' => 'livre',
            'capacidade' => 4,
            'confirmacao' => 'pendente',
        ];
    }
}

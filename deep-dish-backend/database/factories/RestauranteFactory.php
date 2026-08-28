<?php

namespace Database\Factories;

use App\Models\Restaurante;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Restaurante>
 */
class RestauranteFactory extends Factory
{
    protected $model = Restaurante::class;

    public function definition(): array
    {
        return [
            'name' => fake()->company(),
            'email' => fake()->unique()->safeEmail(),
            'cnpj' => fake()->unique()->numerify('##############'),
            'tipo' => 'brasileira',
            'password' => Hash::make('password'),
            'tipo_usuario' => 'restaurante',
            'email_verified_at' => now(),
        ];
    }
}

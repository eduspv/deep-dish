<?php

namespace Database\Factories;

use App\Models\Cliente;
use App\Models\ClienteFila;
use App\Models\Fila;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * Só cobre a entrada "ainda na fila": status_saida, saiu_em,
 * tempo_espera_segundos e deleted_at ficam de fora de propósito — são
 * escritos exclusivamente por ClienteFila::registrarSaida(), nunca por
 * atribuição em massa (estão fora do $fillable do model).
 *
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\ClienteFila>
 */
class ClienteFilaFactory extends Factory
{
    protected $model = ClienteFila::class;

    public function definition(): array
    {
        return [
            'fila_id' => Fila::factory(),
            'cliente_id' => Cliente::factory(),
            'qntd_pessoas' => fake()->numberBetween(1, 6),
        ];
    }
}

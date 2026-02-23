<?php

namespace App\Repositories;

use App\Models\Restaurante;

class RestauranteRepository
{
    public function create(array $data): Restaurante
    {
        // ✅ Único lugar que "fala com o banco" nesta arquitetura
        return Restaurante::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'cnpj' => $data['cnpj'],
            'tipo' => $data['tipo'],
            'endereco' => $data['endereco'],
            'tipo_usuario' => $data['tipo_usuario'],
            'password' => $data['password'], 
        ]);
    }
}
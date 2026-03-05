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
            'logradouro' => $data['logradouro'],
            'numero' => $data['numero'],
            'complemento' => $data['complemento'] ?? null,
            'bairro' => $data['bairro'],
            'cidade' => $data['cidade'],
            'estado' => strtoupper($data['estado']),
            'cep' => $data['cep'],
            'telefone' => $data['telefone'] ?? null,
            'imagem_url' => $data['imagem_url'] ?? null,
            'horario_funcionamento' => $data['horario_funcionamento'] ?? null,
            'fila_ativa' => $data['fila_ativa'] ?? false,
            'tipo_usuario' => $data['tipo_usuario'],
            'password' => $data['password'],
        ]);
    }
}
<?php

namespace App\Repositories;

use App\Models\Cliente;

class ClienteRepository
{
    public function create(array $data): Cliente
    {
        return Cliente::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'cpf' => $data['cpf'],
            'password' => $data['password'],
        ]);
    }
}

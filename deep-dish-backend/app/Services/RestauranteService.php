<?php

namespace App\Services;

use App\Repositories\RestauranteRepository;
use Illuminate\Support\Facades\DB;

class RestauranteService
{
    public function __construct(private RestauranteRepository $repo)
    {
    }

    public function register(array $validated): array
    {
        return DB::transaction(function () use ($validated) {
            $validated['tipo_usuario'] = 'restaurante';
            $restaurante = $this->repo->create($validated);
            $token = auth('restaurante')->login($restaurante);

            return [
                'restaurante' => $restaurante,
                'token' => $token,
            ];
        });
    }
}
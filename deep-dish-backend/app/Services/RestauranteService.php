<?php

namespace App\Services;

use App\Repositories\RestauranteRepository;
use Illuminate\Support\Facades\DB;
use Tymon\JWTAuth\Facades\JWTAuth;

class RestauranteService
{
    public function __construct(private RestauranteRepository $repo)
    {
    }

    public function register(array $validated): array
    {
        return DB::transaction(function () use ($validated) {

            // Regra de negócio: tipo_usuario é definido pelo sistema
            $validated['tipo_usuario'] = 'restaurante';

            // Persiste via repository
            $restaurante = $this->repo->create($validated);

            // Gera token JWT para o restaurante recém criado
            $token = JWTAuth::fromUser($restaurante);

            return [
                'tipo_usuario' => $restaurante->tipo_usuario,
                'token' => $token,
            ];
        });
    }
}
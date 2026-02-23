<?php

namespace App\Services;

use App\Repositories\RestauranteRepository;
use Tymon\JWTAuth\Facades\JWTAuth;

class RestauranteService
{
    public function __construct(private RestauranteRepository $repo)
    {
    }

    public function register(array $validated): array
    {
        // ✅ Regra de negócio: tipo_usuario é definido pelo sistema (não vem do request)
        $validated['tipo_usuario'] = 'restaurante';

        // ✅ Persiste via repository
        $restaurante = $this->repo->create($validated);

        // ✅ Gera token JWT para o restaurante recém criado
        $token = JWTAuth::fromUser($restaurante);

        return [
            'restaurante' => $restaurante,
            'token' => $token,
        ];
    }
}
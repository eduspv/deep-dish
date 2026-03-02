<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Services\RestauranteService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class RestauranteAuthController extends Controller
{
    public function __construct(private RestauranteService $service)
    {
    }

    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => [
                'required',
                'email',
                'regex:/^[^@]+@[^@]+\.(com)$/i',
                'unique:restaurante,email',
            ],
            'cnpj' => 'required|string|unique:restaurante,cnpj',
            'tipo' => 'required|string|in:bifes,vegetariano,churrasco,frutos do mar,comida caseira',
            'endereco' => 'required|string',
            'cidade' => 'nullable|string',
            'telefone' => 'nullable|string',
            'imagem_url' => 'nullable|string',
            'horario_funcionamento' => 'nullable|string',
            'fila_ativa' => 'nullable|boolean',
            'password' => 'required|string|min:6',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'error' => 'Dados de entrada inválidos',
                'details' => $validator->errors(),
            ], 422);
        }

        try {
            $result = $this->service->register($validator->validated());

            return response()->json([
                'message' => 'Restaurante cadastrado com sucesso!',
                'restaurante' => $result['restaurante'],
                'type' => 'restaurante',
                'token' => $result['token'],
            ], 201);
        } catch (\Throwable $e) {
            \Illuminate\Support\Facades\Log::error('Erro ao cadastrar restaurante', [
                'message' => $e->getMessage(),
            ]);

            return response()->json([
                'error' => 'Erro interno no servidor',
            ], 500);
        }
    }

    public function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'password' => 'required|string|min:6',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'error' => $validator->errors(),
            ], 422);
        }

        $credentials = $request->only('email', 'password');

        if (!$token = auth('restaurante')->attempt($credentials)) {
            return response()->json([
                'error' => 'Email ou senha inválidos',
            ], 401);
        }

        return response()->json([
            'message' => 'Login realizado com sucesso',
            'type' => 'restaurante',
            'token' => $token,
        ]);
    }

    public function me()
    {
        return response()->json(auth('restaurante')->user());
    }

    public function logout()
    {
        $user = auth('restaurante')->user();

        if ($user) {
            $user->increment('token_version');
        }

        return response()->json([
            'message' => 'Logout realizado com sucesso',
        ]);
    }

    public function refresh()
    {
        return response()->json([
            'token' => auth('restaurante')->refresh(),
        ]);
    }
}

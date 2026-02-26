<?php

namespace App\Http\Controllers;

use App\Services\RestauranteService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;

class RestauranteController extends Controller
{
    public function __construct(private RestauranteService $service)
    {
    }

    public function register(Request $request)
    {
        $data = $request->all();

        try {
            // ✅ Controller valida entrada (camada HTTP)
            $validated = validator($data, [
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
            ])->validate();

            // ✅ Chama a regra de negócio no Service
            $result = $this->service->register($validated);

            return response()->json([
                'message' => 'Restaurante cadastrado com sucesso!',
                'restaurante' => $result['tipo_usuario'],
                'token' => $result['token'],
            ], 201);

        } catch (ValidationException $e) {
            return response()->json([
                'error' => 'Dados de entrada inválidos',
                'details' => $e->errors(),
            ], 422);

        } catch (\Throwable $e) {
            Log::error('Erro ao cadastrar restaurante', [
                'message' => $e->getMessage(),
            ]);

            return response()->json([
                'error' => 'Erro interno no servidor',
            ], 500);
        }
    }
}
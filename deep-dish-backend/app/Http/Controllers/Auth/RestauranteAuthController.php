<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Services\RestauranteService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class RestauranteAuthController extends Controller
{
    public function __construct(private RestauranteService $service)
    {
    }

    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name'                  => 'required|string|max:255',
            'email'                 => [
                'required',
                'email',
                'regex:/^[^@]+@[^@]+\.(com)$/i',
                'unique:restaurante,email',
            ],
            'cnpj'                  => 'required|string|unique:restaurante,cnpj',
            'tipo'                  => 'required|string|in:brasileira,italiana,japonesa,chinesa,árabe,mexicana,francesa,portuguesa,churrasco,frutos do mar,vegetariano,vegano,fast food,pizza,hamburguer,cafeteria,padaria,comida caseira',
            'logradouro'            => 'required|string|max:255',
            'numero'                => 'required|string|max:20',
            'complemento'           => 'nullable|string|max:100',
            'bairro'                => 'required|string|max:100',
            'cidade'                => 'required|string|max:100',
            'estado'                => 'required|string|size:2',
            'cep'                   => ['required', 'string', 'regex:/^\d{5}-?\d{3}$/'],
            'telefone'              => 'nullable|string',
            'imagem_url'            => 'nullable|string',
            'horario_funcionamento' => 'nullable|string',
            'fila_ativa'            => 'nullable|boolean',
            'password'              => 'required|string|min:6',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'error'   => 'Dados de entrada inválidos',
                'details' => $validator->errors(),
            ], 422);
        }

        try {
            $result = $this->service->register($validator->validated());

            return response()->json([
                'message'     => 'Restaurante cadastrado com sucesso!',
                'restaurante' => $result['restaurante'],
                'type'        => 'restaurante',
                'token'       => $result['token'],
            ], 201);
        } catch (\Throwable $e) {
            Log::error('Erro ao cadastrar restaurante', [
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
            'email'    => 'required|email',
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
            'type'    => 'restaurante',
            'token'   => $token,
        ]);
    }

    public function me()
    {
        return response()->json(auth('restaurante')->user());
    }

    // ─── Atualiza perfil do restaurante ─────────────────────
    public function update(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name'               => 'sometimes|string|max:255',
            'telefone'           => 'sometimes|nullable|string',
            'horario_abertura'   => 'sometimes|nullable|date_format:H:i',
            'horario_fechamento' => 'sometimes|nullable|date_format:H:i',
            'fila_ativa'         => 'sometimes|boolean',
            'logradouro'         => 'sometimes|string|max:255',
            'numero'             => 'sometimes|string|max:20',
            'complemento'        => 'sometimes|nullable|string|max:100',
            'bairro'             => 'sometimes|string|max:100',
            'cidade'             => 'sometimes|string|max:100',
            'estado'             => 'sometimes|string|size:2',
            'cep'                => ['sometimes', 'string', 'regex:/^\d{5}-?\d{3}$/'],
        ]);

        if ($validator->fails()) {
            return response()->json([
                'error'   => 'Dados de entrada inválidos',
                'details' => $validator->errors(),
            ], 422);
        }

        try {
            $restaurante = auth('restaurante')->user();
            $restaurante->update($validator->validated());

            return response()->json($restaurante);
        } catch (\Throwable $e) {
            Log::error('Erro ao atualizar restaurante', ['message' => $e->getMessage()]);

            return response()->json(['error' => 'Erro interno no servidor'], 500);
        }
    }

    // ─── Upload de imagem do restaurante ────────────────────
    public function uploadImagem(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'imagem' => 'required|image|mimes:jpeg,png,jpg,webp|max:2048',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'error'   => 'Imagem inválida',
                'details' => $validator->errors(),
            ], 422);
        }

        $restaurante = auth('restaurante')->user();

        // remove imagem antiga se existir
        if ($restaurante->imagem_url) {
            $oldPath = str_replace(asset('storage') . '/', '', $restaurante->imagem_url);
            Storage::disk('public')->delete($oldPath);
        }

        // salva nova imagem em storage/app/public/restaurantes/
        $path = $request->file('imagem')->store('restaurantes', 'public');
        $url  = asset('storage/' . $path);

        $restaurante->update(['imagem_url' => $url]);

        return response()->json([
            'message'    => 'Imagem atualizada com sucesso!',
            'imagem_url' => $url,
        ]);
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
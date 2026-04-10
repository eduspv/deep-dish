<?php

namespace App\Http\Controllers;

use App\Models\Mesa;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;

class MesaController extends Controller
{
    // ─── Lista mesas do restaurante logado ──────────────────
    public function index(): JsonResponse
    {
        $restauranteId = auth('restaurante')->id();

        $mesas = Mesa::where('restaurante_id', $restauranteId)
            ->orderBy('numero', 'asc')
            ->get();

        return response()->json($mesas);
    }

    // ─── Cria nova mesa ─────────────────────────────────────
    public function store(Request $request): JsonResponse
    {
        $restauranteId = auth('restaurante')->id();

        $validator = Validator::make($request->all(), [
            'numero' => [
                'required',
                'integer',
                'min:1',
                Rule::unique('mesa', 'numero')->where('restaurante_id', $restauranteId),
            ],
            'capacidade' => 'required|integer|min:1|max:30',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'error'   => 'Dados inválidos',
                'details' => $validator->errors(),
            ], 422);
        }

        try {
            $mesa = Mesa::create([
                'restaurante_id' => $restauranteId,
                'numero'         => $request->input('numero'),
                'capacidade'     => $request->input('capacidade'),
                'status'         => 'livre',
                'confirmacao'    => 'pendente',
            ]);

            return response()->json([
                'message' => 'Mesa criada com sucesso!',
                'mesa'    => $mesa,
            ], 201);
        } catch (\Throwable $e) {
            Log::error('Erro ao criar mesa', ['message' => $e->getMessage()]);
            return response()->json(['error' => 'Erro interno ao criar mesa'], 500);
        }
    }

    // ─── Atualiza mesa ──────────────────────────────────────
    public function update(Request $request, string $id): JsonResponse
    {
        $restauranteId = auth('restaurante')->id();

        $mesa = Mesa::where('id', $id)
            ->where('restaurante_id', $restauranteId)
            ->first();

        if (! $mesa) {
            return response()->json(['error' => 'Mesa não encontrada.'], 404);
        }

        $validator = Validator::make($request->all(), [
            'numero' => [
                'sometimes',
                'integer',
                'min:1',
                Rule::unique('mesa', 'numero')
                    ->where('restaurante_id', $restauranteId)
                    ->ignore($mesa->id),
            ],
            'capacidade' => 'sometimes|integer|min:1|max:30',
            'status'     => 'sometimes|string|in:livre,reservada,ocupada,bloqueada',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'error'   => 'Dados inválidos',
                'details' => $validator->errors(),
            ], 422);
        }

        try {
            $mesa->update($validator->validated());

            return response()->json([
                'message' => 'Mesa atualizada!',
                'mesa'    => $mesa->fresh(),
            ]);
        } catch (\Throwable $e) {
            Log::error('Erro ao atualizar mesa', ['message' => $e->getMessage()]);
            return response()->json(['error' => 'Erro interno ao atualizar mesa'], 500);
        }
    }

    // ─── Remove mesa ────────────────────────────────────────
    public function destroy(string $id): JsonResponse
    {
        $restauranteId = auth('restaurante')->id();

        $mesa = Mesa::where('id', $id)
            ->where('restaurante_id', $restauranteId)
            ->first();

        if (! $mesa) {
            return response()->json(['error' => 'Mesa não encontrada.'], 404);
        }

        $mesa->delete();

        return response()->json(['message' => 'Mesa removida.']);
    }
}

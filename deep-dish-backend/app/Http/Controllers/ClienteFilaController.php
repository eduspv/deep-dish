<?php

namespace App\Http\Controllers;

use App\Models\ClienteFila;
use App\Models\Fila;
use App\Models\Restaurante;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Throwable;

class ClienteFilaController extends Controller
{
    /**
     * Entrar na fila digital do restaurante.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'restaurante_id' => ['required', 'integer', 'exists:restaurante,id'],
            'qntd_pessoas' => ['required', 'integer', 'min:1'],
            'clientemesa_id' => ['nullable', 'integer', 'exists:clientemesa,id'],
            'estimated_time' => ['nullable', 'string', 'max:50'],
        ]);

        $cliente = auth('cliente')->user();
        $restaurante = Restaurante::find($validated['restaurante_id']);

        if (! $restaurante->fila_ativa) {
            return response()->json([
                'message' => 'A fila deste restaurante não está ativa.',
            ], 422);
        }

        // Se clientemesa_id foi enviado, verificar se pertence ao cliente
        if (! empty($validated['clientemesa_id'])) {
            $clienteMesa = \App\Models\ClienteMesa::find($validated['clientemesa_id']);
            if ($clienteMesa && $clienteMesa->cliente_id !== $cliente->id) {
                return response()->json([
                    'message' => 'Esta reserva não pertence ao cliente autenticado.',
                ], 403);
            }
        }

        $fila = Fila::where('restaurante_id', $restaurante->id)
            ->where('status', 'ativa')
            ->latest()
            ->first();

        if (! $fila) {
            $fila = Fila::create([
                'restaurante_id' => $restaurante->id,
                'status' => 'ativa',
            ]);
        }

        // Verificar se o cliente já está na fila (status waiting) deste restaurante
        $jaNaFila = ClienteFila::where('cliente_id', $cliente->id)
            ->whereHas('fila', fn ($q) => $q->where('restaurante_id', $restaurante->id))
            ->waiting()
            ->exists();

        if ($jaNaFila) {
            return response()->json([
                'message' => 'Você já está na fila deste restaurante.',
            ], 422);
        }

        try {
            $position = ClienteFila::where('fila_id', $fila->id)->waiting()->count() + 1;

            $clienteFila = ClienteFila::create([
                'fila_id' => $fila->id,
                'cliente_id' => $cliente->id,
                'clientemesa_id' => $validated['clientemesa_id'] ?? null,
                'qntd_pessoas' => $validated['qntd_pessoas'],
                'position' => $position,
                'status' => ClienteFila::STATUS_WAITING,
                'estimated_time' => $validated['estimated_time'] ?? null,
            ]);

            return response()->json([
                'id' => $clienteFila->id,
                'fila_id' => $clienteFila->fila_id,
                'restaurante_id' => $restaurante->id,
                'restaurante_nome' => $restaurante->name,
                'qntd_pessoas' => $clienteFila->qntd_pessoas,
                'position' => $clienteFila->position,
                'status' => $clienteFila->status,
                'estimated_time' => $clienteFila->estimated_time,
                'created_at' => $clienteFila->created_at->format(\DateTimeInterface::ATOM),
            ], 201);
        } catch (Throwable $e) {
            report($e);

            return response()->json([
                'message' => 'Erro ao entrar na fila.',
                'error' => config('app.debug') ? $e->getMessage() : null,
            ], 500);
        }
    }

    /**
     * Sair/cancelar entrada na fila (desistir).
     */
    public function destroy(ClienteFila $clienteFila): JsonResponse
    {
        $cliente = auth('cliente')->user();

        if ($clienteFila->cliente_id !== $cliente->id) {
            return response()->json([
                'message' => 'Você não pode cancelar esta entrada na fila.',
            ], 403);
        }

        if ($clienteFila->status !== ClienteFila::STATUS_WAITING) {
            return response()->json([
                'message' => 'Apenas entradas em espera podem ser canceladas. Status atual: ' . $clienteFila->status,
            ], 422);
        }

        $clienteFila->update(['status' => ClienteFila::STATUS_CANCELLED]);

        return response()->json([
            'message' => 'Você saiu da fila com sucesso.',
        ]);
    }
}

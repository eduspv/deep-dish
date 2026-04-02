<?php

namespace App\Http\Controllers;

use App\Services\FilaService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use InvalidArgumentException;

class FilaController extends Controller
{
    public function __construct(private FilaService $filaService)
    {
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'restaurante_id' => ['required', 'integer', 'exists:restaurante,id'],
            'horario_reserva' => ['required', 'date_format:Y-m-d H:i:s'],
            'qntd_pessoas' => ['required', 'integer', 'min:1'],
        ]);

        $clienteFila = $this->filaService->enfileirar(
            (int) auth('api')->id(),
            (int) $validated['restaurante_id'],
            $validated['horario_reserva'],
            (int) $validated['qntd_pessoas']
        );

        return response()->json([
            'message' => 'Você está na posição ' . $clienteFila->posicao . ' da fila.',
            'data' => $clienteFila,
        ], 201);
    }

    public function destroy(int $id): JsonResponse
    {
        try {
            $this->filaService->cancelarPosicao($id, (int) auth('api')->id());
        } catch (InvalidArgumentException $e) {
            return response()->json([
                'message' => $e->getMessage(),
            ], 403);
        }

        return response()->json([
            'message' => 'Posição na fila cancelada com sucesso.',
        ]);
    }

    public function consultarPosicao(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'restaurante_id' => ['required', 'integer', 'exists:restaurante,id'],
            'horario_reserva' => ['required', 'date_format:Y-m-d H:i:s'],
        ]);

        $registro = $this->filaService->consultarPosicao(
            (int) auth('api')->id(),
            (int) $validated['restaurante_id'],
            $validated['horario_reserva']
        );

        if (! $registro) {
            return response()->json([
                'message' => 'Você não está na fila para este horário.',
            ], 404);
        }

        return response()->json($registro);
    }
}

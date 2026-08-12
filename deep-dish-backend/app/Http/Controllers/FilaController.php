<?php

namespace App\Http\Controllers;

use App\Models\ClienteFila;
use App\Models\Fila;
use App\Services\FilaService;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use InvalidArgumentException;

class FilaController extends Controller
{
    public function __construct(private FilaService $filaService) {}

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'restaurante_id' => ['required', 'string', 'uuid', 'exists:restaurante,id'],
            'horario_reserva' => ['required', 'date', 'after:now'],
            'qntd_pessoas' => ['required', 'integer', 'min:1'],
        ]);

        $horarioUTC = Carbon::parse($validated['horario_reserva'])->utc()->format('Y-m-d H:i:s');

        try {
            $clienteFila = $this->filaService->enfileirar(
                (string) auth('api')->id(),
                $validated['restaurante_id'],
                $horarioUTC,
                (int) $validated['qntd_pessoas']
            );
        } catch (\InvalidArgumentException $e) {
            return response()->json(['message' => $e->getMessage()], 422);
        }

        $clienteFila->load('fila');

        return response()->json([
            'message' => 'Você está na posição '.$clienteFila->posicao.' da fila.',
            'data' => $clienteFila,
        ], 201);
    }

    public function destroy(string $id): JsonResponse
    {
        try {
            $this->filaService->cancelarPosicao($id, (string) auth('api')->id());
        } catch (InvalidArgumentException $e) {
            return response()->json([
                'message' => $e->getMessage(),
            ], 403);
        }

        return response()->json([
            'message' => 'Posição na fila cancelada com sucesso.',
        ]);
    }

    // ─── Restaurante: lista entradas na fila ────────────────
    public function indexRestaurante(): JsonResponse
    {
        $restauranteId = auth('restaurante')->id();

        $entries = ClienteFila::with(['fila', 'cliente'])
            ->whereHas('fila', fn ($q) => $q
                ->where('restaurante_id', $restauranteId)
                ->where('status', Fila::STATUS_ABERTA)
            )
            ->orderBy('created_at')
            ->get();

        return response()->json($entries);
    }

    // ─── Restaurante: remove entrada da fila ────────────────
    public function removerRestaurante(string $id): JsonResponse
    {
        $restauranteId = auth('restaurante')->id();

        $registro = ClienteFila::whereKey($id)
            ->whereHas('fila', fn ($q) => $q->where('restaurante_id', $restauranteId))
            ->first();

        if (! $registro) {
            return response()->json(['message' => 'Entrada não encontrada.'], 404);
        }

        $fila = $registro->fila;
        $registro->delete();

        if (! $fila->clienteFilas()->exists()) {
            $fila->update(['status' => Fila::STATUS_ENCERRADA]);
        }

        return response()->json(['message' => 'Removido da fila.']);
    }

    public function consultarPosicao(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'restaurante_id' => ['required', 'string', 'uuid', 'exists:restaurante,id'],
            'horario_reserva' => ['required', 'date'],
        ]);

        $horarioUTC = Carbon::parse($validated['horario_reserva'])->utc()->format('Y-m-d H:i:s');

        $registro = $this->filaService->consultarPosicao(
            (string) auth('api')->id(),
            $validated['restaurante_id'],
            $horarioUTC
        );

        if (! $registro) {
            return response()->json([
                'message' => 'Você não está na fila para este horário.',
            ], 404);
        }

        $registro->load('fila');

        return response()->json($registro);
    }
}

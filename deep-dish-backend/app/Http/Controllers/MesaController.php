<?php

namespace App\Http\Controllers;

use App\Models\ClienteMesa;
use App\Models\Mesa;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;

class MesaController extends Controller
{
    // ─── Rota pública: mesas disponíveis de um restaurante ──
    // Query params opcionais:
    //   horario      = ISO datetime (ex: 2026-04-13T19:00:00) → filtra por sobreposição de reservas
    //   capacidade_min = int → filtra por capacidade mínima
    public function disponiveis(Request $request, string $id): JsonResponse
    {
        $horarioParam = $request->query('horario');

        $query = Mesa::where('restaurante_id', $id)
            ->where('status', '!=', 'bloqueada')
            ->orderBy('capacidade', 'asc');

        if ($request->has('capacidade_min')) {
            $query->where('capacidade', '>=', (int) $request->query('capacidade_min'));
        }

        if ($horarioParam) {
            // Exclui mesas que já têm reserva ativa sobreposta ao intervalo solicitado (1h)
            try {
                $inicio = Carbon::parse($horarioParam);
                $fim    = $inicio->copy()->addMinutes(60);
            } catch (\Throwable) {
                return response()->json(['error' => 'Horário inválido.'], 422);
            }

            $reservadasIds = ClienteMesa::whereIn('status', ['confirmada', 'em_andamento'])
                ->where('horario_reserva', '<', $fim)
                ->whereRaw("horario_reserva + interval '1 hour' > ?", [$inicio])
                ->pluck('mesa_id');

            $query->whereNotIn('id', $reservadasIds);
        } else {
            // Sem horário: comportamento legado — só mesas com status livre
            $query->where('status', 'livre');
        }

        return response()->json($query->get());
    }

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

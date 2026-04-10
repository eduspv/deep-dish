<?php

namespace App\Http\Controllers;

use App\Models\ClienteMesa;
use App\Models\Mesa;
use App\Models\Restaurante;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

class ReservaController extends Controller
{
    /**
     * Duração padrão de uma reserva (em minutos).
     * Por enquanto fixa em 1 hora — futura feature: configurável por restaurante.
     */
    private const DURACAO_RESERVA_MINUTOS = 60;

    /** Status considerados "ativos" (bloqueia mesa no horário). */
    private const STATUS_ATIVOS = ['confirmada', 'em_andamento'];

    // ─── Cliente: cria nova reserva ─────────────────────────
    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'restaurante_id'  => 'required|string|uuid|exists:restaurante,id',
            'horario_reserva' => 'required|date|after:now',
            'party_size'      => 'required|integer|min:1|max:20',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'error'   => 'Dados de entrada inválidos',
                'details' => $validator->errors(),
            ], 422);
        }

        $clienteId      = auth('api')->id();
        $restauranteId  = $request->input('restaurante_id');
        $horarioReserva = Carbon::parse($request->input('horario_reserva'));
        $partySize      = (int) $request->input('party_size');
        $fimReserva     = $horarioReserva->copy()->addMinutes(self::DURACAO_RESERVA_MINUTOS);

        $restaurante = Restaurante::find($restauranteId);

        if (! $restaurante->reservations_enabled) {
            return response()->json(['error' => 'Este restaurante não aceita reservas.'], 422);
        }

        try {
            return DB::transaction(function () use ($clienteId, $restauranteId, $horarioReserva, $fimReserva, $partySize) {
                // Cliente já tem reserva ativa nesse restaurante e horário?
                $duplicada = ClienteMesa::where('cliente_id', $clienteId)
                    ->whereHas('mesa', fn ($q) => $q->where('restaurante_id', $restauranteId))
                    ->where('horario_reserva', $horarioReserva)
                    ->whereIn('status', self::STATUS_ATIVOS)
                    ->exists();

                if ($duplicada) {
                    return response()->json([
                        'error' => 'Você já possui uma reserva neste restaurante neste horário.',
                    ], 422);
                }

                // Mesas com capacidade suficiente, NÃO bloqueadas, ordenadas pela menor
                $mesasCandidatas = Mesa::where('restaurante_id', $restauranteId)
                    ->where('capacidade', '>=', $partySize)
                    ->where('status', '!=', 'bloqueada')
                    ->orderBy('capacidade', 'asc')
                    ->lockForUpdate()
                    ->get();

                if ($mesasCandidatas->isEmpty()) {
                    return response()->json([
                        'error' => "Não há mesas com capacidade para {$partySize} pessoas neste restaurante.",
                    ], 422);
                }

                // Encontra a primeira mesa sem reserva ativa sobreposta
                $mesaEscolhida = null;
                foreach ($mesasCandidatas as $mesa) {
                    $ocupada = ClienteMesa::where('mesa_id', $mesa->id)
                        ->whereIn('status', self::STATUS_ATIVOS)
                        ->where('horario_reserva', '<', $fimReserva)
                        ->whereRaw("datetime(horario_reserva, '+' || ? || ' minutes') > ?", [self::DURACAO_RESERVA_MINUTOS, $horarioReserva])
                        ->exists();

                    if (! $ocupada) {
                        $mesaEscolhida = $mesa;
                        break;
                    }
                }

                if (! $mesaEscolhida) {
                    return response()->json([
                        'error' => 'Não há mesas disponíveis com capacidade suficiente neste horário.',
                    ], 422);
                }

                // Cria a reserva
                $reserva = ClienteMesa::create([
                    'cliente_id'      => $clienteId,
                    'mesa_id'         => $mesaEscolhida->id,
                    'horario_reserva' => $horarioReserva,
                    'status'          => 'confirmada',
                ]);

                // Marca a mesa como reservada
                $mesaEscolhida->update(['status' => 'reservada']);

                $reserva->load(['mesa.restaurante']);

                return response()->json([
                    'message' => 'Reserva criada com sucesso! Confirme sua chegada com o restaurante para liberar sua mesa.',
                    'reserva' => $reserva,
                ], 201);
            });
        } catch (\Throwable $e) {
            Log::error('Erro ao criar reserva', ['message' => $e->getMessage()]);
            return response()->json(['error' => 'Erro interno ao criar reserva'], 500);
        }
    }

    // ─── Cliente: lista suas reservas ───────────────────────
    public function index(): JsonResponse
    {
        $clienteId = auth('api')->id();

        $reservas = ClienteMesa::with(['mesa.restaurante'])
            ->where('cliente_id', $clienteId)
            ->orderBy('horario_reserva', 'desc')
            ->get();

        return response()->json($reservas);
    }

    // ─── Cliente: detalhe de uma reserva ────────────────────
    public function show(string $id): JsonResponse
    {
        $clienteId = auth('api')->id();

        $reserva = ClienteMesa::with(['mesa.restaurante'])
            ->where('id', $id)
            ->where('cliente_id', $clienteId)
            ->first();

        if (! $reserva) {
            return response()->json(['error' => 'Reserva não encontrada.'], 404);
        }

        return response()->json($reserva);
    }

    // ─── Cliente: cancela reserva ───────────────────────────
    public function destroy(string $id): JsonResponse
    {
        $clienteId = auth('api')->id();

        $reserva = ClienteMesa::where('id', $id)
            ->where('cliente_id', $clienteId)
            ->first();

        if (! $reserva) {
            return response()->json(['error' => 'Reserva não encontrada.'], 404);
        }

        if (! in_array($reserva->status, self::STATUS_ATIVOS)) {
            return response()->json(['error' => 'Esta reserva já foi finalizada.'], 422);
        }

        $reserva->update(['status' => 'cancelada']);

        // Libera a mesa de volta
        $mesa = Mesa::find($reserva->mesa_id);
        if ($mesa && in_array($mesa->status, ['reservada', 'ocupada'])) {
            $mesa->update(['status' => 'livre']);
        }

        return response()->json([
            'message' => 'Reserva cancelada.',
            'reserva' => $reserva->fresh(['mesa.restaurante']),
        ]);
    }

    // ─── Restaurante: lista reservas das suas mesas ─────────
    public function indexRestaurante(): JsonResponse
    {
        $restauranteId = auth('restaurante')->id();

        $reservas = ClienteMesa::with(['mesa', 'cliente'])
            ->whereHas('mesa', fn ($q) => $q->where('restaurante_id', $restauranteId))
            ->orderBy('horario_reserva', 'desc')
            ->get();

        return response()->json($reservas);
    }

    // ─── Restaurante: faz check-in do cliente ───────────────
    public function checkin(string $id): JsonResponse
    {
        $restauranteId = auth('restaurante')->id();

        $reserva = ClienteMesa::with('mesa')
            ->where('id', $id)
            ->whereHas('mesa', fn ($q) => $q->where('restaurante_id', $restauranteId))
            ->first();

        if (! $reserva) {
            return response()->json(['error' => 'Reserva não encontrada.'], 404);
        }

        if ($reserva->status !== 'confirmada') {
            return response()->json(['error' => 'Só é possível fazer check-in de reservas confirmadas.'], 422);
        }

        $reserva->update([
            'status'          => 'em_andamento',
            'horario_checkin'  => now(),
        ]);

        // Mesa passa de reservada para ocupada
        $mesa = $reserva->mesa;
        if ($mesa) {
            $mesa->update(['status' => 'ocupada']);
        }

        return response()->json([
            'message' => 'Check-in realizado! Mesa liberada para o cliente.',
            'reserva' => $reserva->fresh(['mesa', 'cliente']),
        ]);
    }

    // ─── Restaurante: marca mesa como liberada ──────────────
    public function liberar(string $id): JsonResponse
    {
        $restauranteId = auth('restaurante')->id();

        $reserva = ClienteMesa::with('mesa')
            ->where('id', $id)
            ->whereHas('mesa', fn ($q) => $q->where('restaurante_id', $restauranteId))
            ->first();

        if (! $reserva) {
            return response()->json(['error' => 'Reserva não encontrada.'], 404);
        }

        if (! in_array($reserva->status, self::STATUS_ATIVOS)) {
            return response()->json(['error' => 'Esta reserva já foi finalizada.'], 422);
        }

        $reserva->update(['status' => 'liberada']);

        // Mesa volta a ficar livre
        $mesa = $reserva->mesa;
        if ($mesa) {
            $mesa->update(['status' => 'livre']);
        }

        return response()->json([
            'message' => 'Mesa liberada.',
            'reserva' => $reserva->fresh(['mesa', 'cliente']),
        ]);
    }
}

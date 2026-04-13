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

    /**
     * Tolerância para no-show: após esse tempo sem check-in,
     * a reserva expira automaticamente e a mesa é liberada.
     */
    private const TOLERANCIA_NO_SHOW_MINUTOS = 60;

    /** Status considerados "ativos" (bloqueia mesa no horário). */
    private const STATUS_ATIVOS = ['confirmada', 'em_andamento'];

    /**
     * Expira reservas com status 'confirmada' cujo horário + tolerância já passou.
     * Libera a mesa associada. Retorna a quantidade de reservas expiradas.
     */
    public static function expirarReservasVencidas(): int
    {
        $limite = Carbon::now()->subMinutes(self::TOLERANCIA_NO_SHOW_MINUTOS);

        $vencidas = ClienteMesa::where('status', 'confirmada')
            ->where('horario_reserva', '<', $limite)
            ->get();

        if ($vencidas->isEmpty()) {
            return 0;
        }

        DB::transaction(function () use ($vencidas) {
            /** @var ClienteMesa $reserva */
            foreach ($vencidas as $reserva) {
                $reserva->update(['status' => 'expirada']);
                $mesa = Mesa::find($reserva->mesa_id);
                if ($mesa && $mesa->status === 'reservada') {
                    $mesa->update(['status' => 'livre']);
                }
            }
        });

        return $vencidas->count();
    }

    // ─── Cliente: cria nova reserva (escolha direta da mesa) ─
    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'mesa_id'    => 'required|string|uuid|exists:mesa,id',
            'party_size' => 'required|integer|min:1|max:20',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'error'   => 'Dados de entrada inválidos',
                'details' => $validator->errors(),
            ], 422);
        }

        $clienteId = auth('api')->id();
        $mesaId    = $request->input('mesa_id');
        $partySize = (int) $request->input('party_size');

        try {
            return DB::transaction(function () use ($clienteId, $mesaId, $partySize) {
                $mesa = Mesa::lockForUpdate()->find($mesaId);

                if (! $mesa) {
                    return response()->json(['error' => 'Mesa não encontrada.'], 404);
                }

                $restaurante = Restaurante::find($mesa->restaurante_id);
                if (! $restaurante->reservations_enabled) {
                    return response()->json(['error' => 'Este restaurante não aceita reservas.'], 422);
                }

                if ($mesa->status !== 'livre') {
                    return response()->json(['error' => 'Esta mesa não está disponível no momento.'], 422);
                }

                if ($mesa->capacidade < $partySize) {
                    return response()->json([
                        'error' => "Esta mesa comporta apenas {$mesa->capacidade} pessoas.",
                    ], 422);
                }

                // Cliente já tem reserva ativa nesse restaurante?
                $duplicada = ClienteMesa::where('cliente_id', $clienteId)
                    ->whereHas('mesa', fn ($q) => $q->where('restaurante_id', $mesa->restaurante_id))
                    ->whereIn('status', self::STATUS_ATIVOS)
                    ->exists();

                if ($duplicada) {
                    return response()->json([
                        'error' => 'Você já possui uma reserva ativa neste restaurante.',
                    ], 422);
                }

                // Cria a reserva
                $reserva = ClienteMesa::create([
                    'cliente_id'      => $clienteId,
                    'mesa_id'         => $mesa->id,
                    'horario_reserva' => now(),
                    'status'          => 'confirmada',
                ]);

                // Marca a mesa como reservada
                $mesa->update(['status' => 'reservada']);

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
        self::expirarReservasVencidas();

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
        self::expirarReservasVencidas();

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

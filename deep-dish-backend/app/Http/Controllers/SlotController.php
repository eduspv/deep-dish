<?php

namespace App\Http\Controllers;

use App\Models\ClienteMesa;
use App\Models\Mesa;
use App\Models\Restaurante;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SlotController extends Controller
{
    /**
     * Duração padrão de uma reserva (em minutos). Mantida em sincronia
     * com ReservaController::DURACAO_RESERVA_MINUTOS.
     */
    private const DURACAO_RESERVA_MINUTOS = 60;

    /**
     * Retorna os horários disponíveis para reserva em um restaurante em uma data.
     *
     * GET /restaurantes/{id}/slots?data=2026-04-08
     */
    public function index(Request $request, string $id): JsonResponse
    {
        $restaurante = Restaurante::find($id);

        if (! $restaurante) {
            return response()->json(['message' => 'Restaurante não encontrado.'], 404);
        }

        if (! $restaurante->reservations_enabled) {
            return response()->json(['message' => 'Este restaurante não aceita reservas.'], 422);
        }

        if (! $restaurante->horario_abertura || ! $restaurante->horario_fechamento || ! $restaurante->intervalo_reserva) {
            return response()->json(['message' => 'Restaurante sem horários ou intervalo configurados.'], 422);
        }

        $data = $request->query('data', now()->toDateString());

        $totalMesas = Mesa::where('restaurante_id', $id)
            ->where('status', '!=', 'bloqueada')
            ->count();

        if ($totalMesas === 0) {
            return response()->json(['message' => 'Restaurante sem mesas cadastradas.'], 422);
        }

        $abertura = Carbon::parse("{$data} {$restaurante->horario_abertura}");
        $fechamento = Carbon::parse("{$data} {$restaurante->horario_fechamento}");
        $intervalo = (int) $restaurante->intervalo_reserva;

        $slots = [];
        $agora = now();

        for ($hora = $abertura->copy(); $hora->lt($fechamento); $hora->addMinutes($intervalo)) {
            // Não mostrar slots no passado
            if ($hora->lt($agora)) {
                continue;
            }

            $inicioSlot = $hora->copy();
            $fimSlot = $hora->copy()->addMinutes(self::DURACAO_RESERVA_MINUTOS);

            // Conta mesas com reserva ativa que se sobrepõem à janela [inicio, inicio + 1h)
            // Sobreposição: reserva.inicio < slot.fim  AND  reserva.inicio + 1h > slot.inicio
            $reservadas = ClienteMesa::whereHas('mesa', fn ($q) => $q->where('restaurante_id', $id))
                ->whereIn('status', ['confirmada', 'em_andamento'])
                ->where('horario_reserva', '<', $fimSlot)
                ->whereRaw("datetime(horario_reserva, '+' || ? || ' minutes') > ?", [self::DURACAO_RESERVA_MINUTOS, $inicioSlot])
                ->count();

            $disponivel = $totalMesas - $reservadas;

            $slots[] = [
                'horario'    => $hora->format('H:i'),
                'disponivel' => $disponivel > 0,
                'vagas'      => max(0, $disponivel),
            ];
        }

        return response()->json([
            'restaurante_id' => $id,
            'data'           => $data,
            'total_mesas'    => $totalMesas,
            'slots'          => $slots,
        ]);
    }
}

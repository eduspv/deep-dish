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
     * Retorna os horários disponíveis para reserva em um restaurante em uma data.
     *
     * GET /restaurante/{id}/slots?data=2026-04-08
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

        $totalMesas = Mesa::where('restaurante_id', $id)->count();

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
            $fimSlot = $hora->copy()->addMinutes($intervalo);

            // Conta quantas mesas estão reservadas neste slot
            $reservadas = ClienteMesa::whereHas('mesa', fn ($q) => $q->where('restaurante_id', $id))
                ->where('horario_reserva', '>=', $inicioSlot)
                ->where('horario_reserva', '<', $fimSlot)
                ->whereNotIn('status', ['cancelada', 'concluida'])
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

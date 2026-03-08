<?php

namespace App\Http\Controllers;

use App\Models\Restaurante;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class HorariosController extends Controller
{
    /**
     * Exibe os horários configurados pelo restaurante para reservas e entrada na fila.
     * Dados obtidos das tabelas clientemesa e clientefila.
     */
    public function show(Request $request, int|string|null $restaurante = null): JsonResponse
    {
        $id = $restaurante ?? $request->query('restaurante_id');
        if ($id !== null) {
            $id = (int) $id;
        }

        if (! $id) {
            return response()->json([
                'message' => 'O parâmetro restaurante_id é obrigatório.',
            ], 422);
        }

        $restaurante = Restaurante::find($id);

        if (! $restaurante) {
            return response()->json([
                'message' => 'Restaurante não encontrado.',
            ], 404);
        }

        $restaurante->load([
            'mesas.clienteMesas',
            'filas.clienteFilas',
        ]);

        $horariosReservas = [];
        foreach ($restaurante->mesas as $mesa) {
            foreach ($mesa->clienteMesas as $clienteMesa) {
                $horariosReservas[] = [
                    'horario_reserva' => $clienteMesa->horario_reserva?->toIso8601String(),
                    'status' => $clienteMesa->status,
                    'mesa_id' => $mesa->id,
                ];
            }
        }

        $horariosFila = [];
        foreach ($restaurante->filas as $fila) {
            foreach ($fila->clienteFilas as $clienteFila) {
                $horariosFila[] = [
                    'horario_entrada' => $clienteFila->created_at->toIso8601String(),
                    'qntd_pessoas' => $clienteFila->qntd_pessoas,
                    'fila_id' => $fila->id,
                ];
            }
        }

        return response()->json([
            'restaurante_id' => $restaurante->id,
            'nome' => $restaurante->name,
            'horario_funcionamento' => $restaurante->horario_funcionamento,
            'fila_ativa' => (bool) $restaurante->fila_ativa,
            'reservas' => $horariosReservas,
            'fila' => $horariosFila,
        ]);
    }
}

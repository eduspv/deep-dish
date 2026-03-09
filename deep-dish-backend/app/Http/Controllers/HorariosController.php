<?php

namespace App\Http\Controllers;

use App\Models\Restaurante;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Throwable;

class HorariosController extends Controller
{
    /**
     * Exibe os horários configurados pelo restaurante para reservas e entrada na fila.
     * Dados obtidos das tabelas clientemesa e clientefila.
     */
    public function show(Request $request, int|string|null $restaurante = null): JsonResponse
    {
        try {
            $id = $restaurante ?? $request->query('restaurante_id');
            if ($id !== null) {
                $id = (int) $id;
            }

            if (! $id) {
                return response()->json([
                    'message' => 'O parâmetro restaurante_id é obrigatório.',
                ], 422);
            }

            $tipo = $request->query('tipo');
            if ($tipo !== null && ! in_array($tipo, ['reservas', 'fila'], true)) {
                return response()->json([
                    'message' => 'O parâmetro tipo deve ser "reservas" ou "fila".',
                ], 422);
            }

            $restaurante = Restaurante::find($id);

            if (! $restaurante) {
                return response()->json([
                    'message' => 'Restaurante não encontrado.',
                ], 404);
            }

            $relations = [];
            if ($tipo === null || $tipo === 'reservas') {
                $relations[] = 'mesas.clienteMesas';
            }
            if ($tipo === null || $tipo === 'fila') {
                $relations[] = 'filas.clienteFilas';
            }

            if ($relations !== []) {
                $restaurante->load($relations);
            }

            $horariosReservas = [];
            if ($tipo === null || $tipo === 'reservas') {
                foreach ($restaurante->mesas as $mesa) {
                    foreach ($mesa->clienteMesas as $clienteMesa) {
                        $horariosReservas[] = [
                            'horario_reserva' => $clienteMesa->horario_reserva?->format(\DateTimeInterface::ATOM),
                            'status' => $clienteMesa->status,
                            'mesa_id' => $mesa->id,
                        ];
                    }
                }
            }

            $horariosFila = [];
            if ($tipo === null || $tipo === 'fila') {
                foreach ($restaurante->filas as $fila) {
                    foreach ($fila->clienteFilas as $clienteFila) {
                        $horariosFila[] = [
                            'horario_entrada' => $clienteFila->created_at->format(\DateTimeInterface::ATOM),
                            'qntd_pessoas' => $clienteFila->qntd_pessoas,
                            'fila_id' => $fila->id,
                        ];
                    }
                }
            }

            $data = [
                'restaurante_id' => $restaurante->id,
                'nome' => $restaurante->name,
                'horario_funcionamento' => $restaurante->horario_funcionamento,
                'fila_ativa' => (bool) $restaurante->fila_ativa,
            ];

            if ($tipo === null || $tipo === 'reservas') {
                $data['reservas'] = $horariosReservas;
            }

            if ($tipo === null || $tipo === 'fila') {
                $data['fila'] = $horariosFila;
            }

            return response()->json($data);
        } catch (Throwable $e) {
            report($e);

            return response()->json([
                'message' => 'Erro ao carregar horários.',
                'error' => config('app.debug') ? $e->getMessage() : null,
            ], 500);
        }
    }
}

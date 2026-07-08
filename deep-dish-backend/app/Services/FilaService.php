<?php

namespace App\Services;

use App\Models\ClienteFila;
use App\Models\ClienteMesa;
use App\Models\Fila;
use App\Models\Mesa;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use InvalidArgumentException;

class FilaService
{
    public function enfileirar(string $clienteId, string $restauranteId, string $horarioReserva, int $qntdPessoas): ClienteFila
    {
        return DB::transaction(function () use ($clienteId, $restauranteId, $horarioReserva, $qntdPessoas) {
            // Impede entrada dupla na fila do mesmo restaurante
            $jaEmFila = ClienteFila::where('cliente_id', $clienteId)
                ->whereHas('fila', fn ($q) => $q
                    ->where('restaurante_id', $restauranteId)
                    ->where('status', Fila::STATUS_ABERTA)
                )
                ->exists();

            if ($jaEmFila) {
                throw new \InvalidArgumentException('Você já está na fila deste restaurante.');
            }

            $horario = Carbon::parse($horarioReserva);

            $fila = Fila::query()
                ->where('restaurante_id', $restauranteId)
                ->where('horario_reserva', $horario)
                ->where('status', Fila::STATUS_ABERTA)
                ->first();

            if (! $fila) {
                $fila = Fila::create([
                    'restaurante_id' => $restauranteId,
                    'horario_reserva' => $horario,
                    'status' => Fila::STATUS_ABERTA,
                ]);
            }

            return ClienteFila::create([
                'fila_id' => $fila->id,
                'cliente_id' => $clienteId,
                'qntd_pessoas' => $qntdPessoas,
            ]);
        });
    }

    public function cancelarPosicao(string $clienteFilaId, string $clienteId): bool
    {
        return DB::transaction(function () use ($clienteFilaId, $clienteId) {
            $registro = ClienteFila::query()
                ->whereKey($clienteFilaId)
                ->where('cliente_id', $clienteId)
                ->first();

            if (! $registro) {
                throw new InvalidArgumentException('Posição não encontrada ou já processada.');
            }

            $fila = $registro->fila;

            $registro->delete();

            $this->encerrarFilaSeVazia($fila);

            return true;
        });
    }

    public function consultarPosicao(string $clienteId, string $restauranteId, string $horarioReserva): ?ClienteFila
    {
        $horario = Carbon::parse($horarioReserva);

        $fila = Fila::query()
            ->where('restaurante_id', $restauranteId)
            ->where('horario_reserva', $horario)
            ->where('status', Fila::STATUS_ABERTA)
            ->first();

        if (! $fila) {
            return null;
        }

        return ClienteFila::query()
            ->where('fila_id', $fila->id)
            ->where('cliente_id', $clienteId)
            ->first();
    }

    /**
     * Promove o próximo da fila para uma mesa que acabou de ser liberada.
     * Busca a entrada mais antiga entre todas as filas abertas do restaurante.
     */
    public function promoverProximoParaMesa(string $restauranteId, Mesa $mesa): ?ClienteMesa
    {
        return DB::transaction(function () use ($restauranteId, $mesa) {
            $proximo = ClienteFila::whereHas('fila', fn ($q) => $q
                    ->where('restaurante_id', $restauranteId)
                    ->where('status', Fila::STATUS_ABERTA)
                )
                ->orderBy('created_at')
                ->orderBy('id')
                ->lockForUpdate()
                ->first();

            if (! $proximo || $mesa->capacidade < $proximo->qntd_pessoas) {
                return null;
            }

            $clienteMesa = ClienteMesa::create([
                'cliente_id'      => $proximo->cliente_id,
                'mesa_id'         => $mesa->id,
                'horario_reserva' => now()->utc(),
                'party_size'      => $proximo->qntd_pessoas,
                'status'          => 'confirmada',
            ]);

            $fila = $proximo->fila;
            $proximo->delete();
            $this->encerrarFilaSeVazia($fila);

            return $clienteMesa;
        });
    }

    private function encerrarFilaSeVazia(Fila $fila): void
    {
        $temNaFila = ClienteFila::query()
            ->where('fila_id', $fila->id)
            ->exists();

        if (! $temNaFila) {
            $fila->update(['status' => Fila::STATUS_ENCERRADA]);
        }
    }
}

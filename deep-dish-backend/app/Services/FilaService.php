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

    public function promoverProximo(string $restauranteId, string $horarioReserva): ?ClienteMesa
    {
        return DB::transaction(function () use ($restauranteId, $horarioReserva) {
            $horario = Carbon::parse($horarioReserva);

            $fila = Fila::query()
                ->where('restaurante_id', $restauranteId)
                ->where('horario_reserva', $horario)
                ->where('status', Fila::STATUS_ABERTA)
                ->first();

            if (! $fila) {
                return null;
            }

            $proximo = ClienteFila::query()
                ->where('fila_id', $fila->id)
                ->orderBy('created_at')
                ->orderBy('id')
                ->first();

            if (! $proximo) {
                return null;
            }

            $mesa = $this->buscarMesaDisponivel($restauranteId, $horario, $proximo->qntd_pessoas);

            if (! $mesa) {
                return null;
            }

            $clienteMesa = ClienteMesa::create([
                'cliente_id' => $proximo->cliente_id,
                'mesa_id' => $mesa->id,
                'horario_reserva' => $horario,
                'status' => 'pendente',
            ]);

            $proximo->delete();

            $this->encerrarFilaSeVazia($fila);

            return $clienteMesa;
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

    private function buscarMesaDisponivel(string $restauranteId, Carbon $horarioReserva, int $qntdPessoas): ?Mesa
    {
        return Mesa::query()
            ->where('restaurante_id', $restauranteId)
            ->where('capacidade', '>=', $qntdPessoas)
            ->where(function ($q) {
                $q->where('status', 'disponivel')
                    ->orWhere('status', 'disponível');
            })
            ->whereDoesntHave('clienteMesas', function ($q) use ($horarioReserva) {
                $q->where('horario_reserva', $horarioReserva)
                    ->whereIn('status', ['pendente', 'ativo']);
            })
            ->orderBy('id')
            ->first();
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

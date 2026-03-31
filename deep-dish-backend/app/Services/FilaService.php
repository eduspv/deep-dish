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
    public function enfileirar(int $clienteId, int $restauranteId, string $horarioReserva, int $qntdPessoas): ClienteFila
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

            $maxPosicao = (int) ClienteFila::query()
                ->where('id_fila', $fila->id)
                ->where('status', ClienteFila::STATUS_AGUARDANDO)
                ->max('posicao');

            $proximaPosicao = $maxPosicao > 0 ? $maxPosicao + 1 : 1;

            return ClienteFila::create([
                'id_fila' => $fila->id,
                'id_cliente' => $clienteId,
                'qntd_pessoas' => $qntdPessoas,
                'posicao' => $proximaPosicao,
                'status' => ClienteFila::STATUS_AGUARDANDO,
            ]);
        });
    }

    public function promoverProximo(int $restauranteId, string $horarioReserva): ?ClienteMesa
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
                ->where('id_fila', $fila->id)
                ->where('status', ClienteFila::STATUS_AGUARDANDO)
                ->orderBy('posicao')
                ->first();

            if (! $proximo) {
                return null;
            }

            $mesa = $this->buscarMesaDisponivel($restauranteId, $horario, $proximo->qntd_pessoas);

            if (! $mesa) {
                return null;
            }

            $clienteMesa = ClienteMesa::create([
                'cliente_id' => $proximo->id_cliente,
                'mesa_id' => $mesa->id,
                'horario_reserva' => $horario,
                'status' => 'pendente',
            ]);

            $posicaoPromovido = $proximo->posicao;

            $proximo->update(['status' => ClienteFila::STATUS_PROMOVIDO]);

            ClienteFila::query()
                ->where('id_fila', $fila->id)
                ->where('status', ClienteFila::STATUS_AGUARDANDO)
                ->where('posicao', '>', $posicaoPromovido)
                ->decrement('posicao');

            $this->encerrarFilaSeVazia($fila);

            return $clienteMesa;
        });
    }

    public function cancelarPosicao(int $clienteFilaId, int $clienteId): bool
    {
        return DB::transaction(function () use ($clienteFilaId, $clienteId) {
            $registro = ClienteFila::query()
                ->whereKey($clienteFilaId)
                ->where('id_cliente', $clienteId)
                ->first();

            if (! $registro || $registro->status !== ClienteFila::STATUS_AGUARDANDO) {
                throw new InvalidArgumentException('Posição não encontrada ou já processada.');
            }

            $fila = $registro->fila;
            $posicaoCancelada = $registro->posicao;

            $registro->update(['status' => ClienteFila::STATUS_CANCELADO]);

            ClienteFila::query()
                ->where('id_fila', $fila->id)
                ->where('status', ClienteFila::STATUS_AGUARDANDO)
                ->where('posicao', '>', $posicaoCancelada)
                ->decrement('posicao');

            $this->encerrarFilaSeVazia($fila);

            return true;
        });
    }

    public function consultarPosicao(int $clienteId, int $restauranteId, string $horarioReserva): ?ClienteFila
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
            ->where('id_fila', $fila->id)
            ->where('id_cliente', $clienteId)
            ->where('status', ClienteFila::STATUS_AGUARDANDO)
            ->first();
    }

    private function buscarMesaDisponivel(int $restauranteId, Carbon $horarioReserva, int $qntdPessoas): ?Mesa
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
        $aguardando = ClienteFila::query()
            ->where('id_fila', $fila->id)
            ->where('status', ClienteFila::STATUS_AGUARDANDO)
            ->exists();

        if (! $aguardando) {
            $fila->update(['status' => Fila::STATUS_ENCERRADA]);
        }
    }
}

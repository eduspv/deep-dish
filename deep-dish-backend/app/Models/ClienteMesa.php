<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class ClienteMesa extends Model
{
    use HasUuids;
    use SoftDeletes;

    protected $table = 'clientemesa';

    protected $fillable = [
        'cliente_id',
        'mesa_id',
        'horario_reserva',
        'horario_checkin',
        'party_size',
        'status',
    ];

    // 'horario_saida' e 'duracao_segundos' ficam fora do $fillable de propósito:
    // a duração é derivada dos timestamps, então só registrarSaida() pode escrevê-la.

    protected function casts(): array
    {
        return [
            'horario_reserva' => 'datetime',
            'horario_checkin' => 'datetime',
            'horario_saida' => 'datetime',
            'duracao_segundos' => 'integer',
            'created_at' => 'datetime',
            'updated_at' => 'datetime',
        ];
    }

    /**
     * Única porta de saída da mesa. Idempotente.
     *
     * A duração só existe para quem fez check-in: sem 'horario_checkin' o cliente
     * nunca sentou (no-show, ou cancelamento antes de chegar) e o campo fica NULL,
     * não 0 — para não rebaixar a média de permanência do Analytics.
     */
    public function registrarSaida(): void
    {
        if ($this->horario_saida !== null) {
            return;
        }

        $agora = now();

        $this->forceFill([
            'horario_saida' => $agora,
            'duracao_segundos' => $this->horario_checkin
                ? (int) abs($this->horario_checkin->diffInSeconds($agora))
                : null,
        ])->save();
    }

    public function cliente(): BelongsTo
    {
        return $this->belongsTo(Cliente::class, 'cliente_id');
    }

    public function mesa(): BelongsTo
    {
        return $this->belongsTo(Mesa::class, 'mesa_id');
    }
}

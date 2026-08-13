<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class ClienteFila extends Model
{
    use SoftDeletes;
    use HasUuids;

    public const STATUS_SAIDA_DESISTIU = 'desistiu';
    public const STATUS_SAIDA_ATENDIDO = 'atendido';

    public function scopeAtivas($query)
    {
        return $query->whereNull('status_saida');
    }

    public $incrementing = false;

    protected $keyType = 'string';

    protected $table = 'clientefila';

    protected $fillable = [
        'fila_id',
        'cliente_id',
        'qntd_pessoas',
    ];

    protected $appends = [
        'posicao',
    ];

    protected function casts(): array
    {
        return [
            'created_at' => 'datetime',
            'updated_at' => 'datetime',
            'saiu_em' => 'datetime',
            'tempo_espera_segundos' => 'integer',
        ];
    }

    /**
     * Posição atual do cliente na fila.
     * Considera apenas clientes que ainda estão ativos.
     */
    public function getPosicaoAttribute(): int
    {
        return 1 + (int) static::query()
            ->ativas()
            ->where('fila_id', $this->fila_id)
            ->where(function ($q) {
                $q->where('created_at', '<', $this->created_at)
                    ->orWhere(function ($q2) {
                        $q2->where('created_at', '=', $this->created_at)
                            ->where('id', '<', $this->id);
                    });
            })
            ->count();
    }

    public function fila(): BelongsTo
    {
        return $this->belongsTo(Fila::class, 'fila_id');
    }

    public function cliente(): BelongsTo
    {
        return $this->belongsTo(Cliente::class, 'cliente_id');
    }
}
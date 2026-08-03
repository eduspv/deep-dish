<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ClienteFila extends Model
{
    use HasUuids;

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
        ];
    }

    /**
     * Posição na fila: ordem por created_at (desempate por id). Só existe registro enquanto o cliente está na fila.
     */
    public function getPosicaoAttribute(): int
    {
        return 1 + (int) static::query()
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

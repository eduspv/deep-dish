<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ClienteFila extends Model
{
    /** Status: waiting, called, seated, cancelled */
    public const STATUS_WAITING = 'waiting';
    public const STATUS_CALLED = 'called';
    public const STATUS_SEATED = 'seated';
    public const STATUS_CANCELLED = 'cancelled';

    protected $table = 'clientefila';

    protected $fillable = [
        'fila_id',
        'cliente_id',
        'clientemesa_id',
        'qntd_pessoas',
        'position',
        'status',
        'estimated_time',
    ];

    protected function casts(): array
    {
        return [
            'created_at' => 'datetime',
            'updated_at' => 'datetime',
        ];
    }

    public function fila(): BelongsTo
    {
        return $this->belongsTo(Fila::class, 'fila_id');
    }

    public function cliente(): BelongsTo
    {
        return $this->belongsTo(Cliente::class, 'cliente_id');
    }

    public function clienteMesa(): BelongsTo
    {
        return $this->belongsTo(ClienteMesa::class, 'clientemesa_id');
    }

    public function scopeWaiting(Builder $query): Builder
    {
        return $query->where('status', self::STATUS_WAITING);
    }

    public function scopeCancelled(Builder $query): Builder
    {
        return $query->where('status', self::STATUS_CANCELLED);
    }
}

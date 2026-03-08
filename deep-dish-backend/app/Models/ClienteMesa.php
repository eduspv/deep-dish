<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ClienteMesa extends Model
{
    protected $table = 'clientemesa';

    protected $fillable = [
        'cliente_id',
        'mesa_id',
        'horario_reserva',
        'status',
    ];

    protected function casts(): array
    {
        return [
            'horario_reserva' => 'datetime',
            'created_at' => 'datetime',
            'updated_at' => 'datetime',
        ];
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

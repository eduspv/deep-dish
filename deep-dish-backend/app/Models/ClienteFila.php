<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ClienteFila extends Model
{
    protected $table = 'clientefila';

    protected $fillable = [
        'fila_id',
        'cliente_id',
        'qntd_pessoas',
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
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ClienteFila extends Model
{
    public const STATUS_AGUARDANDO = 'aguardando';

    public const STATUS_PROMOVIDO = 'promovido';

    public const STATUS_CANCELADO = 'cancelado';

    protected $table = 'cliente_fila';

    protected $fillable = [
        'id_fila',
        'id_cliente',
        'qntd_pessoas',
        'posicao',
        'status',
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
        return $this->belongsTo(Fila::class, 'id_fila');
    }

    public function cliente(): BelongsTo
    {
        return $this->belongsTo(Cliente::class, 'id_cliente');
    }
}

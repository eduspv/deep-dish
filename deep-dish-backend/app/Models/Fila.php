<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Fila extends Model
{
    public const STATUS_ABERTA = 'aberta';

    public const STATUS_ENCERRADA = 'encerrada';

    protected $table = 'fila';

    protected $fillable = [
        'restaurante_id',
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

    public function restaurante(): BelongsTo
    {
        return $this->belongsTo(Restaurante::class, 'restaurante_id');
    }

    public function clienteFilas(): HasMany
    {
        return $this->hasMany(ClienteFila::class, 'id_fila');
    }
}

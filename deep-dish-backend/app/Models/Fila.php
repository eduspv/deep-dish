<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Fila extends Model
{
    protected $table = 'fila';

    protected $fillable = [
        'restaurante_id',
        'status',
    ];

    protected function casts(): array
    {
        return [
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
        return $this->hasMany(ClienteFila::class, 'fila_id');
    }
}

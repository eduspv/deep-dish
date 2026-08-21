<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Mesa extends Model
{
    use HasFactory;
    use HasUuids;

    protected $table = 'mesa';

    protected $fillable = [
        'restaurante_id',
        'numero',
        'status',
        'capacidade',
        'confirmacao',
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

    public function clienteMesas(): HasMany
    {
        return $this->hasMany(ClienteMesa::class, 'mesa_id');
    }
}

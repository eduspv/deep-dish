<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Tymon\JWTAuth\Contracts\JWTSubject;

class Restaurante extends Authenticatable implements JWTSubject
{
    use HasFactory, HasUuids; // adicionado HasUuids

    protected $keyType = 'string';   
    public $incrementing = false;    

    protected $table = 'restaurante';

    protected $fillable = [
        'name',
        'email',
        'cnpj',
        'tipo',
        'logradouro',
        'numero',
        'complemento',
        'bairro',
        'cidade',
        'estado',
        'cep',
        'telefone',
        'imagem_url',
        'horario_abertura',
        'horario_fechamento',
        'fila_ativa',
        'rating',
        'price_range',
        'reservations_enabled',
        'tipo_usuario',
        'password',
        'token_version',
    ];

    protected $appends = ['endereco_completo', 'tamanho_fila_atual'];

    protected $hidden = [
        'password',
    ];

    protected function casts(): array
    {
        return [
            'password'      => 'hashed',
            'created_at'    => 'datetime',
            'updated_at'    => 'datetime',
            'token_version'       => 'integer',
            'rating'              => 'decimal:1',
            'price_range'         => 'integer',
            'reservations_enabled' => 'boolean',
        ];
    }

    public function getTamanhoFilaAtualAttribute(): int
    {
        return $this->filas()
            ->where('status', Fila::STATUS_ABERTA)
            ->withCount('clienteFilas')
            ->get()
            ->sum('cliente_filas_count');
    }

    public function getEnderecoCompletoAttribute(): string
    {
        $partes = array_filter([
            $this->logradouro,
            $this->numero,
            $this->complemento,
            $this->bairro,
            $this->cidade,
            $this->estado,
            $this->cep,
        ]);

        return implode(', ', $partes);
    }

    public function getJWTIdentifier()
    {
        return $this->getKey();
    }

    public function getJWTCustomClaims(): array
    {
        return [
            'token_version' => $this->token_version ?? 0,
        ];
    }

    public function mesas(): HasMany
    {
        return $this->hasMany(Mesa::class, 'restaurante_id');
    }

    public function filas(): HasMany
    {
        return $this->hasMany(Fila::class, 'restaurante_id');
    }
}
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Tymon\JWTAuth\Contracts\JWTSubject;

class Restaurante extends Authenticatable implements JWTSubject
{
    use HasFactory;

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
        'horario_funcionamento',
        'fila_ativa',
        'tipo_usuario',
        'password',
        'token_version',
    ];

    protected $appends = ['endereco_completo'];

    protected $hidden = [
        'password',
    ];

    protected function casts(): array
    {
        return [
            'password' => 'hashed',
            'created_at' => 'datetime',
            'updated_at' => 'datetime',
            'token_version' => 'integer',
        ];
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
}
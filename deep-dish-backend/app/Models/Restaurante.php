<?php 

namespace App\Models;


use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Foundation\Auth\Restaurante as Authenticatable;

class Restaurante extends Autenticable
{
 /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory;

    protected $fillable = [
        'name',
        'email',
        'cnpj',
        'tipo',
        'endereco',
        'tipo_usuario',
        'password',
    ];

     protected $hidden = [
        'password',
    ];  


      protected function casts(): array
    {
        return [
            'password' => 'hashed',
            'created_at' => 'datetime',
            'updated_at' => 'datetime',
        ];
    }   
}

<?php 

namespace App\Models;


use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Foundation\Auth\Restaurante as Authenticatable;

class Restaurante extends Autenticable
{
 /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory;
}

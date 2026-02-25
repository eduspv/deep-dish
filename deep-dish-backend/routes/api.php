<?php

use Illuminate\Support\Facades\Route;

Route::get('/health', function () {
    return response()->json([
        'ok' => true,
        'app' => 'Deep Dish API',
    ]);
});

//Definindo as rotas publicas.
Route::prefix('cliente')->group(function () {
    //adicione as rotas publicas com prefixo de cliente aqui:
});

Route::prefix('restaurante')->group(function(){
    //adicione as rotas publicas com prefixo de restaurante aqui:
    Route::post('/register', [App\Http\Controllers\RestauranteController::class, 'register']);
});

//Definindo Rotas Protegidas
Route::prefix('cliente')->middleware('auth:cliente')->group(function () {
    //adicione as rotas protegidas do Cliente Aqui
});

Route::prefix('cliente')->middleware('auth:cliente')->group(function () {
    //adicione as rotas protegidas do Restaurante Aqui
});

Route::prefix('cliente')->middleware('cliente.or.restaurante')->group(function(){
    //adicione as rotas protegidas que tanto o cliente quanto o restaurante podem acessar
});
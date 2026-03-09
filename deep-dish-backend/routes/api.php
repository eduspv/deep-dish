<?php

use Illuminate\Support\Facades\Route;

Route::get('/health', function () {
    return response()->json([
        'ok' => true,
        'app' => 'Deep Dish API',
    ]);
});

// Horários configurados pelo restaurante (reservas e fila) - rota pública
Route::get('/horarios', [App\Http\Controllers\HorariosController::class, 'show']);
Route::get('/restaurante/{restaurante}/horarios', [App\Http\Controllers\HorariosController::class, 'show']);

//Definindo as rotas publicas.
Route::prefix('cliente')->group(function () {
    Route::post('/register', [App\Http\Controllers\Auth\ClienteAuthController::class, 'register']);
    Route::post('/login', [App\Http\Controllers\Auth\ClienteAuthController::class, 'login']);
});

Route::prefix('restaurante')->group(function () {
    Route::post('/register', [App\Http\Controllers\Auth\RestauranteAuthController::class, 'register']);
    Route::post('/login', [App\Http\Controllers\Auth\RestauranteAuthController::class, 'login']);
    Route::get('/', [App\Http\Controllers\RestauranteController::class, 'index']);
});

//Definindo Rotas Protegidas
Route::prefix('cliente')->middleware(['auth:cliente', \App\Http\Middleware\VerifyJwtTokenVersion::class])->group(function () {
    Route::get('/me', [App\Http\Controllers\Auth\ClienteAuthController::class, 'me']);
    Route::post('/logout', [App\Http\Controllers\Auth\ClienteAuthController::class, 'logout']);
    Route::post('/refresh', [App\Http\Controllers\Auth\ClienteAuthController::class, 'refresh']);
});

Route::prefix('restaurante')->middleware(['auth:restaurante', \App\Http\Middleware\VerifyJwtTokenVersion::class])->group(function () {
    Route::get('/me', [App\Http\Controllers\Auth\RestauranteAuthController::class, 'me']);
    Route::post('/logout', [App\Http\Controllers\Auth\RestauranteAuthController::class, 'logout']);
    Route::post('/refresh', [App\Http\Controllers\Auth\RestauranteAuthController::class, 'refresh']);
});

Route::prefix('cliente')->middleware('cliente.or.restaurante')->group(function(){
    //adicione as rotas protegidas que tanto o cliente quanto o restaurante podem acessar
});
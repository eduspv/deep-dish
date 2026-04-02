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
    Route::post('/login',    [App\Http\Controllers\Auth\RestauranteAuthController::class, 'login']);
    Route::get('/',          [App\Http\Controllers\RestauranteController::class, 'index']);
    Route::get('/{id}',      [App\Http\Controllers\RestauranteController::class, 'show'])
         ->where('id', '[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}'); 
});

//Definindo Rotas Protegidas (JWT guard api — mesmo provider que cliente)
Route::prefix('cliente')->middleware(['auth:api', \App\Http\Middleware\VerifyJwtTokenVersion::class])->group(function () {
    Route::get('/me', [App\Http\Controllers\Auth\ClienteAuthController::class, 'me']);
    Route::post('/logout', [App\Http\Controllers\Auth\ClienteAuthController::class, 'logout']);
    Route::post('/refresh', [App\Http\Controllers\Auth\ClienteAuthController::class, 'refresh']);
});

// Fila de espera (reservas por horário)
Route::middleware(['auth:api', \App\Http\Middleware\VerifyJwtTokenVersion::class])->group(function () {
    Route::post('/fila', [App\Http\Controllers\FilaController::class, 'store']);
    Route::delete('/fila/{id}', [App\Http\Controllers\FilaController::class, 'destroy'])
        ->where('id', '[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}');
    Route::get('/fila/posicao', [App\Http\Controllers\FilaController::class, 'consultarPosicao']);
});

Route::prefix('restaurante')->middleware(['auth:restaurante', \App\Http\Middleware\VerifyJwtTokenVersion::class])->group(function () {
    Route::get('/me', [App\Http\Controllers\Auth\RestauranteAuthController::class, 'me']);
    Route::put('/me',         [App\Http\Controllers\Auth\RestauranteAuthController::class, 'update']);       
    Route::post('/me/imagem', [App\Http\Controllers\Auth\RestauranteAuthController::class, 'uploadImagem']);
    Route::post('/logout', [App\Http\Controllers\Auth\RestauranteAuthController::class, 'logout']);
    Route::post('/refresh', [App\Http\Controllers\Auth\RestauranteAuthController::class, 'refresh']);
});

Route::prefix('cliente')->middleware('cliente.or.restaurante')->group(function(){
    //adicione as rotas protegidas que tanto o cliente quanto o restaurante podem acessar
});
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
Route::get('/restaurantes/{restaurante}/horarios', [App\Http\Controllers\HorariosController::class, 'show']);

//Definindo as rotas publicas.
Route::prefix('cliente')->group(function () {
    Route::post('/register', [App\Http\Controllers\Auth\ClienteAuthController::class, 'register']);
    Route::post('/login', [App\Http\Controllers\Auth\ClienteAuthController::class, 'login']);
});

Route::prefix('restaurante')->group(function () {
    Route::post('/register', [App\Http\Controllers\Auth\RestauranteAuthController::class, 'register']);
    Route::post('/login',    [App\Http\Controllers\Auth\RestauranteAuthController::class, 'login']);
});

Route::prefix('restaurantes')->group(function () {
    Route::get('/',          [App\Http\Controllers\RestauranteController::class, 'index']);
    Route::get('/{id}',      [App\Http\Controllers\RestauranteController::class, 'show'])
         ->where('id', '[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}');
    Route::get('/{id}/mesas/disponiveis', [App\Http\Controllers\MesaController::class, 'disponiveis'])
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

// Reservas — cliente
Route::middleware(['auth:api', \App\Http\Middleware\VerifyJwtTokenVersion::class])->group(function () {
    Route::post('/reservas',                  [App\Http\Controllers\ReservaController::class, 'store']);
    Route::get('/reservas',                   [App\Http\Controllers\ReservaController::class, 'index']);
    Route::get('/reservas/{id}',              [App\Http\Controllers\ReservaController::class, 'show']);
    Route::delete('/reservas/{id}',           [App\Http\Controllers\ReservaController::class, 'destroy']);
});

Route::prefix('restaurante')->middleware(['auth:restaurante', \App\Http\Middleware\VerifyJwtTokenVersion::class])->group(function () {
    Route::get('/me', [App\Http\Controllers\Auth\RestauranteAuthController::class, 'me']);
    Route::put('/me',         [App\Http\Controllers\Auth\RestauranteAuthController::class, 'update']);
    Route::post('/me/imagem', [App\Http\Controllers\Auth\RestauranteAuthController::class, 'uploadImagem']);
    Route::post('/logout', [App\Http\Controllers\Auth\RestauranteAuthController::class, 'logout']);
    Route::post('/refresh', [App\Http\Controllers\Auth\RestauranteAuthController::class, 'refresh']);

    // Reservas — restaurante
    Route::get('/reservas',                [App\Http\Controllers\ReservaController::class, 'indexRestaurante']);
    Route::patch('/reservas/{id}/checkin', [App\Http\Controllers\ReservaController::class, 'checkin']);
    Route::patch('/reservas/{id}/liberar', [App\Http\Controllers\ReservaController::class, 'liberar']);
    Route::delete('/reservas/{id}',        [App\Http\Controllers\ReservaController::class, 'forceDestroyRestaurante']);

    // Fila — restaurante
    Route::get('/fila',                [App\Http\Controllers\FilaController::class, 'indexRestaurante']);
    Route::delete('/fila/{id}',        [App\Http\Controllers\FilaController::class, 'removerRestaurante'])
        ->where('id', '[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}');

    // Mesas — restaurante
    Route::get('/mesas',         [App\Http\Controllers\MesaController::class, 'index']);
    Route::post('/mesas',        [App\Http\Controllers\MesaController::class, 'store']);
    Route::put('/mesas/{id}',    [App\Http\Controllers\MesaController::class, 'update']);
    Route::delete('/mesas/{id}', [App\Http\Controllers\MesaController::class, 'destroy']);
});

Route::prefix('cliente')->middleware('cliente.or.restaurante')->group(function(){
    //adicione as rotas protegidas que tanto o cliente quanto o restaurante podem acessar
});
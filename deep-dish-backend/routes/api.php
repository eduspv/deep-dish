<?php

use Illuminate\Support\Facades\Route;

Route::get('/health', function () {
    return response()->json([
        'ok' => true,
        'app' => 'Deep Dish API',
    ]);
});

Route::post('/restaurante/register', [App\Http\Controllers\RestauranteController::class, 'register']);
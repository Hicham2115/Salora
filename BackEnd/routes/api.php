<?php

use App\Http\Controllers\SalonOwnerController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Route::get('/user', function (Request $request) {
//     return $request->user();
// })->middleware('auth:sanctum');

Route::post('/create_salon', [SalonOwnerController::class, 'createSalon']);

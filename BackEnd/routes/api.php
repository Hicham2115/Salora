<?php

use App\Http\Controllers\OpeningHoursController;
use App\Http\Controllers\SalonOwnerController;
use App\Http\Controllers\StaffController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Route::get('/user', function (Request $request) {
//     return $request->user();
// })->middleware('auth:sanctum');

// Settings Owner Routes

// Salon Owner Routes.      
Route::post('/create_salon', [SalonOwnerController::class, 'createSalon']);
Route::get('/salon_data', [SalonOwnerController::class, 'SalonData']);
Route::post('/update_salon', [SalonOwnerController::class, 'updateSalon']);
// Opening Hours Routes
Route::post('/create_opening_hours', [OpeningHoursController::class, 'createOpeningHours']);
Route::post('/update_opening_hours', [OpeningHoursController::class, 'updateOpeningHours']);
Route::get('/opening_hours_data', [OpeningHoursController::class, 'OpeningHoursData']);
// Staff Routes
Route::post('/create_staff', [StaffController::class, 'createStaff']);
Route::get('/staff_data', [StaffController::class, 'StaffData']);
Route::post('/update_staff', [StaffController::class, 'updateStaff']);
Route::post('/delete_staff', [StaffController::class, 'deleteStaff']);

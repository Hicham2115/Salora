<?php

use App\Http\Controllers\ClientController;
use App\Http\Controllers\NotificationsController;
use App\Http\Controllers\ServiceController;
use App\Http\Controllers\OpeningHoursController;
use App\Http\Controllers\ReviewsController;
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
// Notifications Routes
Route::post('/create_notifications', [NotificationsController::class, 'createNotifications']);
Route::get('/notifications_data', [NotificationsController::class, 'NotificationsData']);
Route::post('/update_notifications', [NotificationsController::class, 'updateNotifications']);


// Review Routes
Route::post('/create_review', [ReviewsController::class, 'createReview']);
Route::get('/reviews_data', [ReviewsController::class, 'ReviewsData']);

// Service Routes
Route::post('/create_service', [ServiceController::class, 'createService']);
Route::get('/services_data', [ServiceController::class, 'servicesData']);
Route::post('/update_service', [ServiceController::class, 'updateService']);
Route::post('/delete_service', [ServiceController::class, 'deleteService']);

// Client Routes
Route::post('/create_client', [ClientController::class, 'createClient']);
Route::get('/clients_data', [ClientController::class, 'clientsData']);
Route::post('/update_client', [ClientController::class, 'updateClient']);
Route::post('/delete_client', [ClientController::class, 'deleteClient']);
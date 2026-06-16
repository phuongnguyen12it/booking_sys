<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\BookingController;
use App\Http\Controllers\Api\RoomController;
use Illuminate\Support\Facades\Route;

Route::post('/auth/token', [AuthController::class, 'token']);
Route::delete('/auth/token', [AuthController::class, 'destroy'])->middleware('auth:sanctum');

Route::get('/rooms', [RoomController::class, 'index']);
Route::get('/rooms/{room}/bookings', [RoomController::class, 'bookings']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/bookings', [BookingController::class, 'store']);
    Route::delete('/bookings/{booking}', [BookingController::class, 'destroy']);
});

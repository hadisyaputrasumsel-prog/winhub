<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\DashboardController;

// Landing Page
Route::get('/', function () {
    return view('winhub');
})->name('landing');

// Auth Routes
Route::get('/login', [AuthController::class, 'showLogin'])->name('login')->middleware('guest');
Route::post('/login', [AuthController::class, 'login'])->middleware('guest');
Route::post('/logout', [AuthController::class, 'logout'])->name('logout')->middleware('auth');

use App\Http\Controllers\PermohonanController;
use App\Http\Controllers\UserController;

use App\Http\Controllers\BiayaController;

// Dashboard & Portal Routes
Route::middleware('auth')->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    
    // Permohonan
    Route::resource('/permohonan', PermohonanController::class)->except(['show']);
    
    // Manajemen User
    Route::resource('/users', UserController::class)->except(['show']);
    
    // Master Biaya
    Route::resource('/master/biaya', BiayaController::class)->except(['show'])->names('master.biaya');
    
    // Master Wilayah
    Route::resource('/master/wilayah', App\Http\Controllers\WilayahController::class)->except(['show'])->names('master.wilayah');
});

// Old API route (kept for backwards compatibility if needed during transition)
Route::match(['get', 'post'], '/api/winhub', [App\Http\Controllers\WinHubController::class, 'handleApi']);

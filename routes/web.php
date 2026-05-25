<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('winhub');
});

Route::match(['get', 'post'], '/api/winhub', [App\Http\Controllers\WinHubController::class, 'handleApi']);

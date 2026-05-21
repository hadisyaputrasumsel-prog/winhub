<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('winhub');
});

Route::match(['get', 'post'], '/api.php', [App\Http\Controllers\WinHubController::class, 'handleApi']);

<?php

use App\Http\Controllers\MemberController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

//Guests
Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->middleware('guest')->name('home');
//Admin

//Staff


//Member
Route::name('members.')->prefix('/member')->controller(MemberController::class)->group(function () {
    Route::get('register', 'create')->name('create')->middleware(['role:member']);
    Route::post('/', 'store')->name('store')->middleware(['role:member']);
});

// Route::name('subscription.')->prefix('/subscriptions')->group(function () {
//     Route::get('create', function () {
//         return inertia()->render('');
//     });
// });

Route::get('dashboard', function () {
    return Inertia::render('dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

require __DIR__ . '/settings.php';

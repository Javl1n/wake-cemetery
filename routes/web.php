<?php

use App\Http\Controllers\InsuranceController;
use App\Http\Controllers\MemberController;
use App\Http\Controllers\SubscriptionController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

//Guests
Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
        'insurances' => App\Models\Insurance::all(),
    ]);
})->name('home');

//Admin
Route::get('dashboard', function () {
    return Inertia::render('admin/dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

//Staff


//Member
Route::name('members.')->prefix('/member')->controller(MemberController::class)->group(function () {
    Route::get('/welcome', 'welcome')->name('welcome')->middleware(['auth', 'verified', 'role:member']);
    Route::get('/dashboard', 'dashboard')->name('dashboard')->middleware(['auth', 'verified', 'role:member']);
    Route::get('register', 'create')->name('create')->middleware(['role:member']);
    Route::post('/', 'store')->name('store')->middleware(['role:member']);
});

Route::name('subscriptions.')->prefix('/subscription')->controller(SubscriptionController::class)->group(function () {
    Route::get('/register', 'create')->name('create')->middleware(['member-verified']);
});

// Route::name('subscription.')->prefix('/subscriptions')->group(function () {
//     Route::get('create', function () {
//         return inertia()->render('');
//     });
// });



require __DIR__ . '/settings.php';

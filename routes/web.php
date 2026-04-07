<?php

use App\Http\Controllers\CemeteryMapController;
use App\Http\Controllers\MemberController;
use App\Http\Controllers\SubscriptionController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

// Guests
Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
        'insurances' => App\Models\Insurance::all(),
    ]);
})->name('home');

// Admin
Route::get('dashboard', function () {
    return Inertia::render('admin/dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

// Staff

// Member
Route::name('members.')->prefix('/member')->controller(MemberController::class)->group(function () {
    Route::get('/welcome', 'welcome')->name('welcome')->middleware(['auth', 'verified', 'role:member']);
    Route::get('/dashboard', 'dashboard')->name('dashboard')->middleware(['auth', 'verified', 'role:member']);
    Route::get('register', 'create')->name('create')->middleware(['role:member']);
    Route::post('/', 'store')->name('store')->middleware(['role:member']);
});

Route::name('subscriptions.')->prefix('/subscription')->controller(SubscriptionController::class)->group(function () {
    Route::get('/register', 'create')->name('create')->middleware(['auth', 'member-verified']);
    Route::post('/', 'store')->name('store')->middleware(['auth', 'member-verified']);
});

// Cemetery Map (Public access)
Route::name('cemetery.')->prefix('cemetery')->controller(CemeteryMapController::class)->group(function () {
    Route::get('/map', 'index')->name('map');
    Route::get('/search', 'search')->name('search');
});

// Admin - Cemetery Management
Route::middleware(['auth', 'verified', 'role:admin,staff'])->group(function () {
    Route::resource('cemetery-sections', App\Http\Controllers\CemeterySectionController::class)->except(['show', 'create', 'edit']);
    Route::resource('cemetery-plots', App\Http\Controllers\CemeteryPlotController::class)->except(['show', 'create', 'edit']);

    Route::resource('wake-schedules', App\Http\Controllers\WakeScheduleController::class)->except(['show', 'create', 'edit']);
    Route::post('wake-schedules/{wakeSchedule}/complete', [App\Http\Controllers\WakeScheduleController::class, 'complete'])->name('wake-schedules.complete');
    Route::post('wake-schedules/check-availability', [App\Http\Controllers\WakeScheduleController::class, 'checkAvailability'])->name('wake-schedules.check-availability');
});

// Route::name('subscription.')->prefix('/subscriptions')->group(function () {
//     Route::get('create', function () {
//         return inertia()->render('');
//     });
// });

require __DIR__.'/settings.php';

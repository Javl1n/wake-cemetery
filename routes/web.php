<?php

use App\Http\Controllers\CemeteryMapController;
use App\Http\Controllers\MemberController;
use App\Http\Controllers\SubscriptionController;
use App\Http\Controllers\VisitorPingController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

// Guests
Route::post('visitor-ping', VisitorPingController::class)->name('visitor.ping');

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
        'insurances' => App\Models\Insurance::all(),
    ]);
})->name('home');

// Admin
Route::get('dashboard', function () {
    $user = auth()->user();

    $scheduleStats = App\Models\WakeSchedule::selectRaw("
        COUNT(*) as total,
        SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending,
        SUM(CASE WHEN status IN ('confirmed', 'in_progress') THEN 1 ELSE 0 END) as active,
        SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed,
        SUM(CASE WHEN status = 'cancelled' THEN 1 ELSE 0 END) as cancelled
    ")->first();

    $plotStats = App\Models\CemeteryPlot::selectRaw("
        COUNT(*) as total,
        SUM(CASE WHEN status = 'available' THEN 1 ELSE 0 END) as available,
        SUM(CASE WHEN status = 'occupied' THEN 1 ELSE 0 END) as occupied,
        SUM(CASE WHEN status = 'reserved' THEN 1 ELSE 0 END) as reserved,
        SUM(CASE WHEN status = 'maintenance' THEN 1 ELSE 0 END) as maintenance
    ")->first();

    $memberCount = App\Models\Member::count();
    $lowStockCount = App\Models\InventoryItem::where('available', true)->where('stock', '<=', 5)->count();

    $visitorStats = [
        'today_total' => App\Models\VisitorLog::today()->count(),
        'today_near' => App\Models\VisitorLog::today()->nearCemetery()->count(),
    ];

    $recentSchedules = App\Models\WakeSchedule::with([
        'deceased.beneficiary',
        'room',
        'package',
    ])->latest()->limit(6)->get();

    $activeRooms = App\Models\WakeRoom::withCount(['schedules as active_count' => function ($q) {
        $q->whereIn('status', ['confirmed', 'in_progress']);
    }])->active()->get();

    if ($user->hasRole(['staff'])) {
        $pendingServices = App\Models\WakeSchedule::with([
            'deceased.beneficiary',
            'room',
            'services' => fn ($q) => $q->wherePivot('status', 'pending'),
        ])->whereIn('status', ['confirmed', 'in_progress'])->latest()->get()->filter(fn ($s) => $s->services->isNotEmpty());

        $maintenancePlots = App\Models\CemeteryPlot::with('section:id,name,code,color')
            ->where('status', 'maintenance')
            ->get()
            ->map(fn ($p) => [
                'id' => $p->id,
                'plot_number' => $p->plot_number,
                'notes' => $p->notes,
                'section' => ['name' => $p->section->name, 'color' => $p->section->color],
            ]);

        return Inertia::render('staff/dashboard', [
            'scheduleStats' => $scheduleStats,
            'memberCount' => $memberCount,
            'plotStats' => $plotStats,
            'lowStockCount' => $lowStockCount,
            'recentSchedules' => $recentSchedules,
            'activeRooms' => $activeRooms,
            'pendingServices' => $pendingServices->values(),
            'maintenancePlots' => $maintenancePlots,
        ]);
    }

    return Inertia::render('admin/dashboard', [
        'scheduleStats' => $scheduleStats,
        'memberCount' => $memberCount,
        'plotStats' => $plotStats,
        'lowStockCount' => $lowStockCount,
        'recentSchedules' => $recentSchedules,
        'activeRooms' => $activeRooms,
        'visitorStats' => $visitorStats,
    ]);
})->middleware(['auth', 'verified'])->name('dashboard');

// Staff

// Member
Route::name('members.')->prefix('/member')->controller(MemberController::class)->group(function () {
    Route::get('/welcome', 'welcome')->name('welcome')->middleware(['auth', 'verified', 'role:member']);
    Route::get('/dashboard', 'dashboard')->name('dashboard')->middleware(['auth', 'verified', 'role:member']);
    Route::get('/insurance', 'insurance')->name('insurance')->middleware(['auth', 'verified', 'role:member']);
    Route::get('register', 'create')->name('create')->middleware(['role:member']);
    Route::post('/', 'store')->name('store')->middleware(['role:member']);
});

Route::middleware(['auth', 'verified', 'role:member'])->prefix('/member')->name('members.')->group(function () {
    Route::get('/wake-schedules', [App\Http\Controllers\MemberWakeScheduleController::class, 'index'])->name('wake-schedules.index');
    Route::post('/wake-schedules/{wakeSchedule}/orders', [App\Http\Controllers\MemberWakeScheduleController::class, 'storeOrder'])->name('wake-schedules.orders.store');
    Route::post('/wake-schedules/{wakeSchedule}/reserve-plot', [App\Http\Controllers\MemberWakeScheduleController::class, 'reservePlot'])->name('wake-schedules.reserve-plot');
    Route::post('/wake-schedules/{wakeSchedule}/claim', [App\Http\Controllers\InsuranceClaimController::class, 'store'])->name('wake-schedules.claim.store');
});

// Member obituary management
Route::middleware(['auth', 'verified', 'role:member'])->prefix('/member')->name('member.obituary.')->group(function () {
    Route::get('/deceased/{deceased}/obituary/setup', [App\Http\Controllers\DeceasedObituaryController::class, 'setup'])->name('setup');
    Route::post('/deceased/{deceased}/obituary', [App\Http\Controllers\DeceasedObituaryController::class, 'store'])->name('store');
});

Route::name('subscriptions.')->prefix('/subscription')->controller(SubscriptionController::class)->group(function () {
    Route::get('/register', 'create')->name('create')->middleware(['auth', 'member-verified']);
    Route::post('/', 'store')->name('store')->middleware(['auth', 'member-verified']);
});

// Public obituary pages
Route::get('obituary/{token}', [App\Http\Controllers\ObituaryPageController::class, 'show'])->name('obituary.show');

// Public tribute pages
Route::prefix('tribute')->name('tribute.')->controller(App\Http\Controllers\TributePageController::class)->group(function () {
    Route::get('{token}', 'show')->name('show');
    Route::post('{token}/tributes', 'storeTribute')->name('tributes.store');
});

// Cemetery Map (Public access)
Route::name('cemetery.')->prefix('cemetery')->controller(CemeteryMapController::class)->group(function () {
    Route::get('/map', 'index')->name('map');
    Route::get('/search', 'search')->name('search');
    Route::get('/sections/{section}', 'section')->name('section');
});

// Admin - Staff Management
Route::middleware(['auth', 'verified', 'role:admin'])->group(function () {
    Route::resource('staff', App\Http\Controllers\StaffController::class)->except(['show', 'create', 'edit']);
});

// Admin / Staff - Insurance Subscription Review
Route::middleware(['auth', 'verified', 'role:admin,staff'])->name('subscriptions.review.')->prefix('subscriptions/review')->controller(App\Http\Controllers\SubscriptionReviewController::class)->group(function () {
    Route::get('/', 'index')->name('index');
    Route::post('{subscription}/approve', 'approve')->name('approve');
    Route::post('{subscription}/reject', 'reject')->name('reject');
});

// Admin / Staff - Insurance Claim Review
Route::middleware(['auth', 'verified', 'role:admin,staff'])->name('claims.review.')->prefix('claims/review')->controller(App\Http\Controllers\InsuranceClaimReviewController::class)->group(function () {
    Route::get('/', 'index')->name('index');
    Route::post('{claim}/approve', 'approve')->name('approve');
    Route::post('{claim}/reject', 'reject')->name('reject');
});

// Admin - Cemetery Management
Route::middleware(['auth', 'verified', 'role:admin,staff'])->group(function () {
    Route::resource('cemetery-sections', App\Http\Controllers\CemeterySectionController::class)->except(['show', 'create', 'edit']);
    Route::resource('cemetery-plots', App\Http\Controllers\CemeteryPlotController::class)->except(['show', 'create', 'edit']);
    Route::resource('cemetery-events', App\Http\Controllers\CemeteryEventController::class)->except(['show', 'create', 'edit']);
    Route::patch('cemetery-plots/{cemeteryPlot}/flag-maintenance', [App\Http\Controllers\CemeteryPlotController::class, 'flagMaintenance'])->name('cemetery-plots.flag-maintenance');
    Route::patch('cemetery-plots/{cemeteryPlot}/resolve-maintenance', [App\Http\Controllers\CemeteryPlotController::class, 'resolveMaintenance'])->name('cemetery-plots.resolve-maintenance');
    Route::get('cemetery-maintenance', [App\Http\Controllers\CemeteryMaintenanceController::class, 'index'])->name('cemetery-maintenance.index');

    Route::resource('inventory-items', App\Http\Controllers\InventoryItemController::class)->except(['show', 'create', 'edit']);

    Route::resource('wake-services', App\Http\Controllers\WakeServiceController::class)->except(['show', 'create', 'edit']);

    Route::resource('wake-schedules', App\Http\Controllers\WakeScheduleController::class)->except(['show', 'create', 'edit']);
    Route::post('wake-schedules/{wakeSchedule}/complete', [App\Http\Controllers\WakeScheduleController::class, 'complete'])->name('wake-schedules.complete');
    Route::patch('wake-schedules/{wakeSchedule}/services/{wakeService}/complete', [App\Http\Controllers\WakeScheduleController::class, 'completeService'])->name('wake-schedules.services.complete');
    Route::post('wake-schedules/check-availability', [App\Http\Controllers\WakeScheduleController::class, 'checkAvailability'])->name('wake-schedules.check-availability');
});

// Route::name('subscription.')->prefix('/subscriptions')->group(function () {
//     Route::get('create', function () {
//         return inertia()->render('');
//     });
// });

require __DIR__.'/settings.php';

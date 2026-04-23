<?php

use App\Models\VisitorLog;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

it('records a visitor without coordinates', function () {
    $this->postJson('/visitor-ping', [])
        ->assertSuccessful()
        ->assertJson(['near_cemetery' => false]);

    expect(VisitorLog::count())->toBe(1);
    expect(VisitorLog::first()->is_near_cemetery)->toBeFalse();
});

it('marks visitor as near cemetery when within radius', function () {
    // Use the cemetery center coordinates from config — guaranteed to be 0 km away
    $lat = (float) config('cemetery.center.latitude');
    $lng = (float) config('cemetery.center.longitude');

    $this->postJson('/visitor-ping', ['latitude' => $lat, 'longitude' => $lng])
        ->assertSuccessful()
        ->assertJson(['near_cemetery' => true]);

    expect(VisitorLog::first()->is_near_cemetery)->toBeTrue();
});

it('does not mark visitor as near cemetery when far away', function () {
    // Tokyo — far from any Philippine cemetery
    $this->postJson('/visitor-ping', ['latitude' => 35.6762, 'longitude' => 139.6503])
        ->assertSuccessful()
        ->assertJson(['near_cemetery' => false]);

    expect(VisitorLog::first()->is_near_cemetery)->toBeFalse();
});

it('does not double-count the same IP on the same day', function () {
    $lat = (float) config('cemetery.center.latitude');
    $lng = (float) config('cemetery.center.longitude');

    $this->postJson('/visitor-ping', ['latitude' => $lat, 'longitude' => $lng]);
    $this->postJson('/visitor-ping', ['latitude' => $lat, 'longitude' => $lng]);

    expect(VisitorLog::count())->toBe(1);
});

it('counts each unique IP separately', function () {
    $lat = (float) config('cemetery.center.latitude');
    $lng = (float) config('cemetery.center.longitude');

    $this->withServerVariables(['REMOTE_ADDR' => '1.1.1.1'])
        ->postJson('/visitor-ping', ['latitude' => $lat, 'longitude' => $lng]);

    $this->withServerVariables(['REMOTE_ADDR' => '2.2.2.2'])
        ->postJson('/visitor-ping', ['latitude' => $lat, 'longitude' => $lng]);

    expect(VisitorLog::nearCemetery()->today()->count())->toBe(2);
});

it('rejects invalid coordinates', function () {
    $this->postJson('/visitor-ping', ['latitude' => 999, 'longitude' => 0])
        ->assertUnprocessable();
});

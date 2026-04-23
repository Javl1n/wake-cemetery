<?php

use App\Models\CemeteryEvent;
use App\Models\User;

beforeEach(function () {
    $this->user = User::factory()->create(['role' => 'admin']);
});

test('index renders event markers page', function () {
    CemeteryEvent::factory()->count(3)->create(['created_by_id' => $this->user->id]);

    $response = $this->actingAs($this->user)->get('/cemetery-events');

    $response->assertSuccessful();
    $response->assertInertia(fn ($page) => $page->has('events', 3));
});

test('can create event marker', function () {
    $response = $this->actingAs($this->user)->post('/cemetery-events', [
        'title' => 'Santos Burial',
        'type' => 'burial',
        'description' => 'Family burial service',
        'latitude' => 14.5995,
        'longitude' => 120.9842,
        'starts_at' => '2026-04-23 09:00:00',
        'ends_at' => '2026-04-23 11:00:00',
        'color' => '#ef4444',
    ]);

    $response->assertRedirect();

    $event = CemeteryEvent::first();
    expect($event)->not->toBeNull();
    expect($event->title)->toBe('Santos Burial');
    expect($event->type)->toBe('burial');
    expect($event->created_by_id)->toBe($this->user->id);
});

test('can create event marker without end date', function () {
    $response = $this->actingAs($this->user)->post('/cemetery-events', [
        'title' => 'Memorial Service',
        'type' => 'memorial',
        'latitude' => 14.5995,
        'longitude' => 120.9842,
        'starts_at' => '2026-04-23 09:00:00',
        'color' => '#8b5cf6',
    ]);

    $response->assertRedirect();

    $event = CemeteryEvent::first();
    expect($event->ends_at)->toBeNull();
});

test('can update event marker', function () {
    $event = CemeteryEvent::factory()->create(['created_by_id' => $this->user->id]);

    $response = $this->actingAs($this->user)->put("/cemetery-events/{$event->id}", [
        'title' => 'Updated Title',
        'type' => $event->type,
        'latitude' => (float) $event->latitude,
        'longitude' => (float) $event->longitude,
        'starts_at' => $event->starts_at->format('Y-m-d H:i:s'),
        'color' => $event->color,
    ]);

    $response->assertRedirect();

    $event->refresh();
    expect($event->title)->toBe('Updated Title');
});

test('can delete event marker', function () {
    $event = CemeteryEvent::factory()->create(['created_by_id' => $this->user->id]);

    $response = $this->actingAs($this->user)->delete("/cemetery-events/{$event->id}");

    $response->assertRedirect();
    $this->assertModelMissing($event);
});

test('store validates required fields', function () {
    $response = $this->actingAs($this->user)->post('/cemetery-events', []);

    $response->assertInvalid(['title', 'type', 'latitude', 'longitude', 'starts_at', 'color']);
});

test('store validates event type', function () {
    $response = $this->actingAs($this->user)->post('/cemetery-events', [
        'title' => 'Test',
        'type' => 'invalid-type',
        'latitude' => 14.5995,
        'longitude' => 120.9842,
        'starts_at' => '2026-04-23 09:00:00',
        'color' => '#ef4444',
    ]);

    $response->assertInvalid(['type']);
});

test('active scope returns only currently active events', function () {
    CemeteryEvent::factory()->create([
        'created_by_id' => $this->user->id,
        'starts_at' => now()->subHour(),
        'ends_at' => now()->addHour(),
    ]);

    CemeteryEvent::factory()->create([
        'created_by_id' => $this->user->id,
        'starts_at' => now()->subHours(3),
        'ends_at' => now()->subHour(),
    ]);

    CemeteryEvent::factory()->create([
        'created_by_id' => $this->user->id,
        'starts_at' => now()->addHour(),
        'ends_at' => null,
    ]);

    expect(CemeteryEvent::active()->count())->toBe(1);
});

test('public map includes active events', function () {
    CemeteryEvent::factory()->active()->create(['created_by_id' => $this->user->id]);
    CemeteryEvent::factory()->create([
        'created_by_id' => $this->user->id,
        'starts_at' => now()->addDay(),
        'ends_at' => null,
    ]);

    $response = $this->get('/cemetery/map');

    $response->assertSuccessful();
    $response->assertInertia(fn ($page) => $page->has('events', 1));
});

test('staff can manage event markers', function () {
    $staff = User::factory()->create(['role' => 'staff']);

    $response = $this->actingAs($staff)->post('/cemetery-events', [
        'title' => 'Staff Event',
        'type' => 'ceremony',
        'latitude' => 14.5995,
        'longitude' => 120.9842,
        'starts_at' => '2026-04-23 09:00:00',
        'color' => '#0ea5e9',
    ]);

    $response->assertRedirect();
    expect(CemeteryEvent::first()->title)->toBe('Staff Event');
});

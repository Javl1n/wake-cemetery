<?php

use App\Models\CemeterySection;
use App\Models\User;

beforeEach(function () {
    $this->user = User::factory()->create(['role' => 'admin']);
});

test('can create section', function () {
    $response = $this->actingAs($this->user)->post('/cemetery-sections', [
        'name' => 'Veterans Section',
        'code' => 'SEC-C',
        'color' => '#ef4444',
        'total_plots' => 40,
        'available_plots' => 30,
    ]);

    $response->assertRedirect();

    $section = CemeterySection::first();
    expect($section)->not->toBeNull();
});

test('can update section', function () {
    $section = CemeterySection::factory()->create();

    $response = $this->actingAs($this->user)->put("/cemetery-sections/{$section->id}", [
        'name' => 'Updated Name',
        'code' => $section->code,
        'color' => $section->color,
        'total_plots' => $section->total_plots,
        'available_plots' => $section->available_plots,
    ]);

    $response->assertRedirect();

    $section->refresh();
    expect($section->name)->toBe('Updated Name');
});

test('sections index returns sections', function () {
    CemeterySection::factory()->count(3)->create();

    $response = $this->actingAs($this->user)->get('/cemetery-sections');

    $response->assertSuccessful();
    $response->assertInertia(fn ($page) => $page->has('sections', 3));
});

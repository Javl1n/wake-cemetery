<?php

use App\Models\CemeteryPlot;
use App\Models\CemeterySection;
use App\Models\Deceased;
use App\Models\Member;
use App\Models\User;

test('cemetery map page loads successfully', function () {
    $response = $this->get(route('cemetery.map'));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('cemetery/map')
        ->has('sections')
        ->has('plots')
        ->has('mapboxToken')
        ->has('centerCoordinates')
        ->has('initialZoom'));
});

test('search returns matching deceased plots', function () {
    $user = User::factory()->create(['name' => 'John Doe']);
    $member = Member::factory()->create(['user_id' => $user->id]);
    $deceased = Deceased::factory()->create(['member_id' => $member->id]);
    $section = CemeterySection::factory()->create();
    CemeteryPlot::factory()->occupied()->create([
        'section_id' => $section->id,
        'deceased_id' => $deceased->id,
    ]);

    $response = $this->get(route('cemetery.search', ['query' => 'John']));

    $response->assertOk();
    $response->assertJsonStructure([
        'results' => [
            '*' => ['id', 'plot_number', 'latitude', 'longitude', 'deceased_name'],
        ],
    ]);
    $response->assertJsonFragment(['deceased_name' => 'John Doe']);
});

test('search returns empty results for no matches', function () {
    $response = $this->get(route('cemetery.search', ['query' => 'Nonexistent']));

    $response->assertOk();
    $response->assertJson(['results' => []]);
});

test('map page includes only occupied plots', function () {
    $section = CemeterySection::factory()->create();
    CemeteryPlot::factory()->occupied()->create(['section_id' => $section->id]);
    CemeteryPlot::factory()->create([
        'section_id' => $section->id,
        'status' => 'available',
    ]);

    $response = $this->get(route('cemetery.map'));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('cemetery/map')
        ->has('plots', 1));
});

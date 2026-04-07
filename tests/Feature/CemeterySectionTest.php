<?php

use App\Models\CemeterySection;
use App\Models\User;

beforeEach(function () {
    $this->user = User::factory()->create(['role' => 'admin']);
});

test('can create section with polygon geometry', function () {
    $geometry = [
        'type' => 'Feature',
        'geometry' => [
            'type' => 'Polygon',
            'coordinates' => [
                [
                    [120.984, 14.599],
                    [120.985, 14.599],
                    [120.985, 14.600],
                    [120.984, 14.600],
                    [120.984, 14.599],
                ],
            ],
        ],
        'properties' => [
            'geometryType' => 'polygon',
        ],
    ];

    $response = $this->actingAs($this->user)->post('/cemetery-sections', [
        'name' => 'Garden of Peace',
        'code' => 'SEC-A',
        'color' => '#3b82f6',
        'total_plots' => 50,
        'available_plots' => 45,
        'geometry' => $geometry,
        'geometry_type' => 'polygon',
    ]);

    $response->assertRedirect();

    $section = CemeterySection::first();
    expect($section)->not->toBeNull();
    expect($section->geometry)->toEqual($geometry);
    expect($section->geometry_type)->toBe('polygon');
});

test('can create section with line geometry', function () {
    $geometry = [
        'type' => 'Feature',
        'geometry' => [
            'type' => 'LineString',
            'coordinates' => [
                [120.984, 14.599],
                [120.985, 14.600],
            ],
        ],
        'properties' => [
            'geometryType' => 'line',
        ],
    ];

    $response = $this->actingAs($this->user)->post('/cemetery-sections', [
        'name' => 'Memorial Path',
        'code' => 'SEC-B',
        'color' => '#10b981',
        'total_plots' => 30,
        'available_plots' => 25,
        'geometry' => $geometry,
        'geometry_type' => 'line',
    ]);

    $response->assertRedirect();

    $section = CemeterySection::first();
    expect($section)->not->toBeNull();
    expect($section->geometry)->toEqual($geometry);
    expect($section->geometry_type)->toBe('line');
});

test('can create section without geometry', function () {
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
    expect($section->geometry)->toBeNull();
    expect($section->geometry_type)->toBeNull();
});

test('geometry validation rejects invalid geojson', function () {
    $response = $this->actingAs($this->user)->post('/cemetery-sections', [
        'name' => 'Invalid Section',
        'code' => 'SEC-D',
        'color' => '#f59e0b',
        'total_plots' => 20,
        'available_plots' => 15,
        'geometry' => ['invalid' => 'data'],
        'geometry_type' => 'polygon',
    ]);

    $response->assertSessionHasErrors('geometry');
});

test('geometry validation rejects polygon with insufficient points', function () {
    $geometry = [
        'type' => 'Feature',
        'geometry' => [
            'type' => 'Polygon',
            'coordinates' => [
                [
                    [120.984, 14.599],
                    [120.985, 14.599],
                    [120.984, 14.599],
                ],
            ],
        ],
        'properties' => [
            'geometryType' => 'polygon',
        ],
    ];

    $response = $this->actingAs($this->user)->post('/cemetery-sections', [
        'name' => 'Invalid Polygon',
        'code' => 'SEC-E',
        'color' => '#8b5cf6',
        'total_plots' => 25,
        'available_plots' => 20,
        'geometry' => $geometry,
        'geometry_type' => 'polygon',
    ]);

    $response->assertSessionHasErrors('geometry');
});

test('geometry validation rejects line with insufficient points', function () {
    $geometry = [
        'type' => 'Feature',
        'geometry' => [
            'type' => 'LineString',
            'coordinates' => [
                [120.984, 14.599],
            ],
        ],
        'properties' => [
            'geometryType' => 'line',
        ],
    ];

    $response = $this->actingAs($this->user)->post('/cemetery-sections', [
        'name' => 'Invalid Line',
        'code' => 'SEC-F',
        'color' => '#ec4899',
        'total_plots' => 15,
        'available_plots' => 10,
        'geometry' => $geometry,
        'geometry_type' => 'line',
    ]);

    $response->assertSessionHasErrors('geometry');
});

test('can update section geometry', function () {
    $section = CemeterySection::factory()->create();

    $newGeometry = [
        'type' => 'Feature',
        'geometry' => [
            'type' => 'Polygon',
            'coordinates' => [
                [
                    [120.984, 14.599],
                    [120.985, 14.599],
                    [120.985, 14.600],
                    [120.984, 14.600],
                    [120.984, 14.599],
                ],
            ],
        ],
        'properties' => [
            'geometryType' => 'polygon',
        ],
    ];

    $response = $this->actingAs($this->user)->put("/cemetery-sections/{$section->id}", [
        'name' => $section->name,
        'code' => $section->code,
        'color' => $section->color,
        'total_plots' => $section->total_plots,
        'available_plots' => $section->available_plots,
        'geometry' => $newGeometry,
        'geometry_type' => 'polygon',
    ]);

    $response->assertRedirect();

    $section->refresh();
    expect($section->geometry)->toEqual($newGeometry);
    expect($section->geometry_type)->toBe('polygon');
});

test('can remove section geometry', function () {
    $section = CemeterySection::factory()->withPolygon()->create();

    expect($section->geometry)->not->toBeNull();

    $response = $this->actingAs($this->user)->put("/cemetery-sections/{$section->id}", [
        'name' => $section->name,
        'code' => $section->code,
        'color' => $section->color,
        'total_plots' => $section->total_plots,
        'available_plots' => $section->available_plots,
        'geometry' => null,
        'geometry_type' => null,
    ]);

    $response->assertRedirect();

    $section->refresh();
    expect($section->geometry)->toBeNull();
    expect($section->geometry_type)->toBeNull();
});

test('sections index includes geometry data', function () {
    $sectionWithPolygon = CemeterySection::factory()->withPolygon()->create();
    $sectionWithLine = CemeterySection::factory()->withLine()->create();
    $sectionWithoutGeometry = CemeterySection::factory()->create();

    $response = $this->actingAs($this->user)->get('/cemetery-sections');

    $response->assertSuccessful();
    $response->assertInertia(fn ($page) => $page
        ->has('sections', 3)
        ->has('sections.0.geometry')
        ->has('sections.0.geometry_type')
    );
});

test('factory creates section with polygon geometry', function () {
    $section = CemeterySection::factory()->withPolygon()->create();

    expect($section->geometry)->not->toBeNull();
    expect($section->geometry['geometry']['type'])->toBe('Polygon');
    expect($section->geometry_type)->toBe('polygon');
});

test('factory creates section with line geometry', function () {
    $section = CemeterySection::factory()->withLine()->create();

    expect($section->geometry)->not->toBeNull();
    expect($section->geometry['geometry']['type'])->toBe('LineString');
    expect($section->geometry_type)->toBe('line');
});

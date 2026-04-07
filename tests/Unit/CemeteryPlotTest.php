<?php

use App\Models\CemeteryPlot;
use App\Models\CemeterySection;
use App\Models\Deceased;

test('cemetery plot belongs to section', function () {
    $plot = CemeteryPlot::factory()->create();

    expect($plot->section)->toBeInstanceOf(CemeterySection::class);
});

test('cemetery plot can belong to deceased', function () {
    $plot = CemeteryPlot::factory()->occupied()->create();

    expect($plot->deceased)->toBeInstanceOf(Deceased::class);
});

test('cemetery plot can be occupied', function () {
    $plot = CemeteryPlot::factory()->occupied()->create();

    expect($plot->status)->toBe('occupied')
        ->and($plot->deceased_id)->not->toBeNull();
});

test('occupied scope returns only occupied plots', function () {
    CemeteryPlot::factory()->create(['status' => 'available']);
    CemeteryPlot::factory()->occupied()->create();

    $occupiedPlots = CemeteryPlot::occupied()->get();

    expect($occupiedPlots)->toHaveCount(1)
        ->and($occupiedPlots->first()->status)->toBe('occupied');
});

test('available scope returns only available plots', function () {
    CemeteryPlot::factory()->create(['status' => 'available']);
    CemeteryPlot::factory()->occupied()->create();

    $availablePlots = CemeteryPlot::available()->get();

    expect($availablePlots)->toHaveCount(1)
        ->and($availablePlots->first()->status)->toBe('available');
});

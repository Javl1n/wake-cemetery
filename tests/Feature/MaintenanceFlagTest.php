<?php

use App\Models\CemeteryPlot;
use App\Models\User;

beforeEach(function () {
    $this->admin = User::factory()->create(['role' => 'admin']);
    $this->staff = User::factory()->create(['role' => 'staff']);
    $this->member = User::factory()->create(['role' => 'member']);
});

test('admin can flag a plot for maintenance', function () {
    $plot = CemeteryPlot::factory()->create(['status' => 'available']);

    $this->actingAs($this->admin)
        ->patch("/cemetery-plots/{$plot->id}/flag-maintenance", [
            'notes' => 'Path needs repaving.',
        ])
        ->assertRedirect();

    $plot->refresh();
    expect($plot->status)->toBe('maintenance');
    expect($plot->notes)->toBe('Path needs repaving.');
});

test('staff can flag a plot for maintenance', function () {
    $plot = CemeteryPlot::factory()->create(['status' => 'available']);

    $this->actingAs($this->staff)
        ->patch("/cemetery-plots/{$plot->id}/flag-maintenance", [
            'notes' => 'Fence broken.',
        ])
        ->assertRedirect();

    $plot->refresh();
    expect($plot->status)->toBe('maintenance');
    expect($plot->notes)->toBe('Fence broken.');
});

test('member cannot flag a plot for maintenance', function () {
    $plot = CemeteryPlot::factory()->create(['status' => 'available']);

    $this->actingAs($this->member)
        ->patch("/cemetery-plots/{$plot->id}/flag-maintenance", [
            'notes' => 'Testing.',
        ])
        ->assertForbidden();
});

test('flagging maintenance requires notes', function () {
    $plot = CemeteryPlot::factory()->create(['status' => 'available']);

    $this->actingAs($this->admin)
        ->patch("/cemetery-plots/{$plot->id}/flag-maintenance", [])
        ->assertSessionHasErrors('notes');
});

test('resolve maintenance restores to available for plain plot', function () {
    $plot = CemeteryPlot::factory()->create([
        'status' => 'maintenance',
        'deceased_id' => null,
        'beneficiary_id' => null,
    ]);

    $this->actingAs($this->admin)
        ->patch("/cemetery-plots/{$plot->id}/resolve-maintenance")
        ->assertRedirect();

    $plot->refresh();
    expect($plot->status)->toBe('available');
});

test('resolve maintenance restores to occupied when deceased is assigned', function () {
    $plot = CemeteryPlot::factory()->occupied()->create(['status' => 'maintenance']);

    $this->actingAs($this->admin)
        ->patch("/cemetery-plots/{$plot->id}/resolve-maintenance")
        ->assertRedirect();

    $plot->refresh();
    expect($plot->status)->toBe('occupied');
});

test('resolve maintenance restores to reserved when beneficiary is assigned', function () {
    $plot = CemeteryPlot::factory()->reserved()->create(['status' => 'maintenance']);

    $this->actingAs($this->admin)
        ->patch("/cemetery-plots/{$plot->id}/resolve-maintenance")
        ->assertRedirect();

    $plot->refresh();
    expect($plot->status)->toBe('reserved');
});

test('staff can resolve maintenance', function () {
    $plot = CemeteryPlot::factory()->create(['status' => 'maintenance']);

    $this->actingAs($this->staff)
        ->patch("/cemetery-plots/{$plot->id}/resolve-maintenance")
        ->assertRedirect();

    $plot->refresh();
    expect($plot->status)->toBe('available');
});

test('member cannot resolve maintenance', function () {
    $plot = CemeteryPlot::factory()->create(['status' => 'maintenance']);

    $this->actingAs($this->member)
        ->patch("/cemetery-plots/{$plot->id}/resolve-maintenance")
        ->assertForbidden();
});

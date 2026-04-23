<?php

use App\Models\InsuranceClaim;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->admin = User::factory()->create(['role' => 'admin']);
    $this->staff = User::factory()->create(['role' => 'staff']);
    $this->claim = InsuranceClaim::factory()->create(['status' => 'filed']);
});

it('allows admin to view the claims review page', function () {
    $this->actingAs($this->admin)
        ->get('/claims/review')
        ->assertOk()
        ->assertInertia(fn ($page) => $page->component('admin/claims/index'));
});

it('allows staff to view the claims review page', function () {
    $this->actingAs($this->staff)
        ->get('/claims/review')
        ->assertOk();
});

it('prevents members from viewing the claims review page', function () {
    $member = User::factory()->create(['role' => 'member']);

    $this->actingAs($member)
        ->get('/claims/review')
        ->assertForbidden();
});

it('allows admin to approve a filed claim with an amount', function () {
    $this->actingAs($this->admin)
        ->post("/claims/review/{$this->claim->id}/approve", ['approved_amount' => 25000])
        ->assertRedirect('/claims/review');

    $this->claim->refresh();
    expect($this->claim->status)->toBe('approved')
        ->and($this->claim->approved_amount)->toBe('25000.00')
        ->and($this->claim->reviewer_id)->toBe($this->admin->id)
        ->and($this->claim->reviewed_at)->not->toBeNull();
});

it('requires an amount when approving a claim', function () {
    $this->actingAs($this->admin)
        ->post("/claims/review/{$this->claim->id}/approve", [])
        ->assertInvalid(['approved_amount']);
});

it('allows admin to reject a filed claim', function () {
    $this->actingAs($this->admin)
        ->post("/claims/review/{$this->claim->id}/reject")
        ->assertRedirect('/claims/review');

    $this->claim->refresh();
    expect($this->claim->status)->toBe('rejected')
        ->and($this->claim->reviewer_id)->toBe($this->admin->id)
        ->and($this->claim->reviewed_at)->not->toBeNull();
});

it('cannot approve a claim that is not filed', function () {
    $this->claim->update(['status' => 'approved', 'approved_amount' => 10000, 'reviewer_id' => $this->admin->id, 'reviewed_at' => now()]);

    $this->actingAs($this->admin)
        ->post("/claims/review/{$this->claim->id}/approve", ['approved_amount' => 5000])
        ->assertStatus(422);
});

it('cannot reject a claim that is not filed', function () {
    $this->claim->update(['status' => 'rejected', 'reviewer_id' => $this->admin->id, 'reviewed_at' => now()]);

    $this->actingAs($this->admin)
        ->post("/claims/review/{$this->claim->id}/reject")
        ->assertStatus(422);
});

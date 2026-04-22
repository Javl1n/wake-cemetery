<?php

use App\Models\Subscription;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->admin = User::factory()->create(['role' => 'admin']);
    $this->staff = User::factory()->create(['role' => 'staff']);
    $this->subscription = Subscription::factory()->create(['status' => 'pending', 'reviewer_id' => null, 'reviewed_at' => null]);
});

it('allows admin to view the subscriptions review page', function () {
    $this->actingAs($this->admin)
        ->get('/subscriptions/review')
        ->assertOk()
        ->assertInertia(fn ($page) => $page->component('admin/subscriptions/index'));
});

it('allows staff to view the subscriptions review page', function () {
    $this->actingAs($this->staff)
        ->get('/subscriptions/review')
        ->assertOk();
});

it('prevents members from viewing the subscriptions review page', function () {
    $member = User::factory()->create(['role' => 'member']);
    $this->actingAs($member)
        ->get('/subscriptions/review')
        ->assertForbidden();
});

it('allows admin to approve a pending subscription', function () {
    $this->actingAs($this->admin)
        ->post("/subscriptions/review/{$this->subscription->id}/approve")
        ->assertRedirect('/subscriptions/review');

    $this->subscription->refresh();
    expect($this->subscription->status)->toBe('approved')
        ->and($this->subscription->reviewer_id)->toBe($this->admin->id)
        ->and($this->subscription->reviewed_at)->not->toBeNull();
});

it('allows admin to reject a pending subscription', function () {
    $this->actingAs($this->admin)
        ->post("/subscriptions/review/{$this->subscription->id}/reject")
        ->assertRedirect('/subscriptions/review');

    $this->subscription->refresh();
    expect($this->subscription->status)->toBe('rejected')
        ->and($this->subscription->reviewer_id)->toBe($this->admin->id);
});

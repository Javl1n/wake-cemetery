<?php

use App\Models\PremiumSchedule;
use App\Models\Subscription;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->admin = User::factory()->create(['role' => 'admin']);
    $this->staff = User::factory()->create(['role' => 'staff']);
});

it('allows admin to view the premium schedules page', function () {
    $this->actingAs($this->admin)
        ->get('/subscriptions/premiums')
        ->assertOk()
        ->assertInertia(fn ($page) => $page->component('admin/subscriptions/premiums'));
});

it('allows staff to view the premium schedules page', function () {
    $this->actingAs($this->staff)
        ->get('/subscriptions/premiums')
        ->assertOk();
});

it('prevents members from viewing the premium schedules page', function () {
    $member = User::factory()->create(['role' => 'member']);

    $this->actingAs($member)
        ->get('/subscriptions/premiums')
        ->assertForbidden();
});

it('only includes approved subscriptions', function () {
    $approved = Subscription::factory()->create(['status' => 'approved']);
    Subscription::factory()->create(['status' => 'pending']);
    Subscription::factory()->create(['status' => 'rejected']);

    $this->actingAs($this->admin)
        ->get('/subscriptions/premiums')
        ->assertInertia(fn ($page) => $page
            ->component('admin/subscriptions/premiums')
            ->where('subscriptions', fn ($subs) => count($subs) === 1 && $subs[0]['id'] === $approved->id)
        );
});

it('calculates paid and outstanding totals correctly', function () {
    $subscription = Subscription::factory()->create(['status' => 'approved']);

    PremiumSchedule::factory()->paid()->create(['subscription_id' => $subscription->id, 'due_amount' => 1000]);
    PremiumSchedule::factory()->paid()->create(['subscription_id' => $subscription->id, 'due_amount' => 1000]);
    PremiumSchedule::factory()->missed()->create(['subscription_id' => $subscription->id, 'due_amount' => 500]);
    PremiumSchedule::factory()->upcoming()->create(['subscription_id' => $subscription->id, 'due_amount' => 750]);

    $this->actingAs($this->admin)
        ->get('/subscriptions/premiums')
        ->assertInertia(fn ($page) => $page
            ->where('subscriptions.0.paid_total', 2000)
            ->where('subscriptions.0.outstanding_total', 1250)
            ->where('subscriptions.0.missed_count', 1)
        );
});

it('includes the full schedule entries for a subscription', function () {
    $subscription = Subscription::factory()->create(['status' => 'approved']);
    PremiumSchedule::factory()->count(3)->create(['subscription_id' => $subscription->id]);

    $this->actingAs($this->admin)
        ->get('/subscriptions/premiums')
        ->assertInertia(fn ($page) => $page
            ->where('subscriptions.0.schedules', fn ($s) => count($s) === 3)
        );
});

<?php

use App\Models\Beneficiary;
use App\Models\Insurance;
use App\Models\Member;
use App\Models\Subscription;
use App\Models\User;

beforeEach(function () {
    $this->member = Member::factory()->create();
    $this->user = $this->member->user;
});

it('renders the insurance visualization page for a member with a subscription', function () {
    $insurance = Insurance::factory()->create(['beneficiaries' => 2]);
    $subscription = Subscription::factory()->create([
        'member_id' => $this->member->id,
        'insurance_id' => $insurance->id,
        'status' => 'active',
    ]);
    Beneficiary::factory()->count(2)->create(['subscription_id' => $subscription->id]);

    $response = $this->actingAs($this->user)->get('/member/insurance');

    $response->assertSuccessful();
    $response->assertInertia(fn ($page) => $page
        ->component('members/insurance')
        ->has('subscription')
        ->has('beneficiaries', 2)
        ->where('subscription.status', 'active')
        ->where('subscription.insurance.id', $insurance->id)
    );
});

it('renders the insurance page with empty beneficiaries when no subscription exists', function () {
    $response = $this->actingAs($this->user)->get('/member/insurance');

    $response->assertSuccessful();
    $response->assertInertia(fn ($page) => $page
        ->component('members/insurance')
        ->where('subscription', null)
        ->has('beneficiaries', 0)
    );
});

it('denies access to guests', function () {
    $this->get('/member/insurance')->assertRedirect('/login');
});

it('denies access to admin users', function () {
    $admin = User::factory()->create(['role' => 'admin']);

    $this->actingAs($admin)->get('/member/insurance')->assertForbidden();
});

<?php

use App\Models\Beneficiary;
use App\Models\Deceased;
use App\Models\Insurance;
use App\Models\InsuranceClaim;
use App\Models\Member;
use App\Models\Subscription;
use App\Models\User;
use App\Models\WakePackage;
use App\Models\WakeRoom;
use App\Models\WakeSchedule;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

/**
 * Helper: build the full chain for a member with an approved subscription
 * and a confirmed wake schedule for one of their beneficiaries.
 *
 * @return array{user: User, member: Member, subscription: Subscription, beneficiary: Beneficiary, schedule: WakeSchedule}
 */
function makeClaimableSchedule(): array
{
    $user = User::factory()->create(['role' => 'member']);
    $member = Member::factory()->create(['user_id' => $user->id]);
    $insurance = Insurance::factory()->create();
    $subscription = Subscription::factory()->create([
        'member_id' => $member->id,
        'insurance_id' => $insurance->id,
        'status' => 'approved',
    ]);
    $beneficiary = Beneficiary::factory()->create(['subscription_id' => $subscription->id]);
    $deceased = Deceased::factory()->create([
        'member_id' => $member->id,
        'beneficiary_id' => $beneficiary->id,
    ]);
    $schedule = WakeSchedule::create([
        'deceased_id' => $deceased->id,
        'room_id' => WakeRoom::factory()->create()->id,
        'package_id' => WakePackage::factory()->create()->id,
        'date_start' => now()->subDays(3)->toDateString(),
        'date_end' => now()->toDateString(),
        'total_amount' => 50000,
        'status' => 'confirmed',
        'created_by' => User::factory()->create()->id,
    ]);

    return compact('user', 'member', 'subscription', 'beneficiary', 'schedule');
}

it('allows a member with an approved subscription to file a claim', function () {
    ['user' => $user, 'subscription' => $subscription, 'schedule' => $schedule] = makeClaimableSchedule();

    $this->actingAs($user)
        ->post("/member/wake-schedules/{$schedule->id}/claim")
        ->assertRedirect();

    $claim = InsuranceClaim::where('schedule_id', $schedule->id)->first();
    expect($claim)->not->toBeNull()
        ->and($claim->status)->toBe('filed')
        ->and($claim->subscription_id)->toBe($subscription->id)
        ->and($claim->filed_at)->not->toBeNull();
});

it('rejects a claim if the member has no approved subscription', function () {
    ['user' => $user, 'schedule' => $schedule, 'subscription' => $subscription] = makeClaimableSchedule();
    $subscription->update(['status' => 'pending']);

    $this->actingAs($user)
        ->post("/member/wake-schedules/{$schedule->id}/claim")
        ->assertForbidden();
});

it('rejects a claim if the deceased beneficiary belongs to a different subscription', function () {
    $user = User::factory()->create(['role' => 'member']);
    $member = Member::factory()->create(['user_id' => $user->id]);
    Subscription::factory()->create(['member_id' => $member->id, 'status' => 'approved']);

    // Create a deceased whose beneficiary belongs to a DIFFERENT subscription
    $otherSubscription = Subscription::factory()->create();
    $otherBeneficiary = Beneficiary::factory()->create(['subscription_id' => $otherSubscription->id]);
    $deceased = Deceased::factory()->create([
        'member_id' => $member->id,
        'beneficiary_id' => $otherBeneficiary->id,
    ]);
    $schedule = WakeSchedule::create([
        'deceased_id' => $deceased->id,
        'room_id' => WakeRoom::factory()->create()->id,
        'package_id' => WakePackage::factory()->create()->id,
        'date_start' => now()->subDays(3)->toDateString(),
        'date_end' => now()->toDateString(),
        'total_amount' => 50000,
        'status' => 'confirmed',
        'created_by' => $user->id,
    ]);

    $this->actingAs($user)
        ->post("/member/wake-schedules/{$schedule->id}/claim")
        ->assertForbidden();
});

it('rejects a duplicate claim for the same schedule', function () {
    ['user' => $user, 'subscription' => $subscription, 'schedule' => $schedule] = makeClaimableSchedule();

    InsuranceClaim::create([
        'schedule_id' => $schedule->id,
        'subscription_id' => $subscription->id,
        'status' => 'filed',
        'filed_at' => now(),
    ]);

    $this->actingAs($user)
        ->post("/member/wake-schedules/{$schedule->id}/claim")
        ->assertStatus(422);
});

it('rejects a claim for a schedule in a non-claimable status', function () {
    ['user' => $user, 'schedule' => $schedule] = makeClaimableSchedule();
    $schedule->update(['status' => 'pending']);

    $this->actingAs($user)
        ->post("/member/wake-schedules/{$schedule->id}/claim")
        ->assertStatus(422);
});

it('denies guests from filing a claim', function () {
    $schedule = WakeSchedule::factory()->create();

    $this->post("/member/wake-schedules/{$schedule->id}/claim")
        ->assertRedirect('/login');
});

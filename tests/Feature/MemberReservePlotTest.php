<?php

use App\Models\CemeteryPlot;
use App\Models\CemeterySection;
use App\Models\Deceased;
use App\Models\Member;
use App\Models\User;
use App\Models\WakePackage;
use App\Models\WakeRoom;
use App\Models\WakeSchedule;

function makeMemberWithSchedule(string $status = 'confirmed'): array
{
    $user = User::factory()->create(['role' => 'member']);
    $member = Member::factory()->create(['user_id' => $user->id]);
    $deceased = Deceased::factory()->create(['member_id' => $member->id]);
    $room = WakeRoom::factory()->create();
    $package = WakePackage::factory()->create();

    $schedule = WakeSchedule::create([
        'deceased_id' => $deceased->id,
        'room_id' => $room->id,
        'package_id' => $package->id,
        'date_start' => now()->toDateString(),
        'date_end' => now()->addDays(3)->toDateString(),
        'total_amount' => 10000,
        'status' => $status,
    ]);

    return compact('user', 'member', 'deceased', 'schedule');
}

it('reserves an available plot for a confirmed wake schedule', function () {
    ['user' => $user, 'schedule' => $schedule] = makeMemberWithSchedule('confirmed');

    $section = CemeterySection::factory()->create();
    $plot = CemeteryPlot::factory()->create([
        'section_id' => $section->id,
        'status' => 'available',
    ]);

    $this->actingAs($user)
        ->post("/member/wake-schedules/{$schedule->id}/reserve-plot", [
            'plot_id' => $plot->id,
        ])
        ->assertRedirect();

    expect($plot->fresh())
        ->status->toBe('reserved')
        ->deceased_id->toBe($schedule->deceased_id);
});

it('reserves a plot for an in_progress wake schedule', function () {
    ['user' => $user, 'schedule' => $schedule] = makeMemberWithSchedule('in_progress');

    $section = CemeterySection::factory()->create();
    $plot = CemeteryPlot::factory()->create([
        'section_id' => $section->id,
        'status' => 'available',
    ]);

    $this->actingAs($user)
        ->post("/member/wake-schedules/{$schedule->id}/reserve-plot", [
            'plot_id' => $plot->id,
        ])
        ->assertRedirect();

    expect($plot->fresh()->status)->toBe('reserved');
});

it('forbids reserving a plot for a pending schedule', function () {
    ['user' => $user, 'schedule' => $schedule] = makeMemberWithSchedule('pending');

    $section = CemeterySection::factory()->create();
    $plot = CemeteryPlot::factory()->create([
        'section_id' => $section->id,
        'status' => 'available',
    ]);

    $this->actingAs($user)
        ->post("/member/wake-schedules/{$schedule->id}/reserve-plot", [
            'plot_id' => $plot->id,
        ])
        ->assertForbidden();

    expect($plot->fresh()->status)->toBe('available');
});

it("forbids reserving a plot for another member's schedule", function () {
    ['schedule' => $schedule] = makeMemberWithSchedule('confirmed');

    $otherUser = User::factory()->create(['role' => 'member']);
    Member::factory()->create(['user_id' => $otherUser->id]);

    $section = CemeterySection::factory()->create();
    $plot = CemeteryPlot::factory()->create([
        'section_id' => $section->id,
        'status' => 'available',
    ]);

    $this->actingAs($otherUser)
        ->post("/member/wake-schedules/{$schedule->id}/reserve-plot", [
            'plot_id' => $plot->id,
        ])
        ->assertForbidden();

    expect($plot->fresh()->status)->toBe('available');
});

it('cannot reserve a plot that is already taken', function () {
    ['user' => $user, 'schedule' => $schedule] = makeMemberWithSchedule('confirmed');

    $section = CemeterySection::factory()->create();
    $plot = CemeteryPlot::factory()->create([
        'section_id' => $section->id,
        'status' => 'occupied',
    ]);

    $this->actingAs($user)
        ->post("/member/wake-schedules/{$schedule->id}/reserve-plot", [
            'plot_id' => $plot->id,
        ])
        ->assertStatus(422);
});

it('cannot reserve a second plot if one is already assigned to the deceased', function () {
    ['user' => $user, 'schedule' => $schedule, 'deceased' => $deceased] = makeMemberWithSchedule('confirmed');

    $section = CemeterySection::factory()->create();
    CemeteryPlot::factory()->create([
        'section_id' => $section->id,
        'status' => 'reserved',
        'deceased_id' => $deceased->id,
    ]);
    $anotherPlot = CemeteryPlot::factory()->create([
        'section_id' => $section->id,
        'status' => 'available',
    ]);

    $this->actingAs($user)
        ->post("/member/wake-schedules/{$schedule->id}/reserve-plot", [
            'plot_id' => $anotherPlot->id,
        ])
        ->assertStatus(422);

    expect($anotherPlot->fresh()->status)->toBe('available');
});

it('requires plot_id to be present', function () {
    ['user' => $user, 'schedule' => $schedule] = makeMemberWithSchedule('confirmed');

    $this->actingAs($user)
        ->post("/member/wake-schedules/{$schedule->id}/reserve-plot", [])
        ->assertSessionHasErrors(['plot_id']);
});

it('includes available sections on the wake schedules page', function () {
    ['user' => $user] = makeMemberWithSchedule('confirmed');

    $section = CemeterySection::factory()->create();
    CemeteryPlot::factory()->create(['section_id' => $section->id, 'status' => 'available']);

    $this->actingAs($user)
        ->get('/member/wake-schedules')
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('members/wake-schedules/index')
            ->has('availableSections')
        );
});

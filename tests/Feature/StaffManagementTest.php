<?php

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

function makeAdmin(): User
{
    return User::factory()->create(['role' => 'admin']);
}

function makeStaff(): User
{
    return User::factory()->create(['role' => 'staff']);
}

test('admin can view staff list', function () {
    $admin = makeAdmin();
    makeStaff();

    $this->actingAs($admin)
        ->get('/staff')
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('admin/staff/index')
            ->has('staff', 1)
        );
});

test('non-admin cannot view staff list', function () {
    $staff = makeStaff();

    $this->actingAs($staff)
        ->get('/staff')
        ->assertForbidden();
});

test('admin can create a staff member', function () {
    $admin = makeAdmin();

    $this->actingAs($admin)
        ->post('/staff', [
            'name' => 'New Staff',
            'email' => 'newstaff@example.com',
            'password' => 'password123',
            'password_confirmation' => 'password123',
        ])
        ->assertRedirect('/staff');

    $this->assertDatabaseHas('users', [
        'email' => 'newstaff@example.com',
        'role' => 'staff',
    ]);
});

test('admin can update a staff member', function () {
    $admin = makeAdmin();
    $staff = makeStaff();

    $this->actingAs($admin)
        ->put("/staff/{$staff->id}", [
            'name' => 'Updated Name',
            'email' => $staff->email,
            'password' => '',
            'password_confirmation' => '',
        ])
        ->assertRedirect('/staff');

    $this->assertDatabaseHas('users', [
        'id' => $staff->id,
        'name' => 'Updated Name',
    ]);
});

test('admin can delete a staff member', function () {
    $admin = makeAdmin();
    $staff = makeStaff();

    $this->actingAs($admin)
        ->delete("/staff/{$staff->id}")
        ->assertRedirect('/staff');

    $this->assertDatabaseMissing('users', ['id' => $staff->id]);
});

test('staff list only shows staff role users', function () {
    $admin = makeAdmin();
    User::factory()->create(['role' => 'member']);
    $staff1 = makeStaff();
    $staff2 = makeStaff();

    $this->actingAs($admin)
        ->get('/staff')
        ->assertInertia(fn ($page) => $page
            ->has('staff', 2)
        );
});

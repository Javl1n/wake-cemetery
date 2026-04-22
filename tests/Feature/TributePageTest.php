<?php

use App\Models\Deceased;
use App\Models\DeceasedObituary;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

uses(RefreshDatabase::class);

function makeDeceasedWithMember(): array
{
    $deceased = Deceased::factory()->create();
    $member = $deceased->member;
    $user = $member->user;
    $user->update(['role' => 'member']);

    return compact('deceased', 'member', 'user');
}

function makeObituary(Deceased $deceased, int $template = 1): DeceasedObituary
{
    return DeceasedObituary::create([
        'deceased_id' => $deceased->id,
        'template' => $template,
        'image' => 'obituaries/test.jpg',
        'description' => 'A loving soul.',
        'tribute_token' => Str::uuid()->toString(),
    ]);
}

// --- Member setup page ---

test('member can view obituary setup page', function () {
    ['deceased' => $deceased, 'user' => $user] = makeDeceasedWithMember();

    $this->actingAs($user)
        ->get("/member/deceased/{$deceased->id}/obituary/setup")
        ->assertOk()
        ->assertInertia(fn ($page) => $page->component('members/obituary/setup'));
});

test('member cannot view setup page for another member\'s deceased', function () {
    ['deceased' => $deceased] = makeDeceasedWithMember();
    ['user' => $otherUser] = makeDeceasedWithMember();

    $this->actingAs($otherUser)
        ->get("/member/deceased/{$deceased->id}/obituary/setup")
        ->assertForbidden();
});

test('guest cannot view obituary setup page', function () {
    ['deceased' => $deceased] = makeDeceasedWithMember();

    $this->get("/member/deceased/{$deceased->id}/obituary/setup")
        ->assertRedirectToRoute('login');
});

// --- Member store ---

test('member can create an obituary', function () {
    Storage::fake('public');
    ['deceased' => $deceased, 'user' => $user] = makeDeceasedWithMember();

    $this->actingAs($user)
        ->post("/member/deceased/{$deceased->id}/obituary", [
            'template' => 1,
            'image' => UploadedFile::fake()->image('cover.jpg'),
            'description' => 'Forever in our hearts.',
        ])
        ->assertRedirect();

    $this->assertDatabaseHas('deceased_obituaries', [
        'deceased_id' => $deceased->id,
        'template' => 1,
        'description' => 'Forever in our hearts.',
    ]);
});

test('member can update an existing obituary', function () {
    Storage::fake('public');
    ['deceased' => $deceased, 'user' => $user] = makeDeceasedWithMember();
    makeObituary($deceased, 1);

    $this->actingAs($user)
        ->post("/member/deceased/{$deceased->id}/obituary", [
            'template' => 2,
            'image' => UploadedFile::fake()->image('new.jpg'),
            'description' => 'Updated message.',
        ])
        ->assertRedirect();

    $this->assertDatabaseHas('deceased_obituaries', [
        'deceased_id' => $deceased->id,
        'template' => 2,
    ]);
    $this->assertDatabaseCount('deceased_obituaries', 1);
});

// --- Public tribute show ---

test('public can view a tribute page', function () {
    ['deceased' => $deceased] = makeDeceasedWithMember();
    $obituary = makeObituary($deceased, 1);

    $this->get("/tribute/{$obituary->tribute_token}")
        ->assertOk()
        ->assertInertia(fn ($page) => $page->component('tribute/template-1'));
});

test('tribute page shows correct data', function () {
    ['deceased' => $deceased] = makeDeceasedWithMember();
    $obituary = makeObituary($deceased, 2);

    $this->get("/tribute/{$obituary->tribute_token}")
        ->assertInertia(fn ($page) => $page
            ->component('tribute/template-2')
            ->where('obituary.id', $obituary->id)
            ->where('deceased.id', $deceased->id)
            ->has('tributes')
        );
});

test('tribute page returns 404 for unknown token', function () {
    $this->get('/tribute/not-a-real-token')->assertNotFound();
});

// --- Public tribute submission ---

test('anyone can submit a tribute', function () {
    Storage::fake('public');
    ['deceased' => $deceased] = makeDeceasedWithMember();
    $obituary = makeObituary($deceased);

    $this->post("/tribute/{$obituary->tribute_token}/tributes", [
        'uploader_name' => 'Maria Santos',
        'special_relations' => 'Friend',
        'image' => UploadedFile::fake()->image('photo.jpg'),
        'description' => 'Rest in peace.',
    ])->assertRedirect("/tribute/{$obituary->tribute_token}");

    $this->assertDatabaseHas('deceased_tributes', [
        'obituary_id' => $obituary->id,
        'uploader_name' => 'Maria Santos',
    ]);
});

test('tribute submission requires uploader name and image', function () {
    Storage::fake('public');
    ['deceased' => $deceased] = makeDeceasedWithMember();
    $obituary = makeObituary($deceased);

    $this->post("/tribute/{$obituary->tribute_token}/tributes", [])
        ->assertSessionHasErrors(['uploader_name', 'special_relations', 'image']);
});

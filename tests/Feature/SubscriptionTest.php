<?php

use App\Models\CemeteryPlot;
use App\Models\Insurance;
use App\Models\Member;
use App\Models\Subscription;

beforeEach(function () {
    $this->member = Member::factory()->create();
    $this->user = $this->member->user;
});

test('creating subscription with beneficiaries reserves plots for each beneficiary', function () {
    $insurance = Insurance::factory()->create(['beneficiaries' => 3]);

    CemeteryPlot::factory()->count(5)->create();

    $beneficiariesData = [
        [
            'name' => 'John Doe',
            'relationship' => 'Spouse',
            'contact' => '+639171234567',
            'date_of_birth' => '1990-05-15',
            'place_of_birth' => 'Manila, Philippines',
        ],
        [
            'name' => 'Jane Doe',
            'relationship' => 'Child',
            'contact' => '+639187654321',
            'date_of_birth' => '2015-08-20',
            'place_of_birth' => 'Quezon City, Philippines',
        ],
        [
            'name' => 'Jack Doe',
            'relationship' => 'Child',
            'contact' => '+639199876543',
            'date_of_birth' => '2018-03-10',
            'place_of_birth' => 'Makati, Philippines',
        ],
    ];

    $response = $this->actingAs($this->user)->post('/subscription', [
        'insurance' => $insurance->id,
        'beneficiaries' => $beneficiariesData,
    ]);

    $response->assertRedirect(route('members.welcome'));

    $subscription = Subscription::with('beneficiaries.reservedPlot')->first();

    expect($subscription)->not->toBeNull();
    expect($subscription->beneficiaries)->toHaveCount(3);

    foreach ($subscription->beneficiaries as $beneficiary) {
        expect($beneficiary->reservedPlot)->not->toBeNull();
        expect($beneficiary->reservedPlot->status)->toBe('reserved');
        expect($beneficiary->reservedPlot->beneficiary_id)->toBe($beneficiary->id);
    }

    expect(CemeteryPlot::available()->count())->toBe(2);
    expect(CemeteryPlot::reserved()->count())->toBe(3);
});

test('each beneficiary gets a unique plot', function () {
    $insurance = Insurance::factory()->create(['beneficiaries' => 2]);

    CemeteryPlot::factory()->count(3)->create();

    $beneficiariesData = [
        [
            'name' => 'Alice Smith',
            'relationship' => 'Parent',
            'contact' => '+639171111111',
            'date_of_birth' => '1960-01-01',
            'place_of_birth' => 'Cebu, Philippines',
        ],
        [
            'name' => 'Bob Smith',
            'relationship' => 'Parent',
            'contact' => '+639172222222',
            'date_of_birth' => '1962-02-02',
            'place_of_birth' => 'Davao, Philippines',
        ],
    ];

    $this->actingAs($this->user)->post('/subscription', [
        'insurance' => $insurance->id,
        'beneficiaries' => $beneficiariesData,
    ]);

    $subscription = Subscription::with('beneficiaries.reservedPlot')->first();

    $plotIds = $subscription->beneficiaries->map(fn ($b) => $b->reservedPlot->id)->toArray();

    expect($plotIds)->toHaveCount(2);
    expect(count($plotIds))->toBe(count(array_unique($plotIds)));
});

test('subscription without beneficiaries does not reserve any plots', function () {
    $insurance = Insurance::factory()->create(['beneficiaries' => 0]);

    CemeteryPlot::factory()->count(5)->create();

    $response = $this->actingAs($this->user)->post('/subscription', [
        'insurance' => $insurance->id,
        'beneficiaries' => [],
    ]);

    $response->assertRedirect(route('members.welcome'));

    $subscription = Subscription::first();

    expect($subscription)->not->toBeNull();
    expect($subscription->beneficiaries)->toHaveCount(0);
    expect(CemeteryPlot::available()->count())->toBe(5);
    expect(CemeteryPlot::reserved()->count())->toBe(0);
});

test('subscription reserves only available plots', function () {
    $insurance = Insurance::factory()->create(['beneficiaries' => 2]);

    CemeteryPlot::factory()->count(2)->create();
    CemeteryPlot::factory()->occupied()->count(3)->create();

    $beneficiariesData = [
        [
            'name' => 'Carol Brown',
            'relationship' => 'Sibling',
            'contact' => '+639173333333',
            'date_of_birth' => '1985-06-15',
            'place_of_birth' => 'Iloilo, Philippines',
        ],
        [
            'name' => 'Dave Brown',
            'relationship' => 'Sibling',
            'contact' => '+639174444444',
            'date_of_birth' => '1987-07-20',
            'place_of_birth' => 'Bacolod, Philippines',
        ],
    ];

    $this->actingAs($this->user)->post('/subscription', [
        'insurance' => $insurance->id,
        'beneficiaries' => $beneficiariesData,
    ]);

    expect(CemeteryPlot::available()->count())->toBe(0);
    expect(CemeteryPlot::reserved()->count())->toBe(2);
    expect(CemeteryPlot::occupied()->count())->toBe(3);
});

test('plot reservation sets correct beneficiary_id', function () {
    $insurance = Insurance::factory()->create(['beneficiaries' => 1]);

    CemeteryPlot::factory()->count(2)->create();

    $beneficiariesData = [
        [
            'name' => 'Eve Wilson',
            'relationship' => 'Spouse',
            'contact' => '+639175555555',
            'date_of_birth' => '1992-12-25',
            'place_of_birth' => 'Baguio, Philippines',
        ],
    ];

    $this->actingAs($this->user)->post('/subscription', [
        'insurance' => $insurance->id,
        'beneficiaries' => $beneficiariesData,
    ]);

    $subscription = Subscription::with('beneficiaries')->first();
    $beneficiary = $subscription->beneficiaries->first();

    $reservedPlot = CemeteryPlot::where('beneficiary_id', $beneficiary->id)->first();

    expect($reservedPlot)->not->toBeNull();
    expect($reservedPlot->beneficiary_id)->toBe($beneficiary->id);
    expect($reservedPlot->status)->toBe('reserved');
    expect($reservedPlot->deceased_id)->toBeNull();
});

test('subscription is created with pending status', function () {
    $insurance = Insurance::factory()->create(['beneficiaries' => 1]);

    CemeteryPlot::factory()->count(2)->create();

    $beneficiariesData = [
        [
            'name' => 'Frank Green',
            'relationship' => 'Other',
            'contact' => '+639176666666',
            'date_of_birth' => '2000-09-09',
            'place_of_birth' => 'Tacloban, Philippines',
        ],
    ];

    $this->actingAs($this->user)->post('/subscription', [
        'insurance' => $insurance->id,
        'beneficiaries' => $beneficiariesData,
    ]);

    $subscription = Subscription::first();

    expect($subscription->status)->toBe('pending');
    expect($subscription->member_id)->toBe($this->member->id);
    expect($subscription->insurance_id)->toBe($insurance->id);
});

test('when no plots available beneficiary still created but no plot reserved', function () {
    $insurance = Insurance::factory()->create(['beneficiaries' => 1]);

    CemeteryPlot::factory()->occupied()->count(2)->create();

    $beneficiariesData = [
        [
            'name' => 'Grace Lee',
            'relationship' => 'Child',
            'contact' => '+639177777777',
            'date_of_birth' => '2020-04-15',
            'place_of_birth' => 'Cagayan de Oro, Philippines',
        ],
    ];

    $response = $this->actingAs($this->user)->post('/subscription', [
        'insurance' => $insurance->id,
        'beneficiaries' => $beneficiariesData,
    ]);

    $response->assertRedirect(route('members.welcome'));

    $subscription = Subscription::with('beneficiaries')->first();

    expect($subscription)->not->toBeNull();
    expect($subscription->beneficiaries)->toHaveCount(1);

    $beneficiary = $subscription->beneficiaries->first();
    expect($beneficiary->reservedPlot)->toBeNull();
});

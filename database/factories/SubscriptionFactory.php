<?php

namespace Database\Factories;

use App\Models\Insurance;
use App\Models\Member;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Subscription>
 */
class SubscriptionFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'member_id' => Member::factory(),
            'insurance_id' => Insurance::factory(),
            'status' => 'approved',
            'reviewer_id' => \App\Models\User::factory(),
            'reviewed_at' => now(),
        ];
    }
}

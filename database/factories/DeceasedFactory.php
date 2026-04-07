<?php

namespace Database\Factories;

use App\Models\Beneficiary;
use App\Models\Member;
use App\Models\Subscription;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Deceased>
 */
class DeceasedFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        // Create the full relationship chain: User → Member → Subscription → Beneficiary
        $user = User::factory()->create();
        $member = Member::factory()->create(['user_id' => $user->id]);

        // Use an existing insurance, or create one if none exist
        $insurance = \App\Models\Insurance::inRandomOrder()->first();
        if (! $insurance) {
            $insurance = \App\Models\Insurance::factory()->create();
        }

        $subscription = Subscription::factory()->create([
            'member_id' => $member->id,
            'insurance_id' => $insurance->id,
        ]);
        $beneficiary = Beneficiary::factory()->create(['subscription_id' => $subscription->id]);

        return [
            'member_id' => $member->id,
            'beneficiary_id' => $beneficiary->id,
            'date_of_death' => fake()->dateTimeBetween('-5 years', 'now'),
            'cause_of_death' => fake()->sentence(),
        ];
    }
}

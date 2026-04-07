<?php

namespace Database\Factories;

use App\Models\Subscription;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Beneficiary>
 */
class BeneficiaryFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'subscription_id' => Subscription::factory(),
            'name' => fake()->name(),
            'relationship' => fake()->randomElement(['Spouse', 'Child', 'Parent', 'Sibling', 'Other']),
            'contact' => fake()->phoneNumber(),
            'date_of_birth' => fake()->date(),
            'place_of_birth' => fake()->city().', '.fake()->country(),
        ];
    }
}

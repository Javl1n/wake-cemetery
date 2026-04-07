<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Insurance>
 */
class InsuranceFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => fake()->unique()->words(3, true).' Plan',
            'description' => fake()->paragraph(),
            'beneficiaries' => fake()->numberBetween(1, 5),
            'premium' => fake()->randomFloat(2, 500, 5000),
            'frequency' => fake()->randomElement(['monthly', 'semi-anually', 'anually']),
        ];
    }
}

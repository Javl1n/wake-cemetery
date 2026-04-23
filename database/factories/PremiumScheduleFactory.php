<?php

namespace Database\Factories;

use App\Models\Subscription;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\PremiumSchedule>
 */
class PremiumScheduleFactory extends Factory
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
            'due_date' => fake()->dateTimeBetween('-6 months', '+6 months')->format('Y-m-d'),
            'due_amount' => fake()->randomFloat(2, 500, 5000),
            'status' => fake()->randomElement(['upcoming', 'paid', 'missed', 'late']),
        ];
    }

    public function paid(): static
    {
        return $this->state(['status' => 'paid']);
    }

    public function missed(): static
    {
        return $this->state(['status' => 'missed']);
    }

    public function upcoming(): static
    {
        return $this->state(['status' => 'upcoming']);
    }
}

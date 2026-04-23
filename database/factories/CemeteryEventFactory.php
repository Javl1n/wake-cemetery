<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\CemeteryEvent>
 */
class CemeteryEventFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $types = ['burial', 'anniversary', 'memorial', 'ceremony', 'other'];
        $colors = ['#ef4444', '#f97316', '#8b5cf6', '#0ea5e9', '#10b981'];

        $startsAt = now()->addHours(fake()->numberBetween(-24, 168));

        return [
            'title' => fake()->sentence(3),
            'type' => fake()->randomElement($types),
            'description' => fake()->optional()->sentence(),
            'latitude' => fake()->latitude(14.59, 14.61),
            'longitude' => fake()->longitude(120.97, 120.99),
            'starts_at' => $startsAt,
            'ends_at' => fake()->boolean(60) ? $startsAt->copy()->addHours(fake()->numberBetween(1, 72)) : null,
            'color' => fake()->randomElement($colors),
            'created_by_id' => User::factory(),
        ];
    }

    public function active(): static
    {
        return $this->state(fn () => [
            'starts_at' => now()->subHour(),
            'ends_at' => now()->addHours(3),
        ]);
    }
}

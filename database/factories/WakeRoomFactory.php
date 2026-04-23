<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\WakeRoom>
 */
class WakeRoomFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'code' => fake()->unique()->bothify('ROOM-##'),
            'name' => fake()->words(2, true),
            'description' => fake()->sentence(),
            'capacity' => fake()->numberBetween(20, 100),
            'hourly_rate' => fake()->randomFloat(2, 100, 500),
            'status' => 'active',
        ];
    }
}

<?php

namespace Database\Factories;

use App\Models\CemeterySection;
use App\Models\Deceased;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\CemeteryPlot>
 */
class CemeteryPlotFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'section_id' => CemeterySection::factory(),
            'deceased_id' => null,
            'plot_number' => fake()->unique()->bothify('??-###'),
            'latitude' => fake()->randomFloat(6, 6.2105, 6.2120),
            'longitude' => fake()->randomFloat(6, 125.0684, 125.0716),
            'status' => 'available',
            'burial_date' => null,
            'notes' => fake()->optional()->sentence(),
            'description' => fake()->optional()->sentence(),
        ];
    }

    /**
     * Indicate that the plot is occupied.
     */
    public function occupied(): static
    {
        return $this->state(fn (array $attributes) => [
            'deceased_id' => Deceased::factory(),
            'status' => 'occupied',
            'burial_date' => fake()->dateTimeBetween('-10 years', 'now'),
        ]);
    }

    /**
     * Indicate that the plot is reserved.
     */
    public function reserved(): static
    {
        return $this->state(fn (array $attributes) => [
            'beneficiary_id' => \App\Models\Beneficiary::factory(),
            'status' => 'reserved',
        ]);
    }

    /**
     * Indicate that the plot is flagged for maintenance.
     */
    public function maintenance(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'maintenance',
            'notes' => fake()->sentence(),
        ]);
    }
}

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
            'latitude' => fake()->latitude(14.5, 14.7),
            'longitude' => fake()->longitude(120.9, 121.1),
            'status' => 'available',
            'burial_date' => null,
            'notes' => fake()->optional()->sentence(),
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
}

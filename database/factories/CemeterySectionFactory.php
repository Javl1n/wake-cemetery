<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\CemeterySection>
 */
class CemeterySectionFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $sectionNames = [
            'Garden of Peace',
            'Memorial Gardens',
            'Veterans Section',
            'Children\'s Garden',
            'Family Estates',
            'Rose Garden',
            'Eternal Rest',
            'Sacred Grounds',
        ];

        $colors = [
            '#3b82f6', // blue
            '#10b981', // green
            '#f59e0b', // amber
            '#ef4444', // red
            '#8b5cf6', // purple
            '#ec4899', // pink
            '#06b6d4', // cyan
            '#84cc16', // lime
        ];

        $name = fake()->randomElement($sectionNames);
        $code = 'SEC-'.strtoupper(fake()->unique()->bothify('??#'));

        return [
            'name' => $name,
            'code' => $code,
            'description' => fake()->sentence(),
            'color' => fake()->randomElement($colors),
            'total_plots' => 50,
            'available_plots' => fake()->numberBetween(10, 45),
        ];
    }

    public function withPolygon(): static
    {
        return $this->state(fn (array $attributes) => [
            'geometry' => [
                'type' => 'Feature',
                'geometry' => [
                    'type' => 'Polygon',
                    'coordinates' => [[
                        [120.984, 14.599],
                        [120.985, 14.599],
                        [120.985, 14.600],
                        [120.984, 14.600],
                        [120.984, 14.599],
                    ]],
                ],
                'properties' => [
                    'geometryType' => 'polygon',
                ],
            ],
            'geometry_type' => 'polygon',
        ]);
    }

    public function withLine(): static
    {
        return $this->state(fn (array $attributes) => [
            'geometry' => [
                'type' => 'Feature',
                'geometry' => [
                    'type' => 'LineString',
                    'coordinates' => [
                        [120.984, 14.599],
                        [120.985, 14.600],
                    ],
                ],
                'properties' => [
                    'geometryType' => 'line',
                ],
            ],
            'geometry_type' => 'line',
        ]);
    }
}

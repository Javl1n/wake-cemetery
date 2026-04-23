<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\VisitorLog>
 */
class VisitorLogFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        // Cemetery center from config for near/far factory states
        $cemeteryLat = (float) config('cemetery.center.latitude', 14.5995);
        $cemeteryLng = (float) config('cemetery.center.longitude', 120.9842);

        return [
            'ip_address' => $this->faker->ipv4(),
            'visited_on' => today(),
            'latitude' => $cemeteryLat + $this->faker->randomFloat(5, -0.01, 0.01),
            'longitude' => $cemeteryLng + $this->faker->randomFloat(5, -0.01, 0.01),
            'is_near_cemetery' => false,
        ];
    }
}

<?php

namespace Database\Factories;

use App\Models\Deceased;
use App\Models\User;
use App\Models\WakePackage;
use App\Models\WakeRoom;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\WakeSchedule>
 */
class WakeScheduleFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'deceased_id' => Deceased::factory(),
            'room_id' => WakeRoom::factory(),
            'package_id' => WakePackage::factory(),
            'date_start' => now()->subDays(3)->toDateString(),
            'date_end' => now()->toDateString(),
            'total_amount' => fake()->randomFloat(2, 10000, 100000),
            'status' => 'confirmed',
            'created_by' => User::factory(),
        ];
    }
}

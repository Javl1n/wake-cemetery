<?php

namespace Database\Factories;

use App\Models\Subscription;
use App\Models\WakeSchedule;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\InsuranceClaim>
 */
class InsuranceClaimFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'schedule_id' => WakeSchedule::factory(),
            'subscription_id' => Subscription::factory(),
            'status' => 'filed',
            'filed_at' => now(),
        ];
    }
}

<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Member>
 */
class MemberFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            "user_id" => User::factory()->state([
                'role' => 'member'
            ]),
            "sex" => fake()->boolean(),
            "date_of_birth" => fake()->date(max: now()->subYear(18)),
            "civil_status" => fake()->randomElement(['single', 'married', 'divorced', 'widowed']),
            "phone" => fake()->phoneNumber(),
            "address" => fake()->address(),
            "nationality" => "Filipino",
        ];
    }
}

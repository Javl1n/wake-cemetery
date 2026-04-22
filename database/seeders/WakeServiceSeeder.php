<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class WakeServiceSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $services = [
            [
                'name' => 'Embalming Service',
                'description' => 'Professional embalming to preserve the deceased',
                'price' => 8000.00,
            ],
            [
                'name' => 'Flower Arrangement',
                'description' => 'Beautiful floral arrangements and wreaths',
                'price' => 3000.00,
            ],
            [
                'name' => 'Catering Service',
                'description' => 'Food and beverage service for guests',
                'price' => 10000.00,
            ],
            [
                'name' => 'Video Tribute',
                'description' => 'Professional video tribute presentation',
                'price' => 2000.00,
            ],
        ];

        foreach ($services as $service) {
            \App\Models\WakeService::create($service);
        }
    }
}

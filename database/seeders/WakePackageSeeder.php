<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class WakePackageSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $packages = [
            [
                'name' => 'Basic Package',
                'description' => 'Essential wake services including basic room rental and viewing arrangements',
                'base_price' => 15000.00,
                'is_active' => true,
            ],
            [
                'name' => 'Premium Package',
                'description' => 'Enhanced wake services with embalming, upgraded casket, and floral arrangements',
                'base_price' => 35000.00,
                'is_active' => true,
            ],
            [
                'name' => 'Deluxe Package',
                'description' => 'Complete wake services with all amenities, catering, and video tribute',
                'base_price' => 50000.00,
                'is_active' => true,
            ],
        ];

        foreach ($packages as $package) {
            \App\Models\WakePackage::create($package);
        }
    }
}

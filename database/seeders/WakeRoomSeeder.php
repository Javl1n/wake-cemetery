<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class WakeRoomSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $rooms = [
            [
                'code' => 'CHA',
                'name' => 'Chapel A',
                'description' => 'Main chapel with air conditioning and complete sound system',
                'capacity' => 100,
                'features' => json_encode(['Air Conditioned', 'Sound System', 'LCD Screen', 'Parking']),
                'hourly_rate' => 2000.00,
                'status' => 'active',
            ],
            [
                'code' => 'CHB',
                'name' => 'Chapel B',
                'description' => 'Smaller chapel with garden view',
                'capacity' => 50,
                'features' => json_encode(['Air Conditioned', 'Garden View', 'Sound System']),
                'hourly_rate' => 1500.00,
                'status' => 'active',
            ],
            [
                'code' => 'VR1',
                'name' => 'Viewing Room 1',
                'description' => 'Intimate viewing room for smaller gatherings',
                'capacity' => 30,
                'features' => json_encode(['Air Conditioned', 'Private Entrance']),
                'hourly_rate' => 1000.00,
                'status' => 'active',
            ],
        ];

        foreach ($rooms as $room) {
            \App\Models\WakeRoom::create($room);
        }
    }
}

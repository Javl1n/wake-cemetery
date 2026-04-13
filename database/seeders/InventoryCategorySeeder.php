<?php

namespace Database\Seeders;

use App\Models\InventoryCategory;
use Illuminate\Database\Seeder;

class InventoryCategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            'Caskets & Urns',
            'Embalming Supplies',
            'Floral Arrangements',
            'Funeral Attire',
            'Catering & Reception',
            'Memorial Stationery',
            'Lighting & Candles',
            'Audio & Visual Equipment',
        ];

        foreach ($categories as $name) {
            InventoryCategory::create(['name' => $name]);
        }
    }
}

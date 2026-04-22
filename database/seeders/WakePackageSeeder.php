<?php

namespace Database\Seeders;

use App\Models\InventoryItem;
use App\Models\WakePackage;
use App\Models\WakeService;
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
                'services' => [
                    'Casket Purchase',
                ],
                'items' => [
                    ['name' => 'Hardwood Casket', 'quantity' => 1],
                    ['name' => 'Condolence Wreath (Small)', 'quantity' => 1],
                    ['name' => 'Pillar Candle Set (6 pcs)', 'quantity' => 1],
                    ['name' => 'Death Notice Cards (50 pcs)', 'quantity' => 1],
                    ['name' => 'Condolence Book', 'quantity' => 1],
                ],
            ],
            [
                'name' => 'Premium Package',
                'description' => 'Enhanced wake services with embalming, upgraded casket, and floral arrangements',
                'base_price' => 35000.00,
                'is_active' => true,
                'services' => [
                    'Embalming Service',
                    'Casket Purchase',
                    'Flower Arrangement',
                ],
                'items' => [
                    ['name' => 'Mahogany Casket', 'quantity' => 1],
                    ['name' => 'Embalming Fluid (1L)', 'quantity' => 2],
                    ['name' => 'Cavity Treatment Kit', 'quantity' => 1],
                    ['name' => 'Cosmetic Set', 'quantity' => 1],
                    ['name' => 'Condolence Wreath (Large)', 'quantity' => 1],
                    ['name' => 'Casket Spray', 'quantity' => 1],
                    ['name' => 'Pillar Candle Set (6 pcs)', 'quantity' => 2],
                    ['name' => 'Memorial Program Booklet', 'quantity' => 1],
                    ['name' => 'Condolence Book', 'quantity' => 1],
                    ['name' => 'Memorial Frame', 'quantity' => 1],
                ],
            ],
            [
                'name' => 'Deluxe Package',
                'description' => 'Complete wake services with all amenities, catering, and video tribute',
                'base_price' => 50000.00,
                'is_active' => true,
                'services' => [
                    'Embalming Service',
                    'Casket Purchase',
                    'Flower Arrangement',
                    'Catering Service',
                    'Video Tribute',
                ],
                'items' => [
                    ['name' => 'Mahogany Casket', 'quantity' => 1],
                    ['name' => 'Embalming Fluid (1L)', 'quantity' => 2],
                    ['name' => 'Cavity Treatment Kit', 'quantity' => 1],
                    ['name' => 'Cosmetic Set', 'quantity' => 1],
                    ['name' => 'Condolence Wreath (Large)', 'quantity' => 2],
                    ['name' => 'Casket Spray', 'quantity' => 1],
                    ['name' => 'Flower Basket', 'quantity' => 2],
                    ['name' => 'Candelabra (pair)', 'quantity' => 1],
                    ['name' => 'Pillar Candle Set (6 pcs)', 'quantity' => 2],
                    ['name' => 'Buffet Meal (per head)', 'quantity' => 50],
                    ['name' => 'Coffee & Snacks Set', 'quantity' => 50],
                    ['name' => 'Drinking Water (Dispenser)', 'quantity' => 1],
                    ['name' => 'PA System Rental', 'quantity' => 1],
                    ['name' => 'LED Display Rental', 'quantity' => 1],
                    ['name' => 'Video Tribute Service', 'quantity' => 1],
                    ['name' => 'Memorial Program Booklet', 'quantity' => 1],
                    ['name' => 'Condolence Book', 'quantity' => 1],
                    ['name' => 'Memorial Frame', 'quantity' => 1],
                ],
            ],
        ];

        foreach ($packages as $data) {
            $package = WakePackage::create([
                'name' => $data['name'],
                'description' => $data['description'],
                'base_price' => $data['base_price'],
                'is_active' => $data['is_active'],
            ]);

            $serviceIds = WakeService::whereIn('name', $data['services'])->pluck('id');
            $package->services()->attach($serviceIds);

            $itemPivot = [];
            foreach ($data['items'] as $itemData) {
                $item = InventoryItem::where('name', $itemData['name'])->first();
                if ($item) {
                    $itemPivot[$item->id] = ['quantity' => $itemData['quantity']];
                }
            }
            $package->items()->attach($itemPivot);
        }
    }
}

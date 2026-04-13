<?php

namespace Database\Seeders;

use App\Models\InventoryCategory;
use App\Models\InventoryItem;
use Illuminate\Database\Seeder;

class InventoryItemSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $items = [
            'Caskets & Urns' => [
                ['name' => 'Mahogany Casket', 'description' => 'Premium solid mahogany casket with velvet interior lining', 'price' => 25000, 'stock' => 5, 'unit' => 'pcs'],
                ['name' => 'Hardwood Casket', 'description' => 'Standard hardwood casket with satin interior', 'price' => 12000, 'stock' => 8, 'unit' => 'pcs'],
                ['name' => 'Metal Casket', 'description' => 'Stainless steel casket, rust-resistant with foam padding', 'price' => 18000, 'stock' => 4, 'unit' => 'pcs'],
                ['name' => 'Cremation Urn', 'description' => 'Ceramic urn for ashes, available in various designs', 'price' => 2500, 'stock' => 20, 'unit' => 'pcs'],
                ['name' => 'Biodegradable Casket', 'description' => 'Eco-friendly wicker casket for green burials', 'price' => 8000, 'stock' => 3, 'unit' => 'pcs'],
            ],
            'Embalming Supplies' => [
                ['name' => 'Embalming Fluid (1L)', 'description' => 'Standard formaldehyde-based embalming fluid', 'price' => 350, 'stock' => 50, 'unit' => 'bottles'],
                ['name' => 'Cavity Treatment Kit', 'description' => 'Complete kit for cavity embalming procedures', 'price' => 800, 'stock' => 30, 'unit' => 'kits'],
                ['name' => 'Cosmetic Set', 'description' => 'Professional mortuary cosmetics for restorative work', 'price' => 1200, 'stock' => 15, 'unit' => 'sets'],
                ['name' => 'Embalming Table Liner', 'description' => 'Disposable waterproof liners for embalming tables', 'price' => 120, 'stock' => 100, 'unit' => 'pcs'],
            ],
            'Floral Arrangements' => [
                ['name' => 'Condolence Wreath (Large)', 'description' => 'Large standing wreath with white lilies and chrysanthemums', 'price' => 3500, 'stock' => 10, 'unit' => 'pcs'],
                ['name' => 'Condolence Wreath (Small)', 'description' => 'Small standing wreath, suitable for tabletop display', 'price' => 1800, 'stock' => 15, 'unit' => 'pcs'],
                ['name' => 'Casket Spray', 'description' => 'Full-length floral spray arranged to rest on the casket', 'price' => 4500, 'stock' => 8, 'unit' => 'pcs'],
                ['name' => 'Flower Basket', 'description' => 'Assorted fresh flowers in a basket arrangement', 'price' => 1200, 'stock' => 20, 'unit' => 'pcs'],
            ],
            'Funeral Attire' => [
                ['name' => 'Burial Gown (Female)', 'description' => 'White satin burial gown, available in all sizes', 'price' => 950, 'stock' => 25, 'unit' => 'pcs'],
                ['name' => 'Burial Suit (Male)', 'description' => 'Classic black burial suit with tie, all sizes available', 'price' => 1500, 'stock' => 20, 'unit' => 'pcs'],
                ['name' => 'Infant Burial Set', 'description' => 'White clothing set for infant burial', 'price' => 650, 'stock' => 10, 'unit' => 'sets'],
            ],
            'Catering & Reception' => [
                ['name' => 'Buffet Meal (per head)', 'description' => 'Full buffet service including rice, viand, soup, and drinks', 'price' => 350, 'stock' => 500, 'unit' => 'pax'],
                ['name' => 'Coffee & Snacks Set', 'description' => 'Brewed coffee, pastries, and light snacks for overnight vigil', 'price' => 150, 'stock' => 200, 'unit' => 'pax'],
                ['name' => 'Drinking Water (Dispenser)', 'description' => 'Purified water dispenser rental with 2 refill jugs', 'price' => 500, 'stock' => 10, 'unit' => 'units'],
            ],
            'Memorial Stationery' => [
                ['name' => 'Death Notice Cards (50 pcs)', 'description' => 'Printed death notice cards with customizable text', 'price' => 800, 'stock' => 30, 'unit' => 'sets'],
                ['name' => 'Memorial Program Booklet', 'description' => 'Folded booklet with order of service and tributes', 'price' => 1200, 'stock' => 25, 'unit' => 'sets'],
                ['name' => 'Condolence Book', 'description' => 'Guest signing book with ribbon bookmark', 'price' => 450, 'stock' => 40, 'unit' => 'pcs'],
                ['name' => 'Memorial Frame', 'description' => 'Wooden display frame for deceased portrait', 'price' => 600, 'stock' => 20, 'unit' => 'pcs'],
            ],
            'Lighting & Candles' => [
                ['name' => 'Pillar Candle Set (6 pcs)', 'description' => 'White pillar candles in various heights for altar display', 'price' => 480, 'stock' => 50, 'unit' => 'sets'],
                ['name' => 'Candelabra (pair)', 'description' => 'Ornate metal candelabra, holds 5 candles each', 'price' => 1500, 'stock' => 8, 'unit' => 'pairs'],
                ['name' => 'LED Candles (12 pcs)', 'description' => 'Flameless flickering LED candles, battery-operated', 'price' => 750, 'stock' => 30, 'unit' => 'sets'],
                ['name' => 'Memorial Lamp', 'description' => 'Decorative electric memorial lamp with warm-white bulb', 'price' => 900, 'stock' => 15, 'unit' => 'pcs'],
            ],
            'Audio & Visual Equipment' => [
                ['name' => 'PA System Rental', 'description' => 'Sound system with microphone for eulogies and music playback', 'price' => 2500, 'stock' => 5, 'unit' => 'units'],
                ['name' => 'LED Display Rental', 'description' => '55" LED screen for photo slideshow or video tribute', 'price' => 3000, 'stock' => 3, 'unit' => 'units'],
                ['name' => 'Photo Slideshow Service', 'description' => 'Production of photo memorial slideshow with background music', 'price' => 1800, 'stock' => 999, 'unit' => 'service'],
                ['name' => 'Video Tribute Service', 'description' => 'Professionally edited video tribute (up to 5 minutes)', 'price' => 4500, 'stock' => 999, 'unit' => 'service'],
            ],
        ];

        foreach ($items as $categoryName => $categoryItems) {
            $category = InventoryCategory::where('name', $categoryName)->first();

            if (! $category) {
                continue;
            }

            foreach ($categoryItems as $item) {
                InventoryItem::create([
                    'category_id' => $category->id,
                    'name' => $item['name'],
                    'description' => $item['description'],
                    'price' => $item['price'],
                    'stock' => $item['stock'],
                    'unit' => $item['unit'],
                    'available' => true,
                    'image' => '',
                ]);
            }
        }
    }
}

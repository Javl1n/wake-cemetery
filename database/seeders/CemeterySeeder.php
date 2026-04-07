<?php

namespace Database\Seeders;

use App\Models\CemeteryPlot;
use App\Models\CemeterySection;
use Illuminate\Database\Seeder;

class CemeterySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create 5 cemetery sections
        $sections = CemeterySection::factory()->count(5)->create();

        // For each section, create 10 plots
        foreach ($sections as $section) {
            // Create 7 occupied plots with deceased info
            CemeteryPlot::factory()
                ->count(7)
                ->occupied()
                ->create([
                    'section_id' => $section->id,
                ]);

            // Create 3 available plots
            CemeteryPlot::factory()
                ->count(3)
                ->create([
                    'section_id' => $section->id,
                    'status' => 'available',
                ]);
        }

        // Update section plot counts
        foreach ($sections as $section) {
            $section->update([
                'total_plots' => $section->plots()->count(),
                'available_plots' => $section->plots()->where('status', 'available')->count(),
            ]);
        }
    }
}

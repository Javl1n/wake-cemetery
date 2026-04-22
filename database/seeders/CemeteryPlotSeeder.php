<?php

namespace Database\Seeders;

use App\Models\CemeteryPlot;
use App\Models\CemeterySection;
use Illuminate\Database\Seeder;

class CemeteryPlotSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        CemeteryPlot::query()->delete();

        $sections = CemeterySection::all();

        foreach ($sections as $section) {
            $total = $section->total_plots;
            $code = str_replace('SEC-', '', $section->code);

            $occupiedCount = (int) round($total * 0.45);
            $reservedCount = (int) round($total * 0.15);
            $maintenanceCount = (int) round($total * 0.05);
            $availableCount = $total - $occupiedCount - $reservedCount - $maintenanceCount;

            $plotNumber = 1;

            $nextPlotNumber = function () use ($code, &$plotNumber): array {
                return ['plot_number' => sprintf('%s-%03d', $code, $plotNumber++)];
            };

            CemeteryPlot::factory()
                ->count($occupiedCount)
                ->occupied()
                ->sequence($nextPlotNumber)
                ->create(['section_id' => $section->id]);

            CemeteryPlot::factory()
                ->count($reservedCount)
                ->reserved()
                ->sequence($nextPlotNumber)
                ->create(['section_id' => $section->id]);

            CemeteryPlot::factory()
                ->count($maintenanceCount)
                ->maintenance()
                ->sequence($nextPlotNumber)
                ->create(['section_id' => $section->id]);

            CemeteryPlot::factory()
                ->count($availableCount)
                ->sequence($nextPlotNumber)
                ->create(['section_id' => $section->id, 'status' => 'available']);

            $section->update([
                'available_plots' => $section->plots()->where('status', 'available')->count(),
            ]);
        }
    }
}

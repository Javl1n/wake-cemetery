<?php

namespace Database\Seeders;

use App\Models\CemeterySection;
use Illuminate\Database\Seeder;

class CemeterySectionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Cemetery center: 6.211276, 125.06999
        // Sections arranged in a 4×2 grid, each ~80m × 78m with ~11m gaps.
        // GeoJSON coordinates are [longitude, latitude].

        $sections = [
            [
                'name' => 'Garden of Peace',
                'code' => 'SEC-GP',
                'description' => 'A serene garden area dedicated to those who lived peaceful lives, surrounded by lush greenery and flowering plants.',
                'color' => '#10b981',
                'total_plots' => 60,
                'available_plots' => 60,
                'geometry_type' => 'polygon',
                'geometry' => $this->makePolygon(125.06838, 125.06911, 6.21133, 6.21203),
            ],
            [
                'name' => 'Veterans Section',
                'code' => 'SEC-VT',
                'description' => 'A dedicated section honoring the brave men and women who served in the armed forces.',
                'color' => '#3b82f6',
                'total_plots' => 50,
                'available_plots' => 50,
                'geometry_type' => 'polygon',
                'geometry' => $this->makePolygon(125.06921, 125.06994, 6.21133, 6.21203),
            ],
            [
                'name' => 'Children\'s Garden',
                'code' => 'SEC-CG',
                'description' => 'A gentle, lovingly maintained section reserved for infants and young children, adorned with angels and soft floral tributes.',
                'color' => '#ec4899',
                'total_plots' => 30,
                'available_plots' => 30,
                'geometry_type' => 'polygon',
                'geometry' => $this->makePolygon(125.07004, 125.07077, 6.21133, 6.21203),
            ],
            [
                'name' => 'Family Estates',
                'code' => 'SEC-FE',
                'description' => 'Spacious family plots designed to keep loved ones together for eternity.',
                'color' => '#f59e0b',
                'total_plots' => 40,
                'available_plots' => 40,
                'geometry_type' => 'polygon',
                'geometry' => $this->makePolygon(125.07087, 125.07160, 6.21133, 6.21203),
            ],
            [
                'name' => 'Rose Garden',
                'code' => 'SEC-RG',
                'description' => 'A beautifully landscaped section lined with rose bushes, offering a peaceful and fragrant resting place.',
                'color' => '#ef4444',
                'total_plots' => 45,
                'available_plots' => 45,
                'geometry_type' => 'polygon',
                'geometry' => $this->makePolygon(125.06838, 125.06911, 6.21053, 6.21123),
            ],
            [
                'name' => 'Sacred Grounds',
                'code' => 'SEC-SG',
                'description' => 'A blessed section set aside for those of deep religious faith, with regular blessings and ceremonies held on the grounds.',
                'color' => '#8b5cf6',
                'total_plots' => 55,
                'available_plots' => 55,
                'geometry_type' => 'polygon',
                'geometry' => $this->makePolygon(125.06921, 125.06994, 6.21053, 6.21123),
            ],
            [
                'name' => 'Memorial Gardens',
                'code' => 'SEC-MG',
                'description' => 'A commemorative area featuring memorial walls and inscribed benches for quiet reflection and remembrance.',
                'color' => '#06b6d4',
                'total_plots' => 50,
                'available_plots' => 50,
                'geometry_type' => 'polygon',
                'geometry' => $this->makePolygon(125.07004, 125.07077, 6.21053, 6.21123),
            ],
            [
                'name' => 'Eternal Rest',
                'code' => 'SEC-ER',
                'description' => 'A tranquil hillside section offering scenic views, ideal for those who cherished the beauty of nature.',
                'color' => '#84cc16',
                'total_plots' => 35,
                'available_plots' => 35,
                'geometry_type' => 'polygon',
                'geometry' => $this->makePolygon(125.07087, 125.07160, 6.21053, 6.21123),
            ],
        ];

        foreach ($sections as $section) {
            CemeterySection::updateOrCreate(
                ['code' => $section['code']],
                $section
            );
        }
    }

    /**
     * Build a GeoJSON Feature polygon from bounding box coordinates.
     *
     * @return array<string, mixed>
     */
    private function makePolygon(float $lngL, float $lngR, float $latB, float $latT): array
    {
        return [
            'type' => 'Feature',
            'geometry' => [
                'type' => 'Polygon',
                'coordinates' => [[
                    [$lngL, $latT],
                    [$lngR, $latT],
                    [$lngR, $latB],
                    [$lngL, $latB],
                    [$lngL, $latT],
                ]],
            ],
            'properties' => [
                'geometryType' => 'polygon',
            ],
        ];
    }
}

<?php

namespace App\Http\Controllers;

use App\Models\CemeteryPlot;
use App\Models\CemeterySection;

class CemeteryMaintenanceController extends Controller
{
    /**
     * Display the cemetery maintenance management page.
     */
    public function index()
    {
        $sections = CemeterySection::withCount(['plots', 'occupiedPlots'])->get();

        $plots = CemeteryPlot::with([
            'section:id,name,code,color',
            'deceased:id,beneficiary_id,date_of_death',
            'deceased.beneficiary:id,name',
        ])
            ->get()
            ->map(function ($plot) {
                return [
                    'id' => $plot->id,
                    'plot_number' => $plot->plot_number,
                    'latitude' => (float) $plot->latitude,
                    'longitude' => (float) $plot->longitude,
                    'status' => $plot->status,
                    'burial_date' => $plot->burial_date?->format('F d, Y'),
                    'notes' => $plot->notes,
                    'section' => [
                        'id' => $plot->section->id,
                        'name' => $plot->section->name,
                        'code' => $plot->section->code,
                        'color' => $plot->section->color,
                    ],
                    'deceased' => $plot->deceased ? [
                        'id' => $plot->deceased->id,
                        'name' => $plot->deceased->beneficiary->name,
                        'date_of_death' => $plot->deceased->date_of_death->format('F d, Y'),
                    ] : null,
                ];
            });

        return inertia()->render('admin/cemetery-maintenance/index', [
            'sections' => $sections,
            'plots' => $plots,
            'mapboxToken' => config('services.mapbox.token'),
            'centerCoordinates' => [
                'lat' => config('cemetery.center.latitude', 14.5995),
                'lng' => config('cemetery.center.longitude', 120.9842),
            ],
            'initialZoom' => config('cemetery.zoom', 16),
        ]);
    }
}

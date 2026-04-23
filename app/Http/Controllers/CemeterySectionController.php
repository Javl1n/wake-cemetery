<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreCemeterySectionRequest;
use App\Http\Requests\UpdateCemeterySectionRequest;
use App\Models\CemeteryPlot;
use App\Models\CemeterySection;
use Illuminate\Support\Facades\Gate;

class CemeterySectionController extends Controller
{
    /**
     * Display a listing of cemetery sections with map.
     */
    public function index()
    {
        Gate::authorize('viewAny', CemeterySection::class);

        $sections = CemeterySection::withCount(['plots', 'occupiedPlots'])->get();

        $plots = CemeteryPlot::with([
            'section:id,name,code,color',
            'deceased:id,beneficiary_id,date_of_death',
            'deceased.beneficiary:id,name',
        ])
            ->where('status', 'occupied')
            ->get()
            ->map(function ($plot) {
                return [
                    'id' => $plot->id,
                    'plot_number' => $plot->plot_number,
                    'latitude' => (float) $plot->latitude,
                    'longitude' => (float) $plot->longitude,
                    'status' => $plot->status,
                    'burial_date' => $plot->burial_date?->format('F d, Y'),
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

        return inertia()->render('admin/cemetery-sections/index', [
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

    /**
     * Store a newly created cemetery section.
     */
    public function store(StoreCemeterySectionRequest $request)
    {
        CemeterySection::create($request->validated());

        return redirect()->route('cemetery-sections.index')->with('success', 'Cemetery section created successfully');
    }

    /**
     * Update the specified cemetery section.
     */
    public function update(UpdateCemeterySectionRequest $request, CemeterySection $cemeterySection)
    {
        $cemeterySection->update($request->validated());

        return redirect()->route('cemetery-sections.index')->with('success', 'Cemetery section updated successfully');
    }

    /**
     * Remove the specified cemetery section.
     */
    public function destroy(CemeterySection $cemeterySection)
    {
        Gate::authorize('delete', $cemeterySection);

        $cemeterySection->delete();

        return redirect()->route('cemetery-sections.index')->with('success', 'Cemetery section deleted successfully');
    }
}

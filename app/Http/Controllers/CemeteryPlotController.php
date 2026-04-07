<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreCemeteryPlotRequest;
use App\Http\Requests\UpdateCemeteryPlotRequest;
use App\Models\CemeteryPlot;
use App\Models\CemeterySection;
use App\Models\Deceased;
use Illuminate\Support\Facades\Gate;

class CemeteryPlotController extends Controller
{
    /**
     * Display a listing of cemetery plots with map.
     */
    public function index()
    {
        Gate::authorize('viewAny', CemeteryPlot::class);

        $sections = CemeterySection::withCount(['plots', 'occupiedPlots'])->get();

        // Load ALL plots (not just occupied) for admin view
        $plots = CemeteryPlot::with([
            'section:id,name,code,color',
            'deceased.member.user:id,name',
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
                        'name' => $plot->deceased->member?->user?->name ?? 'Unknown',
                        'date_of_death' => $plot->deceased->date_of_death->format('F d, Y'),
                    ] : null,
                ];
            });

        // Load deceased list for form dropdown
        $deceased = Deceased::with('member.user')->get()->map(function ($d) {
            return [
                'id' => $d->id,
                'name' => $d->member?->user?->name ?? 'Unknown',
                'date_of_death' => $d->date_of_death->format('F d, Y'),
            ];
        });

        return inertia()->render('admin/cemetery-plots/index', [
            'sections' => $sections,
            'plots' => $plots,
            'deceased' => $deceased,
            'mapboxToken' => config('services.mapbox.token'),
            'centerCoordinates' => [
                'lat' => config('cemetery.center.latitude', 14.5995),
                'lng' => config('cemetery.center.longitude', 120.9842),
            ],
            'initialZoom' => config('cemetery.zoom', 16),
        ]);
    }

    /**
     * Store a newly created cemetery plot.
     */
    public function store(StoreCemeteryPlotRequest $request)
    {
        CemeteryPlot::create($request->validated());

        return redirect()->route('cemetery-plots.index')->with('success', 'Cemetery plot created successfully');
    }

    /**
     * Update the specified cemetery plot.
     */
    public function update(UpdateCemeteryPlotRequest $request, CemeteryPlot $cemeteryPlot)
    {
        $cemeteryPlot->update($request->validated());

        return redirect()->route('cemetery-plots.index')->with('success', 'Cemetery plot updated successfully');
    }

    /**
     * Remove the specified cemetery plot.
     */
    public function destroy(CemeteryPlot $cemeteryPlot)
    {
        Gate::authorize('delete', $cemeteryPlot);

        $cemeteryPlot->delete();

        return redirect()->route('cemetery-plots.index')->with('success', 'Cemetery plot deleted successfully');
    }
}

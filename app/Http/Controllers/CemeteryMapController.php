<?php

namespace App\Http\Controllers;

use App\Models\CemeteryPlot;
use App\Models\CemeterySection;
use Illuminate\Http\Request;

class CemeteryMapController extends Controller
{
    /**
     * Display the cemetery map (public access).
     */
    public function index()
    {
        $sections = CemeterySection::withCount(['plots', 'occupiedPlots'])
            ->orderBy('code')
            ->get();

        return inertia()->render('cemetery/map', [
            'sections' => $sections,
            'mapboxToken' => config('services.mapbox.token'),
            'centerCoordinates' => [
                'lat' => config('cemetery.center.latitude', 14.5995),
                'lng' => config('cemetery.center.longitude', 120.9842),
            ],
            'initialZoom' => config('cemetery.zoom', 16),
        ]);
    }

    /**
     * Display a section's plot grid (public access).
     */
    public function section(CemeterySection $section)
    {
        $section->loadCount(['plots', 'occupiedPlots']);

        $plots = $section->plots()
            ->with([
                'deceased.member.user:id,name',
                'beneficiary:id,name',
            ])
            ->orderBy('plot_number')
            ->get()
            ->map(function (CemeteryPlot $plot) use ($section) {
                return [
                    'id' => $plot->id,
                    'plot_number' => $plot->plot_number,
                    'latitude' => (float) $plot->latitude,
                    'longitude' => (float) $plot->longitude,
                    'status' => $plot->status,
                    'burial_date' => $plot->burial_date?->format('F d, Y'),
                    'notes' => $plot->notes,
                    'section' => [
                        'id' => $section->id,
                        'name' => $section->name,
                        'code' => $section->code,
                        'color' => $section->color,
                    ],
                    'deceased' => $plot->deceased ? [
                        'id' => $plot->deceased->id,
                        'name' => $plot->deceased->member?->user?->name ?? 'Unknown',
                        'date_of_death' => $plot->deceased->date_of_death->format('F d, Y'),
                        'cause_of_death' => $plot->deceased->cause_of_death,
                    ] : null,
                    'beneficiary' => $plot->beneficiary ? [
                        'id' => $plot->beneficiary->id,
                        'name' => $plot->beneficiary->name,
                    ] : null,
                ];
            });

        return inertia()->render('cemetery/section', [
            'section' => $section,
            'plots' => $plots,
        ]);
    }

    /**
     * Search plots by deceased name (API endpoint).
     */
    public function search(Request $request)
    {
        $query = $request->input('query');

        if (empty($query)) {
            return response()->json(['results' => []]);
        }

        $plots = CemeteryPlot::with([
            'section:id,name,code,color',
            'deceased.member.user:id,name',
        ])
            ->where('status', 'occupied')
            ->whereHas('deceased.member.user', function ($q) use ($query) {
                $q->where('name', 'like', "%{$query}%");
            })
            ->limit(10)
            ->get()
            ->map(function ($plot) {
                return [
                    'id' => $plot->id,
                    'plot_number' => $plot->plot_number,
                    'latitude' => (float) $plot->latitude,
                    'longitude' => (float) $plot->longitude,
                    'deceased_name' => $plot->deceased->member->user->name,
                    'section_name' => $plot->section->name,
                    'burial_date' => $plot->burial_date?->format('F d, Y'),
                    'deceased' => [
                        'id' => $plot->deceased->id,
                        'name' => $plot->deceased->member->user->name,
                        'date_of_death' => $plot->deceased->date_of_death->format('F d, Y'),
                    ],
                    'section' => [
                        'id' => $plot->section->id,
                        'name' => $plot->section->name,
                        'code' => $plot->section->code,
                        'color' => $plot->section->color,
                    ],
                ];
            });

        return response()->json(['results' => $plots]);
    }
}

<?php

namespace App\Http\Controllers;

use App\Models\CemeteryEvent;
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

        $plots = CemeteryPlot::with([
            'section:id,name,code,color',
            'deceased:id,beneficiary_id,date_of_death,cause_of_death',
            'deceased.beneficiary:id,name',
            'deceased.obituary:deceased_id,tribute_token',
            'beneficiary:id,name',
        ])
            ->whereNotNull('latitude')
            ->whereNotNull('longitude')
            ->get()
            ->map(fn (CemeteryPlot $plot) => [
                'id' => $plot->id,
                'plot_number' => $plot->plot_number,
                'latitude' => (float) $plot->latitude,
                'longitude' => (float) $plot->longitude,
                'status' => $plot->status,
                'burial_date' => $plot->burial_date?->format('F d, Y'),
                'notes' => $plot->notes,
                'description' => $plot->description,
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
                    'cause_of_death' => $plot->deceased->cause_of_death,
                    'obituary_token' => $plot->deceased->obituary?->tribute_token,
                ] : null,
                'beneficiary' => $plot->beneficiary ? [
                    'id' => $plot->beneficiary->id,
                    'name' => $plot->beneficiary->name,
                ] : null,
            ]);

        $events = CemeteryEvent::active()
            ->get()
            ->map(fn (CemeteryEvent $event) => [
                'id' => $event->id,
                'title' => $event->title,
                'type' => $event->type,
                'description' => $event->description,
                'latitude' => (float) $event->latitude,
                'longitude' => (float) $event->longitude,
                'starts_at' => $event->starts_at->toISOString(),
                'ends_at' => $event->ends_at?->toISOString(),
                'color' => $event->color,
            ]);

        return inertia()->render('cemetery/map', [
            'sections' => $sections,
            'plots' => $plots,
            'events' => $events,
            'mapboxToken' => config('services.mapbox.token'),
            'centerCoordinates' => [
                'lat' => config('cemetery.center.latitude', 14.5995),
                'lng' => config('cemetery.center.longitude', 120.9842),
            ],
            'entranceCoordinates' => [
                'lat' => config('cemetery.entrance.latitude', 14.5995),
                'lng' => config('cemetery.entrance.longitude', 120.9842),
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
                'deceased:id,beneficiary_id,date_of_death,cause_of_death',
                'deceased.beneficiary:id,name',
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
                    'description' => $plot->description,
                    'section' => [
                        'id' => $section->id,
                        'name' => $section->name,
                        'code' => $section->code,
                        'color' => $section->color,
                    ],
                    'deceased' => $plot->deceased ? [
                        'id' => $plot->deceased->id,
                        'name' => $plot->deceased->beneficiary->name,
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
            'deceased:id,beneficiary_id,date_of_death',
            'deceased.beneficiary:id,name',
        ])
            ->whereHas('deceased.beneficiary', function ($q) use ($query) {
                $q->whereRaw('LOWER(name) LIKE ?', ['%'.strtolower($query).'%']);
            })
            ->limit(10)
            ->get()
            ->map(function ($plot) {
                return [
                    'id' => $plot->id,
                    'plot_number' => $plot->plot_number,
                    'latitude' => (float) $plot->latitude,
                    'longitude' => (float) $plot->longitude,
                    'deceased_name' => $plot->deceased->beneficiary->name,
                    'section_name' => $plot->section->name,
                    'burial_date' => $plot->burial_date?->format('F d, Y'),
                    'description' => $plot->description,
                    'deceased' => [
                        'id' => $plot->deceased->id,
                        'name' => $plot->deceased->beneficiary->name,
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

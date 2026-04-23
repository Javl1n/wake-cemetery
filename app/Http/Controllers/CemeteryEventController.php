<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreCemeteryEventRequest;
use App\Http\Requests\UpdateCemeteryEventRequest;
use App\Models\CemeteryEvent;

class CemeteryEventController extends Controller
{
    public function index()
    {
        $events = CemeteryEvent::with('createdBy:id,name')
            ->orderByDesc('starts_at')
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
                'created_by' => $event->createdBy->name,
                'is_active' => $event->starts_at->lte(now()) && ($event->ends_at === null || $event->ends_at->gte(now())),
            ]);

        return inertia()->render('admin/cemetery-events/index', [
            'events' => $events,
            'mapboxToken' => config('services.mapbox.token'),
            'centerCoordinates' => [
                'lat' => config('cemetery.center.latitude', 14.5995),
                'lng' => config('cemetery.center.longitude', 120.9842),
            ],
            'initialZoom' => config('cemetery.zoom', 16),
        ]);
    }

    public function store(StoreCemeteryEventRequest $request)
    {
        CemeteryEvent::create([
            ...$request->validated(),
            'created_by_id' => auth()->id(),
        ]);

        return redirect()->back();
    }

    public function update(UpdateCemeteryEventRequest $request, CemeteryEvent $cemeteryEvent)
    {
        $cemeteryEvent->update($request->validated());

        return redirect()->back();
    }

    public function destroy(CemeteryEvent $cemeteryEvent)
    {
        $cemeteryEvent->delete();

        return redirect()->back();
    }
}

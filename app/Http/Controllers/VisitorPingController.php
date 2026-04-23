<?php

namespace App\Http\Controllers;

use App\Models\VisitorLog;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class VisitorPingController extends Controller
{
    /**
     * Radius in kilometers within which a visitor is considered "near" the cemetery.
     */
    const PROXIMITY_RADIUS_KM = 1.0;

    public function __invoke(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'latitude' => ['nullable', 'numeric', 'between:-90,90'],
            'longitude' => ['nullable', 'numeric', 'between:-180,180'],
        ]);

        $ip = $request->ip();
        $lat = isset($validated['latitude']) ? (float) $validated['latitude'] : null;
        $lng = isset($validated['longitude']) ? (float) $validated['longitude'] : null;

        $isNear = false;

        if ($lat !== null && $lng !== null) {
            $cemeteryLat = (float) config('cemetery.center.latitude');
            $cemeteryLng = (float) config('cemetery.center.longitude');
            $isNear = $this->distanceKm($lat, $lng, $cemeteryLat, $cemeteryLng) <= self::PROXIMITY_RADIUS_KM;
        }

        VisitorLog::updateOrCreate(
            ['ip_address' => $ip, 'visited_on' => today()],
            ['latitude' => $lat, 'longitude' => $lng, 'is_near_cemetery' => $isNear],
        );

        return response()->json(['near_cemetery' => $isNear]);
    }

    private function distanceKm(float $lat1, float $lon1, float $lat2, float $lon2): float
    {
        $earthRadius = 6371;
        $dLat = deg2rad($lat2 - $lat1);
        $dLon = deg2rad($lon2 - $lon1);
        $a = sin($dLat / 2) ** 2
            + cos(deg2rad($lat1)) * cos(deg2rad($lat2)) * sin($dLon / 2) ** 2;

        return $earthRadius * 2 * atan2(sqrt($a), sqrt(1 - $a));
    }
}

<?php

namespace App\Http\Controllers;

use App\Models\MaintenancePin;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class MaintenancePinController extends Controller
{
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'section_id' => ['nullable', 'exists:cemetery_sections,id'],
            'label' => ['required', 'string', 'max:255'],
            'latitude' => ['required', 'numeric', 'between:-90,90'],
            'longitude' => ['required', 'numeric', 'between:-180,180'],
            'notes' => ['nullable', 'string'],
        ]);

        MaintenancePin::create([
            ...$validated,
            'created_by_id' => auth()->id(),
        ]);

        return back();
    }

    public function resolve(MaintenancePin $maintenancePin): RedirectResponse
    {
        $maintenancePin->update(['resolved_at' => now()]);

        return back();
    }

    public function destroy(MaintenancePin $maintenancePin): RedirectResponse
    {
        $maintenancePin->delete();

        return back();
    }
}

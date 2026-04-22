<?php

namespace App\Http\Controllers;

use App\Models\WakeService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class WakeServiceController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('admin/wake-services/index', [
            'services' => WakeService::orderBy('name')->get(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string', 'max:1000'],
            'price' => ['required', 'numeric', 'min:0'],
        ]);

        WakeService::create($validated);

        return redirect()->back();
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, WakeService $wakeService)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string', 'max:1000'],
            'price' => ['required', 'numeric', 'min:0'],
        ]);

        $wakeService->update($validated);

        return redirect()->back();
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(WakeService $wakeService)
    {
        $wakeService->schedules()->detach();
        $wakeService->packages()->detach();
        $wakeService->delete();

        return redirect()->back();
    }
}

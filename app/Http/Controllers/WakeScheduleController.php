<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreWakeScheduleRequest;
use App\Http\Requests\UpdateWakeScheduleRequest;
use App\Models\CemeteryPlot;
use App\Models\Deceased;
use App\Models\InsuranceClaim;
use App\Models\InventoryItem;
use App\Models\WakePackage;
use App\Models\WakeRoom;
use App\Models\WakeSchedule;
use App\Models\WakeService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;

class WakeScheduleController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        Gate::authorize('viewAny', WakeSchedule::class);

        $schedules = WakeSchedule::with([
            'deceased.member.user',
            'deceased.beneficiary',
            'room',
            'package',
            'services',
            'orders.items',
            'claims',
        ])->latest()->get();

        $rooms = WakeRoom::active()->get();
        $packages = WakePackage::active()->with(['services', 'items'])->get();
        $services = WakeService::all();
        $inventoryItems = InventoryItem::where('available', true)->get();
        $deceaseds = Deceased::with(['member.user', 'beneficiary'])
            ->whereDoesntHave('cemeteryPlot')
            ->latest()
            ->get();

        return inertia()->render('admin/wake-schedules/index', [
            'schedules' => $schedules,
            'rooms' => $rooms,
            'packages' => $packages,
            'services' => $services,
            'inventoryItems' => $inventoryItems,
            'deceaseds' => $deceaseds,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreWakeScheduleRequest $request)
    {
        $schedule = DB::transaction(function () use ($request) {
            $schedule = WakeSchedule::create([
                'deceased_id' => $request->deceased_id,
                'room_id' => $request->room_id,
                'package_id' => $request->package_id,
                'date_start' => $request->date_start,
                'date_end' => $request->date_end,
                'status' => 'pending',
                'notes' => $request->notes,
                'created_by' => $request->user()->id,
                'total_amount' => 0,
            ]);

            $package = WakePackage::with('services')->find($request->package_id);
            foreach ($package->services as $service) {
                $schedule->services()->attach($service->id, [
                    'status' => 'pending',
                    'fee' => $service->price,
                ]);
            }

            if ($request->has('services')) {
                foreach ($request->services as $serviceData) {
                    $service = WakeService::find($serviceData['id']);
                    $schedule->services()->attach($service->id, [
                        'status' => 'pending',
                        'fee' => $serviceData['fee'] ?? $service->price,
                    ]);
                }
            }

            if ($request->has('inventory_items') && count($request->inventory_items) > 0) {
                $inventoryOrder = $schedule->orders()->create([
                    'status' => 'pending',
                    'amount' => 0,
                ]);

                $orderTotal = 0;
                foreach ($request->inventory_items as $itemData) {
                    $item = InventoryItem::find($itemData['id']);
                    $inventoryOrder->items()->attach($item->id, [
                        'quantity' => $itemData['quantity'],
                        'unit_price' => $item->price,
                        'notes' => $itemData['notes'] ?? null,
                    ]);
                    $orderTotal += $item->price * $itemData['quantity'];
                }

                $inventoryOrder->update(['amount' => $orderTotal]);
            }

            $schedule->refresh();
            $schedule->update(['total_amount' => $schedule->calculateTotal()]);

            if ($request->create_claim && $request->subscription_id) {
                InsuranceClaim::create([
                    'subscription_id' => $request->subscription_id,
                    'schedule_id' => $schedule->id,
                    'status' => 'pending',
                    'filed_at' => now(),
                ]);
            }

            return $schedule;
        });

        return redirect()->route('wake-schedules.index');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateWakeScheduleRequest $request, WakeSchedule $wakeSchedule)
    {
        Gate::authorize('update', $wakeSchedule);

        DB::transaction(function () use ($request, $wakeSchedule) {
            $wakeSchedule->update($request->only([
                'deceased_id',
                'room_id',
                'package_id',
                'date_start',
                'date_end',
                'notes',
                'status',
            ]));

            if ($request->has('services')) {
                $serviceData = [];
                foreach ($request->services as $service) {
                    $serviceModel = WakeService::find($service['id']);
                    $serviceData[$service['id']] = [
                        'status' => $service['status'] ?? 'pending',
                        'fee' => $service['fee'] ?? $serviceModel->price,
                    ];
                }
                $wakeSchedule->services()->sync($serviceData);
            }

            $wakeSchedule->update(['total_amount' => $wakeSchedule->calculateTotal()]);
        });

        return redirect()->route('wake-schedules.index');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(WakeSchedule $wakeSchedule)
    {
        Gate::authorize('delete', $wakeSchedule);

        $wakeSchedule->update(['status' => 'cancelled']);

        return redirect()->route('wake-schedules.index');
    }

    /**
     * Complete the wake schedule and assign cemetery plot.
     */
    public function complete(WakeSchedule $wakeSchedule)
    {
        Gate::authorize('complete', $wakeSchedule);

        DB::transaction(function () use ($wakeSchedule) {
            $wakeSchedule->update([
                'status' => 'completed',
                'approved_by' => auth()->id(),
                'approved_at' => now(),
            ]);

            $deceased = $wakeSchedule->deceased;

            if ($deceased->beneficiary && $deceased->beneficiary->reservedPlot) {
                $plot = $deceased->beneficiary->reservedPlot;
                $plot->lockForUpdate();
                $plot->update([
                    'deceased_id' => $deceased->id,
                    'status' => 'occupied',
                    'burial_date' => today(),
                ]);
            } else {
                $plot = CemeteryPlot::available()->lockForUpdate()->first();
                if ($plot) {
                    $plot->update([
                        'deceased_id' => $deceased->id,
                        'status' => 'occupied',
                        'burial_date' => today(),
                    ]);
                }
            }
        });

        return redirect()->route('wake-schedules.index');
    }

    /**
     * Check room availability for given date range.
     */
    public function checkAvailability(Request $request)
    {
        $request->validate([
            'room_id' => 'required|exists:wake_rooms,id',
            'date_start' => 'required|date',
            'date_end' => 'required|date|after_or_equal:date_start',
            'exclude_schedule_id' => 'nullable|exists:wake_schedules,id',
        ]);

        $conflicts = WakeSchedule::conflictingWith(
            $request->room_id,
            $request->date_start,
            $request->date_end,
            $request->exclude_schedule_id
        )->with(['deceased', 'package'])->get();

        return response()->json([
            'available' => $conflicts->isEmpty(),
            'conflicts' => $conflicts,
        ]);
    }
}

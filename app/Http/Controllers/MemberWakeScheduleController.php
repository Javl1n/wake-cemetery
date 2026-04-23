<?php

namespace App\Http\Controllers;

use App\Models\CemeteryPlot;
use App\Models\CemeterySection;
use App\Models\InventoryItem;
use App\Models\WakeSchedule;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class MemberWakeScheduleController extends Controller
{
    /**
     * Display the member's related wake schedules.
     */
    public function index(Request $request)
    {
        $member = $request->user()->member;

        abort_if(! $member, 403, 'Member profile required.');

        $schedules = WakeSchedule::with([
            'deceased.beneficiary',
            'deceased.obituary',
            'deceased.cemeteryPlot.section',
            'room',
            'package',
            'services',
            'orders.items',
            'claims',
        ])
            ->whereHas('deceased', fn ($q) => $q->where('member_id', $member->id))
            ->latest()
            ->get();

        $inventoryItems = InventoryItem::where('available', true)
            ->with('category')
            ->orderBy('name')
            ->get();

        $availableSections = CemeterySection::with([
            'plots' => fn ($q) => $q->where('status', 'available')->orderBy('plot_number'),
        ])->get()->filter(fn ($s) => $s->plots->isNotEmpty())->values();

        return inertia()->render('members/wake-schedules/index', [
            'schedules' => $schedules,
            'inventoryItems' => $inventoryItems,
            'availableSections' => $availableSections,
        ]);
    }

    /**
     * Reserve a cemetery plot for the deceased on a member's wake schedule.
     */
    public function reservePlot(Request $request, WakeSchedule $wakeSchedule)
    {
        $member = $request->user()->member;

        abort_if(! $member, 403);
        abort_if(
            $wakeSchedule->deceased->member_id !== $member->id,
            403,
            'You are not authorized to reserve a plot for this schedule.'
        );
        abort_if(
            ! in_array($wakeSchedule->status, ['confirmed', 'in_progress']),
            403,
            'Plot reservation is only available for confirmed or in-progress schedules.'
        );
        abort_if(
            $wakeSchedule->deceased->cemeteryPlot !== null,
            422,
            'A cemetery plot is already assigned for this deceased.'
        );

        $validated = $request->validate([
            'plot_id' => 'required|exists:cemetery_plots,id',
        ]);

        $plot = CemeteryPlot::findOrFail($validated['plot_id']);

        abort_if($plot->status !== 'available', 422, 'This plot is no longer available.');

        $plot->update([
            'status' => 'reserved',
            'deceased_id' => $wakeSchedule->deceased_id,
        ]);

        return redirect()->back();
    }

    /**
     * Place an inventory order for a member's wake schedule.
     */
    public function storeOrder(Request $request, WakeSchedule $wakeSchedule)
    {
        $member = $request->user()->member;

        abort_if(! $member, 403);
        abort_if(
            $wakeSchedule->deceased->member_id !== $member->id,
            403,
            'You are not authorized to place orders for this schedule.'
        );
        abort_if(
            ! in_array($wakeSchedule->status, ['confirmed', 'in_progress']),
            403,
            'Orders can only be placed for confirmed or in-progress schedules.'
        );

        $validated = $request->validate([
            'items' => 'required|array|min:1',
            'items.*.id' => 'required|exists:inventory_items,id',
            'items.*.quantity' => 'required|integer|min:1',
            'notes' => 'nullable|string|max:500',
        ]);

        DB::transaction(function () use ($validated, $wakeSchedule) {
            $order = $wakeSchedule->orders()->create([
                'status' => 'pending',
                'amount' => 0,
                'notes' => $validated['notes'] ?? null,
            ]);

            $total = 0;
            foreach ($validated['items'] as $itemData) {
                $item = InventoryItem::find($itemData['id']);
                $order->items()->attach($item->id, [
                    'quantity' => $itemData['quantity'],
                    'unit_price' => $item->price,
                    'notes' => null,
                ]);
                $total += $item->price * $itemData['quantity'];
            }

            $order->update(['amount' => $total]);
            $wakeSchedule->refresh();
            $wakeSchedule->update(['total_amount' => $wakeSchedule->calculateTotal()]);
        });

        return redirect()->back();
    }
}

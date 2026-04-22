<?php

namespace App\Http\Controllers;

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

        return inertia()->render('members/wake-schedules/index', [
            'schedules' => $schedules,
            'inventoryItems' => $inventoryItems,
        ]);
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

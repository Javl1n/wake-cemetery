<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreInventoryItemRequest;
use App\Http\Requests\UpdateInventoryItemRequest;
use App\Models\InventoryCategory;
use App\Models\InventoryItem;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Storage;

class InventoryItemController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        Gate::authorize('viewAny', InventoryItem::class);

        $items = InventoryItem::with('category')->latest()->get();
        $categories = InventoryCategory::orderBy('name')->get();

        return inertia()->render('admin/inventory/index', [
            'items' => $items,
            'categories' => $categories,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreInventoryItemRequest $request)
    {
        $imagePath = $request->hasFile('image')
            ? $request->file('image')->store('inventory', 'public')
            : '';

        InventoryItem::create([
            ...$request->safe()->except('image'),
            'available' => $request->boolean('available', true),
            'image' => $imagePath,
        ]);

        return redirect()->route('inventory-items.index');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateInventoryItemRequest $request, InventoryItem $inventoryItem)
    {
        $imagePath = $inventoryItem->image;

        if ($request->hasFile('image')) {
            if ($imagePath) {
                Storage::disk('public')->delete($imagePath);
            }
            $imagePath = $request->file('image')->store('inventory', 'public');
        }

        $inventoryItem->update([
            ...$request->safe()->except('image'),
            'available' => $request->boolean('available'),
            'image' => $imagePath,
        ]);

        return redirect()->route('inventory-items.index');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(InventoryItem $inventoryItem)
    {
        Gate::authorize('delete', $inventoryItem);

        if ($inventoryItem->image) {
            Storage::disk('public')->delete($inventoryItem->image);
        }

        $inventoryItem->delete();

        return redirect()->route('inventory-items.index');
    }
}

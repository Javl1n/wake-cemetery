<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class InventoryItem extends Model
{
    /** @use HasFactory<\Database\Factories\InventoryItemFactory> */
    use HasFactory;

    public function orders()
    {
        return $this->belongsToMany(InventoryOrder::class, 'item_order', 'item_id')->withPivot('unit_price', 'quantity', 'notes');
    }

    public function packages()
    {
        return $this->belongsToMany(WakePackage::class, 'item_package', 'item_id')->withPivot('quantity');
    }
}

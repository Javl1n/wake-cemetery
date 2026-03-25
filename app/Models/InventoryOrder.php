<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class InventoryOrder extends Model
{
    /** @use HasFactory<\Database\Factories\InventoryOrderFactory> */
    use HasFactory;

    public function schedule()
    {
        return $this->belongsTo(WakeSchedule::class, 'schedule_id');
    }

    public function items()
    {
        return $this->belongsToMany(InventoryItem::class, 'item_order', 'order_id')->withPivot('unit_price', 'quantity', 'notes');
    }
}

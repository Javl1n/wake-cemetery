<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class InventoryOrder extends Model
{
    /** @use HasFactory<\Database\Factories\InventoryOrderFactory> */
    use HasFactory;

    protected $fillable = [
        'schedule_id',
        'status',
        'amount',
        'notes',
    ];

    protected function casts(): array
    {
        return [
            'amount' => 'decimal:2',
        ];
    }

    public function schedule()
    {
        return $this->belongsTo(WakeSchedule::class, 'schedule_id');
    }

    public function items()
    {
        return $this->belongsToMany(InventoryItem::class, 'item_order', 'order_id', 'item_id')->withPivot('unit_price', 'quantity', 'notes');
    }

    public function calculateAmount(): float
    {
        return $this->items->sum(function ($item) {
            return $item->pivot->unit_price * $item->pivot->quantity;
        });
    }
}

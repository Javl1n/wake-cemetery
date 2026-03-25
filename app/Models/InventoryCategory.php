<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class InventoryCategory extends Model
{
    /** @use HasFactory<\Database\Factories\InventoryCategoryFactory> */
    use HasFactory;

    public function items()
    {
        return $this->hasMany(InventoryItem::class, 'category_id');
    }
}

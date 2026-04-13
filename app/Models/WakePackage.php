<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class WakePackage extends Model
{
    /** @use HasFactory<\Database\Factories\WakePackageFactory> */
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'base_price',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'base_price' => 'decimal:2',
            'is_active' => 'boolean',
        ];
    }

    public function schedules()
    {
        return $this->hasMany(WakeSchedule::class, 'package_id');
    }

    public function services()
    {
        return $this->belongsToMany(WakeService::class, 'package_service', 'package_id', 'service_id');
    }

    public function items()
    {
        return $this->belongsToMany(InventoryItem::class, 'item_package', 'package_id', 'item_id')->withPivot('quantity');
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }
}

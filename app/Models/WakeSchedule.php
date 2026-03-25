<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class WakeSchedule extends Model
{
    /** @use HasFactory<\Database\Factories\WakeScheduleFactory> */
    use HasFactory;

    public function room()
    {
        return $this->belongsTo(WakeRoom::class, 'room_id');
    }

    public function deceased()
    {
        return $this->belongsTo(Deceased::class, 'deceased_id');
    }

    public function package()
    {
        return $this->belongsTo(WakePackage::class, 'package_id');
    }

    public function orders()
    {
        return $this->hasMany(InventoryOrder::class, 'schedule_id');
    }

    public function services()
    {
        return $this->belongsToMany(WakeService::class, 'schedule_service', 'schedule_id', 'service_id')->withPivot('status', 'completed_at', 'fee');
    }

    public function claims()
    {
        return $this->hasOne(InsuranceClaim::class, 'schedule_id');
    }
}

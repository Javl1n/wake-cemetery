<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class WakeService extends Model
{
    /** @use HasFactory<\Database\Factories\WakeServiceFactory> */
    use HasFactory;

    protected $fillable = ['name', 'description', 'price'];

    public function packages()
    {
        return $this->belongsToMany(WakePackage::class, 'package_service', 'service_id', 'package_id');
    }

    public function schedules()
    {
        return $this->belongsToMany(WakeSchedule::class, 'schedule_service', 'service_id', 'schedule_id')->withPivot('status', 'completed_at', 'fee');
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class WakeService extends Model
{
    /** @use HasFactory<\Database\Factories\WakeServiceFactory> */
    use HasFactory;

    public function schedules()
    {
        return $this->belongsToMany(WakeSchedule::class, 'schedule_service', 'service_id', 'schedule_id')->withPivot('status', 'completed_at', 'fee');
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class WakeRoom extends Model
{
    /** @use HasFactory<\Database\Factories\WakeRoomFactory> */
    use HasFactory;

    public function schedules()
    {
        return $this->hasMany(WakeSchedule::class, 'room_id');
    }
}

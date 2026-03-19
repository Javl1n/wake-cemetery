<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PremiumSchedule extends Model
{
    /** @use HasFactory<\Database\Factories\PremiumScheduleFactory> */
    use HasFactory;

    public function subscription()
    {
        return $this->belongsTo(Subscription::class);
    }
}

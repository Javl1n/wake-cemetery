<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class WakeRoom extends Model
{
    /** @use HasFactory<\Database\Factories\WakeRoomFactory> */
    use HasFactory;

    protected $fillable = [
        'code',
        'name',
        'description',
        'capacity',
        'features',
        'hourly_rate',
        'status',
        'image',
    ];

    protected function casts(): array
    {
        return [
            'capacity' => 'integer',
            'hourly_rate' => 'decimal:2',
            'features' => 'array',
        ];
    }

    public function schedules()
    {
        return $this->hasMany(WakeSchedule::class, 'room_id');
    }

    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    public function isAvailableFor($dateStart, $dateEnd, $excludeScheduleId = null): bool
    {
        return ! $this->schedules()
            ->conflictingWith($this->id, $dateStart, $dateEnd, $excludeScheduleId)
            ->exists();
    }
}

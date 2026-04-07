<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class WakeSchedule extends Model
{
    /** @use HasFactory<\Database\Factories\WakeScheduleFactory> */
    use HasFactory;

    protected $fillable = [
        'deceased_id',
        'room_id',
        'package_id',
        'date_start',
        'date_end',
        'total_amount',
        'status',
        'notes',
        'created_by',
        'approved_by',
        'approved_at',
    ];

    protected function casts(): array
    {
        return [
            'date_start' => 'date',
            'date_end' => 'date',
            'approved_at' => 'datetime',
            'total_amount' => 'decimal:2',
        ];
    }

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

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function approver()
    {
        return $this->belongsTo(User::class, 'approved_by');
    }

    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    public function scopeConfirmed($query)
    {
        return $query->where('status', 'confirmed');
    }

    public function scopeActive($query)
    {
        return $query->whereIn('status', ['confirmed', 'in_progress']);
    }

    public function scopeConflictingWith($query, $roomId, $dateStart, $dateEnd, $excludeId = null)
    {
        return $query->where('room_id', $roomId)
            ->where('status', '!=', 'cancelled')
            ->where(function ($q) use ($dateStart, $dateEnd) {
                $q->whereBetween('date_start', [$dateStart, $dateEnd])
                    ->orWhereBetween('date_end', [$dateStart, $dateEnd])
                    ->orWhere(function ($q2) use ($dateStart, $dateEnd) {
                        $q2->where('date_start', '<=', $dateStart)
                            ->where('date_end', '>=', $dateEnd);
                    });
            })
            ->when($excludeId, fn ($q) => $q->where('id', '!=', $excludeId));
    }

    public function calculateTotal(): float
    {
        $total = $this->package ? $this->package->base_price : 0;

        foreach ($this->services as $service) {
            $total += $service->pivot->fee ?? $service->price;
        }

        foreach ($this->orders as $order) {
            $total += $order->amount;
        }

        return $total;
    }

    public function canBeCompleted(): bool
    {
        return $this->status === 'in_progress' && $this->date_end <= today();
    }
}

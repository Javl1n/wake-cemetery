<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PremiumSchedule extends Model
{
    /** @use HasFactory<\Database\Factories\PremiumScheduleFactory> */
    use HasFactory;

    protected $fillable = [
        'subscription_id',
        'due_date',
        'due_amount',
        'status',
    ];

    protected function casts(): array
    {
        return [
            'due_date' => 'date',
            'due_amount' => 'decimal:2',
        ];
    }

    public function subscription()
    {
        return $this->belongsTo(Subscription::class);
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class InsuranceClaim extends Model
{
    /** @use HasFactory<\Database\Factories\InsuranceClaimFactory> */
    use HasFactory;

    protected $fillable = [
        'schedule_id',
        'subscription_id',
        'reviewer_id',
        'approved_amount',
        'status',
        'filed_at',
        'reviewed_at',
    ];

    protected function casts(): array
    {
        return [
            'filed_at' => 'datetime',
            'reviewed_at' => 'datetime',
            'approved_amount' => 'decimal:2',
        ];
    }

    public function subscription()
    {
        return $this->belongsTo(Subscription::class, 'subscription_id');
    }

    public function schedule()
    {
        return $this->belongsTo(WakeSchedule::class, 'schedule_id');
    }

    public function reviewer()
    {
        return $this->belongsTo(User::class, 'reviewer_id');
    }
}

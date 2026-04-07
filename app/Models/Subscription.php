<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Subscription extends Model
{
    /** @use HasFactory<\Database\Factories\SubscriptionFactory> */
    use HasFactory;

    protected $fillable = [
        'member_id',
        'insurance_id',
        'status',
        'reviewer_id',
        'reviewed_at',
    ];

    public function member()
    {
        return $this->belongsTo(Member::class);
    }

    public function insurance()
    {
        return $this->belongsTo(Insurance::class);
    }

    public function beneficiaries()
    {
        return $this->hasMany(Beneficiary::class);
    }

    public function schedules()
    {
        return $this->hasMany(PremiumSchedule::class, 'subscription_id');
    }

    public function claims()
    {
        return $this->hasMany(InsuranceClaim::class, 'subscription_id');
    }

    public function reviewer()
    {
        return $this->belongsTo(User::class, 'reviewer_id');
    }
}

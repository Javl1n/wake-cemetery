<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Insurance extends Model
{
    /** @use HasFactory<\Database\Factories\InsuranceFactory> */
    use HasFactory;

    public function subscriptions()
    {
        return $this->hasMany(Subscription::class);
    }
}

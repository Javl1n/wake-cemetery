<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Beneficiary extends Model
{
    /** @use HasFactory<\Database\Factories\BeneficiaryFactory> */
    use HasFactory;

    public function subscription()
    {
        return $this->belongsTo(Subscription::class);
    }

    public function deceased()
    {
        return $this->hasOne(Deceased::class, 'deceased_id');
    }
}

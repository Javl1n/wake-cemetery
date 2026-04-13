<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Beneficiary extends Model
{
    /** @use HasFactory<\Database\Factories\BeneficiaryFactory> */
    use HasFactory;

    protected $fillable = [
        'name',
        'relationship',
        'contact',
        'date_of_birth',
        'place_of_birth',
    ];

    public function subscription()
    {
        return $this->belongsTo(Subscription::class);
    }

    public function deceased()
    {
        return $this->hasOne(Deceased::class, 'beneficiary_id');
    }

    public function reservedPlot()
    {
        return $this->hasOne(CemeteryPlot::class, 'beneficiary_id');
    }
}

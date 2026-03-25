<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Deceased extends Model
{
    /** @use HasFactory<\Database\Factories\DeceasedFactory> */
    use HasFactory;

    public function member()
    {
        return $this->belongsTo(Member::class, 'member_id');
    }

    public function beneficiary()
    {
        return $this->belongsTo(Beneficiary::class, 'beneficiary_id');
    }

    public function obituary()
    {
        return $this->hasOne(DeceasedObituary::class, 'deceased_id');
    }
}

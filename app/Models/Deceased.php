<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Deceased extends Model
{
    /** @use HasFactory<\Database\Factories\DeceasedFactory> */
    use HasFactory;

    protected $fillable = [
        'member_id',
        'beneficiary_id',
        'date_of_death',
        'cause_of_death',
    ];

    protected function casts(): array
    {
        return [
            'date_of_death' => 'date',
        ];
    }

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

    public function cemeteryPlot()
    {
        return $this->hasOne(CemeteryPlot::class, 'deceased_id');
    }
}

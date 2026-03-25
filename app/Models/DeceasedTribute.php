<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DeceasedTribute extends Model
{
    /** @use HasFactory<\Database\Factories\DeceasedTributeFactory> */
    use HasFactory;

    public function obituary()
    {
        return $this->belongsTo(DeceasedTribute::class, 'obituary_id');
    }
}

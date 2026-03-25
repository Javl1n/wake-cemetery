<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use PDO;

class DeceasedObituary extends Model
{
    /** @use HasFactory<\Database\Factories\DeceasedObituaryFactory> */
    use HasFactory;

    public function deceased()
    {
        return $this->hasOne(Deceased::class, 'deceased_id');
    }

    public function tributes()
    {
        return $this->hasMany(DeceasedTribute::class, 'obituary_id');
    }
}

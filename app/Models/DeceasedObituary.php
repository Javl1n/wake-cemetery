<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DeceasedObituary extends Model
{
    /** @use HasFactory<\Database\Factories\DeceasedObituaryFactory> */
    use HasFactory;

    protected $fillable = [
        'deceased_id',
        'template',
        'image',
        'description',
        'tribute_token',
    ];

    public function deceased()
    {
        return $this->belongsTo(Deceased::class);
    }

    public function tributes()
    {
        return $this->hasMany(DeceasedTribute::class, 'obituary_id');
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DeceasedTribute extends Model
{
    /** @use HasFactory<\Database\Factories\DeceasedTributeFactory> */
    use HasFactory;

    protected $fillable = [
        'obituary_id',
        'uploader_name',
        'special_relations',
        'image',
        'description',
    ];

    public function obituary()
    {
        return $this->belongsTo(DeceasedObituary::class, 'obituary_id');
    }
}

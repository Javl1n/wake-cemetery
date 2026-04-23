<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class VisitorLog extends Model
{
    /** @use HasFactory<\Database\Factories\VisitorLogFactory> */
    use HasFactory;

    protected $fillable = [
        'ip_address',
        'visited_on',
        'latitude',
        'longitude',
        'is_near_cemetery',
    ];

    protected function casts(): array
    {
        return [
            'visited_on' => 'date',
            'latitude' => 'float',
            'longitude' => 'float',
            'is_near_cemetery' => 'boolean',
        ];
    }

    public function scopeNearCemetery($query): void
    {
        $query->where('is_near_cemetery', true);
    }

    public function scopeToday($query): void
    {
        $query->whereDate('visited_on', today());
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CemeteryPlot extends Model
{
    /** @use HasFactory<\Database\Factories\CemeteryPlotFactory> */
    use HasFactory;

    protected $fillable = [
        'section_id',
        'deceased_id',
        'plot_number',
        'latitude',
        'longitude',
        'status',
        'burial_date',
        'notes',
    ];

    protected function casts(): array
    {
        return [
            'latitude' => 'decimal:8',
            'longitude' => 'decimal:8',
            'burial_date' => 'date',
        ];
    }

    public function section()
    {
        return $this->belongsTo(CemeterySection::class, 'section_id');
    }

    public function deceased()
    {
        return $this->belongsTo(Deceased::class, 'deceased_id');
    }

    public function scopeOccupied($query)
    {
        return $query->where('status', 'occupied')->whereNotNull('deceased_id');
    }

    public function scopeAvailable($query)
    {
        return $query->where('status', 'available');
    }
}

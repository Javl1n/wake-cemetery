<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CemeterySection extends Model
{
    /** @use HasFactory<\Database\Factories\CemeterySectionFactory> */
    use HasFactory;

    protected $fillable = [
        'name',
        'code',
        'description',
        'color',
        'geometry',
        'geometry_type',
        'total_plots',
        'available_plots',
    ];

    protected function casts(): array
    {
        return [
            'total_plots' => 'integer',
            'available_plots' => 'integer',
            'geometry' => 'array',
        ];
    }

    public function plots()
    {
        return $this->hasMany(CemeteryPlot::class, 'section_id');
    }

    public function occupiedPlots()
    {
        return $this->hasMany(CemeteryPlot::class, 'section_id')->where('status', 'occupied');
    }
}

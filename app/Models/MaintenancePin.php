<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MaintenancePin extends Model
{
    protected $fillable = [
        'section_id',
        'label',
        'latitude',
        'longitude',
        'notes',
        'resolved_at',
        'created_by_id',
    ];

    protected function casts(): array
    {
        return [
            'latitude' => 'decimal:8',
            'longitude' => 'decimal:8',
            'resolved_at' => 'datetime',
        ];
    }

    public function section()
    {
        return $this->belongsTo(CemeterySection::class, 'section_id');
    }

    public function createdBy()
    {
        return $this->belongsTo(User::class, 'created_by_id');
    }

    public function scopeUnresolved($query)
    {
        return $query->whereNull('resolved_at');
    }
}

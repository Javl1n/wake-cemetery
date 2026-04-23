<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CemeteryEvent extends Model
{
    /** @use HasFactory<\Database\Factories\CemeteryEventFactory> */
    use HasFactory;

    protected $fillable = [
        'title',
        'type',
        'description',
        'latitude',
        'longitude',
        'starts_at',
        'ends_at',
        'color',
        'created_by_id',
    ];

    protected function casts(): array
    {
        return [
            'latitude' => 'decimal:8',
            'longitude' => 'decimal:8',
            'starts_at' => 'datetime',
            'ends_at' => 'datetime',
        ];
    }

    public function createdBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by_id');
    }

    /**
     * Scope to events that are currently active.
     */
    public function scopeActive(Builder $query): void
    {
        $query->where('starts_at', '<=', now())
            ->where(function (Builder $q) {
                $q->whereNull('ends_at')->orWhere('ends_at', '>=', now());
            });
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Member extends Model
{
    /** @use HasFactory<\Database\Factories\MemberFactory> */
    use HasFactory;

    protected $fillable = [
        'date_of_birth',
        'sex',
        'civil_status',
        'phone',
        'address',
        'nationality',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function verification()
    {
        return $this->hasOne(MemberVerification::class);
    }
}

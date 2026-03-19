<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use PDO;

class MemberVerification extends Model
{
    /** @use HasFactory<\Database\Factories\MemberVerificationFactory> */
    use HasFactory;

    protected $fillable = [
        'id_type',
        'id_number',
        'id_path',
        'date_verified',
    ];

    public function member()
    {
        return $this->belongsTo(Member::class);
    }

    public function verifiedBy()
    {
        return $this->belongsTo(User::class, 'verified_by');
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class OpeningHours extends Model
{
    protected $casts = [
        'monday'    => 'array',
        'tuesday'   => 'array',
        'wednesday' => 'array',
        'thursday'  => 'array',
        'friday'    => 'array',
        'saturday'  => 'array',
        'sunday'    => 'array',
    ];

    protected $fillable = [
        'owner_id',
        'monday',
        'tuesday',
        'wednesday',
        'thursday',
        'friday',
        'saturday',
        'sunday',
    ];
}

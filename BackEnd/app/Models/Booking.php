<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Booking extends Model
{
    protected $fillable = [
        'client_name',
        'phone',
        'service',
        'staff',
        'date',
        'time',
        'duration',
        'price',
        'status',
        'notes',
    ];

    protected $casts = [
        'date'     => 'date:Y-m-d',
        'price'    => 'decimal:2',
        'duration' => 'integer',
    ];
}

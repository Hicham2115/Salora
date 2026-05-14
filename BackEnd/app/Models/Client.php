<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Client extends Model
{
    protected $fillable = [
        'name',
        'phone',
        'visits',
        'last_visit',
        'total_spend',
        'note',
    ];

    protected $casts = [
        'last_visit' => 'date',
        'total_spend' => 'decimal:2',
    ];
}

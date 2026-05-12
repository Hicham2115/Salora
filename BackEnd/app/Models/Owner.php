<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Owner extends Model
{
    protected $table = 'owners';

    protected $fillable = [
        'salon_logo',
        'salon_name',
        'salon_email',
        'salon_phone',
        'salon_website',
        'salon_adresse',
        'salon_about',
    ];
}
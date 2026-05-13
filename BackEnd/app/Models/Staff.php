<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Staff extends Model
{
    protected $table = 'staff_tables';

    protected $fillable = [
        'staff_name',
        'staff_role',
    ];
}

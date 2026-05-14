<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Reviews extends Model
{
    protected $fillable = [
        'reviewer_name',
        'review_content',
        'review_stars',
    ];
}

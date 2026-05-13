<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Notifications extends Model
{
    protected $fillable = [
        'booking_notification',
        'cancelation_notification',
        'appointement_reminder',
        'new_review_notification',
        'marketing_notification',
    ];

    protected $casts = [
        'booking_notification'    => 'boolean',
        'cancelation_notification' => 'boolean',
        'appointement_reminder'   => 'boolean',
        'new_review_notification' => 'boolean',
        'marketing_notification'  => 'boolean',
    ];
}

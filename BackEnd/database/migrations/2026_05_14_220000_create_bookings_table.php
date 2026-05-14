<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('bookings', function (Blueprint $table) {
            $table->id();
            $table->string('client_name');
            $table->string('phone')->nullable();
            $table->string('service');
            $table->string('staff');
            $table->date('date');
            $table->string('time', 5); // HH:MM
            $table->unsignedInteger('duration'); // minutes
            $table->decimal('price', 10, 2)->default(0);
            $table->enum('status', ['confirmed', 'pending', 'cancelled'])->default('pending');
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('bookings');
    }
};

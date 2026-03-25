<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('wake_schedules', function (Blueprint $table) {
            $table->id();
            $table->foreignId('deceased_id')->constrained('deceaseds');
            $table->foreignId('room_id')->constrained('wake_rooms');
            $table->foreignId('package_id')->constrained('wake_packages');
            $table->date('date_start');
            $table->date('date_end');
            $table->float('total_amount');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('wake_schedules');
    }
};

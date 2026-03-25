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
        Schema::create('schedule_service', function (Blueprint $table) {
            $table->id();
            $table->foreignId('schedule_id')->constrained('wake_schedules');
            $table->foreignId('service_id')->constrained('wake_services');
            $table->enum('status', ['pending', 'completed', 'cancelled']);
            $table->timestamp('completed_at');
            $table->float('fee');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('schedule_service');
    }
};

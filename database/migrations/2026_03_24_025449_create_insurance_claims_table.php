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
        Schema::create('insurance_claims', function (Blueprint $table) {
            $table->id();
            $table->foreignId('schedule_id')->constrained('wake_schedules');
            $table->foreignId('subscription_id')->constrained('subscriptions');
            $table->foreignId('reviewer_id')->constrained('users');
            $table->float('approved_amount');
            $table->enum('status', ['filed', 'approved', 'rejected', 'paid']);
            $table->timestamp('filed_at');
            $table->timestamp('reviewed_ad');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('insurance_claims');
    }
};

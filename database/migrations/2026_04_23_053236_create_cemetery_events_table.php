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
        Schema::create('cemetery_events', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->enum('type', ['burial', 'anniversary', 'memorial', 'ceremony', 'other'])->default('other');
            $table->text('description')->nullable();
            $table->decimal('latitude', 10, 8);
            $table->decimal('longitude', 11, 8);
            $table->datetime('starts_at');
            $table->datetime('ends_at')->nullable();
            $table->string('color', 7)->default('#ef4444');
            $table->foreignId('created_by_id')->constrained('users')->cascadeOnDelete();
            $table->timestamps();

            $table->index(['starts_at', 'ends_at']);
            $table->index(['latitude', 'longitude']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('cemetery_events');
    }
};

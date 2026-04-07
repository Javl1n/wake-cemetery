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
        Schema::create('cemetery_plots', function (Blueprint $table) {
            $table->id();
            $table->foreignId('section_id')->constrained('cemetery_sections')->onDelete('cascade');
            $table->foreignId('deceased_id')->nullable()->constrained('deceaseds')->onDelete('set null');
            $table->string('plot_number')->unique();
            $table->decimal('latitude', 10, 8);
            $table->decimal('longitude', 11, 8);
            $table->enum('status', ['available', 'occupied', 'reserved', 'maintenance'])->default('available');
            $table->date('burial_date')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();

            $table->index(['latitude', 'longitude']);
            $table->index('status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('cemetery_plots');
    }
};

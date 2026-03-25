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
        Schema::create('deceased_obituaries', function (Blueprint $table) {
            $table->id();
            $table->foreignId('deceased_id')->constrained('deceaseds');
            $table->integer('template');
            $table->string('image');
            $table->string('description')->nullable();
            $table->string('tribute_token')->unique();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('deceased_obituaries');
    }
};

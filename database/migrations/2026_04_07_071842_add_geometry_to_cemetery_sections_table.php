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
        Schema::table('cemetery_sections', function (Blueprint $table) {
            $table->text('geometry')->nullable()->after('color');
            $table->enum('geometry_type', ['polygon', 'line'])->nullable()->after('geometry');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('cemetery_sections', function (Blueprint $table) {
            $table->dropColumn(['geometry', 'geometry_type']);
        });
    }
};

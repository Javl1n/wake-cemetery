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
        Schema::table('wake_rooms', function (Blueprint $table) {
            $table->string('name', 255)->after('code');
            $table->text('description')->nullable()->after('name');
            $table->integer('capacity')->after('description');
            $table->text('features')->nullable()->after('capacity');
            $table->decimal('hourly_rate', 10, 2)->nullable()->after('features');
            $table->string('status')->default('active')->after('hourly_rate');
            $table->string('image')->nullable()->after('status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('wake_rooms', function (Blueprint $table) {
            $table->dropColumn([
                'name',
                'description',
                'capacity',
                'features',
                'hourly_rate',
                'status',
                'image',
            ]);
        });
    }
};

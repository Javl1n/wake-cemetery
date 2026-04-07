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
        Schema::table('wake_schedules', function (Blueprint $table) {
            $table->string('status')->default('pending')->after('total_amount');
            $table->text('notes')->nullable()->after('status');
            $table->foreignId('created_by')->nullable()->after('notes')->constrained('users')->onDelete('set null');
            $table->foreignId('approved_by')->nullable()->after('created_by')->constrained('users')->onDelete('set null');
            $table->timestamp('approved_at')->nullable()->after('approved_by');

            // Add indexes for performance
            $table->index('status');
            $table->index(['date_start', 'date_end']);
            $table->index(['room_id', 'date_start', 'date_end']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('wake_schedules', function (Blueprint $table) {
            $table->dropIndex(['wake_schedules_status_index']);
            $table->dropIndex(['wake_schedules_date_start_date_end_index']);
            $table->dropIndex(['wake_schedules_room_id_date_start_date_end_index']);
            $table->dropForeign(['created_by']);
            $table->dropForeign(['approved_by']);
            $table->dropColumn([
                'status',
                'notes',
                'created_by',
                'approved_by',
                'approved_at',
            ]);
        });
    }
};

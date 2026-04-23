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
        Schema::table('insurance_claims', function (Blueprint $table) {
            $table->foreignId('reviewer_id')->nullable()->change();
            $table->float('approved_amount')->nullable()->change();
            $table->timestamp('reviewed_at')->nullable()->change();
        });
    }

    public function down(): void
    {
        Schema::table('insurance_claims', function (Blueprint $table) {
            $table->foreignId('reviewer_id')->nullable(false)->change();
            $table->float('approved_amount')->nullable(false)->change();
            $table->timestamp('reviewed_at')->nullable(false)->change();
        });
    }
};

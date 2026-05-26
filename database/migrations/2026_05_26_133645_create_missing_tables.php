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
        if (!Schema::hasTable('members')) {
            Schema::create('members', function (Blueprint $table) {
                $table->string('id')->primary();
                $table->string('nama');
                $table->string('hp')->nullable();
                $table->string('status')->nullable();
            });
        }

        if (!Schema::hasTable('biaya')) {
            Schema::create('biaya', function (Blueprint $table) {
                $table->integer('daya')->primary();
                $table->integer('nidi')->default(0);
                $table->integer('slo')->default(0);
                $table->integer('area')->default(0);
                $table->integer('mitra')->default(0);
                $table->integer('langganan')->default(0);
                $table->integer('banyak_rutin')->default(0);
                $table->integer('pelanggan')->default(0);
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('members');
        Schema::dropIfExists('biaya');
    }
};

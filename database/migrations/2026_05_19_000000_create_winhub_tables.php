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
        Schema::create('daya', function (Blueprint $table) {
            $table->id();
            $table->integer('daya');
            $table->string('golongan');
            $table->string('keterangan');
        });

        Schema::create('members', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->string('nama');
            $table->string('hp')->nullable();
            $table->string('status')->nullable();
        });

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

        Schema::create('provinsi', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->string('nama');
        });

        Schema::create('kota', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->string('provinsiId');
            $table->string('nama');
        });

        Schema::create('kecamatan', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->string('kotaId');
            $table->string('nama');
        });

        Schema::create('desa', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->string('kecamatanId');
            $table->string('nama');
        });

        Schema::create('dusun', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->string('desaId');
            $table->string('nama');
        });

        Schema::create('permohonan', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->string('namaPemohon');
            $table->string('nik');
            $table->string('namaPelanggan');
            $table->string('daya');
            $table->text('alamat');
            $table->string('kecamatan');
            $table->integer('biaya');
            $table->string('metodePembayaran');
            $table->string('jenisPermohonan');
            $table->string('status');
            $table->string('ttNidi')->nullable();
            $table->string('ttSlo')->nullable();
            $table->text('catatanNidi')->nullable();
            $table->text('catatanSlo')->nullable();
            $table->string('pembayaranStatus');
            $table->boolean('shared')->default(false);
            $table->dateTime('tanggalInput');
            $table->string('nidiFile')->nullable();
            $table->string('sloFile')->nullable();
            $table->string('buktiBayar')->nullable();
        });

        Schema::create('logs', function (Blueprint $table) {
            $table->id();
            $table->string('user');
            $table->text('action');
            $table->dateTime('time');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('logs');
        Schema::dropIfExists('permohonan');
        Schema::dropIfExists('dusun');
        Schema::dropIfExists('desa');
        Schema::dropIfExists('kecamatan');
        Schema::dropIfExists('kota');
        Schema::dropIfExists('provinsi');
        Schema::dropIfExists('daya');
        Schema::dropIfExists('members');
        Schema::dropIfExists('biaya');
    }
};

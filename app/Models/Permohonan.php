<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Permohonan extends Model
{
    protected $table = 'permohonan';
    protected $keyType = 'string';
    public $incrementing = false;
    public $timestamps = false;

    protected $fillable = [
        'id', 'namaPemohon', 'nik', 'namaPelanggan', 'daya', 'alamat', 
        'kecamatan', 'biaya', 'metodePembayaran', 'jenisPermohonan', 'status',
        'ttNidi', 'ttSlo', 'catatanNidi', 'catatanSlo', 'pembayaranStatus',
        'shared', 'tanggalInput', 'nidiFile', 'sloFile', 'buktiBayar'
    ];
}

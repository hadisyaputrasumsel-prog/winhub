<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Biaya extends Model
{
    protected $table = 'biaya';
    protected $primaryKey = 'daya';
    public $incrementing = false;
    public $timestamps = false;

    protected $fillable = [
        'daya', 'nidi', 'slo', 'area', 'mitra', 'langganan', 'banyak_rutin', 'pelanggan'
    ];
}

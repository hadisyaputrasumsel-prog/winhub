<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Daya extends Model
{
    protected $table = 'daya';
    public $timestamps = false;

    protected $fillable = [
        'daya', 'golongan', 'keterangan'
    ];
}

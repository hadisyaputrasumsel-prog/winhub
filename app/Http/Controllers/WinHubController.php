<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class WinHubController extends Controller
{
    /**
     * Handle WinHub REST API requests for data load and synchronization.
     */
    public function handleApi(Request $request)
    {
        $action = $request->input('action') ?? $request->query('action') ?? '';
        $method = $request->method();

        // -----------------------------------------------------------------
        // GET HANDLERS
        // -----------------------------------------------------------------
        if ($method === 'GET') {
            if ($action === 'load_all') {
                try {
                    // Load users
                    $users = DB::table('users')->get()->toArray();
                    
                    // Load daya
                    $dayas = DB::table('daya')->orderBy('id', 'ASC')->get()->map(function($x) { return (array)$x; })->toArray();
                    
                    // Load wilayah relationally
                    $provinsi = DB::table('provinsi')->orderBy('id', 'ASC')->get()->map(function($x){ return (array)$x; })->toArray();
                    $kota = DB::table('kota')->orderBy('id', 'ASC')->get()->map(function($x){ return (array)$x; })->toArray();
                    $kecam = DB::table('kecamatan')->orderBy('id', 'ASC')->get()->map(function($x){ return (array)$x; })->toArray();
                    $desa = DB::table('desa')->orderBy('id', 'ASC')->get()->map(function($x){ return (array)$x; })->toArray();
                    $dusun = DB::table('dusun')->orderBy('id', 'ASC')->get()->map(function($x){ return (array)$x; })->toArray();
                    
                    // Load permohonan
                    $permohonan = DB::table('permohonan')->orderBy('tanggalInput', 'DESC')->get()->map(function ($p) {
                        $pArr = (array) $p;
                        $pArr['shared'] = $pArr['shared'] == 1;
                        $pArr['biaya'] = (int) $pArr['biaya'];
                        return $pArr;
                    })->toArray();
                    
                    // Load logs
                    $logs = DB::table('logs')->orderBy('time', 'DESC')->limit(200)->get()->map(function ($l) {
                        $lArr = (array) $l;
                        $lArr['time'] = date('c', strtotime($lArr['time']));
                        return $lArr;
                    })->toArray();
                    
                    return response()->json([
                        'success' => true,
                        'data' => [
                            'users' => $users,
                            'daya' => $dayas,
                            'wilayah' => [
                                'provinsi' => $provinsi,
                                'kota' => $kota,
                                'kecamatan' => $kecam,
                                'desa' => $desa,
                                'dusun' => $dusun
                            ],
                            'permohonan' => $permohonan,
                            'logs' => $logs
                        ]
                    ]);
                } catch (\Exception $e) {
                    return response()->json(['success' => false, 'error' => $e->getMessage()]);
                }
            }
        }

        // -----------------------------------------------------------------
        // POST HANDLERS (MUTATIONS)
        // -----------------------------------------------------------------
        if ($method === 'POST') {
            if ($action === 'sync_table') {
                try {
                    $table = $request->input('table');
                    $data = $request->input('data');
                    
                    if ($table === 'permohonan') {
                        DB::statement('SET FOREIGN_KEY_CHECKS = 0');
                        DB::table('permohonan')->truncate();
                        
                        foreach ($data as $p) {
                            DB::table('permohonan')->insert([
                                'id' => $p['id'],
                                'namaPemohon' => $p['namaPemohon'],
                                'nik' => $p['nik'],
                                'namaPelanggan' => $p['namaPelanggan'],
                                'daya' => $p['daya'],
                                'alamat' => $p['alamat'],
                                'kecamatan' => $p['kecamatan'],
                                'biaya' => $p['biaya'],
                                'metodePembayaran' => $p['metodePembayaran'],
                                'jenisPermohonan' => $p['jenisPermohonan'],
                                'status' => $p['status'],
                                'ttNidi' => $p['ttNidi'],
                                'ttSlo' => $p['ttSlo'],
                                'catatanNidi' => $p['catatanNidi'] ?? '',
                                'catatanSlo' => $p['catatanSlo'] ?? '',
                                'pembayaranStatus' => $p['pembayaranStatus'],
                                'shared' => $p['shared'] ? 1 : 0,
                                'tanggalInput' => date('Y-m-d H:i:s', strtotime($p['tanggalInput'])),
                                'nidiFile' => $p['nidiFile'] ?? null,
                                'sloFile' => $p['sloFile'] ?? null,
                                'buktiBayar' => $p['buktiBayar'] ?? null
                            ]);
                        }
                        DB::statement('SET FOREIGN_KEY_CHECKS = 1');
                    }
                    elseif ($table === 'logs') {
                        DB::table('logs')->truncate();
                        
                        foreach ($data as $l) {
                            DB::table('logs')->insert([
                                'user' => $l['user'],
                                'action' => $l['action'],
                                'time' => date('Y-m-d H:i:s', strtotime($l['time']))
                            ]);
                        }
                    }
                    elseif ($table === 'users') {
                        DB::statement('SET FOREIGN_KEY_CHECKS = 0');
                        DB::table('users')->truncate();
                        
                        foreach ($data as $u) {
                            DB::table('users')->insert([
                                'id' => $u['id'],
                                'email' => $u['email'],
                                'name' => $u['name'],
                                'role' => $u['role'],
                                'avatar' => $u['avatar'],
                                'phone' => $u['phone'] ?? null
                            ]);
                        }
                        DB::statement('SET FOREIGN_KEY_CHECKS = 1');
                    }
                    elseif ($table === 'daya') {
                        DB::table('daya')->truncate();
                        
                        foreach ($data as $d) {
                            DB::table('daya')->insert([
                                'daya' => $d['daya'],
                                'golongan' => $d['golongan'],
                                'keterangan' => $d['keterangan']
                            ]);
                        }
                    }
                    elseif ($table === 'wilayah') {
                        DB::statement('SET FOREIGN_KEY_CHECKS = 0');
                        DB::table('provinsi')->truncate();
                        DB::table('kota')->truncate();
                        DB::table('kecamatan')->truncate();
                        DB::table('desa')->truncate();
                        DB::table('dusun')->truncate();
                        
                        if (isset($data['provinsi'])) {
                            foreach ($data['provinsi'] as $p) {
                                DB::table('provinsi')->insert([
                                    'id' => $p['id'],
                                    'nama' => $p['nama']
                                ]);
                            }
                        }
                        if (isset($data['kota'])) {
                            foreach ($data['kota'] as $k) {
                                DB::table('kota')->insert([
                                    'id' => $k['id'],
                                    'provinsiId' => $k['provinsiId'],
                                    'nama' => $k['nama']
                                ]);
                            }
                        }
                        if (isset($data['kecamatan'])) {
                            foreach ($data['kecamatan'] as $k) {
                                DB::table('kecamatan')->insert([
                                    'id' => $k['id'],
                                    'kotaId' => $k['kotaId'],
                                    'nama' => $k['nama']
                                ]);
                            }
                        }
                        if (isset($data['desa'])) {
                            foreach ($data['desa'] as $d) {
                                DB::table('desa')->insert([
                                    'id' => $d['id'],
                                    'kecamatanId' => $d['kecamatanId'],
                                    'nama' => $d['nama']
                                ]);
                            }
                        }
                        if (isset($data['dusun'])) {
                            foreach ($data['dusun'] as $d) {
                                DB::table('dusun')->insert([
                                    'id' => $d['id'],
                                    'desaId' => $d['desaId'],
                                    'nama' => $d['nama']
                                ]);
                            }
                        }
                        DB::statement('SET FOREIGN_KEY_CHECKS = 1');
                    }
                    
                    return response()->json([
                        'success' => true, 
                        'message' => "Table $table synchronized successfully!"
                    ]);
                } catch (\Exception $e) {
                    return response()->json(['success' => false, 'error' => $e->getMessage()]);
                }
            }
        }

        return response()->json(['success' => false, 'error' => 'Invalid action or method.']);
    }
}

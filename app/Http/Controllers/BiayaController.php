<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\Biaya;
use Illuminate\Support\Facades\DB;

class BiayaController extends Controller
{
    public function index(Request $request)
    {
        $query = DB::table('biaya')
            ->leftJoin('daya', 'biaya.daya', '=', 'daya.daya')
            ->select('biaya.*', 'daya.golongan', 'daya.keterangan')
            ->orderBy('biaya.daya', 'asc');

        if ($request->has('search')) {
            $search = $request->input('search');
            $query->where('biaya.daya', 'like', "%{$search}%");
        }

        $biayas = $query->paginate(20);

        return view('master.biaya.index', compact('biayas'));
    }
    public function create()
    {
        return view('master.biaya.create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'daya' => 'required|numeric|unique:biaya,daya',
            'nidi' => 'required|numeric',
            'slo' => 'required|numeric',
            'area' => 'required|numeric',
            'mitra' => 'required|numeric',
            'langganan' => 'required|numeric',
            'banyak_rutin' => 'required|numeric',
            'pelanggan' => 'required|numeric',
        ]);

        Biaya::create($validated);

        return redirect()->route('master.biaya.index')->with('success', 'Data biaya berhasil ditambahkan.');
    }

    public function edit($id)
    {
        $biaya = Biaya::where('daya', $id)->firstOrFail();
        return view('master.biaya.edit', compact('biaya'));
    }

    public function update(Request $request, $id)
    {
        $biaya = Biaya::where('daya', $id)->firstOrFail();
        
        $validated = $request->validate([
            'nidi' => 'required|numeric',
            'slo' => 'required|numeric',
            'area' => 'required|numeric',
            'mitra' => 'required|numeric',
            'langganan' => 'required|numeric',
            'banyak_rutin' => 'required|numeric',
            'pelanggan' => 'required|numeric',
        ]);

        $biaya->update($validated);

        return redirect()->route('master.biaya.index')->with('success', 'Data biaya berhasil diubah.');
    }

    public function destroy($id)
    {
        $biaya = Biaya::where('daya', $id)->firstOrFail();
        $biaya->delete();

        return redirect()->route('master.biaya.index')->with('success', 'Data biaya berhasil dihapus.');
    }
}

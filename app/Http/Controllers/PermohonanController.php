<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\Permohonan;

class PermohonanController extends Controller
{
    public function index(Request $request)
    {
        $query = Permohonan::orderBy('tanggalInput', 'desc');

        if ($request->has('search')) {
            $search = $request->input('search');
            $query->where('id', 'like', "%{$search}%")
                  ->orWhere('namaPemohon', 'like', "%{$search}%")
                  ->orWhere('namaPelanggan', 'like', "%{$search}%");
        }

        if ($request->has('status') && $request->input('status') !== 'all') {
            $query->where('status', $request->input('status'));
        }

        $permohonans = $query->paginate(15);

        return view('permohonan.index', compact('permohonans'));
    }
    public function create()
    {
        return view('permohonan.create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'id' => 'required|string|unique:permohonan,id',
            'namaPemohon' => 'required|string|max:255',
            'nik' => 'nullable|string|max:20',
            'namaPelanggan' => 'required|string|max:255',
            'daya' => 'required|string|max:50',
            'alamat' => 'required|string',
            'kecamatan' => 'required|string|max:100',
            'biaya' => 'required|numeric',
            'metodePembayaran' => 'required|string',
            'jenisPermohonan' => 'required|string',
            'status' => 'required|string',
            'pembayaranStatus' => 'required|string',
        ]);

        $validated['tanggalInput'] = date('Y-m-d\TH:i:s');
        $validated['shared'] = 0;

        Permohonan::create($validated);

        return redirect()->route('permohonan.index')->with('success', 'Permohonan berhasil ditambahkan.');
    }

    public function edit(Permohonan $permohonan)
    {
        return view('permohonan.edit', compact('permohonan'));
    }

    public function update(Request $request, Permohonan $permohonan)
    {
        $validated = $request->validate([
            'namaPemohon' => 'required|string|max:255',
            'nik' => 'nullable|string|max:20',
            'namaPelanggan' => 'required|string|max:255',
            'daya' => 'required|string|max:50',
            'alamat' => 'required|string',
            'kecamatan' => 'required|string|max:100',
            'biaya' => 'required|numeric',
            'metodePembayaran' => 'required|string',
            'jenisPermohonan' => 'required|string',
            'status' => 'required|string',
            'pembayaranStatus' => 'required|string',
        ]);

        $permohonan->update($validated);

        return redirect()->route('permohonan.index')->with('success', 'Permohonan berhasil diubah.');
    }

    public function destroy(Permohonan $permohonan)
    {
        $permohonan->delete();

        return redirect()->route('permohonan.index')->with('success', 'Permohonan berhasil dihapus.');
    }
}

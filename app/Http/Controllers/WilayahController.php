<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use Illuminate\Support\Facades\DB;

class WilayahController extends Controller
{
    public function index(Request $request)
    {
        $query = \App\Models\Provinsi::orderBy('nama', 'asc');

        if ($request->has('search')) {
            $search = $request->input('search');
            $query->where('nama', 'like', "%{$search}%")
                  ->orWhere('id', 'like', "%{$search}%");
        }

        $provinsis = $query->paginate(20);

        return view('master.wilayah.index', compact('provinsis'));
    }

    public function create()
    {
        return view('master.wilayah.create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'id' => 'required|string|unique:provinsi,id',
            'nama' => 'required|string|max:255',
        ]);

        \App\Models\Provinsi::create($validated);

        return redirect()->route('master.wilayah.index')->with('success', 'Provinsi berhasil ditambahkan.');
    }

    public function edit($id)
    {
        $provinsi = \App\Models\Provinsi::where('id', $id)->firstOrFail();
        return view('master.wilayah.edit', compact('provinsi'));
    }

    public function update(Request $request, $id)
    {
        $provinsi = \App\Models\Provinsi::where('id', $id)->firstOrFail();
        
        $validated = $request->validate([
            'nama' => 'required|string|max:255',
        ]);

        $provinsi->update($validated);

        return redirect()->route('master.wilayah.index')->with('success', 'Provinsi berhasil diubah.');
    }

    public function destroy($id)
    {
        $provinsi = \App\Models\Provinsi::where('id', $id)->firstOrFail();
        $provinsi->delete();

        return redirect()->route('master.wilayah.index')->with('success', 'Provinsi berhasil dihapus.');
    }
}

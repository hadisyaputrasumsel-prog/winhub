@extends('layouts.app')

@section('header_title', 'Tambah Master Biaya')
@section('header_subtitle', 'Masukkan konfigurasi tarif baru berdasarkan daya.')

@section('content')
<div class="view-content active" style="animation: fadeUp 0.4s ease-out;">
    <div class="portal-card" style="max-width: 800px; margin: 0 auto;">
        <form action="{{ route('master.biaya.store') }}" method="POST">
            @csrf
            
            <div style="margin-bottom: 15px;">
                <label style="display: block; margin-bottom: 5px; font-weight: bold; color: #1E293B;">Daya Listrik (VA) <span style="color: #EF4444;">*</span></label>
                <input type="number" name="daya" value="{{ old('daya') }}" required placeholder="Contoh: 450" style="width: 100%; padding: 10px; border-radius: 8px; border: 1px solid #CBD5E1;">
                @error('daya') <span style="color: #EF4444; font-size: 12px;">{{ $message }}</span> @enderror
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 15px;">
                <div>
                    <label style="display: block; margin-bottom: 5px; font-weight: bold; color: #1E293B;">Tarif NIDI (Rp) <span style="color: #EF4444;">*</span></label>
                    <input type="number" name="nidi" value="{{ old('nidi', 0) }}" required style="width: 100%; padding: 10px; border-radius: 8px; border: 1px solid #CBD5E1;">
                </div>
                <div>
                    <label style="display: block; margin-bottom: 5px; font-weight: bold; color: #1E293B;">Tarif SLO (Rp) <span style="color: #EF4444;">*</span></label>
                    <input type="number" name="slo" value="{{ old('slo', 0) }}" required style="width: 100%; padding: 10px; border-radius: 8px; border: 1px solid #CBD5E1;">
                </div>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 15px;">
                <div>
                    <label style="display: block; margin-bottom: 5px; font-weight: bold; color: #1E293B;">Biaya Area (Rp) <span style="color: #EF4444;">*</span></label>
                    <input type="number" name="area" value="{{ old('area', 0) }}" required style="width: 100%; padding: 10px; border-radius: 8px; border: 1px solid #CBD5E1;">
                </div>
                <div>
                    <label style="display: block; margin-bottom: 5px; font-weight: bold; color: #1E293B;">Biaya Mitra (Rp) <span style="color: #EF4444;">*</span></label>
                    <input type="number" name="mitra" value="{{ old('mitra', 0) }}" required style="width: 100%; padding: 10px; border-radius: 8px; border: 1px solid #CBD5E1;">
                </div>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 15px;">
                <div>
                    <label style="display: block; margin-bottom: 5px; font-weight: bold; color: #1E293B;">Langganan (Rp) <span style="color: #EF4444;">*</span></label>
                    <input type="number" name="langganan" value="{{ old('langganan', 0) }}" required style="width: 100%; padding: 10px; border-radius: 8px; border: 1px solid #CBD5E1;">
                </div>
                <div>
                    <label style="display: block; margin-bottom: 5px; font-weight: bold; color: #1E293B;">Banyak Rutin (Rp) <span style="color: #EF4444;">*</span></label>
                    <input type="number" name="banyak_rutin" value="{{ old('banyak_rutin', 0) }}" required style="width: 100%; padding: 10px; border-radius: 8px; border: 1px solid #CBD5E1;">
                </div>
            </div>

            <div style="margin-bottom: 25px;">
                <label style="display: block; margin-bottom: 5px; font-weight: bold; color: #1E293B;">Biaya Pelanggan (Rp) <span style="color: #EF4444;">*</span></label>
                <input type="number" name="pelanggan" value="{{ old('pelanggan', 0) }}" required style="width: 100%; padding: 10px; border-radius: 8px; border: 1px solid #CBD5E1; background: #F8FAFC;">
                <small style="color: #64748B;">Total biaya yang ditagihkan ke pelanggan.</small>
            </div>

            <div style="display: flex; gap: 10px; justify-content: flex-end;">
                <a href="{{ route('master.biaya.index') }}" class="btn-secondary" style="padding: 10px 20px; text-decoration: none;">Batal</a>
                <button type="submit" class="btn-primary" style="padding: 10px 20px; border: none; cursor: pointer;">Simpan Data</button>
            </div>
        </form>
    </div>
</div>
@endsection

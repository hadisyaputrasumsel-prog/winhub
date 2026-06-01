@extends('layouts.app')

@section('header_title', 'Edit Master Biaya')
@section('header_subtitle', 'Ubah konfigurasi tarif layanan.')

@section('content')
<div class="view-content active" style="animation: fadeUp 0.4s ease-out;">
    <div class="portal-card" style="max-width: 800px; margin: 0 auto;">
        <form action="{{ route('master.biaya.update', $biaya->daya) }}" method="POST">
            @csrf
            @method('PUT')
            
            <div style="margin-bottom: 15px;">
                <label style="display: block; margin-bottom: 5px; font-weight: bold; color: #1E293B;">Daya Listrik (VA)</label>
                <input type="number" name="daya" value="{{ $biaya->daya }}" readonly style="width: 100%; padding: 10px; border-radius: 8px; border: 1px solid #CBD5E1; background: #F1F5F9; color: #64748B;">
                <small style="color: #64748B;">Daya tidak dapat diubah. Hapus dan buat baru jika salah.</small>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 15px;">
                <div>
                    <label style="display: block; margin-bottom: 5px; font-weight: bold; color: #1E293B;">Tarif NIDI (Rp) <span style="color: #EF4444;">*</span></label>
                    <input type="number" name="nidi" value="{{ old('nidi', $biaya->nidi) }}" required style="width: 100%; padding: 10px; border-radius: 8px; border: 1px solid #CBD5E1;">
                </div>
                <div>
                    <label style="display: block; margin-bottom: 5px; font-weight: bold; color: #1E293B;">Tarif SLO (Rp) <span style="color: #EF4444;">*</span></label>
                    <input type="number" name="slo" value="{{ old('slo', $biaya->slo) }}" required style="width: 100%; padding: 10px; border-radius: 8px; border: 1px solid #CBD5E1;">
                </div>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 15px;">
                <div>
                    <label style="display: block; margin-bottom: 5px; font-weight: bold; color: #1E293B;">Biaya Area (Rp) <span style="color: #EF4444;">*</span></label>
                    <input type="number" name="area" value="{{ old('area', $biaya->area) }}" required style="width: 100%; padding: 10px; border-radius: 8px; border: 1px solid #CBD5E1;">
                </div>
                <div>
                    <label style="display: block; margin-bottom: 5px; font-weight: bold; color: #1E293B;">Biaya Mitra (Rp) <span style="color: #EF4444;">*</span></label>
                    <input type="number" name="mitra" value="{{ old('mitra', $biaya->mitra) }}" required style="width: 100%; padding: 10px; border-radius: 8px; border: 1px solid #CBD5E1;">
                </div>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 15px;">
                <div>
                    <label style="display: block; margin-bottom: 5px; font-weight: bold; color: #1E293B;">Langganan (Rp) <span style="color: #EF4444;">*</span></label>
                    <input type="number" name="langganan" value="{{ old('langganan', $biaya->langganan) }}" required style="width: 100%; padding: 10px; border-radius: 8px; border: 1px solid #CBD5E1;">
                </div>
                <div>
                    <label style="display: block; margin-bottom: 5px; font-weight: bold; color: #1E293B;">Banyak Rutin (Rp) <span style="color: #EF4444;">*</span></label>
                    <input type="number" name="banyak_rutin" value="{{ old('banyak_rutin', $biaya->banyak_rutin) }}" required style="width: 100%; padding: 10px; border-radius: 8px; border: 1px solid #CBD5E1;">
                </div>
            </div>

            <div style="margin-bottom: 25px;">
                <label style="display: block; margin-bottom: 5px; font-weight: bold; color: #1E293B;">Biaya Pelanggan (Rp) <span style="color: #EF4444;">*</span></label>
                <input type="number" name="pelanggan" value="{{ old('pelanggan', $biaya->pelanggan) }}" required style="width: 100%; padding: 10px; border-radius: 8px; border: 1px solid #CBD5E1; background: #F8FAFC;">
            </div>

            <div style="display: flex; gap: 10px; justify-content: flex-end;">
                <a href="{{ route('master.biaya.index') }}" class="btn-secondary" style="padding: 10px 20px; text-decoration: none;">Batal</a>
                <button type="submit" class="btn-primary" style="padding: 10px 20px; border: none; cursor: pointer;">Update Data</button>
            </div>
        </form>
    </div>
</div>
@endsection

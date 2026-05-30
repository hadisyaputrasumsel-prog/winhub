@extends('layouts.app')

@section('header_title', 'Edit Permohonan')
@section('header_subtitle', 'Ubah data permohonan SLO/NIDI.')

@section('content')
<div class="view-content active" style="animation: fadeUp 0.4s ease-out;">
    <div class="portal-card" style="max-width: 800px; margin: 0 auto;">
        <form action="{{ route('permohonan.update', $permohonan->id) }}" method="POST">
            @csrf
            @method('PUT')
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 15px;">
                <div>
                    <label style="display: block; margin-bottom: 5px; font-weight: bold; color: #1E293B;">ID Registrasi</label>
                    <input type="text" name="id" value="{{ $permohonan->id }}" readonly style="width: 100%; padding: 10px; border-radius: 8px; border: 1px solid #CBD5E1; background: #F1F5F9; color: #64748B;">
                </div>
                <div>
                    <label style="display: block; margin-bottom: 5px; font-weight: bold; color: #1E293B;">Jenis Layanan <span style="color: #EF4444;">*</span></label>
                    <select name="jenisPermohonan" required style="width: 100%; padding: 10px; border-radius: 8px; border: 1px solid #CBD5E1; background: white;">
                        <option value="SLO & NIDI" {{ old('jenisPermohonan', $permohonan->jenisPermohonan) == 'SLO & NIDI' ? 'selected' : '' }}>SLO & NIDI</option>
                        <option value="Hanya SLO" {{ old('jenisPermohonan', $permohonan->jenisPermohonan) == 'Hanya SLO' ? 'selected' : '' }}>Hanya SLO</option>
                        <option value="Hanya NIDI" {{ old('jenisPermohonan', $permohonan->jenisPermohonan) == 'Hanya NIDI' ? 'selected' : '' }}>Hanya NIDI</option>
                    </select>
                </div>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 15px;">
                <div>
                    <label style="display: block; margin-bottom: 5px; font-weight: bold; color: #1E293B;">Nama Pemohon <span style="color: #EF4444;">*</span></label>
                    <input type="text" name="namaPemohon" value="{{ old('namaPemohon', $permohonan->namaPemohon) }}" required style="width: 100%; padding: 10px; border-radius: 8px; border: 1px solid #CBD5E1;">
                    @error('namaPemohon') <span style="color: #EF4444; font-size: 12px;">{{ $message }}</span> @enderror
                </div>
                <div>
                    <label style="display: block; margin-bottom: 5px; font-weight: bold; color: #1E293B;">NIK (KTP)</label>
                    <input type="text" name="nik" value="{{ old('nik', $permohonan->nik) }}" style="width: 100%; padding: 10px; border-radius: 8px; border: 1px solid #CBD5E1;">
                </div>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 15px;">
                <div>
                    <label style="display: block; margin-bottom: 5px; font-weight: bold; color: #1E293B;">Nama Pelanggan (Pemilik) <span style="color: #EF4444;">*</span></label>
                    <input type="text" name="namaPelanggan" value="{{ old('namaPelanggan', $permohonan->namaPelanggan) }}" required style="width: 100%; padding: 10px; border-radius: 8px; border: 1px solid #CBD5E1;">
                </div>
                <div>
                    <label style="display: block; margin-bottom: 5px; font-weight: bold; color: #1E293B;">Daya (VA) <span style="color: #EF4444;">*</span></label>
                    <input type="text" name="daya" value="{{ old('daya', $permohonan->daya) }}" required placeholder="Misal: 900" style="width: 100%; padding: 10px; border-radius: 8px; border: 1px solid #CBD5E1;">
                </div>
            </div>

            <div style="margin-bottom: 15px;">
                <label style="display: block; margin-bottom: 5px; font-weight: bold; color: #1E293B;">Alamat Lokasi <span style="color: #EF4444;">*</span></label>
                <textarea name="alamat" required rows="3" style="width: 100%; padding: 10px; border-radius: 8px; border: 1px solid #CBD5E1;">{{ old('alamat', $permohonan->alamat) }}</textarea>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 15px;">
                <div>
                    <label style="display: block; margin-bottom: 5px; font-weight: bold; color: #1E293B;">Kecamatan <span style="color: #EF4444;">*</span></label>
                    <input type="text" name="kecamatan" value="{{ old('kecamatan', $permohonan->kecamatan) }}" required style="width: 100%; padding: 10px; border-radius: 8px; border: 1px solid #CBD5E1;">
                </div>
                <div>
                    <label style="display: block; margin-bottom: 5px; font-weight: bold; color: #1E293B;">Biaya Total (Rp) <span style="color: #EF4444;">*</span></label>
                    <input type="number" name="biaya" value="{{ old('biaya', $permohonan->biaya) }}" required style="width: 100%; padding: 10px; border-radius: 8px; border: 1px solid #CBD5E1;">
                </div>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 15px; margin-bottom: 25px;">
                <div>
                    <label style="display: block; margin-bottom: 5px; font-weight: bold; color: #1E293B;">Status Permohonan <span style="color: #EF4444;">*</span></label>
                    <select name="status" required style="width: 100%; padding: 10px; border-radius: 8px; border: 1px solid #CBD5E1; background: white;">
                        <option value="Draft" {{ old('status', $permohonan->status) == 'Draft' ? 'selected' : '' }}>Draft</option>
                        <option value="Waiting Process" {{ old('status', $permohonan->status) == 'Waiting Process' ? 'selected' : '' }}>Waiting Process</option>
                        <option value="Proses NIDI" {{ old('status', $permohonan->status) == 'Proses NIDI' ? 'selected' : '' }}>Proses NIDI</option>
                        <option value="Proses SLO" {{ old('status', $permohonan->status) == 'Proses SLO' ? 'selected' : '' }}>Proses SLO</option>
                        <option value="Completed" {{ old('status', $permohonan->status) == 'Completed' ? 'selected' : '' }}>Completed</option>
                        <option value="NIDI Selesai" {{ old('status', $permohonan->status) == 'NIDI Selesai' ? 'selected' : '' }}>NIDI Selesai</option>
                        <option value="SLO Selesai" {{ old('status', $permohonan->status) == 'SLO Selesai' ? 'selected' : '' }}>SLO Selesai</option>
                    </select>
                </div>
                <div>
                    <label style="display: block; margin-bottom: 5px; font-weight: bold; color: #1E293B;">Metode Bayar <span style="color: #EF4444;">*</span></label>
                    <select name="metodePembayaran" required style="width: 100%; padding: 10px; border-radius: 8px; border: 1px solid #CBD5E1; background: white;">
                        <option value="Transfer Bank" {{ old('metodePembayaran', $permohonan->metodePembayaran) == 'Transfer Bank' ? 'selected' : '' }}>Transfer Bank</option>
                        <option value="Cash" {{ old('metodePembayaran', $permohonan->metodePembayaran) == 'Cash' ? 'selected' : '' }}>Cash</option>
                        <option value="E-Wallet" {{ old('metodePembayaran', $permohonan->metodePembayaran) == 'E-Wallet' ? 'selected' : '' }}>E-Wallet</option>
                    </select>
                </div>
                <div>
                    <label style="display: block; margin-bottom: 5px; font-weight: bold; color: #1E293B;">Status Bayar <span style="color: #EF4444;">*</span></label>
                    <select name="pembayaranStatus" required style="width: 100%; padding: 10px; border-radius: 8px; border: 1px solid #CBD5E1; background: white;">
                        <option value="Unpaid" {{ old('pembayaranStatus', $permohonan->pembayaranStatus) == 'Unpaid' ? 'selected' : '' }}>Unpaid</option>
                        <option value="Paid" {{ old('pembayaranStatus', $permohonan->pembayaranStatus) == 'Paid' ? 'selected' : '' }}>Paid</option>
                    </select>
                </div>
            </div>

            <div style="display: flex; gap: 10px; justify-content: flex-end;">
                <a href="{{ route('permohonan.index') }}" class="btn-secondary" style="padding: 10px 20px; text-decoration: none;">Batal</a>
                <button type="submit" class="btn-primary" style="padding: 10px 20px; border: none; cursor: pointer;">Update Data</button>
            </div>
        </form>
    </div>
</div>
@endsection

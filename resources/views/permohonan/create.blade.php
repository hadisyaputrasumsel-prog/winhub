@extends('layouts.app')

@section('header_title', 'Tambah Permohonan')
@section('header_subtitle', 'Masukkan data permohonan SLO/NIDI baru.')

@section('content')
<div class="view-content active" style="animation: fadeUp 0.4s ease-out;">
    <div class="portal-card" style="max-width: 800px; margin: 0 auto;">
        <form action="{{ route('permohonan.store') }}" method="POST">
            @csrf
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 15px;">
                <div>
                    <label style="display: block; margin-bottom: 5px; font-weight: bold; color: #1E293B;">ID Registrasi <span style="color: #EF4444;">*</span></label>
                    <input type="text" name="id" value="{{ old('id', 'REG-'.date('Ymd').'-'.rand(1000,9999)) }}" required style="width: 100%; padding: 10px; border-radius: 8px; border: 1px solid #CBD5E1;">
                    @error('id') <span style="color: #EF4444; font-size: 12px;">{{ $message }}</span> @enderror
                </div>
                <div>
                    <label style="display: block; margin-bottom: 5px; font-weight: bold; color: #1E293B;">Jenis Layanan <span style="color: #EF4444;">*</span></label>
                    <select name="jenisPermohonan" required style="width: 100%; padding: 10px; border-radius: 8px; border: 1px solid #CBD5E1; background: white;">
                        <option value="SLO & NIDI" {{ old('jenisPermohonan') == 'SLO & NIDI' ? 'selected' : '' }}>SLO & NIDI</option>
                        <option value="Hanya SLO" {{ old('jenisPermohonan') == 'Hanya SLO' ? 'selected' : '' }}>Hanya SLO</option>
                        <option value="Hanya NIDI" {{ old('jenisPermohonan') == 'Hanya NIDI' ? 'selected' : '' }}>Hanya NIDI</option>
                    </select>
                </div>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 15px;">
                <div>
                    <label style="display: block; margin-bottom: 5px; font-weight: bold; color: #1E293B;">Nama Pemohon <span style="color: #EF4444;">*</span></label>
                    <input type="text" name="namaPemohon" value="{{ old('namaPemohon') }}" required style="width: 100%; padding: 10px; border-radius: 8px; border: 1px solid #CBD5E1;">
                    @error('namaPemohon') <span style="color: #EF4444; font-size: 12px;">{{ $message }}</span> @enderror
                </div>
                <div>
                    <label style="display: block; margin-bottom: 5px; font-weight: bold; color: #1E293B;">NIK (KTP)</label>
                    <input type="text" name="nik" value="{{ old('nik') }}" style="width: 100%; padding: 10px; border-radius: 8px; border: 1px solid #CBD5E1;">
                </div>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 15px;">
                <div>
                    <label style="display: block; margin-bottom: 5px; font-weight: bold; color: #1E293B;">Nama Pelanggan (Pemilik) <span style="color: #EF4444;">*</span></label>
                    <input type="text" name="namaPelanggan" value="{{ old('namaPelanggan') }}" required style="width: 100%; padding: 10px; border-radius: 8px; border: 1px solid #CBD5E1;">
                </div>
                <div>
                    <label style="display: block; margin-bottom: 5px; font-weight: bold; color: #1E293B;">Daya (VA) <span style="color: #EF4444;">*</span></label>
                    <input type="text" name="daya" value="{{ old('daya') }}" required placeholder="Misal: 900" style="width: 100%; padding: 10px; border-radius: 8px; border: 1px solid #CBD5E1;">
                </div>
            </div>

            <div style="margin-bottom: 15px;">
                <label style="display: block; margin-bottom: 5px; font-weight: bold; color: #1E293B;">Alamat Lokasi <span style="color: #EF4444;">*</span></label>
                <textarea name="alamat" required rows="3" style="width: 100%; padding: 10px; border-radius: 8px; border: 1px solid #CBD5E1;">{{ old('alamat') }}</textarea>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 15px;">
                <div>
                    <label style="display: block; margin-bottom: 5px; font-weight: bold; color: #1E293B;">Kecamatan <span style="color: #EF4444;">*</span></label>
                    <input type="text" name="kecamatan" value="{{ old('kecamatan') }}" required style="width: 100%; padding: 10px; border-radius: 8px; border: 1px solid #CBD5E1;">
                </div>
                <div>
                    <label style="display: block; margin-bottom: 5px; font-weight: bold; color: #1E293B;">Biaya Total (Rp) <span style="color: #EF4444;">*</span></label>
                    <input type="number" name="biaya" value="{{ old('biaya') }}" required style="width: 100%; padding: 10px; border-radius: 8px; border: 1px solid #CBD5E1;">
                </div>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 15px; margin-bottom: 25px;">
                <div>
                    <label style="display: block; margin-bottom: 5px; font-weight: bold; color: #1E293B;">Status Permohonan <span style="color: #EF4444;">*</span></label>
                    <select name="status" required style="width: 100%; padding: 10px; border-radius: 8px; border: 1px solid #CBD5E1; background: white;">
                        <option value="Draft" {{ old('status') == 'Draft' ? 'selected' : '' }}>Draft</option>
                        <option value="Waiting Process" {{ old('status') == 'Waiting Process' ? 'selected' : '' }}>Waiting Process</option>
                        <option value="Proses NIDI" {{ old('status') == 'Proses NIDI' ? 'selected' : '' }}>Proses NIDI</option>
                        <option value="Proses SLO" {{ old('status') == 'Proses SLO' ? 'selected' : '' }}>Proses SLO</option>
                        <option value="Completed" {{ old('status') == 'Completed' ? 'selected' : '' }}>Completed</option>
                    </select>
                </div>
                <div>
                    <label style="display: block; margin-bottom: 5px; font-weight: bold; color: #1E293B;">Metode Bayar <span style="color: #EF4444;">*</span></label>
                    <select name="metodePembayaran" required style="width: 100%; padding: 10px; border-radius: 8px; border: 1px solid #CBD5E1; background: white;">
                        <option value="Transfer Bank" {{ old('metodePembayaran') == 'Transfer Bank' ? 'selected' : '' }}>Transfer Bank</option>
                        <option value="Cash" {{ old('metodePembayaran') == 'Cash' ? 'selected' : '' }}>Cash</option>
                        <option value="E-Wallet" {{ old('metodePembayaran') == 'E-Wallet' ? 'selected' : '' }}>E-Wallet</option>
                    </select>
                </div>
                <div>
                    <label style="display: block; margin-bottom: 5px; font-weight: bold; color: #1E293B;">Status Bayar <span style="color: #EF4444;">*</span></label>
                    <select name="pembayaranStatus" required style="width: 100%; padding: 10px; border-radius: 8px; border: 1px solid #CBD5E1; background: white;">
                        <option value="Unpaid" {{ old('pembayaranStatus') == 'Unpaid' ? 'selected' : '' }}>Unpaid</option>
                        <option value="Paid" {{ old('pembayaranStatus') == 'Paid' ? 'selected' : '' }}>Paid</option>
                    </select>
                </div>
            </div>

            <div style="display: flex; gap: 10px; justify-content: flex-end;">
                <a href="{{ route('permohonan.index') }}" class="btn-secondary" style="padding: 10px 20px; text-decoration: none;">Batal</a>
                <button type="submit" class="btn-primary" style="padding: 10px 20px; border: none; cursor: pointer;">Simpan Data</button>
            </div>
        </form>
    </div>
</div>
@endsection

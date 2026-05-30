@extends('layouts.app')

@section('header_title', 'Tambah User')
@section('header_subtitle', 'Tambahkan pengguna baru ke dalam sistem.')

@section('content')
<div class="view-content active" style="animation: fadeUp 0.4s ease-out;">
    <div class="portal-card" style="max-width: 600px; margin: 0 auto;">
        <form action="{{ route('users.store') }}" method="POST">
            @csrf
            
            <div style="margin-bottom: 15px;">
                <label style="display: block; margin-bottom: 5px; font-weight: bold; color: #1E293B;">ID User <span style="color: #EF4444;">*</span></label>
                <input type="text" name="id" value="{{ old('id') }}" required placeholder="Contoh: usr-05" style="width: 100%; padding: 10px; border-radius: 8px; border: 1px solid #CBD5E1;">
                @error('id')
                    <span style="color: #EF4444; font-size: 12px;">{{ $message }}</span>
                @enderror
            </div>

            <div style="margin-bottom: 15px;">
                <label style="display: block; margin-bottom: 5px; font-weight: bold; color: #1E293B;">Nama Lengkap <span style="color: #EF4444;">*</span></label>
                <input type="text" name="name" value="{{ old('name') }}" required placeholder="Nama lengkap" style="width: 100%; padding: 10px; border-radius: 8px; border: 1px solid #CBD5E1;">
                @error('name')
                    <span style="color: #EF4444; font-size: 12px;">{{ $message }}</span>
                @enderror
            </div>

            <div style="margin-bottom: 15px;">
                <label style="display: block; margin-bottom: 5px; font-weight: bold; color: #1E293B;">Email <span style="color: #EF4444;">*</span></label>
                <input type="email" name="email" value="{{ old('email') }}" required placeholder="email@example.com" style="width: 100%; padding: 10px; border-radius: 8px; border: 1px solid #CBD5E1;">
                @error('email')
                    <span style="color: #EF4444; font-size: 12px;">{{ $message }}</span>
                @enderror
            </div>
            
            <div style="margin-bottom: 15px;">
                <label style="display: block; margin-bottom: 5px; font-weight: bold; color: #1E293B;">No. HP</label>
                <input type="text" name="phone" value="{{ old('phone') }}" placeholder="08..." style="width: 100%; padding: 10px; border-radius: 8px; border: 1px solid #CBD5E1;">
                @error('phone')
                    <span style="color: #EF4444; font-size: 12px;">{{ $message }}</span>
                @enderror
            </div>

            <div style="margin-bottom: 15px;">
                <label style="display: block; margin-bottom: 5px; font-weight: bold; color: #1E293B;">Role Akses <span style="color: #EF4444;">*</span></label>
                <select name="role" required style="width: 100%; padding: 10px; border-radius: 8px; border: 1px solid #CBD5E1; background: white;">
                    <option value="">Pilih Role</option>
                    <option value="Super Admin" {{ old('role') == 'Super Admin' ? 'selected' : '' }}>Super Admin</option>
                    <option value="Admin Pelayanan" {{ old('role') == 'Admin Pelayanan' ? 'selected' : '' }}>Admin Pelayanan</option>
                    <option value="Admin Proses" {{ old('role') == 'Admin Proses' ? 'selected' : '' }}>Admin Proses</option>
                    <option value="TT NIDI" {{ old('role') == 'TT NIDI' ? 'selected' : '' }}>TT NIDI</option>
                    <option value="TT SLO" {{ old('role') == 'TT SLO' ? 'selected' : '' }}>TT SLO</option>
                    <option value="Admin Keuangan" {{ old('role') == 'Admin Keuangan' ? 'selected' : '' }}>Admin Keuangan</option>
                    <option value="Manager" {{ old('role') == 'Manager' ? 'selected' : '' }}>Manager</option>
                </select>
                @error('role')
                    <span style="color: #EF4444; font-size: 12px;">{{ $message }}</span>
                @enderror
            </div>

            <div style="margin-bottom: 25px;">
                <label style="display: block; margin-bottom: 5px; font-weight: bold; color: #1E293B;">Password <span style="color: #EF4444;">*</span></label>
                <input type="password" name="password" required placeholder="Minimal 6 karakter" style="width: 100%; padding: 10px; border-radius: 8px; border: 1px solid #CBD5E1;">
                @error('password')
                    <span style="color: #EF4444; font-size: 12px;">{{ $message }}</span>
                @enderror
            </div>

            <div style="display: flex; gap: 10px; justify-content: flex-end;">
                <a href="{{ route('users.index') }}" class="btn-secondary" style="padding: 10px 20px; text-decoration: none;">Batal</a>
                <button type="submit" class="btn-primary" style="padding: 10px 20px; border: none; cursor: pointer;">Simpan User</button>
            </div>
        </form>
    </div>
</div>
@endsection

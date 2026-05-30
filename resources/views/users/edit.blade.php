@extends('layouts.app')

@section('header_title', 'Edit User')
@section('header_subtitle', 'Ubah data pengguna sistem.')

@section('content')
<div class="view-content active" style="animation: fadeUp 0.4s ease-out;">
    <div class="portal-card" style="max-width: 600px; margin: 0 auto;">
        <form action="{{ route('users.update', $user->id) }}" method="POST">
            @csrf
            @method('PUT')
            
            <div style="margin-bottom: 15px;">
                <label style="display: block; margin-bottom: 5px; font-weight: bold; color: #1E293B;">ID User</label>
                <input type="text" name="id" value="{{ $user->id }}" readonly style="width: 100%; padding: 10px; border-radius: 8px; border: 1px solid #CBD5E1; background: #F1F5F9; color: #64748B;">
                <small style="color: #64748B;">ID tidak dapat diubah.</small>
            </div>

            <div style="margin-bottom: 15px;">
                <label style="display: block; margin-bottom: 5px; font-weight: bold; color: #1E293B;">Nama Lengkap <span style="color: #EF4444;">*</span></label>
                <input type="text" name="name" value="{{ old('name', $user->name) }}" required placeholder="Nama lengkap" style="width: 100%; padding: 10px; border-radius: 8px; border: 1px solid #CBD5E1;">
                @error('name')
                    <span style="color: #EF4444; font-size: 12px;">{{ $message }}</span>
                @enderror
            </div>

            <div style="margin-bottom: 15px;">
                <label style="display: block; margin-bottom: 5px; font-weight: bold; color: #1E293B;">Email <span style="color: #EF4444;">*</span></label>
                <input type="email" name="email" value="{{ old('email', $user->email) }}" required placeholder="email@example.com" style="width: 100%; padding: 10px; border-radius: 8px; border: 1px solid #CBD5E1;">
                @error('email')
                    <span style="color: #EF4444; font-size: 12px;">{{ $message }}</span>
                @enderror
            </div>
            
            <div style="margin-bottom: 15px;">
                <label style="display: block; margin-bottom: 5px; font-weight: bold; color: #1E293B;">No. HP</label>
                <input type="text" name="phone" value="{{ old('phone', $user->phone) }}" placeholder="08..." style="width: 100%; padding: 10px; border-radius: 8px; border: 1px solid #CBD5E1;">
                @error('phone')
                    <span style="color: #EF4444; font-size: 12px;">{{ $message }}</span>
                @enderror
            </div>

            <div style="margin-bottom: 15px;">
                <label style="display: block; margin-bottom: 5px; font-weight: bold; color: #1E293B;">Role Akses <span style="color: #EF4444;">*</span></label>
                <select name="role" required style="width: 100%; padding: 10px; border-radius: 8px; border: 1px solid #CBD5E1; background: white;">
                    <option value="">Pilih Role</option>
                    <option value="Super Admin" {{ old('role', $user->role) == 'Super Admin' ? 'selected' : '' }}>Super Admin</option>
                    <option value="Admin Pelayanan" {{ old('role', $user->role) == 'Admin Pelayanan' ? 'selected' : '' }}>Admin Pelayanan</option>
                    <option value="Admin Proses" {{ old('role', $user->role) == 'Admin Proses' ? 'selected' : '' }}>Admin Proses</option>
                    <option value="TT NIDI" {{ old('role', $user->role) == 'TT NIDI' ? 'selected' : '' }}>TT NIDI</option>
                    <option value="TT SLO" {{ old('role', $user->role) == 'TT SLO' ? 'selected' : '' }}>TT SLO</option>
                    <option value="Admin Keuangan" {{ old('role', $user->role) == 'Admin Keuangan' ? 'selected' : '' }}>Admin Keuangan</option>
                    <option value="Manager" {{ old('role', $user->role) == 'Manager' ? 'selected' : '' }}>Manager</option>
                </select>
                @error('role')
                    <span style="color: #EF4444; font-size: 12px;">{{ $message }}</span>
                @enderror
            </div>

            <div style="margin-bottom: 25px;">
                <label style="display: block; margin-bottom: 5px; font-weight: bold; color: #1E293B;">Password</label>
                <input type="password" name="password" placeholder="Kosongkan jika tidak ingin mengubah" style="width: 100%; padding: 10px; border-radius: 8px; border: 1px solid #CBD5E1;">
                <small style="color: #64748B;">Isi jika ingin mengubah password (minimal 6 karakter).</small>
                @error('password')
                    <br><span style="color: #EF4444; font-size: 12px;">{{ $message }}</span>
                @enderror
            </div>

            <div style="display: flex; gap: 10px; justify-content: flex-end;">
                <a href="{{ route('users.index') }}" class="btn-secondary" style="padding: 10px 20px; text-decoration: none;">Batal</a>
                <button type="submit" class="btn-primary" style="padding: 10px 20px; border: none; cursor: pointer;">Update User</button>
            </div>
        </form>
    </div>
</div>
@endsection

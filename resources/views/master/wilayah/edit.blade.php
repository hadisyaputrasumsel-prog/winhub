@extends('layouts.app')

@section('header_title', 'Edit Provinsi')
@section('header_subtitle', 'Ubah data wilayah provinsi.')

@section('content')
<div class="view-content active" style="animation: fadeUp 0.4s ease-out;">
    <div class="portal-card" style="max-width: 500px; margin: 0 auto;">
        <form action="{{ route('master.wilayah.update', $provinsi->id) }}" method="POST">
            @csrf
            @method('PUT')
            
            <div style="margin-bottom: 15px;">
                <label style="display: block; margin-bottom: 5px; font-weight: bold; color: #1E293B;">ID Provinsi</label>
                <input type="text" name="id" value="{{ $provinsi->id }}" readonly style="width: 100%; padding: 10px; border-radius: 8px; border: 1px solid #CBD5E1; background: #F1F5F9; color: #64748B;">
                <small style="color: #64748B;">ID Provinsi tidak dapat diubah.</small>
            </div>

            <div style="margin-bottom: 25px;">
                <label style="display: block; margin-bottom: 5px; font-weight: bold; color: #1E293B;">Nama Provinsi <span style="color: #EF4444;">*</span></label>
                <input type="text" name="nama" value="{{ old('nama', $provinsi->nama) }}" required style="width: 100%; padding: 10px; border-radius: 8px; border: 1px solid #CBD5E1;">
                @error('nama') <span style="color: #EF4444; font-size: 12px;">{{ $message }}</span> @enderror
            </div>

            <div style="display: flex; gap: 10px; justify-content: flex-end;">
                <a href="{{ route('master.wilayah.index') }}" class="btn-secondary" style="padding: 10px 20px; text-decoration: none;">Batal</a>
                <button type="submit" class="btn-primary" style="padding: 10px 20px; border: none; cursor: pointer;">Update Data</button>
            </div>
        </form>
    </div>
</div>
@endsection

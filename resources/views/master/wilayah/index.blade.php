@extends('layouts.app')

@section('header_title', 'Master Wilayah (Provinsi)')
@section('header_subtitle', 'Manajemen direktori wilayah pelayanan.')

@section('content')
<div class="view-content active" id="wilayah-view" style="animation: fadeUp 0.4s ease-out;">
    @if(session('success'))
        <div style="padding: 15px; margin-bottom: 20px; background: #D1FAE5; color: #065F46; border-radius: 8px; border: 1px solid #34D399;">
            <i class="fas fa-check-circle"></i> {{ session('success') }}
        </div>
    @endif
    @if(session('error'))
        <div style="padding: 15px; margin-bottom: 20px; background: #FEE2E2; color: #B91C1C; border-radius: 8px; border: 1px solid #F87171;">
            <i class="fas fa-exclamation-circle"></i> {{ session('error') }}
        </div>
    @endif
    <div class="portal-card">
        <div class="table-controls" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; flex-wrap: wrap; gap: 15px;">
            <div class="search-box">
                <form action="{{ route('master.wilayah.index') }}" method="GET" style="display:flex; align-items:center;">
                    <i class="fas fa-search" style="position: absolute; margin-left: 10px; color: #94A3B8;"></i>
                    <input type="text" name="search" value="{{ request('search') }}" placeholder="Cari Provinsi..." style="padding: 10px 10px 10px 35px; border-radius: 8px; border: 1px solid #CBD5E1; background: white; width: 250px;">
                    
                    <button type="submit" class="btn-action" style="margin-left: 10px; padding: 10px 15px;">Cari</button>
                    @if(request('search'))
                        <a href="{{ route('master.wilayah.index') }}" class="btn-secondary" style="margin-left: 10px; padding: 10px 15px; text-decoration: none;">Reset</a>
                    @endif
                </form>
            </div>
            <div class="action-buttons">
                <a href="{{ route('master.wilayah.create') }}" class="btn-primary" style="text-decoration:none;"><i class="fas fa-plus"></i> Tambah Provinsi</a>
            </div>
        </div>

        <div class="table-responsive">
            <table class="data-table">
                <thead>
                    <tr>
                        <th>ID Provinsi</th>
                        <th>Nama Provinsi</th>
                        <th style="text-align: center;">Aksi</th>
                    </tr>
                </thead>
                <tbody>
                    @forelse($provinsis as $provinsi)
                        <tr>
                            <td>
                                <strong>{{ $provinsi->id }}</strong>
                            </td>
                            <td>
                                <strong>{{ $provinsi->nama }}</strong>
                            </td>
                            <td style="text-align: center;">
                                <div style="display: flex; gap: 5px; justify-content: center;">
                                    <a href="#" class="btn-action" style="padding: 5px 10px; font-size: 12px; text-decoration:none;"><i class="fas fa-eye"></i> Lihat Kota</a>
                                    <a href="{{ route('master.wilayah.edit', $provinsi->id) }}" class="btn-secondary" style="padding: 5px 10px; font-size: 12px; text-decoration:none;"><i class="fas fa-edit"></i> Edit</a>
                                    <form action="{{ route('master.wilayah.destroy', $provinsi->id) }}" method="POST" onsubmit="return confirm('Hapus provinsi ini?');" style="margin: 0;">
                                        @csrf
                                        @method('DELETE')
                                        <button type="submit" class="btn-secondary" style="padding: 5px 10px; font-size: 12px; color: #EF4444; border-color: #EF4444; cursor:pointer;"><i class="fas fa-trash"></i></button>
                                    </form>
                                </div>
                            </td>
                        </tr>
                    @empty
                        <tr>
                            <td colspan="3" style="text-align: center; padding: 20px; color: #94A3B8;">Tidak ada data master provinsi.</td>
                        </tr>
                    @endforelse
                </tbody>
            </table>
        </div>
        
        <div style="margin-top: 20px;">
            {{ $provinsis->withQueryString()->links('pagination::bootstrap-4') }}
        </div>
    </div>
</div>
@endsection

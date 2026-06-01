@extends('layouts.app')

@section('header_title', 'Master Biaya & Daya')
@section('header_subtitle', 'Manajemen daftar harga layanan SLO dan NIDI berdasarkan daya listrik.')

@section('content')
<div class="view-content active" id="biaya-view" style="animation: fadeUp 0.4s ease-out;">
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
                <form action="{{ route('master.biaya.index') }}" method="GET" style="display:flex; align-items:center;">
                    <i class="fas fa-search" style="position: absolute; margin-left: 10px; color: #94A3B8;"></i>
                    <input type="text" name="search" value="{{ request('search') }}" placeholder="Cari Daya Listrik (VA)..." style="padding: 10px 10px 10px 35px; border-radius: 8px; border: 1px solid #CBD5E1; background: white; width: 250px;">
                    
                    <button type="submit" class="btn-action" style="margin-left: 10px; padding: 10px 15px;">Cari</button>
                    @if(request('search'))
                        <a href="{{ route('master.biaya.index') }}" class="btn-secondary" style="margin-left: 10px; padding: 10px 15px; text-decoration: none;">Reset</a>
                    @endif
                </form>
            </div>
            <div class="action-buttons">
                <a href="{{ route('master.biaya.create') }}" class="btn-primary" style="text-decoration:none;"><i class="fas fa-plus"></i> Tambah Tarif</a>
            </div>
        </div>

        <div class="table-responsive">
            <table class="data-table">
                <thead>
                    <tr>
                        <th style="width: 250px; min-width: 200px;">Daya Listrik</th>
                        <th>Golongan / Keterangan</th>
                        <th style="text-align: right;">NIDI</th>
                        <th style="text-align: right;">SLO</th>
                        <th style="text-align: right;">Area</th>
                        <th style="text-align: right;">Mitra</th>
                        <th style="text-align: right;">Pelanggan</th>
                        <th style="text-align: center;">Aksi</th>
                    </tr>
                </thead>
                <tbody>
                    @forelse($biayas as $biaya)
                        <tr>
                            <td>
                                <strong>{{ number_format($biaya->daya, 0, ',', '.') }} VA</strong>
                            </td>
                            <td>
                                <strong>{{ $biaya->golongan ?? '-' }}</strong><br>
                                <span style="font-size: 12px; color: #64748B;">{{ $biaya->keterangan ?? 'Tidak ada keterangan' }}</span>
                            </td>
                            <td style="text-align: right; color: #4A5568;">Rp {{ number_format($biaya->nidi, 0, ',', '.') }}</td>
                            <td style="text-align: right; color: #4A5568;">Rp {{ number_format($biaya->slo, 0, ',', '.') }}</td>
                            <td style="text-align: right; color: #4A5568;">Rp {{ number_format($biaya->area, 0, ',', '.') }}</td>
                            <td style="text-align: right; color: #4A5568;">Rp {{ number_format($biaya->mitra, 0, ',', '.') }}</td>
                            <td style="text-align: right;">
                                <strong>Rp {{ number_format($biaya->pelanggan, 0, ',', '.') }}</strong>
                            </td>
                            <td style="text-align: center;">
                                <div style="display: flex; gap: 5px; justify-content: center;">
                                    <a href="{{ route('master.biaya.edit', $biaya->daya) }}" class="btn-action" style="padding: 5px 10px; font-size: 12px; text-decoration:none;"><i class="fas fa-edit"></i> Edit</a>
                                    <form action="{{ route('master.biaya.destroy', $biaya->daya) }}" method="POST" onsubmit="return confirm('Hapus data daya ini?');" style="margin: 0;">
                                        @csrf
                                        @method('DELETE')
                                        <button type="submit" class="btn-secondary" style="padding: 5px 10px; font-size: 12px; color: #EF4444; border-color: #EF4444; cursor:pointer;"><i class="fas fa-trash"></i></button>
                                    </form>
                                </div>
                            </td>
                        </tr>
                    @empty
                        <tr>
                            <td colspan="8" style="text-align: center; padding: 20px; color: #94A3B8;">Tidak ada data master biaya.</td>
                        </tr>
                    @endforelse
                </tbody>
            </table>
        </div>
        
        <div style="margin-top: 20px;">
            {{ $biayas->withQueryString()->links('pagination::bootstrap-4') }}
        </div>
    </div>
</div>
@endsection

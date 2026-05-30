@extends('layouts.app')

@section('header_title', 'Daftar Permohonan')
@section('header_subtitle', 'Kelola pengajuan layanan SLO dan NIDI pelanggan.')

@section('content')
<div class="view-content active" id="permohonan-view" style="animation: fadeUp 0.4s ease-out;">
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
                <form action="{{ route('permohonan.index') }}" method="GET" style="display:flex; align-items:center;">
                    <i class="fas fa-search" style="position: absolute; margin-left: 10px; color: #94A3B8;"></i>
                    <input type="text" name="search" value="{{ request('search') }}" placeholder="Cari ID, Nama..." style="padding: 10px 10px 10px 35px; border-radius: 8px; border: 1px solid #CBD5E1; background: white; width: 250px;">
                    <button type="submit" class="btn-action" style="margin-left: 10px; padding: 10px 15px;">Cari</button>
                    @if(request('search'))
                        <a href="{{ route('permohonan.index') }}" class="btn-secondary" style="margin-left: 10px; padding: 10px 15px; text-decoration: none;">Reset</a>
                    @endif
                </form>
            </div>
            <div class="action-buttons">
                <a href="{{ route('permohonan.create') }}" class="btn-primary" style="text-decoration:none;"><i class="fas fa-plus"></i> Tambah Baru</a>
            </div>
        </div>

        <div class="table-responsive">
            <table class="data-table">
                <thead>
                    <tr>
                        <th>ID Reg</th>
                        <th>Tgl Input</th>
                        <th>Pemohon</th>
                        <th>Layanan</th>
                        <th>Status</th>
                        <th>Biaya</th>
                        <th>Aksi</th>
                    </tr>
                </thead>
                <tbody>
                    @forelse($permohonans as $p)
                        <tr>
                            <td><strong>{{ $p->id }}</strong></td>
                            <td>{{ \Carbon\Carbon::parse($p->tanggalInput)->format('d/m/Y H:i') }}</td>
                            <td>
                                <strong>{{ $p->namaPemohon }}</strong><br>
                                <span style="font-size: 12px; color: #64748B;">{{ $p->daya }} - {{ $p->kecamatan }}</span>
                            </td>
                            <td>
                                <span class="badge" style="background: rgba(0, 74, 173, 0.1); color: #004AAD;">{{ $p->jenisPermohonan }}</span>
                            </td>
                            <td>
                                @php
                                    $color = '#94A3B8';
                                    if(in_array($p->status, ['Proses NIDI', 'Proses SLO'])) $color = '#3B82F6';
                                    if(in_array($p->status, ['Completed', 'NIDI Selesai', 'SLO Selesai'])) $color = '#10B981';
                                    if($p->status == 'Waiting Process') $color = '#F59E0B';
                                @endphp
                                <span class="badge" style="background: {{ $color }}20; color: {{ $color }};">{{ $p->status }}</span>
                            </td>
                            <td>
                                <strong>Rp {{ number_format($p->biaya, 0, ',', '.') }}</strong><br>
                                @if($p->pembayaranStatus == 'Paid')
                                    <span style="font-size: 10px; color: #10B981; font-weight: bold;"><i class="fas fa-check-circle"></i> LUNAS</span>
                                @else
                                    <span style="font-size: 10px; color: #EF4444; font-weight: bold;"><i class="fas fa-clock"></i> BELUM BAYAR</span>
                                @endif
                            </td>
                            <td>
                                <div style="display: flex; gap: 5px; flex-wrap: wrap;">
                                    <a href="#" class="btn-action" style="padding: 5px 10px; font-size: 12px; text-decoration:none;"><i class="fas fa-eye"></i></a>
                                    <a href="{{ route('permohonan.edit', $p->id) }}" class="btn-action" style="padding: 5px 10px; font-size: 12px; text-decoration:none;"><i class="fas fa-edit"></i></a>
                                    <form action="{{ route('permohonan.destroy', $p->id) }}" method="POST" onsubmit="return confirm('Hapus permohonan ini?');" style="margin: 0;">
                                        @csrf
                                        @method('DELETE')
                                        <button type="submit" class="btn-secondary" style="padding: 5px 10px; font-size: 12px; color: #EF4444; border-color: #EF4444; cursor:pointer;"><i class="fas fa-trash"></i></button>
                                    </form>
                                </div>
                            </td>
                        </tr>
                    @empty
                        <tr>
                            <td colspan="7" style="text-align: center; padding: 20px; color: #94A3B8;">Tidak ada data permohonan.</td>
                        </tr>
                    @endforelse
                </tbody>
            </table>
        </div>
        
        <div style="margin-top: 20px;">
            {{ $permohonans->withQueryString()->links('pagination::bootstrap-4') }}
        </div>
    </div>
</div>
@endsection

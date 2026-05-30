@extends('layouts.app')

@section('header_title', 'Manajemen User & Akses')
@section('header_subtitle', 'Kelola data pekerja, admin, dan hak akses sistem.')

@section('content')
<div class="view-content active" id="users-view" style="animation: fadeUp 0.4s ease-out;">
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
                <form action="{{ route('users.index') }}" method="GET" style="display:flex; align-items:center;">
                    <i class="fas fa-search" style="position: absolute; margin-left: 10px; color: #94A3B8;"></i>
                    <input type="text" name="search" value="{{ request('search') }}" placeholder="Cari Nama, Email..." style="padding: 10px 10px 10px 35px; border-radius: 8px; border: 1px solid #CBD5E1; background: white; width: 250px;">
                    
                    <select name="role" style="margin-left: 10px; padding: 10px; border-radius: 8px; border: 1px solid #CBD5E1; background: white;">
                        <option value="all">Semua Role</option>
                        <option value="Super Admin" {{ request('role') == 'Super Admin' ? 'selected' : '' }}>Super Admin</option>
                        <option value="Admin Pelayanan" {{ request('role') == 'Admin Pelayanan' ? 'selected' : '' }}>Admin Pelayanan</option>
                        <option value="Admin Proses" {{ request('role') == 'Admin Proses' ? 'selected' : '' }}>Admin Proses</option>
                        <option value="TT NIDI" {{ request('role') == 'TT NIDI' ? 'selected' : '' }}>TT NIDI</option>
                        <option value="TT SLO" {{ request('role') == 'TT SLO' ? 'selected' : '' }}>TT SLO</option>
                        <option value="Admin Keuangan" {{ request('role') == 'Admin Keuangan' ? 'selected' : '' }}>Admin Keuangan</option>
                        <option value="Manager" {{ request('role') == 'Manager' ? 'selected' : '' }}>Manager</option>
                    </select>

                    <button type="submit" class="btn-action" style="margin-left: 10px; padding: 10px 15px;">Cari</button>
                    @if(request('search') || (request('role') && request('role') !== 'all'))
                        <a href="{{ route('users.index') }}" class="btn-secondary" style="margin-left: 10px; padding: 10px 15px; text-decoration: none;">Reset</a>
                    @endif
                </form>
            </div>
            <div class="action-buttons">
                <a href="{{ route('users.create') }}" class="btn-primary"><i class="fas fa-plus"></i> Tambah User</a>
            </div>
        </div>

        <div class="table-responsive">
            <table class="data-table">
                <thead>
                    <tr>
                        <th>ID User</th>
                        <th>Profil</th>
                        <th>Kontak</th>
                        <th>Role Akses</th>
                        <th>Aksi</th>
                    </tr>
                </thead>
                <tbody>
                    @forelse($users as $user)
                        <tr>
                            <td><strong>{{ $user->id }}</strong></td>
                            <td>
                                <div style="display: flex; align-items: center; gap: 10px;">
                                    <div style="width: 35px; height: 35px; background: rgba(0,74,173,0.1); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; color: #004AAD;">
                                        {{ $user->avatar ?? strtoupper(substr($user->name, 0, 2)) }}
                                    </div>
                                    <div>
                                        <strong>{{ $user->name }}</strong>
                                    </div>
                                </div>
                            </td>
                            <td>
                                <div style="font-size: 13px; color: #4A5568;">
                                    <i class="fas fa-envelope" style="width: 15px; color: #94A3B8;"></i> {{ $user->email }}<br>
                                    <i class="fas fa-phone" style="width: 15px; color: #94A3B8;"></i> {{ $user->phone ?? '-' }}
                                </div>
                            </td>
                            <td>
                                @php
                                    $roleColor = '#94A3B8';
                                    if($user->role == 'Super Admin' || $user->role == 'Manager') $roleColor = '#8B5CF6';
                                    elseif(strpos($user->role, 'Admin') !== false) $roleColor = '#3B82F6';
                                    elseif(strpos($user->role, 'TT') !== false) $roleColor = '#10B981';
                                @endphp
                                <span class="badge" style="background: {{ $roleColor }}20; color: {{ $roleColor }};">{{ $user->role ?? 'No Role' }}</span>
                            </td>
                            <td>
                                <div style="display: flex; gap: 5px;">
                                    <a href="{{ route('users.edit', $user->id) }}" class="btn-action" style="padding: 5px 10px; font-size: 12px; text-decoration: none;"><i class="fas fa-edit"></i> Edit</a>
                                    @if($user->id !== 'usr-00' && $user->id !== auth()->id())
                                        <form action="{{ route('users.destroy', $user->id) }}" method="POST" onsubmit="return confirm('Apakah Anda yakin ingin menghapus user ini?');" style="margin: 0;">
                                            @csrf
                                            @method('DELETE')
                                            <button type="submit" class="btn-secondary" style="padding: 5px 10px; font-size: 12px; color: #EF4444; border-color: #EF4444; cursor:pointer;"><i class="fas fa-trash"></i></button>
                                        </form>
                                    @endif
                                </div>
                            </td>
                        </tr>
                    @empty
                        <tr>
                            <td colspan="5" style="text-align: center; padding: 20px; color: #94A3B8;">Tidak ada data user.</td>
                        </tr>
                    @endforelse
                </tbody>
            </table>
        </div>
        
        <div style="margin-top: 20px;">
            {{ $users->withQueryString()->links('pagination::bootstrap-4') }}
        </div>
    </div>
</div>
@endsection

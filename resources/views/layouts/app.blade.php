<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Portal Enterprise - WIN Hub</title>
    
    <!-- Styling -->
    <link rel="stylesheet" href="{{ asset('style.css') }}?v={{ time() }}">
    
    <!-- Google Fonts & CDN Icon Kits -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    
    <!-- Premium Interactive Libs -->
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
    
    <!-- WinHub Favicon -->
    <link rel="icon" type="image/png" href="{{ asset('logo/logo winhub1.png?v=2') }}">
</head>
<body class="dark-mode">

    <div id="portal-section" style="display: flex; min-height: 100vh;">
        
        <!-- Sidebar Navigation -->
        <aside class="portal-sidebar">
            <div class="sidebar-brand" style="justify-content: center; padding: 15px 0;">
                <img src="{{ asset('logo/logo winhub2.png?v=2') }}" alt="WIN Hub Sidebar Logo" class="sidebar-logo" style="width: 160px; height: auto;">
            </div>

            <!-- Profile Widget -->
            <div class="user-profile-widget">
                <div class="user-avatar">{{ strtoupper(substr(Auth::user()->name, 0, 2)) }}</div>
                <div class="user-details">
                    <h5 style="margin: 0; color: white; font-size: 14px;">{{ Auth::user()->name }}</h5>
                    <span class="role-badge">{{ Auth::user()->role }}</span>
                </div>
            </div>

            <!-- Dynamic Sidebar Menu -->
            <ul class="sidebar-menu">
                <li><a href="{{ route('dashboard') }}" class="sidebar-link {{ request()->routeIs('dashboard') ? 'active' : '' }}"><i class="fas fa-home"></i> <span>Dashboard Utama</span></a></li>
                <li><a href="{{ route('permohonan.index') }}" class="sidebar-link {{ request()->routeIs('permohonan.*') ? 'active' : '' }}"><i class="fas fa-file-invoice"></i> <span>Daftar Permohonan</span></a></li>
                
                @if(in_array(Auth::user()->role, ['Super Admin', 'Admin Pelayanan']))
                <li><a href="{{ route('users.index') }}" class="sidebar-link {{ request()->routeIs('users.*') ? 'active' : '' }}"><i class="fas fa-users"></i> <span>Manajemen User</span></a></li>
                <li><a href="{{ route('master.biaya.index') }}" class="sidebar-link {{ request()->routeIs('master.biaya.*') ? 'active' : '' }}"><i class="fas fa-money-bill-wave"></i> <span>Master Biaya</span></a></li>
                <li><a href="{{ route('master.wilayah.index') }}" class="sidebar-link {{ request()->routeIs('master.wilayah.*') ? 'active' : '' }}"><i class="fas fa-map-marker-alt"></i> <span>Master Wilayah</span></a></li>
                @endif
            </ul>

            <div class="sidebar-footer">
                <form action="{{ route('logout') }}" method="POST" style="width: 100%;">
                    @csrf
                    <button type="submit" class="btn-logout" style="width: 100%; border: none; cursor: pointer;">
                        <i class="fas fa-power-off"></i> <span>Keluar Sistem</span>
                    </button>
                </form>
            </div>
        </aside>

        <!-- Main Viewport Area -->
        <main class="portal-main">
            <div class="portal-header">
                <div class="portal-title" style="display: flex; align-items: center;">
                    <button id="mobile-sidebar-toggle" class="mobile-menu-btn" style="display:none; background:none; border:none; font-size:20px; color:var(--primary); cursor:pointer; margin-right: 15px;"><i class="fas fa-bars"></i></button>
                    <div>
                        <h2 style="margin-bottom: 5px;">@yield('header_title', 'Dashboard')</h2>
                        <p style="margin: 0; color: #94A3B8;">@yield('header_subtitle', 'Selamat datang kembali di sistem.')</p>
                    </div>
                </div>
            </div>

            <!-- Subview Wrapper Area -->
            <div id="portal-dynamic-content" style="flex-grow: 1; display: flex; flex-direction: column;">
                @yield('content')
            </div>
        </main>
    </div>

</body>
</html>

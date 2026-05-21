<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>WIN Hub - Smart Electrical Service Platform & COLLABORATIVE ENERGY</title>
    
    <!-- SEO Optimization -->
    <meta name="description" content="WIN Hub adalah platform pelayanan penerbitan SLO dan NIDI secara cepat, aman, dan berlisensi untuk memenuhi standar keselamatan kelistrikan nasional.">
    <meta name="keywords" content="NIDI, SLO, Kelayakan Listrik, Siujang, WIN GROUP, Sertifikasi Listrik">
    <meta name="author" content="WIN GROUP">

    <!-- Styling -->
    <link rel="stylesheet" href="{{ asset('style.css') }}">
    
    <!-- Google Fonts & CDN Icon Kits -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    
    <!-- Premium Interactive Libs -->
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
    
    <!-- WinHub Favicon -->
    <link rel="icon" type="image/png" href="{{ asset('logo/logo winhub1.png?v=2') }}">
</head>
<body>

    <!-- ============================================ -->
    <!-- 1. LANDING PAGE VIEW                        -->
    <!-- ============================================ -->
    <div id="landing-page">
        <!-- Navigation Header -->
        <nav class="landing-nav">
            <div class="brand-logo-container">
                <img src="{{ asset('logo/logo winhub1.png?v=2') }}" alt="WIN Hub Logo" class="brand-logo" id="logo-main">
                <div class="brand-info">
                    <span class="brand-title">WIN <span>Hub</span></span>
                    <span class="brand-subtitle">Smart Electrical Service Platform</span>
                </div>
            </div>
            <ul class="nav-links">
                <li><a href="#" class="nav-link active">Beranda</a></li>
                <li class="dropdown-link">
                    <a href="#" class="nav-link">Layanan <i class="fas fa-chevron-down" style="font-size:10px;"></i></a>
                </li>
                <li><a href="#" class="nav-link">Mitra</a></li>
                <li><a href="#" class="nav-link btn-lacak-trigger">Lacak Pesanan</a></li>
                <li><a href="#" class="nav-link">Artikel</a></li>
                <li><a href="#" class="nav-link">Tentang Kami</a></li>
                <li><a href="#" class="nav-link">Kontak</a></li>
            </ul>
            <button class="btn-portal-access" id="btn-nav-login"><i class="fas fa-user-circle" style="font-size: 16px;"></i> Login</button>
        </nav>

        <!-- Hero Section -->
        <section class="hero-section">
            <div class="hero-text">
                <h1>Solusi Layanan Kelistrikan <span class="highlight-blue">Cerdas</span> dan <span class="highlight-orange">Terintegrasi</span></h1>
                <p>WIN Hub membantu pelanggan mengurus berbagai layanan kelistrikan dengan mudah, cepat, transparan, dan terintegrasi dalam satu platform.</p>
                <div class="hero-cta">
                    <button class="btn-portal-access primary-hero-btn"><i class="fas fa-bolt"></i> Ajukan Layanan</button>
                    <button class="btn-secondary btn-lacak-trigger"><i class="fas fa-search"></i> Lacak Pesanan</button>
                </div>
                <div class="hero-badges">
                    <span><i class="fas fa-bolt"></i> Proses Cepat</span>
                    <span><i class="fas fa-shield-alt"></i> Aman & Terpercaya</span>
                    <span><i class="fas fa-eye"></i> Transparan</span>
                </div>
            </div>

        </section>

        <!-- Services Section -->
        <section id="services" class="services-section">
            <span class="section-tag-red">PRODUK & LAYANAN</span>
            <h2 class="section-title-new">Berbagai Layanan Kelistrikan dalam Satu Platform</h2>
            <div class="services-grid-new">
                <div class="service-card-new">
                    <div class="service-circle sc-blue"><i class="fas fa-file-invoice-dollar"></i></div>
                    <h3>NIDI & SLO</h3>
                    <p>Pengurusan Nomor Identitas Instalasi (NIDI) dan Sertifikat Laik Operasi (SLO) dengan proses mudah dan cepat.</p>
                    <a href="#" class="service-link btn-portal-access">Selengkapnya <i class="fas fa-arrow-right"></i></a>
                </div>
                <div class="service-card-new">
                    <div class="service-circle sc-green"><i class="fas fa-home"></i><i class="fas fa-bolt" style="position: absolute; font-size: 10px; bottom: 8px; right: 8px;"></i></div>
                    <h3>Pasang Baru Listrik</h3>
                    <p>Layanan pemasangan listrik baru untuk rumah, usaha, atau gedung sesuai kebutuhan Anda.</p>
                    <a href="#" class="service-link btn-portal-access">Selengkapnya <i class="fas fa-arrow-right"></i></a>
                </div>
                <div class="service-card-new">
                    <div class="service-circle sc-orange"><i class="fas fa-bolt"></i></div>
                    <h3>Rubah / Tambah Daya</h3>
                    <p>Urus perubahan atau tambah daya listrik sesuai kebutuhan, aman dan terjamin.</p>
                    <a href="#" class="service-link btn-portal-access">Selengkapnya <i class="fas fa-arrow-right"></i></a>
                </div>
                <div class="service-card-new">
                    <div class="service-circle sc-red"><i class="fas fa-exclamation-triangle"></i></div>
                    <h3>Gangguan Instalasi</h3>
                    <p>Layanan penanganan gangguan instalasi listrik cepat oleh teknisi berpengalaman.</p>
                    <a href="#" class="service-link btn-portal-access">Selengkapnya <i class="fas fa-arrow-right"></i></a>
                </div>
                <div class="service-card-new">
                    <div class="service-circle sc-purple"><i class="fas fa-tools"></i></div>
                    <h3>Pemasangan Instalasi</h3>
                    <p>Pemasangan instalasi listrik baru oleh tenaga teknik kompeten dan bersertifikat.</p>
                    <a href="#" class="service-link btn-portal-access">Selengkapnya <i class="fas fa-arrow-right"></i></a>
                </div>
                <div class="service-card-new">
                    <div class="service-circle sc-teal"><i class="fas fa-headphones"></i></div>
                    <h3>Konsultasi Kelistrikan</h3>
                    <p>Konsultasi seputar layanan, dokumen, biaya, dan informasi kelistrikan lainnya.</p>
                    <a href="#" class="service-link btn-portal-access">Selengkapnya <i class="fas fa-arrow-right"></i></a>
                </div>
            </div>
        </section>

        <!-- Advantages Section -->
        <section id="advantages" class="advantages-section">
            <span class="section-tag-red">KEUNGGULAN WIN HUB</span>
            <h2 class="section-title-new">Mengapa Memilih WIN Hub?</h2>
            
            <div class="advantages-grid">
                <div class="advantage-card">
                    <div class="advantage-icon"><i class="fas fa-user-shield"></i></div>
                    <div class="advantage-text">
                        <h4>Tenaga Teknik Terlindungi</h4>
                        <p>Teknisi, BU, dan LIT terdaftar dan terverifikasi.</p>
                    </div>
                </div>
                <div class="advantage-card">
                    <div class="advantage-icon"><i class="fas fa-desktop"></i></div>
                    <div class="advantage-text">
                        <h4>Proses Layanan Terpantau</h4>
                        <p>Pantau setiap tahapan pekerjaan secara real-time.</p>
                    </div>
                </div>
                <div class="advantage-card">
                    <div class="advantage-icon"><i class="fas fa-share-alt"></i></div>
                    <div class="advantage-text">
                        <h4>Data Terintegrasi</h4>
                        <p>Data pelanggan dan pekerjaan tersimpan aman dan terintegrasi.</p>
                    </div>
                </div>
                <div class="advantage-card">
                    <div class="advantage-icon"><i class="fas fa-wallet"></i></div>
                    <div class="advantage-text">
                        <h4>Pembayaran Tercatat</h4>
                        <p>Riwayat pembayaran tercatat rapi dan transparan.</p>
                    </div>
                </div>
                <div class="advantage-card">
                    <div class="advantage-icon"><i class="fas fa-chart-bar"></i></div>
                    <div class="advantage-text">
                        <h4>Laporan Real-time</h4>
                        <p>Laporan pekerjaan dan pendapatan dapat diakses kapan saja.</p>
                    </div>
                </div>
                <div class="advantage-card">
                    <div class="advantage-icon"><i class="fas fa-users"></i></div>
                    <div class="advantage-text">
                        <h4>Untuk Semua Pengguna</h4>
                        <p>Cocok untuk pelanggan, teknisi, admin, hingga manager.</p>
                    </div>
                </div>
            </div>
        </section>

        <!-- Interactive Calculator Section in collapsible container -->
        <section id="estimator" class="calc-section-new" style="background:#F8FAFC; padding: 60px 8%; border-top: 1px solid #eee;">
            <div class="calc-container-new" style="max-width:900px; margin: 0 auto; background:white; border:1px solid #ddd; padding:30px; border-radius:12px; box-shadow: 0 10px 30px rgba(0,0,0,0.03);">
                <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:20px;">
                    <div>
                        <span class="section-tag-red" style="text-align: left; margin:0;">TARIF TRANSPARAN</span>
                        <h3 style="font-size:24px; color:#0B1E43; font-weight:800; margin-top:5px;">Kalkulator Tarif NIDI & SLO Resmi</h3>
                    </div>
                    <div style="display:flex; gap:10px;">
                        <div class="calc-group-new">
                            <select id="est-daya" class="calc-select" style="background: white; color: #333; border: 1px solid #ccc; padding: 10px 15px; border-radius: 6px;">
                                <!-- Seeded via JS -->
                            </select>
                        </div>
                        <div class="calc-group-new">
                            <select id="est-jenis" class="calc-select" style="background: white; color: #333; border: 1px solid #ccc; padding: 10px 15px; border-radius: 6px;">
                                <option value="NIDI">NIDI SAJA</option>
                                <option value="SLO">SLO SAJA</option>
                                <option value="SLO + NIDI">SLO + NIDI (Paket Hemat 10%)</option>
                                <option value="FULL">FULL SERVICE (Pekerjaan Lapangan & Sertifikasi)</option>
                            </select>
                        </div>
                    </div>
                </div>
                <div style="margin-top:20px; border-top:1px solid #eee; padding-top:20px; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:20px;">
                    <div id="est-breakdown" style="font-size:13px; color:#555; max-width:550px;">Silakan pilih daya dan jenis permohonan untuk menghitung rincian biaya.</div>
                    <div style="text-align:right;">
                        <span style="font-size:11px; color:#777; text-transform:uppercase; letter-spacing:0.5px; display:block;">Estimasi Tarif</span>
                        <strong id="est-price" style="font-size:28px; color:var(--secondary); font-weight:800; font-family:'Outfit';">Rp 0</strong>
                    </div>
                </div>
            </div>
        </section>

        <!-- Bottom CTA Banner Section -->
        <section class="bottom-cta-section">
            <div class="bottom-cta-container">
                <h2>Butuh Layanan Kelistrikan?<br><strong>Ajukan melalui WIN Hub sekarang!</strong></h2>
                <p>Urus semua kebutuhan listrik Anda dengan mudah, cepat, dan transparan bersama WIN Hub.</p>
                <div class="bottom-cta-buttons">
                    <button class="btn-portal-access bottom-cta-orange"><i class="fas fa-bolt"></i> Ajukan Layanan Sekarang</button>
                    <button class="btn-secondary bottom-cta-outline btn-lacak-trigger"><i class="fas fa-search"></i> Lacak Pesanan Anda</button>
                </div>
            </div>
        </section>

        <!-- Footer -->
        <footer class="landing-footer-new">
            <div class="footer-bottom-new">
                &copy; 2026 WIN Hub - Smart Electrical Service Platform. All rights reserved.
            </div>
        </footer>
    </div>

    <!-- ============================================ -->
    <!-- 2. LOGIN OVERLAY & DEMO GATEWAY             -->
    <!-- ============================================ -->
    <div id="login-section" style="display: none;">
        <div class="login-card">
            <div class="login-header">
                <img src="{{ asset('logo/logo winhub1.png?v=2') }}" alt="WIN Hub" class="login-logo">
                <h2>Portal Enterprise WIN Hub</h2>
                <p>Silakan masuk menggunakan akun resmi Anda</p>
            </div>
            
            <form id="login-form">
                <div class="input-group">
                    <label for="login-email">Alamat Email Kerja</label>
                    <div class="input-wrapper">
                        <i class="fas fa-envelope"></i>
                        <input type="email" id="login-email" class="login-input" placeholder="nama@winhub.com" required autocomplete="email">
                    </div>
                </div>
                <div class="input-group">
                    <label for="login-password">Kata Sandi</label>
                    <div class="input-wrapper">
                        <i class="fas fa-lock"></i>
                        <input type="password" id="login-password" class="login-input" placeholder="Masukkan kata sandi" required autocomplete="current-password">
                    </div>
                </div>
                
                <button type="submit" class="btn-login"><i class="fas fa-sign-in-alt"></i> Masuk Ke Portal</button>
            </form>



            <div style="text-align: center; margin-top: 25px;">
                <button class="btn-action" id="back-to-landing"><i class="fas fa-arrow-left"></i> Kembali ke Beranda</button>
            </div>
        </div>
    </div>

    <!-- ============================================ -->
    <!-- 3. ENTERPRISE PORTAL INTERFACE               -->
    <!-- ============================================ -->
    <div id="portal-section" style="display: none;">
        
        <!-- Top Bar Quick Role Switcher for workflow testing -->
        <div class="role-switcher-bar" id="role-switcher-bar" style="display: none !important;">
            <div class="role-switcher-label">
                <i class="fas fa-exchange-alt"></i>
                <span><strong>Quick Switch Role (Simulator Alur Kerja)</strong></span>
            </div>
            <div class="role-switcher-buttons" id="role-switcher-buttons">
                <!-- Injected via JS -->
            </div>
        </div>

        <!-- Sidebar Navigation -->
        <aside class="portal-sidebar">
            <div class="sidebar-brand" style="justify-content: center; padding: 15px 0;">
                <img src="{{ asset('logo/logo winhub2.png?v=2') }}" alt="WIN Hub Sidebar Logo" class="sidebar-logo" style="width: 160px; height: auto;">
            </div>

            <!-- Profile Widget -->
            <div class="user-profile-widget">
                <div class="user-avatar" id="sidebar-user-avatar">AP</div>
                <div class="user-details">
                    <h5 id="sidebar-user-name">Ilsa Pelayanan</h5>
                    <span class="role-badge" id="sidebar-user-role">Admin Pelayanan</span>
                </div>
            </div>

            <!-- Dynamic Sidebar Menu -->
            <ul class="sidebar-menu" id="sidebar-menu-list">
                <!-- Injected dynamically via JS depending on logged-in role -->
            </ul>

            <div class="sidebar-footer">
                <button class="btn-logout" id="sidebar-logout-btn"><i class="fas fa-power-off"></i> <span>Keluar Sistem</span></button>
            </div>
        </aside>

        <!-- Main Viewport Area -->
        <main class="portal-main">
            <div class="portal-header">
                <div class="portal-title">
                    <h2 id="view-title">Dashboard</h2>
                    <p id="view-subtitle">Selamat datang kembali di sistem.</p>
                </div>
            </div>

            <!-- Subview Wrapper Area (JS injects pages here) -->
            <div id="portal-dynamic-content" style="flex-grow: 1; display: flex; flex-direction: column;">
                <!-- Injected content goes here -->
            </div>
        </main>
    </div>

    <!-- ============================================ -->
    <!-- 4. MODALS & POPUPS SYSTEM                   -->
    <!-- ============================================ -->
    
    <!-- Master Request Detail & Assignment Modal Overlay -->
    <div class="modal-overlay" id="modal-overlay">
        <div class="modal-box" id="modal-box">
            <!-- Modal Header, Body, Footer dynamically injected by JS -->
        </div>
    </div>

    <!-- Float WhatsApp Gateway Notification Simulator -->
    <div class="wa-simulator" id="whatsapp-simulator">
        <div class="wa-header">
            <img src="https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=100&auto=format&fit=crop&q=60" id="wa-header-img" alt="WA Sender Avatar">
            <div class="wa-header-info" style="flex-grow: 1;">
                <h5 id="wa-header-title">Admin Pelayanan</h5>
                <p><i class="fas fa-circle" style="color:#25D366; font-size:6px; margin-right:4px;"></i> Online</p>
            </div>
            <button class="btn-close-modal" id="wa-close-btn" style="color:white; font-size:14px;"><i class="fas fa-times"></i></button>
        </div>
        <div class="wa-body" id="wa-msg-body">
            <!-- Injected custom bubble text -->
        </div>
        <div class="wa-footer">
            <div class="wa-input-box">Ketik balasan pesan...</div>
            <i class="fas fa-paper-plane send-icon"></i>
        </div>
    </div>

    <!-- Core Javascript Code -->
    <script src="{{ asset('app.js') }}"></script>
</body>
</html>

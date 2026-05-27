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
    <link rel="stylesheet" href="{{ asset('style.css') }}?v={{ time() }}">
    
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
                <li><a href="#" class="nav-link active" id="nav-beranda">Beranda</a></li>
                <li>
                    <a href="#" class="nav-link" id="nav-layanan">Layanan</a>
                </li>
                <li><a href="#" class="nav-link" id="nav-mitra">Mitra</a></li>
                <li><a href="#" class="nav-link btn-lacak-trigger">Lacak Pesanan</a></li>
                <li><a href="#" class="nav-link" id="nav-tentang-kami">Tentang Kami</a></li>
            </ul>
            <div style="display:flex; gap:10px; align-items:center;">
                <button class="btn-portal-access" id="btn-nav-login"><i class="fas fa-user-circle" style="font-size: 16px;"></i> <span class="hide-mobile">Login</span></button>
                <button id="mobile-nav-toggle" class="mobile-menu-btn" style="display:none; background:none; border:none; font-size:24px; color:var(--primary); cursor:pointer;"><i class="fas fa-bars"></i></button>
            </div>
        </nav>

        <!-- Landing Content -->
        <div id="landing-content">
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
                                <option value="SLO + NIDI">SLO + NIDI</option>
                                <option value="FULL">FULL SERVICE</option>
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

        <!-- Footer / Contact Us -->
        <footer id="kontak" class="landing-footer-new" style="background: #0B1E43; color: white; padding: 60px 8% 20px 8%;">
            <div style="max-width: 1200px; margin: 0 auto; display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 40px; margin-bottom: 40px;">
                <div>
                    <h3 style="font-size: 20px; font-weight: 800; margin-bottom: 20px; color: white;">PT Winata Solusindo Group</h3>
                    <p style="color: #94A3B8; line-height: 1.6; margin-bottom: 10px;">
                        <i class="fas fa-map-marker-alt" style="margin-right: 10px; color: var(--secondary);"></i>
                        <strong>Alamat:</strong> Jl. Kenanga 2 RT 7 Kel. Batu Urip, Kec. Lubuklinggau Utara II Kota Lubuklinggau
                    </p>
                    <p style="color: #94A3B8; line-height: 1.6; margin-bottom: 10px;">
                        <i class="fas fa-building" style="margin-right: 10px; color: var(--secondary);"></i>
                        <strong>Kantor Pelayanan:</strong> Jl Pinangsia (Depan UP3 Lubuklinggau) Kota Lubuklinggau
                    </p>
                </div>
                <div>
                    <h3 style="font-size: 20px; font-weight: 800; margin-bottom: 20px; color: white;">Hubungi Kami</h3>
                    <p style="color: #94A3B8; line-height: 1.6; margin-bottom: 10px;">
                        <i class="fas fa-phone-alt" style="margin-right: 10px; color: var(--secondary);"></i>
                        0813 828255 / 081356565667
                    </p>
                    <p style="color: #94A3B8; line-height: 1.6; margin-bottom: 10px;">
                        <i class="fas fa-envelope" style="margin-right: 10px; color: var(--secondary);"></i>
                        pt.winatasolusindogroup@gmail.com
                    </p>
                    <p style="color: #94A3B8; line-height: 1.6;">
                        <i class="fas fa-globe" style="margin-right: 10px; color: var(--secondary);"></i>
                        <a href="https://wingroup.id" style="color: #94A3B8; text-decoration: none;">wingroup.id</a>
                    </p>
                </div>
            </div>
            <div class="footer-bottom-new" style="border-top: 1px solid rgba(255,255,255,0.1); padding-top: 20px; text-align: center; color: #64748B; font-size: 14px;">
                &copy; 2026 PT Winata Solusindo Group - WIN Hub. All rights reserved.
            </div>
        </footer>
        </div> <!-- End of landing-content -->

        <!-- ============================================ -->
        <!-- 5. COMPANY PROFILE OVERLAY                   -->
        <!-- ============================================ -->
        <div id="company-profile-section" style="display: none; background: #f8fafc; min-height: 100vh;">
            <div style="padding-bottom: 0;">
                <!-- About Us Section -->
                <section id="about-profile" class="about-section" style="padding: 120px 8% 60px 8%; background: #fff;">
                    <div style="max-width: 1200px; margin: 0 auto; text-align: center;">
                        <span class="section-tag-red">TENTANG KAMI</span>
                        <h2 class="section-title-new" style="margin-bottom: 20px;">PT Winata Solusindo Group</h2>
                        <p style="font-size: 16px; color: #4A5568; line-height: 1.8; margin-bottom: 20px; text-align: justify;">
                            PT Winata Solusindo Group adalah perusahaan yang bergerak di bidang elektrikal, civil konstruksi, dan pengadaan, hadir sebagai mitra strategis dalam mewujudkan pembangunan infrastruktur yang modern, aman, dan berkelanjutan. Dengan dukungan tim profesional berpengalaman, teknologi terkini, serta komitmen terhadap kualitas, kami menghadirkan solusi menyeluruh mulai dari perencanaan, pelaksanaan proyek, hingga penyediaan material yang tepat waktu dan efisien.
                        </p>
                        <p style="font-size: 15px; color: #64748B; font-style: italic; text-align: justify; padding-left: 20px; border-left: 4px solid var(--primary);">
                            PT Winata Solusindo Group is a company specializing in electrical, civil construction, and procurement services, serving as a strategic partner in delivering modern, safe, and sustainable infrastructure development. With the support of experienced professionals, the latest technology, and a strong commitment to quality, we provide end-to-end solutions from planning and project execution to timely and efficient procurement.
                        </p>
                    </div>
                </section>

                <!-- Vision & Mission Section -->
                <section id="vision-mission-profile" class="vision-mission-section" style="padding: 60px 8%; background: #F8FAFC;">
                    <div style="max-width: 1200px; margin: 0 auto;">
                        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 40px;">
                            <!-- Visi -->
                            <div style="background: white; border-radius: 12px; padding: 40px; box-shadow: 0 10px 30px rgba(0,0,0,0.03); border-top: 4px solid var(--primary);">
                                <h3 style="font-size: 24px; color: var(--primary); margin-bottom: 20px; font-weight: 800;"><i class="fas fa-eye"></i> Visi (Vision)</h3>
                                <p style="color: #4A5568; line-height: 1.7; margin-bottom: 15px; text-align: justify;">Menjadi perusahaan terdepan di bidang elektrikal, konstruksi sipil, dan pengadaan yang dikenal karena inovasi, integritas, serta kualitas layanan, guna mendukung pembangunan nasional yang berkelanjutan.</p>
                                <p style="color: #64748B; line-height: 1.7; font-style: italic; text-align: justify;">To become a leading company in electrical, civil construction, and procurement services, recognized for innovation, integrity, and quality, contributing to sustainable national development.</p>
                            </div>
                            <!-- Misi -->
                            <div style="background: white; border-radius: 12px; padding: 40px; box-shadow: 0 10px 30px rgba(0,0,0,0.03); border-top: 4px solid var(--secondary);">
                                <h3 style="font-size: 24px; color: var(--secondary); margin-bottom: 20px; font-weight: 800;"><i class="fas fa-bullseye"></i> Misi (Mission)</h3>
                                <ol style="color: #4A5568; line-height: 1.7; margin-left: 20px;">
                                    <li style="margin-bottom: 10px;">Memberikan layanan terbaik yang mengutamakan kualitas, ketepatan, dan keselamatan.</li>
                                    <li style="margin-bottom: 10px;">Menghadirkan solusi terintegrasi dari perencanaan, konstruksi, hingga pengadaan.</li>
                                    <li style="margin-bottom: 10px;">Mengembangkan sumber daya manusia yang profesional, berintegritas, dan berkompeten.</li>
                                    <li style="margin-bottom: 10px;">Menerapkan teknologi terbaru untuk meningkatkan efisiensi dan efektivitas proyek.</li>
                                    <li>Berkontribusi pada pembangunan berkelanjutan dan peningkatan kesejahteraan masyarakat.</li>
                                </ol>
                            </div>
                        </div>
                    </div>
                </section>

                <!-- Services Section -->
                <section id="services-profile" class="services-section" style="padding: 120px 8% 60px 8%; background: #fff;">
                    <span class="section-tag-red" style="display:block; text-align:center;">LAYANAN KAMI</span>
                    <h2 class="section-title-new" style="text-align:center;">Services</h2>
                    <div style="max-width: 1200px; margin: 0 auto; display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 30px; margin-top: 40px;">
                        <div style="background: white; border: 1px solid #eee; border-radius: 16px; padding: 30px; transition: transform 0.3s; box-shadow: 0 10px 30px rgba(0,0,0,0.02);">
                            <div style="width: 60px; height: 60px; border-radius: 12px; background: rgba(59,130,246,0.1); color: #3b82f6; display: flex; align-items: center; justify-content: center; font-size: 24px; margin-bottom: 20px;"><i class="fas fa-bolt"></i></div>
                            <h3 style="font-size: 18px; margin-bottom: 15px; color: #0f172a;">1. Electrical Services</h3>
                            <ul style="color: #4A5568; line-height: 1.6; margin-left: 15px; font-size: 14px;">
                                <li>Supervisi NIDI dan Sertifikasi SLO</li>
                                <li>Instalasi listrik tegangan rendah & menengah</li>
                                <li>Pembangunan jaringan listrik</li>
                                <li>Sistem penerangan, panel, & kontrol</li>
                                <li>Maintenance & upgrading sistem kelistrikan</li>
                            </ul>
                        </div>
                        <div style="background: white; border: 1px solid #eee; border-radius: 16px; padding: 30px; transition: transform 0.3s; box-shadow: 0 10px 30px rgba(0,0,0,0.02);">
                            <div style="width: 60px; height: 60px; border-radius: 12px; background: rgba(245,158,11,0.1); color: #f59e0b; display: flex; align-items: center; justify-content: center; font-size: 24px; margin-bottom: 20px;"><i class="fas fa-hard-hat"></i></div>
                            <h3 style="font-size: 18px; margin-bottom: 15px; color: #0f172a;">2. Civil Construction</h3>
                            <ul style="color: #4A5568; line-height: 1.6; margin-left: 15px; font-size: 14px;">
                                <li>Pembangunan gedung & infrastruktur</li>
                                <li>Pekerjaan sipil (jalan, drainase, jembatan)</li>
                                <li>Renovasi & perbaikan fasilitas bangunan</li>
                                <li>Manajemen proyek konstruksi</li>
                            </ul>
                        </div>
                        <div style="background: white; border: 1px solid #eee; border-radius: 16px; padding: 30px; transition: transform 0.3s; box-shadow: 0 10px 30px rgba(0,0,0,0.02);">
                            <div style="width: 60px; height: 60px; border-radius: 12px; background: rgba(16,185,129,0.1); color: #10b981; display: flex; align-items: center; justify-content: center; font-size: 24px; margin-bottom: 20px;"><i class="fas fa-boxes"></i></div>
                            <h3 style="font-size: 18px; margin-bottom: 15px; color: #0f172a;">3. Procurement</h3>
                            <ul style="color: #4A5568; line-height: 1.6; margin-left: 15px; font-size: 14px;">
                                <li>Pengadaan material konstruksi & elektrikal</li>
                                <li>Supply chain & distribusi peralatan proyek</li>
                                <li>Pengadaan sesuai spesifikasi & kebutuhan klien</li>
                                <li>Layanan pengadaan yang efisien, tepat waktu, dan terpercaya</li>
                            </ul>
                        </div>
                    </div>
                </section>

                <!-- Core Values Section -->
                <section id="core-values-profile" class="advantages-section" style="padding: 60px 8%; background: #F8FAFC;">
                    <span class="section-tag-red" style="display:block; text-align:center;">NILAI PERUSAHAAN</span>
                    <h2 class="section-title-new" style="text-align:center;">Core Values</h2>
                    <div style="max-width: 1200px; margin: 0 auto; display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-top: 40px;">
                        <div class="advantage-card">
                            <div class="advantage-icon"><i class="fas fa-shield-alt"></i></div>
                            <div class="advantage-text">
                                <h4>Integrity / Integritas</h4>
                                <p>Menjunjung tinggi kejujuran, etika, dan kepercayaan.</p>
                            </div>
                        </div>
                        <div class="advantage-card">
                            <div class="advantage-icon"><i class="fas fa-gem"></i></div>
                            <div class="advantage-text">
                                <h4>Quality / Kualitas</h4>
                                <p>Mengutamakan hasil kerja terbaik dalam setiap proyek.</p>
                            </div>
                        </div>
                        <div class="advantage-card">
                            <div class="advantage-icon"><i class="fas fa-lightbulb"></i></div>
                            <div class="advantage-text">
                                <h4>Innovation / Inovasi</h4>
                                <p>Terus mengembangkan solusi modern dan efektif.</p>
                            </div>
                        </div>
                        <div class="advantage-card">
                            <div class="advantage-icon"><i class="fas fa-user-tie"></i></div>
                            <div class="advantage-text">
                                <h4>Professionalism</h4>
                                <p>Didukung oleh tim ahli yang kompeten dan berdedikasi.</p>
                            </div>
                        </div>
                        <div class="advantage-card">
                            <div class="advantage-icon"><i class="fas fa-leaf"></i></div>
                            <div class="advantage-text">
                                <h4>Sustainability</h4>
                                <p>Berkontribusi pada pembangunan yang ramah lingkungan.</p>
                            </div>
                        </div>
                    </div>
                </section>

                <!-- Clients & Partners Section -->
                <section id="clients-profile" class="about-section" style="padding: 120px 8% 60px 8%; background: #fff;">
                    <div style="max-width: 1000px; margin: 0 auto; text-align: center;">
                        <span class="section-tag-red">KLIEN & MITRA</span>
                        <h2 class="section-title-new" style="margin-bottom: 30px;">Clients & Partners</h2>
                        <div style="background: rgba(0, 74, 173, 0.03); padding: 40px; border-radius: 16px; border: 1px solid rgba(0, 74, 173, 0.1);">
                            <p style="font-size: 16px; color: #4A5568; line-height: 1.8; margin-bottom: 20px;">
                                PT Winata Solusindo Group telah dipercaya berbagai klien, baik dari sektor swasta maupun pemerintah, untuk mengerjakan proyek elektrikal, konstruksi, dan pengadaan. Dengan komitmen terhadap kepuasan pelanggan, kami selalu menghadirkan hasil yang memenuhi standar nasional maupun internasional.
                            </p>
                            <p style="font-size: 15px; color: #64748B; font-style: italic; line-height: 1.6;">
                                PT Winata Solusindo Group has been trusted by clients from both private and government sectors to deliver electrical, construction, and procurement projects. With a strong commitment to customer satisfaction, we consistently deliver results that meet both national and international standards.
                            </p>
                        </div>
                    </div>
                </section>
                
                <!-- Footer / Contact Us -->
                <footer class="landing-footer-new" style="background: #0B1E43; color: white; padding: 60px 8% 20px 8%;">
                    <div style="max-width: 1200px; margin: 0 auto; display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 40px; margin-bottom: 40px;">
                        <div>
                            <h3 style="font-size: 20px; font-weight: 800; margin-bottom: 20px; color: white;">PT Winata Solusindo Group</h3>
                            <p style="color: #94A3B8; line-height: 1.6; margin-bottom: 10px;">
                                <i class="fas fa-map-marker-alt" style="margin-right: 10px; color: var(--secondary);"></i>
                                <strong>Alamat:</strong> Jl. Kenanga 2 RT 7 Kel. Batu Urip, Kec. Lubuklinggau Utara II Kota Lubuklinggau
                            </p>
                            <p style="color: #94A3B8; line-height: 1.6; margin-bottom: 10px;">
                                <i class="fas fa-building" style="margin-right: 10px; color: var(--secondary);"></i>
                                <strong>Kantor Pelayanan:</strong> Jl Pinangsia (Depan UP3 Lubuklinggau) Kota Lubuklinggau
                            </p>
                        </div>
                        <div>
                            <h3 style="font-size: 20px; font-weight: 800; margin-bottom: 20px; color: white;">Hubungi Kami</h3>
                            <p style="color: #94A3B8; line-height: 1.6; margin-bottom: 10px;">
                                <i class="fas fa-phone-alt" style="margin-right: 10px; color: var(--secondary);"></i>
                                0813 828255 / 081356565667
                            </p>
                            <p style="color: #94A3B8; line-height: 1.6; margin-bottom: 10px;">
                                <i class="fas fa-envelope" style="margin-right: 10px; color: var(--secondary);"></i>
                                pt.winatasolusindogroup@gmail.com
                            </p>
                            <p style="color: #94A3B8; line-height: 1.6;">
                                <i class="fas fa-globe" style="margin-right: 10px; color: var(--secondary);"></i>
                                <a href="https://wingroup.id" style="color: #94A3B8; text-decoration: none;">wingroup.id</a>
                            </p>
                        </div>
                    </div>
                    <div class="footer-bottom-new" style="border-top: 1px solid rgba(255,255,255,0.1); padding-top: 20px; text-align: center; color: #64748B; font-size: 14px;">
                        &copy; 2026 PT Winata Solusindo Group - WIN Hub. All rights reserved.
                    </div>
                </footer>
            </div>
        </div>
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
                <div class="portal-title" style="display: flex; align-items: center;">
                    <button id="mobile-sidebar-toggle" class="mobile-menu-btn" style="display:none; background:none; border:none; font-size:20px; color:var(--primary); cursor:pointer; margin-right: 15px;"><i class="fas fa-bars"></i></button>
                    <div>
                        <h2 id="view-title" style="margin-bottom: 5px;">Dashboard</h2>
                        <p id="view-subtitle" style="margin: 0;">Selamat datang kembali di sistem.</p>
                    </div>
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
    <script src="{{ asset('app.js') }}?v={{ time() }}"></script>
</body>
</html>

/* 
   WIN Hub - Smart Electrical Service Platform
   Application Logic Engine (Local Database & Flow Engine)
*/

// TEMPORARY RESET - CLEAR ALL TRANSACTIONS
if (!localStorage.getItem('wh_cleared_transactions_v4')) {
    localStorage.setItem('wh_permohonan', JSON.stringify([]));
    localStorage.setItem('wh_logs', JSON.stringify([]));
    localStorage.setItem('wh_cleared_transactions_v4', 'true');
}

window.syncTableToMySQL = async function(table, data) {
    try {
        const response = await fetch('/api/winhub?action=sync_table', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ table: table, data: data })
        });
        const res = await response.json();
        if (!res.success) console.error("MySQL Sync Error:", res.error);
    } catch (e) {
        console.error("MySQL Sync Failed:", e);
    }
};

window.isSyncingDown = false;
const originalSetItem = localStorage.setItem;
localStorage.setItem = function(key, value) {
    originalSetItem.apply(this, arguments);
    if (!window.isSyncingDown && key.startsWith('wh_')) {
        const tableMap = {
            'wh_users': 'users',
            'wh_daya': 'daya',
            'wh_wilayah': 'wilayah',
            'wh_permohonan': 'permohonan',
            'wh_logs': 'logs',
            'wh_members': 'members',
            'wh_biaya': 'biaya'
        };
        const table = tableMap[key];
        if (table && typeof window.syncTableToMySQL === 'function') {
            window.syncTableToMySQL(table, JSON.parse(value));
        }
    }
};

document.addEventListener('DOMContentLoaded', async () => {

    // 0. FETCH FROM MYSQL
    try {
        const response = await fetch('/api/winhub?action=load_all');
        const res = await response.json();
        if (res.success && res.data) {
            window.isSyncingDown = true;
            if (res.data.users && res.data.users.length > 0) {
                // Database is populated, use it as source of truth
                localStorage.setItem('wh_users', JSON.stringify(res.data.users));
                if (res.data.daya && res.data.daya.length > 0) localStorage.setItem('wh_daya', JSON.stringify(res.data.daya));
                if (res.data.wilayah && res.data.wilayah.provinsi && res.data.wilayah.provinsi.length > 0) localStorage.setItem('wh_wilayah', JSON.stringify(res.data.wilayah));
                if (res.data.permohonan) localStorage.setItem('wh_permohonan', JSON.stringify(res.data.permohonan));
                if (res.data.logs) localStorage.setItem('wh_logs', JSON.stringify(res.data.logs));
                if (res.data.members) localStorage.setItem('wh_members', JSON.stringify(res.data.members));
                if (res.data.biaya && res.data.biaya.length > 0) localStorage.setItem('wh_biaya', JSON.stringify(res.data.biaya));
            } else {
                // Database is empty (just migrated). We will let initDatabase() run, then sync UP!
                setTimeout(() => {
                    window.isSyncingDown = false;
                    const ks = ['wh_users', 'wh_daya', 'wh_wilayah', 'wh_members', 'wh_biaya', 'wh_permohonan', 'wh_logs'];
                    ks.forEach(k => {
                        const val = localStorage.getItem(k);
                        if(val) {
                           const tableMap = {'wh_users':'users','wh_daya':'daya','wh_wilayah':'wilayah','wh_permohonan':'permohonan','wh_logs':'logs','wh_members':'members','wh_biaya':'biaya'};
                           window.syncTableToMySQL(tableMap[k], JSON.parse(val));
                        }
                    });
                }, 2000);
            }
            window.isSyncingDown = false;
        }
    } catch(e) {
        console.error("Failed to load from MySQL:", e);
    }

    // 1. STATE VARIABLES
    let currentUser = JSON.parse(localStorage.getItem('wh_current_user')) || null;
    let activeTab = 'dashboard';
    
    // 2. UI ELEMENT REFERENCES
    const landingPage = document.getElementById('landing-page');
    const loginSection = document.getElementById('login-section');
    const portalSection = document.getElementById('portal-section');
    const roleSwitcherBar = document.getElementById('role-switcher-bar');

    // 3. CORE INITIALIZER
    initDatabase();
    applyThemeAndLayout();
    initLandingPageEvents();
    initLoginEvents();
    initPortalEvents();
    
    // Functions declarations
    function initDatabase() {
        // Pre-seeded Users
        if (!localStorage.getItem('wh_users')) {
            const defaultUsers = [
                { id: 'usr-00', email: 'superadmin@winhub.com', name: 'Super Admin', role: 'Super Admin', avatar: 'SA', phone: '6281234567890' },
                { id: 'usr-01', email: 'pelayanan@winhub.com', name: 'Ilsa Pelayanan', role: 'Admin Pelayanan', avatar: 'IP', phone: '6281234567891' },
                { id: 'usr-02', email: 'proses@winhub.com', name: 'Rian Proses', role: 'Admin Proses', avatar: 'RP', phone: '6281234567892' },
                { id: 'usr-03', email: 'nidi@winhub.com', name: 'Tono NIDI', role: 'TT NIDI', avatar: 'TN', phone: '6281234567893' },
                { id: 'usr-04', email: 'slo@winhub.com', name: 'Slamet SLO', role: 'TT SLO', avatar: 'SS', phone: '6281234567894' },
                { id: 'usr-05', email: 'keuangan@winhub.com', name: 'Kiki Keuangan', role: 'Admin Keuangan', avatar: 'KK', phone: '6281234567895' },
                { id: 'usr-06', email: 'manager@winhub.com', name: 'Bapak Winata', role: 'Manager', avatar: 'WN', phone: '6281234567896' }
            ];
            localStorage.setItem('wh_users', JSON.stringify(defaultUsers));
        } else {
            // Ensure phone numbers are populated for default users in existing localStorage
            try {
                const uList = JSON.parse(localStorage.getItem('wh_users')) || [];
                let updated = false;
                const defaultsMap = {
                    'usr-00': '6281234567890',
                    'usr-01': '6281234567891',
                    'usr-02': '6281234567892',
                    'usr-03': '6281234567893',
                    'usr-04': '6281234567894',
                    'usr-05': '6281234567895',
                    'usr-06': '6281234567896'
                };
                
                // Add Super Admin if missing
                if (!uList.some(u => u.email.toLowerCase() === 'superadmin@winhub.com')) {
                    uList.push({ id: 'usr-00', email: 'superadmin@winhub.com', name: 'Super Admin', role: 'Super Admin', avatar: 'SA', phone: '6281234567890' });
                    updated = true;
                }

                uList.forEach(u => {
                    if (defaultsMap[u.id] && !u.phone) {
                        u.phone = defaultsMap[u.id];
                        updated = true;
                    }
                });
                if (updated) {
                    localStorage.setItem('wh_users', JSON.stringify(uList));
                    // Trigger sync to MySQL
                    if (typeof syncTableToMySQL === 'function') {
                        syncTableToMySQL('users', uList);
                    }
                }
            } catch(e) {
                console.error("Failed to migrate users phone numbers:", e);
            }
        }

        // Migrate Biaya (Add Banyak dan Rutin)
        try {
            let biayas = JSON.parse(localStorage.getItem('wh_biaya'));
            if (biayas) {
                let updated = false;
                const brMap = {
                    450: 50000, 900: 70000, 1300: 130000, 2200: 145000, 3500: 132500,
                    4400: 164000, 5500: 202500, 6600: 281000, 7700: 279500, 10600: 368000,
                    11000: 340000, 13200: 314000, 16500: 545000, 23000: 740000, 33000: 875000,
                    41500: 1087500, 53000: 1375000
                };
                biayas.forEach(b => {
                    if (b.banyak_rutin === undefined) {
                        b.banyak_rutin = brMap[b.daya] || 0;
                        updated = true;
                    }
                });
                if (updated) localStorage.setItem('wh_biaya', JSON.stringify(biayas));
            }
        } catch(e) {}


        // Master Daya
        if (!localStorage.getItem('wh_daya')) {
            const defaultDaya = [
                { daya: 450, golongan: 'R-1/TR', keterangan: 'Rumah Tangga Sangat Kecil / Subsidi' },
                { daya: 900, golongan: 'R-1/TR', keterangan: 'Rumah Tangga Kecil' },
                { daya: 1300, golongan: 'R-1/TR', keterangan: 'Rumah Tangga Sedang' },
                { daya: 2200, golongan: 'R-1/TR', keterangan: 'Rumah Tangga Menengah' },
                { daya: 3500, golongan: 'R-2/TR', keterangan: 'Rumah Tangga Besar' },
                { daya: 4400, golongan: 'R-2/TR', keterangan: 'Rumah Tangga Besar' },
                { daya: 5500, golongan: 'R-3/TR', keterangan: 'Rumah Tangga Mewah' }
            ];
            localStorage.setItem('wh_daya', JSON.stringify(defaultDaya));
        }

        // Master Wilayah (Provinsi, Kota, Kecamatan, Desa, Dusun)
        let currentWilayah = JSON.parse(localStorage.getItem('wh_wilayah'));
        if (currentWilayah && currentWilayah.provinsi && currentWilayah.provinsi.length < 4) {
             localStorage.removeItem('wh_wilayah');
        }

        if (!localStorage.getItem('wh_wilayah')) {
            const defaultWilayah = {
                provinsi: [
                    { id: 'prov-01', nama: 'Sumatera Selatan' },
                    { id: 'prov-02', nama: 'Bangka Belitung' },
                    { id: 'prov-03', nama: 'Jambi' },
                    { id: 'prov-04', nama: 'Bengkulu' }
                ],
                kota: [
                    // Sumatera Selatan
                    { id: 'kota-01', provinsiId: 'prov-01', nama: 'Palembang' },
                    { id: 'kota-02', provinsiId: 'prov-01', nama: 'Lubuklinggau' },
                    { id: 'kota-03', provinsiId: 'prov-01', nama: 'Ogan Komering Ilir (OKI)' },
                    { id: 'kota-04', provinsiId: 'prov-01', nama: 'Ogan Ilir (OI)' },
                    { id: 'kota-05', provinsiId: 'prov-01', nama: 'Banyuasin' },
                    { id: 'kota-06', provinsiId: 'prov-01', nama: 'Prabumulih' },
                    { id: 'kota-07', provinsiId: 'prov-01', nama: 'Muara Enim' },
                    { id: 'kota-08', provinsiId: 'prov-01', nama: 'Pagar Alam' },
                    { id: 'kota-09', provinsiId: 'prov-01', nama: 'Lahat' },
                    { id: 'kota-10', provinsiId: 'prov-01', nama: 'Musi Banyuasin (Muba)' },
                    { id: 'kota-11', provinsiId: 'prov-01', nama: 'Musi Rawas (Mura)' },
                    { id: 'kota-12', provinsiId: 'prov-01', nama: 'Musi Rawas Utara (Muratara)' },
                    { id: 'kota-13', provinsiId: 'prov-01', nama: 'Ogan Komering Ulu (OKU)' },
                    { id: 'kota-14', provinsiId: 'prov-01', nama: 'OKU Selatan' },
                    { id: 'kota-15', provinsiId: 'prov-01', nama: 'OKU Timur' },
                    { id: 'kota-16', provinsiId: 'prov-01', nama: 'Penukal Abab Lematang Ilir (PALI)' },
                    { id: 'kota-17', provinsiId: 'prov-01', nama: 'Empat Lawang' },

                    // Bangka Belitung
                    { id: 'kota-18', provinsiId: 'prov-02', nama: 'Pangkal Pinang' },
                    { id: 'kota-19', provinsiId: 'prov-02', nama: 'Bangka' },
                    { id: 'kota-20', provinsiId: 'prov-02', nama: 'Bangka Barat' },
                    { id: 'kota-21', provinsiId: 'prov-02', nama: 'Bangka Selatan' },
                    { id: 'kota-22', provinsiId: 'prov-02', nama: 'Bangka Tengah' },
                    { id: 'kota-23', provinsiId: 'prov-02', nama: 'Belitung' },
                    { id: 'kota-24', provinsiId: 'prov-02', nama: 'Belitung Timur' },

                    // Jambi
                    { id: 'kota-25', provinsiId: 'prov-03', nama: 'Jambi' },
                    { id: 'kota-26', provinsiId: 'prov-03', nama: 'Sungai Penuh' },
                    { id: 'kota-27', provinsiId: 'prov-03', nama: 'Batanghari' },
                    { id: 'kota-28', provinsiId: 'prov-03', nama: 'Bungo' },
                    { id: 'kota-29', provinsiId: 'prov-03', nama: 'Kerinci' },
                    { id: 'kota-30', provinsiId: 'prov-03', nama: 'Merangin' },
                    { id: 'kota-31', provinsiId: 'prov-03', nama: 'Muaro Jambi' },
                    { id: 'kota-32', provinsiId: 'prov-03', nama: 'Sarolangun' },
                    { id: 'kota-33', provinsiId: 'prov-03', nama: 'Tanjung Jabung Barat' },
                    { id: 'kota-34', provinsiId: 'prov-03', nama: 'Tanjung Jabung Timur' },
                    { id: 'kota-35', provinsiId: 'prov-03', nama: 'Tebo' },

                    // Bengkulu
                    { id: 'kota-36', provinsiId: 'prov-04', nama: 'Bengkulu' },
                    { id: 'kota-37', provinsiId: 'prov-04', nama: 'Bengkulu Selatan' },
                    { id: 'kota-38', provinsiId: 'prov-04', nama: 'Bengkulu Tengah' },
                    { id: 'kota-39', provinsiId: 'prov-04', nama: 'Bengkulu Utara' },
                    { id: 'kota-40', provinsiId: 'prov-04', nama: 'Kaur' },
                    { id: 'kota-41', provinsiId: 'prov-04', nama: 'Kepahiang' },
                    { id: 'kota-42', provinsiId: 'prov-04', nama: 'Lebong' },
                    { id: 'kota-43', provinsiId: 'prov-04', nama: 'Mukomuko' },
                    { id: 'kota-44', provinsiId: 'prov-04', nama: 'Rejang Lebong' },
                    { id: 'kota-45', provinsiId: 'prov-04', nama: 'Seluma' }
                ],
                kecamatan: [
                    // Palembang
                    { id: 'kec-01', kotaId: 'kota-01', nama: 'Sukarami' },
                    { id: 'kec-02', kotaId: 'kota-01', nama: 'Alang-Alang Lebar' },
                    { id: 'kec-03', kotaId: 'kota-01', nama: 'Kemuning' },
                    { id: 'kec-04', kotaId: 'kota-01', nama: 'Sako' },
                    { id: 'kec-05', kotaId: 'kota-01', nama: 'Kalidoni' },
                    { id: 'kec-06', kotaId: 'kota-01', nama: 'Ilir Barat I' },
                    { id: 'kec-07', kotaId: 'kota-01', nama: 'Seberang Ulu I' },
                    // Lubuklinggau
                    { id: 'kec-08', kotaId: 'kota-02', nama: 'Lubuklinggau Barat' },
                    { id: 'kec-09', kotaId: 'kota-02', nama: 'Lubuklinggau Timur' },
                    // OKI
                    { id: 'kec-10', kotaId: 'kota-03', nama: 'Kayu Agung' },
                    { id: 'kec-11', kotaId: 'kota-03', nama: 'Lempuing' },
                    // Ogan Ilir
                    { id: 'kec-12', kotaId: 'kota-04', nama: 'Indralaya' },
                    { id: 'kec-13', kotaId: 'kota-04', nama: 'Tanjung Raja' },
                    // Banyuasin
                    { id: 'kec-14', kotaId: 'kota-05', nama: 'Talang Kelapa' },
                    { id: 'kec-15', kotaId: 'kota-05', nama: 'Rambutan' },
                    // Prabumulih
                    { id: 'kec-16', kotaId: 'kota-06', nama: 'Prabumulih Barat' },
                    // Muara Enim
                    { id: 'kec-17', kotaId: 'kota-07', nama: 'Gelumbang' }
                ],
                desa: [
                    // Sukarami
                    { id: 'desa-01', kecamatanId: 'kec-01', nama: 'Talang Kelapa' },
                    { id: 'desa-02', kecamatanId: 'kec-01', nama: 'Kebun Bunga' },
                    // Alang-Alang Lebar
                    { id: 'desa-03', kecamatanId: 'kec-02', nama: 'Alang-Alang Lebar' },
                    // Kemuning
                    { id: 'desa-04', kecamatanId: 'kec-03', nama: 'Ario Kemuning' },
                    // Sako
                    { id: 'desa-05', kecamatanId: 'kec-04', nama: 'Sako Kenten' },
                    // Kalidoni
                    { id: 'desa-06', kecamatanId: 'kec-05', nama: 'Kalidoni' },
                    { id: 'desa-07', kecamatanId: 'kec-05', nama: 'Sei Selayur' },
                    // Ilir Barat I
                    { id: 'desa-08', kecamatanId: 'kec-06', nama: 'Lorok Pakjo' },
                    { id: 'desa-09', kecamatanId: 'kec-06', nama: 'Demang Lebar Daun' },
                    // Seberang Ulu I
                    { id: 'desa-10', kecamatanId: 'kec-07', nama: '1 Ulu' },
                    { id: 'desa-11', kecamatanId: 'kec-07', nama: '2 Ulu' },
                    // Kayu Agung
                    { id: 'desa-12', kecamatanId: 'kec-10', nama: 'Kayu Agung Asli' },
                    { id: 'desa-13', kecamatanId: 'kec-10', nama: 'Cinta Raja' },
                    // Lempuing
                    { id: 'desa-14', kecamatanId: 'kec-11', nama: 'Tugumulyo' },
                    // Indralaya
                    { id: 'desa-15', kecamatanId: 'kec-12', nama: 'Indralaya Indah' },
                    { id: 'desa-16', kecamatanId: 'kec-12', nama: 'Timbangan' },
                    // Tanjung Raja
                    { id: 'desa-17', kecamatanId: 'kec-13', nama: 'Tanjung Raja Barat' },
                    // Talang Kelapa
                    { id: 'desa-18', kecamatanId: 'kec-14', nama: 'Sukajadi' },
                    // Rambutan
                    { id: 'desa-19', kecamatanId: 'kec-15', nama: 'Gelebak Dalam' },
                    // Prabumulih Barat
                    { id: 'desa-20', kecamatanId: 'kec-16', nama: 'Patih Galung' },
                    // Gelumbang
                    { id: 'desa-21', kecamatanId: 'kec-17', nama: 'Gelumbang' }
                ],
                dusun: [
                    { id: 'dusun-01', desaId: 'desa-01', nama: 'Dusun I' },
                    { id: 'dusun-02', desaId: 'desa-01', nama: 'RT 01' },
                    { id: 'dusun-03', desaId: 'desa-01', nama: 'RT 02' },
                    { id: 'dusun-04', desaId: 'desa-08', nama: 'RT 12' },
                    { id: 'dusun-05', desaId: 'desa-08', nama: 'RT 15' },
                    { id: 'dusun-06', desaId: 'desa-16', nama: 'Dusun III' },
                    { id: 'dusun-07', desaId: 'desa-16', nama: 'RT 05' },
                    { id: 'dusun-08', desaId: 'desa-21', nama: 'Dusun IV' }
                ]
            };
            localStorage.setItem('wh_wilayah', JSON.stringify(defaultWilayah));
        }

        // Pre-seeded Permohonan / Tasks for wow factor
        if (!localStorage.getItem('wh_permohonan')) {
            const defaultPermohonan = [
                {
                    id: 'REQ-2026-001',
                    namaPemohon: 'Budi Santoso',
                    nik: '1671012345670001',
                    namaPelanggan: 'Budi Santoso',
                    daya: '1300 VA',
                    alamat: 'Jl. Kol. H. Barlian No. 12, Sukarami',
                    kecamatan: 'Sukarami',
                    biaya: 220000,
                    metodePembayaran: 'Transfer',
                    jenisPermohonan: 'SLO + NIDI',
                    status: 'Completed',
                    ttNidi: 'usr-03',
                    ttSlo: 'usr-04',
                    catatanNidi: 'Instalasi kabel utama rapi, siap SLO.',
                    catatanSlo: 'Hasil uji tahanan isolasi baik, SLO diterbitkan.',
                    pembayaranStatus: 'Paid',
                    shared: true,
                    tanggalInput: '2026-05-10T10:30:00Z',
                    nidiFile: 'NIDI_1671012345670001.pdf',
                    sloFile: 'SLO_1671012345670001.pdf',
                    buktiBayar: 'bukti_transfer_budi.jpg'
                },
                {
                    id: 'REQ-2026-002',
                    namaPemohon: 'CV Makmur Jaya',
                    nik: '1671034409870002',
                    namaPelanggan: 'Ruko CV Makmur Jaya',
                    daya: '3500 VA',
                    alamat: 'Komp. Ruko Alang-Alang Lebar Blok B5',
                    kecamatan: 'Alang-Alang Lebar',
                    biaya: 580000,
                    metodePembayaran: 'Cash',
                    jenisPermohonan: 'FULL',
                    status: 'Process NIDI',
                    ttNidi: 'usr-03',
                    ttSlo: null,
                    catatanNidi: '',
                    catatanSlo: '',
                    pembayaranStatus: 'Unpaid',
                    shared: false,
                    tanggalInput: '2026-05-18T08:15:00Z',
                    nidiFile: null,
                    sloFile: null,
                    buktiBayar: null
                },
                {
                    id: 'REQ-2026-003',
                    namaPemohon: 'Ahmad Faisal',
                    nik: '1671021102940003',
                    namaPelanggan: 'Ahmad Faisal',
                    daya: '900 VA',
                    alamat: 'Jl. Basuki Rahmat Gg. Kemuning Jaya No. 44',
                    kecamatan: 'Kemuning',
                    biaya: 90000,
                    metodePembayaran: 'Transfer',
                    jenisPermohonan: 'NIDI',
                    status: 'Waiting Process',
                    ttNidi: null,
                    ttSlo: null,
                    catatanNidi: '',
                    catatanSlo: '',
                    pembayaranStatus: 'Unpaid',
                    shared: false,
                    tanggalInput: '2026-05-18T14:20:00Z',
                    nidiFile: null,
                    sloFile: null,
                    buktiBayar: null
                },
                {
                    id: 'REQ-2026-004',
                    namaPemohon: 'Siti Rahma',
                    nik: '1671045204890004',
                    namaPelanggan: 'Siti Rahma',
                    daya: '2200 VA',
                    alamat: 'Jl. Residen H. Amaludin Kuto Baru, Sako',
                    kecamatan: 'Sako',
                    biaya: 350000,
                    metodePembayaran: 'Transfer',
                    jenisPermohonan: 'SLO',
                    status: 'Waiting SLO',
                    ttNidi: null,
                    ttSlo: null,
                    catatanNidi: '',
                    catatanSlo: '',
                    pembayaranStatus: 'Paid',
                    shared: false,
                    tanggalInput: '2026-05-17T11:00:00Z',
                    nidiFile: null,
                    sloFile: null,
                    buktiBayar: 'bukti_transfer_siti.jpg'
                },
                {
                    id: 'REQ-2026-005',
                    namaPemohon: 'PT Graha Elektrindo',
                    nik: '1671050505990005',
                    namaPelanggan: 'Gudang Graha Elektrindo',
                    daya: '5500 VA',
                    alamat: 'Kawasan Pergudangan Kalidoni No. 99',
                    kecamatan: 'Kalidoni',
                    biaya: 890000,
                    metodePembayaran: 'Transfer',
                    jenisPermohonan: 'SLO + NIDI',
                    status: 'SLO Finished',
                    ttNidi: 'usr-03',
                    ttSlo: 'usr-04',
                    catatanNidi: 'Kabel tembaga tebal, grounding aman.',
                    catatanSlo: 'Megger test aman, SLO dirilis.',
                    pembayaranStatus: 'Paid',
                    shared: false,
                    tanggalInput: '2026-05-16T09:00:00Z',
                    nidiFile: 'NIDI_GUDANG.pdf',
                    sloFile: 'SLO_GUDANG.pdf',
                    buktiBayar: 'bukti_transfer_graha.jpg'
                }
            ];
            localStorage.setItem('wh_permohonan', JSON.stringify(defaultPermohonan));
        }

        // Audit Trail Logs
        if (!localStorage.getItem('wh_logs')) {
            const defaultLogs = [
                { user: 'Ilsa Pelayanan', action: 'Membuat permohonan REQ-2026-001 (Budi Santoso)', time: '2026-05-10T10:32:00Z' },
                { user: 'Rian Proses', action: 'Menugaskan TT NIDI Tono NIDI untuk REQ-2026-001', time: '2026-05-10T11:00:00Z' },
                { user: 'Tono NIDI', action: 'Menyelesaikan pekerjaan NIDI untuk REQ-2026-001', time: '2026-05-10T14:45:00Z' },
                { user: 'Rian Proses', action: 'Menugaskan TT SLO Slamet SLO untuk REQ-2026-001', time: '2026-05-10T15:00:00Z' },
                { user: 'Slamet SLO', action: 'Menyelesaikan pekerjaan SLO untuk REQ-2026-001', time: '2026-05-11T09:30:00Z' },
                { user: 'Ilsa Pelayanan', action: 'Membagikan dokumen SLO & NIDI REQ-2026-001 ke Budi Santoso', time: '2026-05-11T10:15:00Z' },
                { user: 'Kiki Keuangan', action: 'Memverifikasi pembayaran LUNAS untuk REQ-2026-001', time: '2026-05-11T11:00:00Z' }
            ];
            localStorage.setItem('wh_logs', JSON.stringify(defaultLogs));
        }
    }

    // 5. THEME AND LAYOUT MANAGER
    function applyThemeAndLayout() {
        if (currentUser) {
            // Logged in
            landingPage.style.display = 'none';
            loginSection.style.display = 'none';
            portalSection.style.display = 'flex';
            
            // Show Role Switcher only if current user is Super Admin or originally logged in as Super Admin
            if (currentUser.role === 'Super Admin' || localStorage.getItem('wh_is_superadmin') === 'true') {
                roleSwitcherBar.style.display = 'flex';
            } else {
                roleSwitcherBar.style.display = 'none';
            }
            
            document.body.classList.add('dark-mode');
            
            // Build Quick Switcher buttons
            renderQuickRoleSwitcher();
            // Build Sidebar
            renderSidebar();
            // Render Current Active Portal view
            renderPortalView();
        } else {
            // Logged out
            landingPage.style.display = 'block';
            loginSection.style.display = 'none';
            portalSection.style.display = 'none';
            roleSwitcherBar.style.display = 'none';
            document.body.classList.remove('dark-mode');
        }
    }

    // 6. LANDING PAGE CODE
    function initLandingPageEvents() {
        // Scroll navigation effect
        window.addEventListener('scroll', () => {
            const nav = document.querySelector('.landing-nav');
            if (nav) {
                if (window.scrollY > 50) {
                    nav.style.boxShadow = '0 10px 30px rgba(0, 74, 173, 0.08)';
                    nav.style.padding = '12px 8%';
                } else {
                    nav.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.02)';
                    nav.style.padding = '20px 8%';
                }
            }
        });

        // Launch portal button
        document.querySelectorAll('.btn-portal-access').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                landingPage.style.display = 'none';
                loginSection.style.display = 'flex';
            });
        });

        // Lacak Pesanan Button Logic
        document.querySelectorAll('.btn-lacak-trigger').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                Swal.fire({
                    title: 'Lacak Pesanan',
                    text: 'Masukkan Nomor Registrasi / ID Permohonan (Contoh: REQ-2026-001):',
                    input: 'text',
                    inputPlaceholder: 'Ketik Nomor Registrasi...',
                    showCancelButton: true,
                    confirmButtonColor: '#004AAD',
                    confirmButtonText: 'Lacak',
                    cancelButtonText: 'Batal',
                    preConfirm: (trackingId) => {
                        if (!trackingId) {
                            Swal.showValidationMessage('Silakan masukkan Nomor Registrasi!');
                        }
                        return trackingId.trim();
                    }
                }).then((result) => {
                    if (result.isConfirmed) {
                        const trackingId = result.value.toUpperCase();
                        const permohonanList = JSON.parse(localStorage.getItem('wh_permohonan')) || [];
                        const matched = permohonanList.find(p => p.id === trackingId);
                        
                        if (matched) {
                            // Translate status color and text
                            let statusColor = '#94A3B8';
                            let statusDesc = 'Sedang diproses...';
                            if (matched.status === 'Draft') { statusColor = '#94A3B8'; statusDesc = 'Draft belum diajukan.'; }
                            else if (matched.status === 'Waiting Process') { statusColor = '#F59E0B'; statusDesc = 'Menunggu verifikasi admin.'; }
                            else if (matched.status === 'Proses NIDI') { statusColor = '#3B82F6'; statusDesc = 'Sedang dalam pengerjaan teknis NIDI.'; }
                            else if (matched.status === 'NIDI Selesai') { statusColor = '#10B981'; statusDesc = 'NIDI telah selesai.'; }
                            else if (matched.status === 'Menunggu SLO') { statusColor = '#8B5CF6'; statusDesc = 'Menunggu pengerjaan SLO.'; }
                            else if (matched.status === 'Proses SLO') { statusColor = '#EC4899'; statusDesc = 'Sedang dalam proses SLO.'; }
                            else if (matched.status === 'SLO Selesai') { statusColor = '#20B8A6'; statusDesc = 'Sertifikat SLO telah terbit.'; }
                            else if (matched.status === 'Completed') { statusColor = '#10B981'; statusDesc = 'Permohonan Selesai & Berkas sudah dibagikan.'; }
                            
                            Swal.fire({
                                title: `Status Pesanan: ${matched.id}`,
                                html: `
                                    <div style="text-align: left; padding: 15px; background: rgba(0,0,0,0.02); border-radius: 8px;">
                                        <p style="margin:0 0 10px 0; font-size:14px;"><strong>Pemohon:</strong> ${matched.namaPemohon}</p>
                                        <p style="margin:0 0 10px 0; font-size:14px;"><strong>Layanan:</strong> ${matched.jenisLayanan}</p>
                                        <p style="margin:0 0 15px 0; font-size:14px;"><strong>Daya:</strong> ${matched.daya} VA</p>
                                        <hr style="border:none; border-top:1px dashed #cbd5e1; margin-bottom:15px;">
                                        <div style="display:flex; align-items:center; gap:10px;">
                                            <span style="display:inline-block; padding: 6px 12px; background: ${statusColor}; color: white; border-radius: 20px; font-weight: bold; font-size: 13px;">${matched.status}</span>
                                            <span style="font-size:13px; color:#64748b;">${statusDesc}</span>
                                        </div>
                                    </div>
                                `,
                                icon: 'info',
                                confirmButtonColor: '#004AAD',
                                confirmButtonText: 'Tutup'
                            });
                        } else {
                            Swal.fire('Tidak Ditemukan', `Pesanan dengan ID "${trackingId}" tidak ditemukan. Pastikan Anda mengetikkan nomor registrasi dengan benar.`, 'error');
                        }
                    }
                });
            });
        });

        // Mobile Menu Toggle
        const mobileNavToggle = document.getElementById('mobile-nav-toggle');
        const landingNav = document.querySelector('.landing-nav');
        if (mobileNavToggle && landingNav) {
            mobileNavToggle.addEventListener('click', () => {
                landingNav.classList.toggle('mobile-active');
            });
            
            // Close mobile menu when clicking a nav link
            const navLinks = landingNav.querySelectorAll('.nav-link');
            navLinks.forEach(link => {
                link.addEventListener('click', () => {
                    if (landingNav.classList.contains('mobile-active')) {
                        landingNav.classList.remove('mobile-active');
                    }
                });
            });
        }

        // Company Profile Overlay Toggle
        const navTentangKami = document.getElementById('nav-tentang-kami');
        const navBeranda = document.getElementById('nav-beranda');
        const companyProfileSection = document.getElementById('company-profile-section');
        const landingContent = document.getElementById('landing-content');

        if (navTentangKami && companyProfileSection && landingContent) {
            navTentangKami.addEventListener('click', (e) => {
                e.preventDefault();
                landingContent.style.display = 'none';
                companyProfileSection.style.display = 'block';
                
                // Show about, vision-mission, and core-values
                const showSections = ['about-profile', 'vision-mission-profile', 'core-values-profile'];
                showSections.forEach(id => {
                    const el = document.getElementById(id);
                    if (el) el.style.display = 'block';
                });

                const hideSections = ['services-profile', 'clients-profile'];
                hideSections.forEach(id => {
                    const el = document.getElementById(id);
                    if (el) el.style.display = 'none';
                });
                
                window.scrollTo(0, 0);
            });
        }

        if (navBeranda && companyProfileSection && landingContent) {
            navBeranda.addEventListener('click', (e) => {
                // Only act as a back button if company profile is open
                if (companyProfileSection.style.display === 'block') {
                    e.preventDefault();
                    companyProfileSection.style.display = 'none';
                    landingContent.style.display = 'block';
                    window.scrollTo(0, 0);
                }
            });
        }

        const navMitra = document.getElementById('nav-mitra');
        if (navMitra && companyProfileSection && landingContent) {
            navMitra.addEventListener('click', (e) => {
                e.preventDefault();
                // Switch to company profile view
                landingContent.style.display = 'none';
                companyProfileSection.style.display = 'block';
                
                // Hide all sections except clients-profile
                const hideSections = ['about-profile', 'vision-mission-profile', 'services-profile', 'core-values-profile'];
                hideSections.forEach(id => {
                    const el = document.getElementById(id);
                    if (el) el.style.display = 'none';
                });
                
                const clientsSection = document.getElementById('clients-profile');
                if (clientsSection) {
                    clientsSection.style.display = 'block';
                }
                
                window.scrollTo(0, 0);
            });
        }

        const navLayanan = document.getElementById('nav-layanan');
        if (navLayanan && companyProfileSection && landingContent) {
            navLayanan.addEventListener('click', (e) => {
                e.preventDefault();
                landingContent.style.display = 'none';
                companyProfileSection.style.display = 'block';
                
                const showSections = ['services-profile'];
                showSections.forEach(id => {
                    const el = document.getElementById(id);
                    if (el) el.style.display = 'block';
                });

                const hideSections = ['about-profile', 'vision-mission-profile', 'core-values-profile', 'clients-profile'];
                hideSections.forEach(id => {
                    const el = document.getElementById(id);
                    if (el) el.style.display = 'none';
                });
                
                window.scrollTo(0, 0);
            });
        }

        // Dynamic Interactive Cost Estimator
        const estDayaSelect = document.getElementById('est-daya');
        const estJenisSelect = document.getElementById('est-jenis');
        
        if (estDayaSelect && estJenisSelect) {
            // Seed daya options
            const dayas = JSON.parse(localStorage.getItem('wh_daya')) || [];
            estDayaSelect.innerHTML = '';
            dayas.forEach(d => {
                const opt = document.createElement('option');
                opt.value = d.daya + ' VA';
                opt.textContent = `${d.daya} VA (${d.golongan})`;
                estDayaSelect.appendChild(opt);
            });

            // Add change listener
            [estDayaSelect, estJenisSelect].forEach(el => {
                el.addEventListener('change', calculateEstimatedCost);
            });

            // Run initial calculation
            calculateEstimatedCost();
        }
    }

    function calculateEstimatedCost() {
        const estDayaSelect = document.getElementById('est-daya');
        const estJenisSelect = document.getElementById('est-jenis');
        const estPriceSpan = document.getElementById('est-price');
        const estBreakdownDiv = document.getElementById('est-breakdown');

        if (!estDayaSelect || !estJenisSelect || !estPriceSpan) return;

        const dayaStr = estDayaSelect.value;
        const typeStr = estJenisSelect.value;
        const dayaValue = parseInt(dayaStr.replace(' VA', ''));

        // Load Master Biaya
        let biayas = JSON.parse(localStorage.getItem('wh_biaya'));
        if (!biayas) {
            biayas = [
                { daya: 450, nidi: 45000, slo: 40000, area: 23000, mitra: 70000, langganan: 85000, pelanggan: 135000 },
                { daya: 900, nidi: 90000, slo: 60000, area: 39000, mitra: 130000, langganan: 150000, pelanggan: 200000 },
                { daya: 1300, nidi: 130000, slo: 120000, area: 68000, mitra: 165000, langganan: 250000, pelanggan: 300000 },
                { daya: 2200, nidi: 220000, slo: 135000, area: 91250, mitra: 275000, langganan: 355000, pelanggan: 405000 },
                { daya: 3500, nidi: 350000, slo: 122500, area: 112875, mitra: 400000, langganan: 472500, pelanggan: 522500 },
                { daya: 4400, nidi: 440000, slo: 154000, area: 141900, mitra: 500000, langganan: 594000, pelanggan: 644000 },
                { daya: 5500, nidi: 550000, slo: 192500, area: 177375, mitra: 600000, langganan: 742500, pelanggan: 792500 },
                { daya: 6600, nidi: 660000, slo: 231000, area: 212850, mitra: 750000, langganan: 891000, pelanggan: 991000 },
                { daya: 7700, nidi: 770000, slo: 269500, area: 248325, mitra: 800000, langganan: 1039500, pelanggan: 1089500 },
                { daya: 10600, nidi: 1060000, slo: 318000, area: 323300, mitra: 1100000, langganan: 1378000, pelanggan: 1478000 },
                { daya: 11000, nidi: 1100000, slo: 330000, area: 335500, mitra: 1200000, langganan: 1430000, pelanggan: 1530000 },
                { daya: 13200, nidi: 1320000, slo: 264000, area: 356400, mitra: 1300000, langganan: 1584000, pelanggan: 1684000 },
                { daya: 16500, nidi: 1650000, slo: 495000, area: 503250, mitra: 1800000, langganan: 2145000, pelanggan: 2245000 },
                { daya: 23000, nidi: 1725000, slo: 690000, area: 586500, mitra: 2000000, langganan: 2415000, pelanggan: 2515000 },
                { daya: 33000, nidi: 2475000, slo: 825000, area: 783750, mitra: 2800000, langganan: 3300000, pelanggan: 3400000 },
                { daya: 41500, nidi: 3112500, slo: 1037500, area: 985625, mitra: 3500000, langganan: 4150000, pelanggan: 4250000 },
                { daya: 53000, nidi: 3975000, slo: 1325000, area: 1258750, mitra: 4500000, langganan: 5300000, pelanggan: 5400000 },
                { daya: 66000, nidi: 4950000, slo: 1650000, area: 1567500, mitra: 5600000, langganan: 6600000, pelanggan: 6800000 },
                { daya: 82500, nidi: 4950000, slo: 1650000, area: 1567500, mitra: 5600000, langganan: 6600000, pelanggan: 6800000 },
                { daya: 105000, nidi: 6300000, slo: 2100000, area: 1995000, mitra: 7000000, langganan: 8400000, pelanggan: 8600000 },
                { daya: 131000, nidi: 7860000, slo: 2620000, area: 2489000, mitra: 8900000, langganan: 10480000, pelanggan: 10680000 },
                { daya: 147000, nidi: 8820000, slo: 2940000, area: 2793000, mitra: 9800000, langganan: 11760000, pelanggan: 11960000 },
                { daya: 164000, nidi: 9840000, slo: 3280000, area: 3116000, mitra: 11000000, langganan: 13120000, pelanggan: 13320000 },
                { daya: 197000, nidi: 11820000, slo: 3940000, area: 3743000, mitra: 13000000, langganan: 15760000, pelanggan: 15960000 }
            ];
            localStorage.setItem('wh_biaya', JSON.stringify(biayas));
        }

        const bItem = biayas.find(b => b.daya === dayaValue) || { nidi: 0, slo: 0, pelanggan: 0 };
        
        let nidiCost = bItem.nidi;
        let sloCost = bItem.slo;
        let pelangganCost = bItem.pelanggan;

        let totalCost = 0;
        let detailsText = '';

        if (typeStr === 'NIDI') {
            totalCost = nidiCost;
            detailsText = `Biaya NIDI untuk daya ${dayaStr} sebesar Rp ${formatCurrency(nidiCost)}. Pekerjaan dilakukan oleh Tenaga Teknik (TT) berlisensi.`;
        } else if (typeStr === 'SLO') {
            totalCost = sloCost;
            detailsText = `Biaya SLO untuk daya ${dayaStr} sebesar Rp ${formatCurrency(sloCost)}. Meliputi inspeksi keselamatan instalasi & sertifikasi.`;
        } else if (typeStr === 'SLO + NIDI') {
            totalCost = nidiCost + sloCost;
            detailsText = `Biaya Paket NIDI + SLO Resmi (Status Pelanggan):<br>NIDI: Rp ${formatCurrency(nidiCost)}<br>SLO: Rp ${formatCurrency(sloCost)}<br>Total Harga Resmi: Rp ${formatCurrency(totalCost)}`;
        } else if (typeStr === 'FULL') {
            totalCost = pelangganCost;
            detailsText = `Biaya Full Service (NIDI, SLO & Pekerjaan Sipil/Instalasi Lapangan):<br>Sesuai dengan Tarif Resmi Kategori PELANGGAN. Estimasi Total Rp ${formatCurrency(totalCost)}.`;
        }

        estPriceSpan.textContent = `Rp ${formatCurrency(totalCost)}`;
        estBreakdownDiv.innerHTML = detailsText;
    }

    // 7. LOGIN SCREEN CODE
    function initLoginEvents() {
        const loginForm = document.getElementById('login-form');
        const backToLandingBtn = document.getElementById('back-to-landing');

        if (backToLandingBtn) {
            backToLandingBtn.addEventListener('click', () => {
                loginSection.style.display = 'none';
                landingPage.style.display = 'block';
            });
        }

        // Demo login button clicks
        document.querySelectorAll('.demo-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const email = btn.getAttribute('data-email');
                const passwordInput = document.getElementById('login-password');
                const emailInput = document.getElementById('login-email');
                
                if (emailInput && passwordInput) {
                    emailInput.value = email;
                    passwordInput.value = 'admin';
                }
            });
        });

        if (loginForm) {
            loginForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                const email = document.getElementById('login-email').value.trim();
                const pass = document.getElementById('login-password').value.trim();
                
                const loginBtn = loginForm.querySelector('.btn-login');
                const originalText = loginBtn.innerHTML;
                loginBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Memeriksa...';
                loginBtn.disabled = true;

                try {
                    const response = await fetch('/api/winhub?action=login', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ email: email, password: pass })
                    });
                    
                    const result = await response.json();
                    
                    if (result.success) {
                        currentUser = result.user;
                        localStorage.setItem('wh_current_user', JSON.stringify(currentUser));
                        
                        if (currentUser.role === 'Super Admin') {
                            localStorage.setItem('wh_is_superadmin', 'true');
                        } else {
                            localStorage.removeItem('wh_is_superadmin');
                        }
                        
                        Swal.fire({
                            title: 'Login Berhasil!',
                            text: `Selamat datang kembali, ${currentUser.name}! Anda masuk sebagai ${currentUser.role}.`,
                            icon: 'success',
                            timer: 2000,
                            showConfirmButton: false
                        }).then(() => {
                            applyThemeAndLayout();
                        });
                    } else {
                        Swal.fire({
                            title: 'Login Gagal',
                            text: result.error || 'Email atau password salah.',
                            icon: 'error'
                        });
                    }
                } catch (err) {
                    console.error("Login Error:", err);
                    Swal.fire({
                        title: 'Error',
                        text: 'Terjadi kesalahan saat menghubungi server.',
                        icon: 'error'
                    });
                } finally {
                    loginBtn.innerHTML = originalText;
                    loginBtn.disabled = false;
                }
            });
        }
    }

    // 8. ENTERPRISE PORTAL & WORKFLOW MANAGEMENT
    function initPortalEvents() {
        // Quick role switcher logic
        const quickButtonsContainer = document.getElementById('role-switcher-buttons');
        if (quickButtonsContainer) {
            quickButtonsContainer.addEventListener('click', (e) => {
                if (e.target.classList.contains('role-switch-btn')) {
                    const role = e.target.getAttribute('data-role');
                    const users = JSON.parse(localStorage.getItem('wh_users')) || [];
                    const user = users.find(u => u.role === role);
                    
                    if (user) {
                        currentUser = user;
                        localStorage.setItem('wh_current_user', JSON.stringify(currentUser));
                        activeTab = 'dashboard'; // reset active tab
                        
                        Swal.fire({
                            title: `Switch Ke Role: ${role}`,
                            text: `Mengubah pandangan portal untuk ${user.name}`,
                            icon: 'info',
                            toast: true,
                            position: 'top-end',
                            timer: 2000,
                            showConfirmButton: false
                        });
                        
                        applyThemeAndLayout();
                    }
                }
            });
        }

        // Logout action
        const logoutBtn = document.getElementById('sidebar-logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                Swal.fire({
                    title: 'Keluar Sistem',
                    text: 'Apakah Anda yakin ingin keluar dari Portal WIN Hub?',
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#004AAD',
                    cancelButtonColor: '#EF4444',
                    confirmButtonText: 'Ya, Logout',
                    cancelButtonText: 'Batal'
                }).then((result) => {
                    if (result.isConfirmed) {
                        currentUser = null;
                        localStorage.removeItem('wh_current_user');
                        localStorage.removeItem('wh_is_superadmin');
                        applyThemeAndLayout();
                    }
                });
            });
        }

        // Sidebar Navigation click router
        const sidebarMenu = document.getElementById('sidebar-menu-list');
        if (sidebarMenu) {
            sidebarMenu.addEventListener('click', (e) => {
                const menuItem = e.target.closest('.menu-item');
                if (menuItem) {
                    e.preventDefault();
                    document.querySelectorAll('.menu-item').forEach(el => el.classList.remove('active'));
                    menuItem.classList.add('active');
                    
                    activeTab = menuItem.getAttribute('data-tab');
                    renderPortalView();
                }
            });
        }
    }

    function renderQuickRoleSwitcher() {
        const quickButtonsContainer = document.getElementById('role-switcher-buttons');
        if (!quickButtonsContainer) return;

        const roles = [
            'Super Admin',
            'Admin Pelayanan',
            'Admin Proses',
            'TT NIDI',
            'TT SLO',
            'Admin Keuangan',
            'Manager'
        ];

        quickButtonsContainer.innerHTML = '';
        roles.forEach(role => {
            const btn = document.createElement('button');
            btn.className = `role-switch-btn ${currentUser && currentUser.role === role ? (role === 'Manager' ? 'active-role-manager' : 'active') : ''}`;
            btn.setAttribute('data-role', role);
            btn.textContent = role;
            quickButtonsContainer.appendChild(btn);
        });
    }

    function renderSidebar() {
        const sidebarMenu = document.getElementById('sidebar-menu-list');
        const userAvatarDiv = document.getElementById('sidebar-user-avatar');
        const userNameH5 = document.getElementById('sidebar-user-name');
        const userRoleSpan = document.getElementById('sidebar-user-role');

        if (!currentUser) return;

        // Set profile widget
        if (userAvatarDiv) userAvatarDiv.textContent = currentUser.avatar;
        if (userNameH5) userNameH5.textContent = currentUser.name;
        if (userRoleSpan) userRoleSpan.textContent = currentUser.role;

        if (!sidebarMenu) return;

        // Dynamic Menu Items based on Role
        let menuHtml = '';

        // All roles have Dashboard
        menuHtml += `<li class="menu-item ${activeTab === 'dashboard' ? 'active' : ''}" data-tab="dashboard">
            <a href="#"><i class="fas fa-chart-line"></i> <span>Dashboard</span></a>
        </li>`;

        if (currentUser.role === 'Admin Pelayanan') {
            menuHtml += `
            <li class="menu-item ${activeTab === 'permohonan' ? 'active' : ''}" data-tab="permohonan">
                <a href="#"><i class="fas fa-file-signature"></i> <span>Input Permohonan</span></a>
            </li>
            <li class="menu-item ${activeTab === 'share-dokumen' ? 'active' : ''}" data-tab="share-dokumen">
                <a href="#"><i class="fas fa-share-alt"></i> <span>Share Dokumen</span></a>
            </li>`;
        } else if (currentUser.role === 'Admin Proses') {
            menuHtml += `
            <li class="menu-item ${activeTab === 'data-masuk' ? 'active' : ''}" data-tab="data-masuk">
                <a href="#"><i class="fas fa-inbox"></i> <span>Data Masuk</span></a>
            </li>`;
        } else if (currentUser.role === 'TT NIDI') {
            menuHtml += `
            <li class="menu-item ${activeTab === 'tugas-nidi' ? 'active' : ''}" data-tab="tugas-nidi">
                <a href="#"><i class="fas fa-bolt"></i> <span>Pekerjaan NIDI</span></a>
            </li>`;
        } else if (currentUser.role === 'TT SLO') {
            menuHtml += `
            <li class="menu-item ${activeTab === 'tugas-slo' ? 'active' : ''}" data-tab="tugas-slo">
                <a href="#"><i class="fas fa-file-contract"></i> <span>Tugas SLO</span></a>
            </li>`;
        } else if (currentUser.role === 'Admin Keuangan') {
            menuHtml += `
            <li class="menu-item ${activeTab === 'keuangan-verif' ? 'active' : ''}" data-tab="keuangan-verif">
                <a href="#"><i class="fas fa-wallet"></i> <span>Verifikasi Bayar</span></a>
            </li>`;
        }

        // Master Data
        if (currentUser.role === 'Manager' || currentUser.role === 'Admin Pelayanan' || currentUser.role === 'Admin Proses' || currentUser.role === 'Super Admin') {
            menuHtml += `
            <li class="menu-item ${activeTab === 'master-data' ? 'active' : ''}" data-tab="master-data">
                <a href="#"><i class="fas fa-database"></i> <span>Master Data</span></a>
            </li>`;
        }
        
        // Audit Trail
        if (currentUser.role === 'Manager' || currentUser.role === 'Super Admin') {
            menuHtml += `
            <li class="menu-item ${activeTab === 'audit-trail' ? 'active' : ''}" data-tab="audit-trail">
                <a href="#"><i class="fas fa-history"></i> <span>Audit Trail</span></a>
            </li>`;
        }

        sidebarMenu.innerHTML = menuHtml;
    }

    function renderPortalView() {
        const viewTitleH2 = document.getElementById('view-title');
        const viewSubtitleP = document.getElementById('view-subtitle');
        const contentArea = document.getElementById('portal-dynamic-content');

        if (!currentUser || !contentArea) return;

        // Clear content area
        contentArea.innerHTML = '';

        // Dynamic routing
        if (activeTab === 'dashboard') {
            viewTitleH2.innerHTML = `<i class="fas fa-tachometer-alt"></i> Dashboard ${currentUser.role}`;
            viewSubtitleP.textContent = `Selamat datang, ${currentUser.name}. Berikut ringkasan aktivitas sistem hari ini.`;
            
            if (currentUser.role === 'Manager') {
                renderManagerDashboard(contentArea);
            } else if (currentUser.role === 'Admin Pelayanan') {
                renderPelayananDashboard(contentArea);
            } else if (currentUser.role === 'Admin Proses') {
                renderProsesDashboard(contentArea);
            } else if (currentUser.role === 'TT NIDI') {
                renderTTNidiDashboard(contentArea);
            } else if (currentUser.role === 'TT SLO') {
                renderTTSloDashboard(contentArea);
            } else if (currentUser.role === 'Admin Keuangan') {
                renderKeuanganDashboard(contentArea);
            }
        } 
        else if (activeTab === 'permohonan' && currentUser.role === 'Admin Pelayanan') {
            viewTitleH2.innerHTML = `<i class="fas fa-file-signature"></i> Formulir Input Permohonan Baru`;
            viewSubtitleP.textContent = 'Silakan isi data pemohon, instalasi, dan jenis layanan kelistrikan di bawah ini.';
            renderInputPermohonanForm(contentArea);
        } 
        else if (activeTab === 'share-dokumen' && currentUser.role === 'Admin Pelayanan') {
            viewTitleH2.innerHTML = `<i class="fas fa-share-alt"></i> Hub Share Dokumen SLO & NIDI`;
            viewSubtitleP.textContent = 'Daftar berkas SLO & NIDI yang telah rampung dan siap dibagikan ke pelanggan.';
            renderShareDokumenView(contentArea);
        }
        else if (activeTab === 'data-masuk' && currentUser.role === 'Admin Proses') {
            viewTitleH2.innerHTML = `<i class="fas fa-inbox"></i> Kotak Data Masuk Permohonan`;
            viewSubtitleP.textContent = 'Daftar permohonan baru yang perlu diverifikasi dan didistribusikan ke Tenaga Teknik (TT).';
            renderDataMasukView(contentArea);
        }
        else if (activeTab === 'tugas-nidi' && currentUser.role === 'TT NIDI') {
            viewTitleH2.innerHTML = `<i class="fas fa-bolt"></i> Manajemen Tugas Sertifikasi NIDI`;
            viewSubtitleP.textContent = 'Daftar tugas NIDI aktif Anda berdasarkan pembagian wilayah Kecamatan.';
            renderTTNidiTugasView(contentArea);
        }
        else if (activeTab === 'tugas-slo' && currentUser.role === 'TT SLO') {
            viewTitleH2.innerHTML = `<i class="fas fa-file-contract"></i> Manajemen Tugas Sertifikasi SLO`;
            viewSubtitleP.textContent = 'Daftar tugas SLO aktif Anda berdasarkan pembagian wilayah Kecamatan.';
            renderTTSloTugasView(contentArea);
        }
        else if (activeTab === 'keuangan-verif' && currentUser.role === 'Admin Keuangan') {
            viewTitleH2.innerHTML = `<i class="fas fa-wallet"></i> Verifikasi & Pembayaran`;
            viewSubtitleP.textContent = 'Manajemen verifikasi pembayaran permohonan pelanggan secara real-time.';
            renderKeuanganVerifView(contentArea);
        }
        else if (activeTab === 'master-data') {
            viewTitleH2.innerHTML = `<i class="fas fa-database"></i> Panel Master Data`;
            viewSubtitleP.textContent = 'Manajemen parameter dasar sistem: Wilayah, Daya, dan User.';
            renderMasterDataView(contentArea);
        }
        else if (activeTab === 'audit-trail') {
            viewTitleH2.innerHTML = `<i class="fas fa-history"></i> Log Aktivitas Sistem (Audit Trail)`;
            viewSubtitleP.textContent = 'Catatan aktivitas real-time yang dilakukan oleh seluruh pengguna dalam sistem.';
            renderAuditTrailView(contentArea);
        }
    }

    // ============================================
    // VIEW RENDERERS (DASHBOARD & MENUS)
    // ============================================

    // 8A. ADMIN PELAYANAN DASHBOARD
    function renderPelayananDashboard(container) {
        const data = JSON.parse(localStorage.getItem('wh_permohonan')) || [];
        
        // Count statuses
        const draftCount = data.filter(x => x.status === 'Draft').length;
        const waitingCount = data.filter(x => x.status === 'Waiting Process').length;
        const totalActive = data.filter(x => x.status !== 'Completed' && x.status !== 'Draft').length;
        const completedCount = data.filter(x => x.status === 'Completed').length;

        container.innerHTML = `
            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-card-details">
                        <p>Draft Permohonan</p>
                        <h3>${draftCount}</h3>
                    </div>
                    <div class="stat-card-icon"><i class="fas fa-edit"></i></div>
                </div>
                <div class="stat-card">
                    <div class="stat-card-details">
                        <p>Menunggu Verifikasi</p>
                        <h3>${waitingCount}</h3>
                    </div>
                    <div class="stat-card-icon"><i class="fas fa-clock"></i></div>
                </div>
                <div class="stat-card">
                    <div class="stat-card-details">
                        <p>Dalam Pengerjaan</p>
                        <h3>${totalActive}</h3>
                    </div>
                    <div class="stat-card-icon"><i class="fas fa-cogs"></i></div>
                </div>
                <div class="stat-card">
                    <div class="stat-card-details">
                        <p>Selesai & Rampung</p>
                        <h3>${completedCount}</h3>
                    </div>
                    <div class="stat-card-icon"><i class="fas fa-check-double"></i></div>
                </div>
            </div>

            <div class="table-card">
                <div class="table-card-header">
                    <h4>Status Permohonan Terbaru</h4>
                    <button class="btn-action primary" id="btn-goto-input-permohonan"><i class="fas fa-plus"></i> Input Permohonan Baru</button>
                </div>
                <div class="table-responsive">
                    <table class="custom-table" id="pelayanan-recent-table">
                        <thead>
                            <tr>
                                <th>No</th>
                                <th>ID Permohonan</th>
                                <th>Pelanggan</th>
                                <th>Member</th>
                                <th>Jenis</th>
                                <th>Daya</th>
                                <th>Biaya</th>
                                <th>Status Pengerjaan</th>
                                <th>Pembayaran</th>
                                <th>Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${renderPermohonanTableRows(data)}
                        </tbody>
                    </table>
                </div>
            </div>
        `;

        // Bind quick button
        const gotoInputBtn = document.getElementById('btn-goto-input-permohonan');
        if (gotoInputBtn) {
            gotoInputBtn.addEventListener('click', () => {
                activeTab = 'permohonan';
                renderSidebar();
                renderPortalView();
            });
        }

        // Bind table action clicks
        bindTableActionEvents();
    }

    // 8B. ADMIN PROSES DASHBOARD
    function renderProsesDashboard(container) {
        const data = JSON.parse(localStorage.getItem('wh_permohonan')) || [];
        
        const dataMasukCount = data.filter(x => x.status === 'Waiting Process').length;
        const runningNidi = data.filter(x => x.status === 'Process NIDI').length;
        const waitingSlo = data.filter(x => x.status === 'Waiting SLO').length;
        const runningSlo = data.filter(x => x.status === 'Process SLO').length;

        container.innerHTML = `
            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-card-details">
                        <p>Permohonan Masuk Baru</p>
                        <h3>${dataMasukCount}</h3>
                    </div>
                    <div class="stat-card-icon"><i class="fas fa-inbox"></i></div>
                </div>
                <div class="stat-card">
                    <div class="stat-card-details">
                        <p>Aktif Proses NIDI</p>
                        <h3>${runningNidi}</h3>
                    </div>
                    <div class="stat-card-icon"><i class="fas fa-charging-station"></i></div>
                </div>
                <div class="stat-card">
                    <div class="stat-card-details">
                        <p>Menunggu Assign SLO</p>
                        <h3>${waitingSlo}</h3>
                    </div>
                    <div class="stat-card-icon"><i class="fas fa-file-contract"></i></div>
                </div>
                <div class="stat-card">
                    <div class="stat-card-details">
                        <p>Aktif Proses SLO</p>
                        <h3>${runningSlo}</h3>
                    </div>
                    <div class="stat-card-icon"><i class="fas fa-running"></i></div>
                </div>
            </div>

            <div class="table-card">
                <div class="table-card-header">
                    <h4>Pekerjaan Aktif dalam Sistem</h4>
                    <button class="btn-action primary" id="btn-goto-data-masuk"><i class="fas fa-tasks"></i> Masuk Ke Kotak Data</button>
                </div>
                <div class="table-responsive">
                    <table class="custom-table">
                        <thead>
                            <tr>
                                <th>No</th>
                                <th>ID</th>
                                <th>Pelanggan</th>
                                <th>Kecamatan</th>
                                <th>Layanan</th>
                                <th>Status Pengerjaan</th>
                                <th>Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${renderProsesRecentRows(data)}
                        </tbody>
                    </table>
                </div>
            </div>
        `;

        // Bind redirect
        const btnGo = document.getElementById('btn-goto-data-masuk');
        if (btnGo) {
            btnGo.addEventListener('click', () => {
                activeTab = 'data-masuk';
                renderSidebar();
                renderPortalView();
            });
        }

        bindTableActionEvents();
    }

    function renderProsesRecentRows(data) {
        const activeItems = data.filter(x => x.status !== 'Completed' && x.status !== 'Draft');
        if (activeItems.length === 0) {
            return `<tr><td colspan="7" style="text-align:center;">Tidak ada pekerjaan aktif saat ini.</td></tr>`;
        }

        return activeItems.map((item, idx) => `
            <tr>
                <td>${idx + 1}</td>
                <td><strong>${item.id}</strong></td>
                <td>${item.namaPelanggan}</td>
                <td>${item.kecamatan}</td>
                <td><span class="badge" style="background:rgba(255,255,255,0.05); color:white;">${item.jenisPermohonan}</span></td>
                <td><span class="badge ${getStatusBadgeClass(item.status)}">${item.status}</span></td>
                <td>
                    <button class="btn-action btn-detail-req" data-id="${item.id}"><i class="fas fa-eye"></i> Detail & Assign</button>
                </td>
            </tr>
        `).join('');
    }

    // 8C. TT NIDI DASHBOARD
    function renderTTNidiDashboard(container) {
        const data = JSON.parse(localStorage.getItem('wh_permohonan')) || [];
        const nidiTasks = data.filter(x => x.ttNidi === currentUser.id || x.ttNidi === currentUser.name);
        
        const total = nidiTasks.length;
        const pending = nidiTasks.filter(x => x.status === 'Process NIDI').length;
        const finished = nidiTasks.filter(x => x.status !== 'Process NIDI').length;

        // Kecamatan Aktif count
        const activeKec = [...new Set(nidiTasks.filter(x => x.status === 'Process NIDI').map(x => x.kecamatan))].length;

        container.innerHTML = `
            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-card-details">
                        <p>Total Penugasan</p>
                        <h3>${total}</h3>
                    </div>
                    <div class="stat-card-icon"><i class="fas fa-clipboard-list"></i></div>
                </div>
                <div class="stat-card">
                    <div class="stat-card-details">
                        <p>Belum Dikerjakan</p>
                        <h3>${pending}</h3>
                    </div>
                    <div class="stat-card-icon"><i class="fas fa-hourglass-half"></i></div>
                </div>
                <div class="stat-card">
                    <div class="stat-card-details">
                        <p>Selesai Sertifikasi</p>
                        <h3>${finished}</h3>
                    </div>
                    <div class="stat-card-icon"><i class="fas fa-clipboard-check"></i></div>
                </div>
                <div class="stat-card">
                    <div class="stat-card-details">
                        <p>Kecamatan Aktif</p>
                        <h3>${activeKec}</h3>
                    </div>
                    <div class="stat-card-icon"><i class="fas fa-map-marked-alt"></i></div>
                </div>
            </div>

            <div class="table-card">
                <div class="table-card-header">
                    <h4>Pekerjaan NIDI Aktif per Wilayah</h4>
                    <button class="btn-action primary" id="btn-goto-nidi-tugas"><i class="fas fa-bolt"></i> Mulai Inspeksi NIDI</button>
                </div>
                <div class="table-responsive" style="padding: 20px;">
                    ${renderKecamatanSummary(nidiTasks, 'Process NIDI')}
                </div>
            </div>
        `;

        const btnGo = document.getElementById('btn-goto-nidi-tugas');
        if (btnGo) {
            btnGo.addEventListener('click', () => {
                activeTab = 'tugas-nidi';
                renderSidebar();
                renderPortalView();
            });
        }
    }

    // 8D. TT SLO DASHBOARD
    function renderTTSloDashboard(container) {
        const data = JSON.parse(localStorage.getItem('wh_permohonan')) || [];
        const sloTasks = data.filter(x => x.ttSlo === currentUser.id || x.ttSlo === currentUser.name);
        
        const total = sloTasks.length;
        const pending = sloTasks.filter(x => x.status === 'Process SLO').length;
        const finished = sloTasks.filter(x => x.status !== 'Process SLO' && x.status !== 'Waiting SLO').length;
        const activeKec = [...new Set(sloTasks.filter(x => x.status === 'Process SLO').map(x => x.kecamatan))].length;

        container.innerHTML = `
            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-card-details">
                        <p>Total Penugasan SLO</p>
                        <h3>${total}</h3>
                    </div>
                    <div class="stat-card-icon"><i class="fas fa-file-signature"></i></div>
                </div>
                <div class="stat-card">
                    <div class="stat-card-details">
                        <p>Belum Dikerjakan</p>
                        <h3>${pending}</h3>
                    </div>
                    <div class="stat-card-icon"><i class="fas fa-clock"></i></div>
                </div>
                <div class="stat-card">
                    <div class="stat-card-details">
                        <p>SLO Rampung</p>
                        <h3>${finished}</h3>
                    </div>
                    <div class="stat-card-icon"><i class="fas fa-check-double"></i></div>
                </div>
                <div class="stat-card">
                    <div class="stat-card-details">
                        <p>Kecamatan Aktif</p>
                        <h3>${activeKec}</h3>
                    </div>
                    <div class="stat-card-icon"><i class="fas fa-map-marked-alt"></i></div>
                </div>
            </div>

            <div class="table-card">
                <div class="table-card-header">
                    <h4>Pekerjaan SLO Aktif per Wilayah</h4>
                    <button class="btn-action primary" id="btn-goto-slo-tugas"><i class="fas fa-file-contract"></i> Mulai Uji SLO</button>
                </div>
                <div class="table-responsive" style="padding: 20px;">
                    ${renderKecamatanSummary(sloTasks, 'Process SLO')}
                </div>
            </div>
        `;

        const btnGo = document.getElementById('btn-goto-slo-tugas');
        if (btnGo) {
            btnGo.addEventListener('click', () => {
                activeTab = 'tugas-slo';
                renderSidebar();
                renderPortalView();
            });
        }
    }

    function renderKecamatanSummary(tasks, activeStatus) {
        const activeTasks = tasks.filter(x => x.status === activeStatus);
        if (activeTasks.length === 0) {
            return `<div style="text-align:center; color:var(--text-muted-dark); padding: 20px 0;">Tidak ada pekerjaan lapangan yang menanti Anda saat ini. Selamat!</div>`;
        }

        // Group by kecamatan
        const group = {};
        activeTasks.forEach(t => {
            group[t.kecamatan] = (group[t.kecamatan] || 0) + 1;
        });

        return Object.keys(group).map(kec => `
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px 15px; background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); border-radius: 8px; margin-bottom: 10px;">
                <span style="font-weight:600;"><i class="fas fa-map-marker-alt" style="color:var(--secondary); margin-right:8px;"></i> Kecamatan ${kec}</span>
                <span class="badge" style="background:var(--primary); color:white;">${group[kec]} Permohonan Menunggu</span>
            </div>
        `).join('');
    }

    // 8E. ADMIN KEUANGAN DASHBOARD
    function renderKeuanganDashboard(container) {
        const data = JSON.parse(localStorage.getItem('wh_permohonan')) || [];
        
        const totalRevenue = data.filter(x => x.pembayaranStatus === 'Paid').reduce((sum, item) => sum + item.biaya, 0);
        const outstanding = data.filter(x => x.pembayaranStatus === 'Unpaid').reduce((sum, item) => sum + item.biaya, 0);
        const lunasCount = data.filter(x => x.pembayaranStatus === 'Paid').length;
        const outstandingCount = data.filter(x => x.pembayaranStatus === 'Unpaid').length;

        // Calculate Daily, Monthly, Yearly Revenue
        const todayStr = new Date().toISOString().split('T')[0];
        const monthStr = todayStr.substring(0, 7);
        const yearStr = todayStr.substring(0, 4);

        const paidData = data.filter(x => x.pembayaranStatus === 'Paid');
        const dailyRev = paidData.filter(x => (x.tanggalInput || '').startsWith(todayStr)).reduce((s, i) => s + i.biaya, 0);
        const monthlyRev = paidData.filter(x => (x.tanggalInput || '').startsWith(monthStr)).reduce((s, i) => s + i.biaya, 0);
        const yearlyRev = paidData.filter(x => (x.tanggalInput || '').startsWith(yearStr)).reduce((s, i) => s + i.biaya, 0);

        container.innerHTML = `
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:15px;">
                <h4 style="margin:0; color:#f8fafc;"><i class="fas fa-chart-line"></i> Ringkasan Laporan Pendapatan</h4>
                <button class="btn-action primary" id="btn-print-laporan" style="font-size:12px; padding:6px 12px;"><i class="fas fa-print"></i> Cetak Laporan</button>
            </div>
            <div class="stats-grid" style="grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); margin-bottom: 25px;">
                <div class="stat-card" style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); border:none;">
                    <div class="stat-card-details">
                        <p style="color:rgba(255,255,255,0.9);">Harian (Hari Ini)</p>
                        <h3 style="color:white;">Rp ${formatCurrency(dailyRev)}</h3>
                    </div>
                    <div class="stat-card-icon" style="color:rgba(255,255,255,0.3);"><i class="fas fa-calendar-day"></i></div>
                </div>
                <div class="stat-card" style="background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); border:none;">
                    <div class="stat-card-details">
                        <p style="color:rgba(255,255,255,0.9);">Bulanan (Bulan Ini)</p>
                        <h3 style="color:white;">Rp ${formatCurrency(monthlyRev)}</h3>
                    </div>
                    <div class="stat-card-icon" style="color:rgba(255,255,255,0.3);"><i class="fas fa-calendar-alt"></i></div>
                </div>
                <div class="stat-card" style="background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%); border:none;">
                    <div class="stat-card-details">
                        <p style="color:rgba(255,255,255,0.9);">Tahunan (Tahun Ini)</p>
                        <h3 style="color:white;">Rp ${formatCurrency(yearlyRev)}</h3>
                    </div>
                    <div class="stat-card-icon" style="color:rgba(255,255,255,0.3);"><i class="fas fa-calendar"></i></div>
                </div>
            </div>

            <h4 style="margin-bottom:15px; color:#f8fafc;"><i class="fas fa-wallet"></i> Status Keuangan Keseluruhan</h4>
            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-card-details">
                        <p>Total Pendapatan (All Time)</p>
                        <h3>Rp ${formatCurrency(totalRevenue)}</h3>
                    </div>
                    <div class="stat-card-icon"><i class="fas fa-hand-holding-usd"></i></div>
                </div>
                <div class="stat-card">
                    <div class="stat-card-details">
                        <p>Piutang / Belum Lunas</p>
                        <h3>Rp ${formatCurrency(outstanding)}</h3>
                    </div>
                    <div class="stat-card-icon"><i class="fas fa-donate"></i></div>
                </div>
                <div class="stat-card">
                    <div class="stat-card-details">
                        <p>Transaksi Lunas</p>
                        <h3>${lunasCount}</h3>
                    </div>
                    <div class="stat-card-icon"><i class="fas fa-receipt"></i></div>
                </div>
                <div class="stat-card">
                    <div class="stat-card-details">
                        <p>Transaksi Tertunda</p>
                        <h3>${outstandingCount}</h3>
                    </div>
                    <div class="stat-card-icon"><i class="fas fa-exclamation-circle"></i></div>
                </div>
            </div>

            <div class="table-card">
                <div class="table-card-header">
                    <h4>Aliran Kas / Transaksi Terbaru</h4>
                    <button class="btn-action primary" id="btn-goto-keuangan-verif"><i class="fas fa-wallet"></i> Kelola Pembayaran</button>
                </div>
                <div class="table-responsive">
                    <table class="custom-table">
                        <thead>
                            <tr>
                                <th>No</th>
                                <th>Nama Member (Pelanggan)</th>
                                <th>Total Pendapatan Masuk</th>
                                <th>Piutang / Belum Lunas</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${renderKeuanganRecentRows(data)}
                        </tbody>
                    </table>
                </div>
            </div>
        `;

        const btnGo = document.getElementById('btn-goto-keuangan-verif');
        if (btnGo) {
            btnGo.addEventListener('click', () => {
                activeTab = 'keuangan-verif';
                renderSidebar();
                renderPortalView();
            });
        }
        
        const btnPrint = document.getElementById('btn-print-laporan');
        if (btnPrint) {
            btnPrint.addEventListener('click', () => {
                Swal.fire({
                    title: 'Pilih Rentang Waktu Laporan',
                    html: `
                        <div style="display:flex; flex-direction:column; gap:15px; text-align:left; margin-top:10px;">
                            <div>
                                <label style="font-weight:bold; margin-bottom:5px; display:block;">Dari Tanggal</label>
                                <input type="date" id="print-start-date" class="swal2-input" style="width:100%; margin:0; box-sizing:border-box;">
                            </div>
                            <div>
                                <label style="font-weight:bold; margin-bottom:5px; display:block;">Sampai Tanggal</label>
                                <input type="date" id="print-end-date" class="swal2-input" style="width:100%; margin:0; box-sizing:border-box;">
                            </div>
                            <div style="font-size:12px; color:#666;">
                                * Kosongkan tanggal jika ingin menampilkan semua rentang waktu
                            </div>
                        </div>
                    `,
                    showCancelButton: true,
                    confirmButtonColor: '#004AAD',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Preview Laporan',
                    cancelButtonText: 'Batal',
                    preConfirm: () => {
                        return {
                            start: document.getElementById('print-start-date').value,
                            end: document.getElementById('print-end-date').value
                        }
                    }
                }).then((result) => {
                    if (result.isConfirmed) {
                        const { start, end } = result.value;
                        let filteredData = paidData;
                        
                        let periodText = 'Keseluruhan Waktu';
                        
                        if (start || end) {
                            filteredData = paidData.filter(p => {
                                const d = new Date(p.tanggalInput).getTime();
                                const s = start ? new Date(start + 'T00:00:00').getTime() : 0;
                                const e = end ? new Date(end + 'T23:59:59').getTime() : Infinity;
                                return d >= s && d <= e;
                            });
                            
                            if (start && end) {
                                periodText = `${new Date(start).toLocaleDateString('id-ID')} s/d ${new Date(end).toLocaleDateString('id-ID')}`;
                            } else if (start) {
                                periodText = `Sejak ${new Date(start).toLocaleDateString('id-ID')}`;
                            } else if (end) {
                                periodText = `Hingga ${new Date(end).toLocaleDateString('id-ID')}`;
                            }
                        }
                        
                        // Calculate summary for the filtered data
                        let totalFiltered = 0;
                        let fDaily = 0, fMonthly = 0, fYearly = 0;
                        const now = new Date();
                        const todayStr = now.toISOString().split('T')[0];
                        const thisMonth = now.getMonth();
                        const thisYear = now.getFullYear();

                        filteredData.forEach(p => {
                            const val = parseInt(p.biaya) || 0;
                            totalFiltered += val;
                            const d = new Date(p.tanggalInput);
                            const dStr = d.toISOString().split('T')[0];
                            if (dStr === todayStr) fDaily += val;
                            if (d.getMonth() === thisMonth && d.getFullYear() === thisYear) fMonthly += val;
                            if (d.getFullYear() === thisYear) fYearly += val;
                        });

                        const w = window.open('', '_blank');
                        w.document.write(`
                            <html>
                            <head>
                                <title>Preview Laporan - WinHub</title>
                                <style>
                                    body { font-family: 'Inter', Arial, sans-serif; padding: 30px; color: #333; background: #f4f7f6; }
                                    .report-container { max-width: 900px; margin: 0 auto; background: #fff; padding: 40px; box-shadow: 0 4px 15px rgba(0,0,0,0.05); border-radius: 8px; }
                                    h1, h2 { text-align: center; color: #004AAD; }
                                    .header-info { text-align:center; color:#666; margin-top:-10px; margin-bottom: 30px; font-size:14px; }
                                    table { width: 100%; border-collapse: collapse; margin-top: 20px; font-size: 13px; }
                                    th, td { border: 1px solid #e0e0e0; padding: 12px; text-align: left; }
                                    th { background: #004AAD; color: white; }
                                    tr:nth-child(even) { background-color: #f9f9f9; }
                                    .summary { display: flex; justify-content: space-between; margin-top: 20px; gap: 15px; flex-wrap: wrap; }
                                    .summary-box { border: 1px solid #e2e8f0; padding: 20px; flex: 1; min-width: 150px; border-radius: 8px; background:#fff; text-align:center; box-shadow: 0 2px 5px rgba(0,0,0,0.02); }
                                    .summary-box.highlight { border-color: #004AAD; background: #f0f7ff; }
                                    .summary-box h3 { margin-top:0; font-size:13px; color:#64748b; text-transform: uppercase; letter-spacing: 0.5px; }
                                    .summary-box p { font-size:22px; font-weight:bold; margin:10px 0 0; color:#0f172a; }
                                    .controls { text-align: center; margin-bottom: 20px; }
                                    .btn-print { background: #004AAD; color: #fff; border: none; padding: 12px 25px; font-size: 16px; border-radius: 5px; cursor: pointer; font-weight: bold; }
                                    .btn-print:hover { background: #003680; }
                                    @media print {
                                        body { padding: 0; background: #fff; }
                                        .report-container { box-shadow: none; padding: 0; }
                                        .controls, .no-print { display: none !important; }
                                        .summary-box { page-break-inside: avoid; }
                                    }
                                </style>
                            </head>
                            <body>
                                <div class="controls no-print">
                                    <button class="btn-print" onclick="window.print()">🖨️ Cetak Laporan Sekarang</button>
                                </div>
                                <div class="report-container">
                                    <h1>Laporan Pendapatan Keuangan</h1>
                                    <div class="header-info">
                                        Periode: <strong>${periodText}</strong><br>
                                        Dicetak pada: ${new Date().toLocaleDateString('id-ID')} | Oleh: ${currentUser ? currentUser.name : 'Admin'}
                                    </div>
                                    
                                    <div class="summary">
                                        <div class="summary-box">
                                            <h3>Harian (Di Rentang)</h3>
                                            <p>Rp ${formatCurrency(fDaily)}</p>
                                        </div>
                                        <div class="summary-box">
                                            <h3>Bulanan (Di Rentang)</h3>
                                            <p>Rp ${formatCurrency(fMonthly)}</p>
                                        </div>
                                        <div class="summary-box">
                                            <h3>Tahunan (Di Rentang)</h3>
                                            <p>Rp ${formatCurrency(fYearly)}</p>
                                        </div>
                                        <div class="summary-box highlight">
                                            <h3 style="color:#004AAD;">Total Terpilih</h3>
                                            <p style="color:#004AAD;">Rp ${formatCurrency(totalFiltered)}</p>
                                        </div>
                                    </div>

                                    <h2 style="margin-top: 40px; font-size:18px; text-align:left; color:#333; border-bottom:2px solid #004AAD; padding-bottom:10px;">Rincian Transaksi Lunas</h2>
                                    <table>
                                        <thead>
                                            <tr>
                                                <th>No</th>
                                                <th>Tanggal</th>
                                                <th>No. Permohonan</th>
                                                <th>Nama Pelanggan</th>
                                                <th>Jenis Permohonan</th>
                                                <th>Nominal (Rp)</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            ${filteredData.sort((a,b) => new Date(b.tanggalInput) - new Date(a.tanggalInput)).map((p, idx) => `
                                                <tr>
                                                    <td>${idx + 1}</td>
                                                    <td>${new Date(p.tanggalInput).toLocaleDateString('id-ID')}</td>
                                                    <td>${p.id}</td>
                                                    <td>${p.namaPelanggan}</td>
                                                    <td>${p.jenisPermohonan}</td>
                                                    <td>${formatCurrency(p.biaya)}</td>
                                                </tr>
                                            `).join('') || '<tr><td colspan="6" style="text-align:center; padding: 20px;">Tidak ada transaksi lunas pada periode ini.</td></tr>'}
                                        </tbody>
                                    </table>
                                </div>
                            </body>
                            </html>
                        `);
                        w.document.close();
                    }
                });
            });
        }
    }

    window.showUnpaidDetails = function(name) {
        const data = JSON.parse(localStorage.getItem('wh_permohonan')) || [];
        const unpaidItems = data.filter(item => {
            const itemName = item.namaPemohon || item.namaPelanggan || 'Tanpa Nama';
            return itemName === name && item.pembayaranStatus !== 'Paid';
        });

        if (unpaidItems.length === 0) {
            Swal.fire('Info', 'Tidak ada tagihan yang belum lunas.', 'info');
            return;
        }

        let totalUnpaid = 0;
        let rows = unpaidItems.map((item, idx) => {
            totalUnpaid += (item.biaya || 0);
            return `
            <tr>
                <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; color: #333;">${idx + 1}</td>
                <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; color: #333;"><strong>${item.id}</strong></td>
                <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; color: #333;">${item.jenisPermohonan || '-'}</td>
                <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; color: #333; text-align: right;">Rp ${formatCurrency(item.biaya || 0)}</td>
            </tr>
            `;
        }).join('');

        const tableHtml = `
            <div style="text-align: left; overflow-x: auto; margin-top: 10px; border-radius: 8px; border: 1px solid #e2e8f0;">
                <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
                    <thead>
                        <tr style="background: #f8fafc;">
                            <th style="padding: 10px; text-align: left; color: #64748b;">No</th>
                            <th style="padding: 10px; text-align: left; color: #64748b;">ID Transaksi</th>
                            <th style="padding: 10px; text-align: left; color: #64748b;">Layanan</th>
                            <th style="padding: 10px; text-align: right; color: #64748b;">Tagihan</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${rows}
                    </tbody>
                    <tfoot>
                        <tr style="background: #f1f5f9;">
                            <td colspan="3" style="padding: 10px; text-align: right; font-weight: bold; color: #0f172a;">Total Piutang:</td>
                            <td style="padding: 10px; text-align: right; font-weight: bold; color: #ef4444;">Rp ${formatCurrency(totalUnpaid)}</td>
                        </tr>
                    </tfoot>
                </table>
            </div>
        `;

        Swal.fire({
            title: `Rincian Piutang`,
            html: `<p style="margin-bottom:15px; color:#475569; font-size:14px;">Tagihan belum dibayar untuk pelanggan <strong>${name}</strong>:</p>` + tableHtml,
            width: 600,
            confirmButtonColor: '#004AAD',
            confirmButtonText: 'Tutup'
        });
    };

    function renderKeuanganRecentRows(data) {
        if (data.length === 0) {
            return `<tr><td colspan="4" style="text-align:center;">Belum ada riwayat transaksi.</td></tr>`;
        }

        const members = JSON.parse(localStorage.getItem('wh_members')) || [];
        const memberStats = {};

        data.forEach(item => {
            const name = item.namaPemohon || item.namaPelanggan || 'Tanpa Nama';
            const resolvedStatus = resolveStatusMember(item, members);

            if (!memberStats[name]) {
                memberStats[name] = { 
                    name: name,
                    statusMember: resolvedStatus,
                    paid: 0, 
                    unpaid: 0 
                };
            }
            if (item.pembayaranStatus === 'Paid') {
                memberStats[name].paid += item.biaya || 0;
            } else {
                memberStats[name].unpaid += item.biaya || 0;
            }
        });

        // Sort by total transactions (paid + unpaid) descending
        const membersList = Object.values(memberStats).sort((a,b) => (b.paid + b.unpaid) - (a.paid + a.unpaid));

        return membersList.map((item, idx) => `
            <tr>
                <td>${idx + 1}</td>
                <td><strong>${item.name}</strong> <span class="badge" style="font-size:10px; margin-left:8px; background:rgba(255,255,255,0.05); color:#cbd5e1;">${item.statusMember}</span></td>
                <td><strong style="color:var(--success);">Rp ${formatCurrency(item.paid)}</strong></td>
                <td>
                    ${item.unpaid > 0 
                        ? `<strong style="color:var(--danger); cursor:pointer; text-decoration:underline; display:inline-block; padding:4px 8px; border-radius:4px; background:rgba(239, 68, 68, 0.1);" onclick="window.showUnpaidDetails('${item.name.replace(/'/g, "\\'")}')" title="Klik untuk melihat rincian piutang">Rp ${formatCurrency(item.unpaid)} <i class="fas fa-search" style="font-size:11px; margin-left:4px;"></i></strong>`
                        : `<strong style="color:#64748b;">Rp 0</strong>`
                    }
                </td>
            </tr>
        `).join('');
    }

    // 8F. MANAGER DASHBOARD (Visual Complex Reports with Charts!)
    function renderManagerDashboard(container) {
        const data = JSON.parse(localStorage.getItem('wh_permohonan')) || [];
        
        const totalCust = data.length;
        const completed = data.filter(x => x.status === 'Completed').length;
        const waiting = data.filter(x => x.status === 'Waiting Process').length;
        const pendingNidi = data.filter(x => x.status === 'Process NIDI').length;
        const pendingSlo = data.filter(x => x.status === 'Process SLO').length;

        container.innerHTML = `
            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-card-details">
                        <p>Total Pelanggan Bulan Ini</p>
                        <h3>${totalCust}</h3>
                    </div>
                    <div class="stat-card-icon"><i class="fas fa-users"></i></div>
                </div>
                <div class="stat-card">
                    <div class="stat-card-details">
                        <p>Pekerjaan Selesai (Completed)</p>
                        <h3>${completed}</h3>
                    </div>
                    <div class="stat-card-icon"><i class="fas fa-check-circle"></i></div>
                </div>
                <div class="stat-card">
                    <div class="stat-card-details">
                        <p>Pending Admin Proses</p>
                        <h3>${waiting}</h3>
                    </div>
                    <div class="stat-card-icon"><i class="fas fa-hourglass-start"></i></div>
                </div>
                <div class="stat-card">
                    <div class="stat-card-details">
                        <p>Dalam Proses NIDI / SLO</p>
                        <h3>${pendingNidi + pendingSlo}</h3>
                    </div>
                    <div class="stat-card-icon"><i class="fas fa-hourglass-half"></i></div>
                </div>
            </div>

            <!-- Charts Container -->
            <div class="charts-grid">
                <div class="chart-card" style="grid-column: span 2;">
                    <div class="chart-card-header">
                        <h4>Beban Kerja per Divisi (Permohonan Aktif)</h4>
                    </div>
                    <div class="chart-container" style="height: 320px;">
                        <canvas id="chart-divisi"></canvas>
                    </div>
                </div>
                <div class="chart-card">
                    <div class="chart-card-header">
                        <h4>Jumlah Permohonan per Jenis</h4>
                    </div>
                    <div class="chart-container">
                        <canvas id="chart-jenis"></canvas>
                    </div>
                </div>
                <div class="chart-card">
                    <div class="chart-card-header">
                        <h4>Distribusi Status Pembayaran</h4>
                    </div>
                    <div class="chart-container">
                        <canvas id="chart-pembayaran"></canvas>
                    </div>
                </div>
                <div class="chart-card" style="grid-column: span 2;">
                    <div class="chart-card-header">
                        <h4>Estimasi Cashflow Bulanan (Pendapatan Lunas)</h4>
                    </div>
                    <div class="chart-container" style="height: 320px;">
                        <canvas id="chart-cashflow"></canvas>
                    </div>
                </div>
                <div class="chart-card" style="grid-column: span 2;">
                    <div class="chart-card-header">
                        <h4>Pekerjaan Berdasarkan Member (Selesai vs Belum Selesai)</h4>
                    </div>
                    <div class="chart-container" style="height: 350px;">
                        <canvas id="chart-member"></canvas>
                    </div>
                </div>
            </div>

            <!-- TT Monitoring Table -->
            <div class="table-card">
                <div class="table-card-header">
                    <h4>Monitoring Performa Tim Lapangan (Tenaga Teknik)</h4>
                </div>
                <div class="table-responsive">
                    <table class="custom-table">
                        <thead>
                            <tr>
                                <th>Nama Tenaga Teknik</th>
                                <th>Spesialisasi</th>
                                <th>Total Penugasan</th>
                                <th>Selesai Dikerjakan</th>
                                <th>Aktif Pending</th>
                                <th>Tingkat Penyelesaian (%)</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${renderTTPerformanceRows(data)}
                        </tbody>
                    </table>
                </div>
            </div>
        `;

        // Render charts using ChartJS
        setTimeout(() => {
            renderManagerCharts(data);
        }, 100);
    }

    function renderTTPerformanceRows(data) {
        const usersList = JSON.parse(localStorage.getItem('wh_users')) || [];
        const tts = usersList.filter(u => u.role === 'TT NIDI' || u.role === 'TT SLO');
        
        if (tts.length === 0) {
             return `<tr><td colspan="6" style="text-align:center; color:#94A3B8;">Belum ada data Tenaga Teknik.</td></tr>`;
        }

        let html = '';
        tts.forEach(tt => {
             const isNidi = tt.role === 'TT NIDI';
             const tasks = data.filter(x => isNidi ? (x.ttNidi === tt.id || x.ttNidi === tt.name) : (x.ttSlo === tt.id || x.ttSlo === tt.name));
             const total = tasks.length;
             const pending = tasks.filter(x => x.status === (isNidi ? 'Process NIDI' : 'Process SLO')).length;
             const selesai = total - pending;
             const rate = total > 0 ? Math.round((selesai / total) * 100) : 0;
             const badgeClass = isNidi ? 'rgba(59,130,246,0.15)' : 'rgba(236,72,153,0.15)';
             const badgeColor = isNidi ? '#3B82F6' : '#EC4899';
             const badgeText = isNidi ? 'Sertifikasi NIDI' : 'Uji Laik SLO';

             html += `
                <tr>
                    <td><strong>${tt.name}</strong></td>
                    <td><span class="badge" style="background:${badgeClass}; color:${badgeColor};">${badgeText}</span></td>
                    <td>${total}</td>
                    <td><span style="color:var(--success); font-weight:600;">${selesai}</span></td>
                    <td><span style="color:var(--warning); font-weight:600;">${pending}</span></td>
                    <td><strong>${rate}%</strong></td>
                </tr>
             `;
        });
        return html;
    }

    function renderManagerCharts(data) {
        // Chart 1: Jenis Permohonan Distribution
        const types = { 'NIDI': 0, 'SLO': 0, 'SLO + NIDI': 0, 'FULL': 0 };
        data.forEach(x => {
            if (types[x.jenisPermohonan] !== undefined) {
                types[x.jenisPermohonan]++;
            }
        });

        const ctxJenis = document.getElementById('chart-jenis').getContext('2d');
        new Chart(ctxJenis, {
            type: 'bar',
            data: {
                labels: Object.keys(types),
                datasets: [{
                    label: 'Jumlah Permohonan',
                    data: Object.values(types),
                    backgroundColor: ['#3B82F6', '#8B5CF6', '#EC4899', '#FF6B00'],
                    borderWidth: 0,
                    borderRadius: 6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#94A3B8' } },
                    x: { ticks: { color: '#94A3B8' } }
                }
            }
        });

        // Chart 2: Pembayaran Status
        const paidCount = data.filter(x => x.pembayaranStatus === 'Paid').length;
        const unpaidCount = data.filter(x => x.pembayaranStatus === 'Unpaid').length;

        const ctxPembayaran = document.getElementById('chart-pembayaran').getContext('2d');
        new Chart(ctxPembayaran, {
            type: 'doughnut',
            data: {
                labels: ['Lunas (Paid)', 'Belum Lunas (Unpaid)'],
                datasets: [{
                    data: [paidCount, unpaidCount],
                    backgroundColor: ['#10B981', '#EF4444'],
                    borderColor: '#0E1326',
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: { color: '#94A3B8', boxWidth: 12 }
                    }
                }
            }
        });

        // Chart 3: Cashflow Bulanan
        // Pre-calculated cashflow
        const cashflowData = {
            'Jan': 4500000, 'Feb': 5200000, 'Mar': 4800000, 'Apr': 6100000, 'Mei': 7800000
        };
        // Add current May data
        const currentMayRevenue = data.filter(x => x.pembayaranStatus === 'Paid').reduce((sum, item) => sum + item.biaya, 0);
        cashflowData['Mei'] = currentMayRevenue;

        const ctxCashflow = document.getElementById('chart-cashflow').getContext('2d');
        new Chart(ctxCashflow, {
            type: 'line',
            data: {
                labels: Object.keys(cashflowData),
                datasets: [{
                    label: 'Pendapatan (Rupiah)',
                    data: Object.values(cashflowData),
                    borderColor: '#FF6B00',
                    backgroundColor: 'rgba(255, 107, 0, 0.1)',
                    fill: true,
                    tension: 0.3,
                    borderWidth: 3,
                    pointBackgroundColor: '#FF6B00'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#94A3B8' } },
                    x: { ticks: { color: '#94A3B8' } }
                }
            }
        });

        // Chart 4: Beban Kerja Divisi
        const adminPelayanan = data.filter(x => x.status === 'Draft' || x.status === 'Waiting SLO' || x.status === 'Ready').length;
        const adminProses = data.filter(x => x.status === 'Waiting Process').length;
        const ttNidi = data.filter(x => x.status === 'Process NIDI').length;
        const ttSlo = data.filter(x => x.status === 'Process SLO').length;

        const ctxDivisi = document.getElementById('chart-divisi').getContext('2d');
        new Chart(ctxDivisi, {
            type: 'bar',
            data: {
                labels: ['Admin Pelayanan', 'Admin Proses', 'TT NIDI', 'TT SLO'],
                datasets: [{
                    label: 'Beban Kerja (Permohonan Aktif)',
                    data: [adminPelayanan, adminProses, ttNidi, ttSlo],
                    backgroundColor: ['#3B82F6', '#10B981', '#F59E0B', '#EC4899'],
                    borderWidth: 0,
                    borderRadius: 6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#94A3B8' }, beginAtZero: true },
                    x: { ticks: { color: '#94A3B8' } }
                }
            }
        });

        // Chart 5: Pekerjaan per Member
        const membersMaster = JSON.parse(localStorage.getItem('wh_members')) || [];
        const memberTaskStats = {};
        data.forEach(item => {
            const statusMember = resolveStatusMember(item, membersMaster);
            if (statusMember === 'Pelanggan') return; // Exclude Pelanggan

            const name = item.namaPemohon || item.namaPelanggan || 'Tanpa Nama';
            if (!memberTaskStats[name]) {
                memberTaskStats[name] = { completed: 0, pending: 0 };
            }
            if (item.status === 'Completed') {
                memberTaskStats[name].completed++;
            } else {
                memberTaskStats[name].pending++;
            }
        });

        const memberLabels = Object.keys(memberTaskStats).sort((a,b) => (memberTaskStats[b].completed + memberTaskStats[b].pending) - (memberTaskStats[a].completed + memberTaskStats[a].pending));
        const dataCompleted = memberLabels.map(m => memberTaskStats[m].completed);
        const dataPending = memberLabels.map(m => memberTaskStats[m].pending);

        // Jika tidak ada data member selain pelanggan, berikan label dummy agar grafik tidak terlihat error
        if (memberLabels.length === 0) {
            memberLabels.push('Belum Ada Transaksi Member');
            dataCompleted.push(0);
            dataPending.push(0);
        }

        const ctxMember = document.getElementById('chart-member').getContext('2d');
        new Chart(ctxMember, {
            type: 'bar',
            data: {
                labels: memberLabels,
                datasets: [
                    {
                        label: 'Selesai (Completed)',
                        data: dataCompleted,
                        backgroundColor: '#10B981',
                        borderRadius: 4
                    },
                    {
                        label: 'Belum Selesai (Aktif/Pending)',
                        data: dataPending,
                        backgroundColor: '#EF4444',
                        borderRadius: 4
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                        labels: { color: '#94A3B8', boxWidth: 12 }
                    }
                },
                scales: {
                    y: { 
                        stacked: true,
                        grid: { color: 'rgba(255,255,255,0.05)' }, 
                        ticks: { color: '#94A3B8', precision: 0 } 
                    },
                    x: { 
                        stacked: true,
                        ticks: { color: '#94A3B8' } 
                    }
                }
            }
        });
    }

    // 8G. FORM INPUT PERMOHONAN (Admin Pelayanan)
    function renderInputPermohonanForm(container) {
        const dayas = JSON.parse(localStorage.getItem('wh_daya')) || [];
        const wilayah = JSON.parse(localStorage.getItem('wh_wilayah')) || {};
        const members = JSON.parse(localStorage.getItem('wh_members')) || [];
        
        container.innerHTML = `
            <div class="table-card" style="max-width: 800px; margin: 0 auto; padding: 30px;">
                <form id="form-input-permohonan-baru">
                    <div class="form-grid">
                        <div class="form-field form-group-full">
                            <label>Status Member</label>
                            <select id="inp-status-member" class="form-input">
                                <option value="Area">AREA</option>
                                <option value="Mitra">MITRA</option>
                                <option value="Langganan">LANGGANAN</option>
                                <option value="Banyak dan Rutin">BANYAK & RUTIN</option>
                                <option value="Pelanggan">PELANGGAN</option>
                            </select>
                        </div>
                        <div class="form-field" id="container-nama-pemohon" style="display: none;">
                            <label>Nama Pemohon</label>
                            <input list="member-list" id="inp-pemohon" class="form-input" placeholder="Cari / ketik nama pemohon..." autocomplete="off">
                            <datalist id="member-list">
                            </datalist>
                        </div>
                        <div class="form-field" id="container-nohp">
                            <label>Nomor HP</label>
                            <input type="text" id="inp-nohp" class="form-input" placeholder="Contoh: 6281234..." required>
                        </div>
                        <div class="form-field">
                            <label>NIK Pemohon</label>
                            <input type="text" id="inp-nik" class="form-input" placeholder="Masukkan NIK 16 digit" maxlength="16" required>
                        </div>
                        <div class="form-field">
                            <label>Nama Perorangan / Badan Usaha</label>
                            <input type="text" id="inp-pelanggan" class="form-input" placeholder="Nama pemilik instalasi" required>
                        </div>
                        <div class="form-field">
                            <label>Metode Pembayaran</label>
                            <select id="inp-metode" class="form-input">
                                <option value="Transfer">Transfer Bank</option>
                                <option value="Cash">Tunai (Cash)</option>
                            </select>
                        </div>
                        <div class="form-field">
                            <label>Layanan Permohonan</label>
                            <select id="inp-jenis" class="form-input">
                                <option value="NIDI">NIDI SAJA</option>
                                <option value="SLO">SLO SAJA</option>
                                <option value="SLO + NIDI">SLO + NIDI</option>
                                <option value="FULL">FULL SERVICE</option>
                            </select>
                        </div>
                        <div class="form-field">
                            <label>Batas Daya Listrik</label>
                            <select id="inp-daya" class="form-input">
                                ${dayas.map(d => `<option value="${d.daya} VA">${d.daya} VA (${d.golongan})</option>`).join('')}
                            </select>
                        </div>

                        <!-- Lokasi Master -->
                        <div class="form-field">
                            <label>Provinsi</label>
                            <select id="inp-provinsi" class="form-input" required>
                                <option value="">-- Pilih Provinsi --</option>
                            </select>
                        </div>
                        <div class="form-field">
                            <label>Kabupaten / Kota</label>
                            <select id="inp-kabupaten" class="form-input" required>
                                <option value="">-- Pilih Kabupaten / Kota --</option>
                            </select>
                        </div>
                        <div class="form-field form-group-full">
                            <label>Kecamatan Wilayah</label>
                            <select id="inp-kecamatan" class="form-input" required>
                                <option value="">-- Pilih Kecamatan --</option>
                            </select>
                        </div>

                        <div class="form-field form-group-full">
                            <label>Alamat Lengkap Instalasi</label>
                            <textarea id="inp-alamat" class="form-textarea" placeholder="Tuliskan alamat lengkap beserta nomor rumah..." required></textarea>
                        </div>

                        <!-- Biaya Tambahan (Conditional) -->
                        <div class="form-field form-group-full" id="container-biaya-tambahan" style="display: none; background: rgba(0, 74, 173, 0.05); border: 1px solid rgba(0, 74, 173, 0.2); padding: 15px; border-radius: 8px;">
                            <label id="label-biaya-manual" style="color: var(--secondary);">Biaya Tambahan (Manual Input)</label>
                            <input type="number" id="inp-biaya-tambahan" class="form-input" placeholder="Masukkan nominal jika ada (opsional)" value="0">
                            <span id="hint-biaya-manual" style="font-size: 11px; color: #94a3b8; display: block; margin-top: 4px;"><i class="fas fa-info-circle"></i> Biaya ini akan ditambahkan ke total estimasi.</span>
                        </div>

                        <!-- Dynamic cost displays in real time -->
                        <div class="form-field form-group-full" style="background:rgba(255,255,255,0.02); border:1px solid rgba(255,255,255,0.05); padding:15px; border-radius:8px; display:flex; justify-content:space-between; align-items:center;">
                            <div>
                                <span style="font-size:12px; color:var(--text-muted-dark); text-transform:uppercase;">Estimasi Biaya Transaksi</span>
                                <h3 id="form-cost-display" style="color:var(--secondary); font-size:24px; font-weight:800; margin-top:4px;">Rp 0</h3>
                            </div>
                            <span style="font-size:11px; color:var(--text-muted-dark); text-align:right;">Sesuai regulasi penetapan tarif<br>WIN GROUP 2026.</span>
                        </div>
                    </div>

                    <div style="display:flex; justify-content:flex-end; gap:12px; margin-top:25px;">
                        <button type="button" class="btn-action" id="btn-save-draft"><i class="fas fa-file-alt"></i> Simpan Draft</button>
                        <button type="submit" class="btn-action primary" id="btn-submit-permohonan"><i class="fas fa-paper-plane"></i> Lanjut & Proses</button>
                    </div>
                </form>
            </div>
        `;

        const form = document.getElementById('form-input-permohonan-baru');
        const inpDaya = document.getElementById('inp-daya');
        const inpJenis = document.getElementById('inp-jenis');
        const costDisplay = document.getElementById('form-cost-display');

        const statusMemberSelect = document.getElementById('inp-status-member');
        const containerNamaPemohon = document.getElementById('container-nama-pemohon');
        const inpPemohon = document.getElementById('inp-pemohon');
        const memberList = document.getElementById('member-list');
        const inpNoHp = document.getElementById('inp-nohp');

        const containerBiayaTambahan = document.getElementById('container-biaya-tambahan');
        const inpBiayaTambahan = document.getElementById('inp-biaya-tambahan');

        statusMemberSelect.addEventListener('change', () => {
            const val = statusMemberSelect.value;
            if (val === 'Pelanggan') {
                containerNamaPemohon.style.display = 'none';
                inpPemohon.removeAttribute('required');
                inpPemohon.value = '';
                
                if (inpNoHp) {
                    inpNoHp.removeAttribute('readonly');
                    inpNoHp.value = '';
                    inpNoHp.style.background = '';
                }
            } else {
                containerNamaPemohon.style.display = 'block';
                inpPemohon.setAttribute('required', 'required');
                const filteredMembers = members.filter(m => (m.status || 'Pelanggan') === val);
                memberList.innerHTML = filteredMembers.map(m => `<option value="${m.nama}">${m.hp}</option>`).join('');
                
                if (inpNoHp) {
                    inpNoHp.setAttribute('readonly', 'readonly');
                    inpNoHp.value = '';
                    inpNoHp.style.background = 'rgba(255,255,255,0.05)';
                }
            }
        });

        if (inpPemohon && inpNoHp) {
            inpPemohon.addEventListener('input', () => {
                if (statusMemberSelect.value !== 'Pelanggan') {
                    const selectedMember = members.find(m => m.nama === inpPemohon.value);
                    if (selectedMember) {
                        inpNoHp.value = selectedMember.hp || '';
                    } else {
                        inpNoHp.value = '';
                    }
                }
            });
        }
        
        // Trigger initial state
        setTimeout(() => statusMemberSelect.dispatchEvent(new Event('change')), 50);

        const provinsiSelect = document.getElementById('inp-provinsi');
        const kabupatenSelect = document.getElementById('inp-kabupaten');
        const kecamatanSelect = document.getElementById('inp-kecamatan');

        // Populate Provinsi dynamically from Master
        const provinsis = wilayah.provinsi || [];
        provinsis.forEach(prov => {
            const opt = document.createElement('option');
            opt.value = prov.id;
            opt.textContent = prov.nama;
            provinsiSelect.appendChild(opt);
        });

        // Event listener for Provinsi change
        provinsiSelect.addEventListener('change', () => {
            kabupatenSelect.innerHTML = '<option value="">-- Pilih Kabupaten / Kota --</option>';
            kecamatanSelect.innerHTML = '<option value="">-- Pilih Kecamatan --</option>';
            
            const selectedProvId = provinsiSelect.value;
            if (!selectedProvId) return;

            const kotas = (wilayah.kota || []).filter(k => k.provinsiId === selectedProvId);
            kotas.forEach(k => {
                const opt = document.createElement('option');
                opt.value = k.id;
                opt.textContent = k.nama;
                kabupatenSelect.appendChild(opt);
            });
        });

        // Event listener for Kabupaten / Kota change
        kabupatenSelect.addEventListener('change', () => {
            kecamatanSelect.innerHTML = '<option value="">-- Pilih Kecamatan --</option>';
            
            const selectedKotaId = kabupatenSelect.value;
            if (!selectedKotaId) return;

            const kecamatans = (wilayah.kecamatan || []).filter(kec => kec.kotaId === selectedKotaId);
            kecamatans.forEach(kec => {
                const opt = document.createElement('option');
                opt.value = kec.id;
                opt.textContent = `Kecamatan ${kec.nama}`;
                kecamatanSelect.appendChild(opt);
            });
        });

        // Initial cost update
        updateFormCost();

        // Listeners for dynamic cost
        [inpDaya, inpJenis, statusMemberSelect, inpBiayaTambahan].forEach(el => {
            if (el) {
                el.addEventListener('change', updateFormCost);
                if (el.tagName === 'INPUT' && el.type === 'number') {
                    el.addEventListener('input', updateFormCost);
                }
            }
        });

        function updateFormCost() {
            const dayaStr = inpDaya.value;
            const typeStr = inpJenis.value;
            const statusStr = statusMemberSelect ? statusMemberSelect.value : 'Pelanggan';
            const dayaValue = parseInt(dayaStr.replace(' VA', ''));

            let total = 0;
            const bList = JSON.parse(localStorage.getItem('wh_biaya')) || [];
            
            // Find the exactly matching daya, or fallback to 0 if not found
            const bItem = bList.find(b => b.daya === dayaValue) || {};

            if (statusStr === 'Area') {
                total = bItem.area || 0;
            } else if (statusStr === 'Mitra') {
                total = bItem.mitra || 0;
            } else if (statusStr === 'Langganan') {
                total = bItem.langganan || 0;
            } else if (statusStr === 'Banyak dan Rutin') {
                total = 0; // Manual input
            } else {
                // Status is 'Pelanggan'
                if (typeStr === 'NIDI') {
                    total = bItem.nidi || 0;
                } else if (typeStr === 'SLO') {
                    total = bItem.slo || 0;
                } else {
                    total = bItem.pelanggan || 0;
                }
            }

            // Handling Biaya Tambahan Visibility & Calculation
            let biayaTambahan = 0;
            const labelBiayaManual = document.getElementById('label-biaya-manual');
            const hintBiayaManual = document.getElementById('hint-biaya-manual');

            if (statusStr === 'Banyak dan Rutin') {
                if (containerBiayaTambahan) containerBiayaTambahan.style.display = 'block';
                if (labelBiayaManual) labelBiayaManual.innerText = 'Total Biaya Transaksi (Input Manual)';
                if (hintBiayaManual) hintBiayaManual.innerHTML = '<i class="fas fa-info-circle"></i> Masukkan total biaya secara manual sesuai kesepakatan.';
                if (inpBiayaTambahan) biayaTambahan = parseInt(inpBiayaTambahan.value) || 0;
            } else if (statusStr === 'Pelanggan' && typeStr === 'FULL') {
                if (containerBiayaTambahan) containerBiayaTambahan.style.display = 'block';
                if (labelBiayaManual) labelBiayaManual.innerText = 'Biaya Tambahan (Manual Input)';
                if (hintBiayaManual) hintBiayaManual.innerHTML = '<i class="fas fa-info-circle"></i> Biaya ini akan ditambahkan ke total estimasi.';
                if (inpBiayaTambahan) biayaTambahan = parseInt(inpBiayaTambahan.value) || 0;
            } else {
                if (containerBiayaTambahan) containerBiayaTambahan.style.display = 'none';
                if (inpBiayaTambahan) inpBiayaTambahan.value = '0';
            }

            total += biayaTambahan;

            if (costDisplay) costDisplay.textContent = `Rp ${formatCurrency(total)}`;
            return total;
        }

        // Form submit - Lanjut Proses
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                savePermohonan('Waiting Process');
            });
        }

        // Save draft
        const draftBtn = document.getElementById('btn-save-draft');
        if (draftBtn) {
            draftBtn.addEventListener('click', () => {
                savePermohonan('Draft');
            });
        }

        function savePermohonan(targetStatus) {
            const statusMember = document.getElementById('inp-status-member').value;
            let pemohon = document.getElementById('inp-pemohon').value.trim();
            const nik = document.getElementById('inp-nik').value.trim();
            const pelanggan = document.getElementById('inp-pelanggan').value.trim();
            const noHp = document.getElementById('inp-nohp') ? document.getElementById('inp-nohp').value.trim() : '';
            
            if (statusMember === 'Pelanggan' && !pemohon) {
                pemohon = pelanggan;
            }
            const metode = document.getElementById('inp-metode').value;
            const jenis = document.getElementById('inp-jenis').value;
            const daya = document.getElementById('inp-daya').value;
            const provinsiId = document.getElementById('inp-provinsi').value;
            const kabupatenId = document.getElementById('inp-kabupaten').value;
            const kecamatanId = document.getElementById('inp-kecamatan').value;
            const alamat = document.getElementById('inp-alamat').value.trim();

            if (!pemohon || !nik || !pelanggan || !alamat || !provinsiId || !kabupatenId || !kecamatanId) {
                Swal.fire({
                    title: 'Lengkapi Data',
                    text: 'Semua kolom yang wajib diisi (termasuk Provinsi, Kabupaten/Kota, dan Kecamatan) harus dilengkapi terlebih dahulu.',
                    icon: 'warning'
                });
                return;
            }

            // Resolve the actual Kecamatan name from its master ID
            const targetKec = (wilayah.kecamatan || []).find(k => k.id === kecamatanId);
            const kecamatan = targetKec ? targetKec.nama : kecamatanId;

            const reqCost = updateFormCost();
            const newId = `REQ-2026-${Math.floor(100 + Math.random() * 900)}`;

            const newPermohonan = {
                id: newId,
                statusMember: statusMember,
                namaPemohon: pemohon,
                hp: noHp,
                nik: nik,
                namaPelanggan: pelanggan,
                daya: daya,
                alamat: alamat,
                kecamatan: kecamatan,
                biaya: reqCost,
                metodePembayaran: metode,
                jenisPermohonan: jenis,
                status: targetStatus,
                ttNidi: null,
                ttSlo: null,
                catatanNidi: '',
                catatanSlo: '',
                pembayaranStatus: 'Unpaid',
                shared: false,
                tanggalInput: new Date().toISOString(),
                nidiFile: null,
                sloFile: null,
                buktiBayar: null
            };

            const dataStore = JSON.parse(localStorage.getItem('wh_permohonan')) || [];
            dataStore.unshift(newPermohonan);
            localStorage.setItem('wh_permohonan', JSON.stringify(dataStore));

            // Log activity
            logActivity(currentUser.name, `Membuat permohonan baru ${newId} (${pelanggan}) - Status: ${targetStatus}`);

            // If it goes directly to Admin Proses, send fake WhatsApp and notify
            if (targetStatus === 'Waiting Process') {
                triggerWhatsAppNotification(
                    `*WIN GROUP NOTIFICATION*\n\nAda Permohonan Baru masuk!\n\n*ID:* ${newId}\n*Pelanggan:* ${pelanggan}\n*Layanan:* ${jenis}\n*Daya:* ${daya}\n\nMohon Admin Proses segera memverifikasi data ini. Terima kasih.`,
                    'Admin Proses',
                    'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=100&auto=format&fit=crop&q=60'
                );
            }

            Swal.fire({
                title: targetStatus === 'Draft' ? 'Draft Disimpan' : 'Permohonan Dikirim!',
                text: targetStatus === 'Draft' 
                    ? 'Draft permohonan berhasil disimpan ke dalam sistem Anda.' 
                    : `Permohonan ${newId} berhasil dikirim ke Admin Proses.`,
                icon: 'success'
            }).then(() => {
                activeTab = 'dashboard';
                renderSidebar();
                renderPortalView();
            });
        }
    }

    // 8H. DATA MASUK VIEW (Admin Proses)
    function renderDataMasukView(container) {
        const data = JSON.parse(localStorage.getItem('wh_permohonan')) || [];
        const items = data.filter(x => x.status === 'Waiting Process');

        if (items.length === 0) {
            container.innerHTML = `
                <div class="table-card" style="text-align:center; padding:50px; color:var(--text-muted-dark);">
                    <i class="fas fa-inbox" style="font-size:48px; margin-bottom:15px; color:var(--primary);"></i>
                    <h4>Kotak Data Masuk Kosong</h4>
                    <p>Tidak ada permohonan baru yang menanti persetujuan Anda saat ini.</p>
                </div>
            `;
            return;
        }

        container.innerHTML = `
            <div class="table-card">
                <div class="table-card-header">
                    <h4>Antrean Data Masuk (${items.length} Permohonan Baru)</h4>
                </div>
                <div class="table-responsive">
                    <table class="custom-table">
                        <thead>
                            <tr>
                                <th>No</th>
                                <th>Nama Pelanggan</th>
                                <th>Kecamatan</th>
                                <th>Layanan</th>
                                <th>Batas Daya</th>
                                <th>Biaya Estimasi</th>
                                <th>Status</th>
                                <th>Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${items.map((item, idx) => `
                                <tr>
                                    <td>${idx + 1}</td>
                                    <td><strong>${item.namaPelanggan}</strong></td>
                                    <td>${item.kecamatan}</td>
                                    <td><span class="badge" style="background:rgba(255,255,255,0.05); color:white;">${item.jenisPermohonan}</span></td>
                                    <td>${item.daya}</td>
                                    <td><strong>Rp ${formatCurrency(item.biaya)}</strong></td>
                                    <td><span class="badge badge-waiting">Waiting Process</span></td>
                                    <td>
                                        <button class="btn-action primary btn-detail-req" data-id="${item.id}"><i class="fas fa-cogs"></i> Detail & Tugaskan</button>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        `;

        bindTableActionEvents();
    }

    // 8I. PEKERJAAN TT NIDI VIEW
    function renderTTNidiTugasView(container) {
        const data = JSON.parse(localStorage.getItem('wh_permohonan')) || [];
        const tasks = data.filter(x => (x.ttNidi === currentUser.id || x.ttNidi === currentUser.name) && x.status === 'Process NIDI');

        if (tasks.length === 0) {
            container.innerHTML = `
                <div class="table-card" style="text-align:center; padding:50px; color:var(--text-muted-dark);">
                    <i class="fas fa-check-double" style="font-size:48px; margin-bottom:15px; color:var(--success);"></i>
                    <h4>Semua Tugas NIDI Selesai</h4>
                    <p>Hebat! Tidak ada sisa tugas inspeksi NIDI aktif untuk wilayah Anda.</p>
                </div>
            `;
            return;
        }

        // Group by kecamatan
        const group = {};
        tasks.forEach(t => {
            if (!group[t.kecamatan]) group[t.kecamatan] = [];
            group[t.kecamatan].push(t);
        });

        let accordionHtml = '';
        Object.keys(group).forEach((kec, idx) => {
            accordionHtml += `
                <div class="kecamatan-card" style="margin-bottom: 15px;">
                    <div class="kecamatan-header" data-target="body-kec-${idx}">
                        <div class="kecamatan-title">
                            <i class="fas fa-map-marked-alt"></i>
                            <span>Wilayah Kecamatan ${kec}</span>
                            <span class="kecamatan-badge">${group[kec].length} Tugas</span>
                        </div>
                        <i class="fas fa-chevron-down toggle-icon" style="color:var(--text-muted-dark);"></i>
                    </div>
                    <div class="kecamatan-body open" id="body-kec-${idx}">
                        <div class="table-responsive">
                            <table class="custom-table">
                                <thead>
                                    <tr>
                                        <th>Nama Pelanggan</th>
                                        <th>Batas Daya</th>
                                        <th>Alamat Instalasi</th>
                                        <th>Aksi Pekerjaan</th>
                                    </tr>
                                </thead>
                                tbody>
                                    ${group[kec].map(item => `
                                        <tr>
                                            <td><strong>${item.namaPelanggan}</strong></td>
                                            <td>${item.daya}</td>
                                            <td><small>${item.alamat}</small></td>
                                            <td>
                                                <button class="btn-action primary btn-complete-nidi" data-id="${item.id}"><i class="fas fa-check"></i> Selesai Dikerjakan</button>
                                            </td>
                                        </tr>
                                    `).join('')}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            `;
        });

        container.innerHTML = `<div class="kecamatan-grid">${accordionHtml}</div>`;

        // Bind accordion click
        document.querySelectorAll('.kecamatan-header').forEach(header => {
            header.addEventListener('click', () => {
                const targetId = header.getAttribute('data-target');
                const body = document.getElementById(targetId);
                const icon = header.querySelector('.toggle-icon');

                if (body.classList.contains('open')) {
                    body.classList.remove('open');
                    icon.className = 'fas fa-chevron-right toggle-icon';
                } else {
                    body.classList.add('open');
                    icon.className = 'fas fa-chevron-down toggle-icon';
                }
            });
        });

        // Bind Selesai Dikerjakan
        document.querySelectorAll('.btn-complete-nidi').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.getAttribute('data-id');
                
                Swal.fire({
                    title: 'Inspeksi NIDI Selesai?',
                    text: 'Silakan masukkan catatan hasil pemeriksaan instalasi Anda di bawah ini:',
                    input: 'textarea',
                    inputPlaceholder: 'Contoh: Instalasi grounding aman, kabel SNI rapi...',
                    showCancelButton: true,
                    confirmButtonColor: '#004AAD',
                    cancelButtonColor: '#EF4444',
                    confirmButtonText: 'Submit & Selesai',
                    cancelButtonText: 'Batal'
                }).then((result) => {
                    if (result.isConfirmed) {
                        const note = result.value || 'Inspeksi selesai, kelayakan instalasi baik.';
                        completeNidiTask(id, note);
                    }
                });
            });
        });
    }

    function completeNidiTask(id, note) {
        const data = JSON.parse(localStorage.getItem('wh_permohonan')) || [];
        const index = data.findIndex(x => x.id === id);

        if (index !== -1) {
            const item = data[index];
            item.catatanNidi = note;
            item.nidiFile = `NIDI_${item.nik}.pdf`;

            // Logic flow
            if (item.jenisPermohonan === 'NIDI') {
                // Done NIDI only
                item.status = 'SLO Finished'; // Ready to share (finished)
            } else {
                // Needs SLO
                item.status = 'Waiting SLO';
            }

            localStorage.setItem('wh_permohonan', JSON.stringify(data));
            logActivity(currentUser.name, `Menyelesaikan inspeksi NIDI untuk ${item.namaPelanggan}. Catatan: ${note}`);

            // Notifications to Manager
            triggerWhatsAppNotification(
                `*WIN GROUP NOTIFICATION - LAPORAN NIDI SELESAI*\n\nHalo Bapak Winata (Manager),\n\nTugas inspeksi NIDI telah selesai dikerjakan oleh Tenaga Teknik (${currentUser.name}).\n\n*ID:* ${item.id}\n*Pelanggan:* ${item.namaPelanggan}\n*Daya:* ${item.daya}\n*Alamat:* ${item.alamat}\n*Catatan Lapangan:* ${note}\n\nMohon Bapak Manager dapat meninjau progres pekerjaan ini. Terima kasih.`,
                'Manager',
                'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=60'
            );

            Swal.fire({
                title: 'Tugas NIDI Rampung',
                text: `Sertifikasi NIDI untuk ${item.namaPelanggan} berhasil dilaporkan.`,
                icon: 'success'
            }).then(() => {
                renderPortalView();
            });
        }
    }

    // 8J. PEKERJAAN TT SLO VIEW
    function renderTTSloTugasView(container) {
        const data = JSON.parse(localStorage.getItem('wh_permohonan')) || [];
        const tasks = data.filter(x => (x.ttSlo === currentUser.id || x.ttSlo === currentUser.name) && x.status === 'Process SLO');

        if (tasks.length === 0) {
            container.innerHTML = `
                <div class="table-card" style="text-align:center; padding:50px; color:var(--text-muted-dark);">
                    <i class="fas fa-check-double" style="font-size:48px; margin-bottom:15px; color:var(--success);"></i>
                    <h4>Semua Tugas SLO Selesai</h4>
                    <p>Kerja bagus! Seluruh antrean sertifikasi SLO Anda telah diselesaikan.</p>
                </div>
            `;
            return;
        }

        // Group by kecamatan
        const group = {};
        tasks.forEach(t => {
            if (!group[t.kecamatan]) group[t.kecamatan] = [];
            group[t.kecamatan].push(t);
        });

        let accordionHtml = '';
        Object.keys(group).forEach((kec, idx) => {
            accordionHtml += `
                <div class="kecamatan-card" style="margin-bottom: 15px;">
                    <div class="kecamatan-header" data-target="body-kec-${idx}">
                        <div class="kecamatan-title">
                            <i class="fas fa-map-marked-alt"></i>
                            <span>Wilayah Kecamatan ${kec}</span>
                            <span class="kecamatan-badge">${group[kec].length} Tugas</span>
                        </div>
                        <i class="fas fa-chevron-down toggle-icon" style="color:var(--text-muted-dark);"></i>
                    </div>
                    <div class="kecamatan-body open" id="body-kec-${idx}">
                        <div class="table-responsive">
                            <table class="custom-table">
                                <thead>
                                    <tr>
                                        <th>Nama Pelanggan</th>
                                        <th>Batar Daya</th>
                                        <th>Alamat Instalasi</th>
                                        <th>Aksi Pekerjaan</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${group[kec].map(item => `
                                        <tr>
                                            <td><strong>${item.namaPelanggan}</strong></td>
                                            <td>${item.daya}</td>
                                            <td><small>${item.alamat}</small></td>
                                            <td>
                                                <button class="btn-action primary btn-complete-slo" data-id="${item.id}"><i class="fas fa-check"></i> Uji SLO Selesai</button>
                                            </td>
                                        </tr>
                                    `).join('')}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            `;
        });

        container.innerHTML = `<div class="kecamatan-grid">${accordionHtml}</div>`;

        // Accordion binder
        document.querySelectorAll('.kecamatan-header').forEach(header => {
            header.addEventListener('click', () => {
                const targetId = header.getAttribute('data-target');
                const body = document.getElementById(targetId);
                const icon = header.querySelector('.toggle-icon');

                if (body.classList.contains('open')) {
                    body.classList.remove('open');
                    icon.className = 'fas fa-chevron-right toggle-icon';
                } else {
                    body.classList.add('open');
                    icon.className = 'fas fa-chevron-down toggle-icon';
                }
            });
        });

        // Complete SLO binder
        document.querySelectorAll('.btn-complete-slo').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.getAttribute('data-id');
                
                Swal.fire({
                    title: 'Uji Laik SLO Selesai?',
                    text: 'Silakan masukkan hasil pengujian tahanan isolasi & pembumian di bawah ini:',
                    input: 'textarea',
                    inputPlaceholder: 'Contoh: Hasil uji laik operasi lolos, SLO siap dirilis...',
                    showCancelButton: true,
                    confirmButtonColor: '#004AAD',
                    cancelButtonColor: '#EF4444',
                    confirmButtonText: 'Terbitkan SLO',
                    cancelButtonText: 'Batal'
                }).then((result) => {
                    if (result.isConfirmed) {
                        const note = result.value || 'Pemeriksaan keselamatan lolos, layak mendapatkan SLO.';
                        completeSloTask(id, note);
                    }
                });
            });
        });
    }

    function completeSloTask(id, note) {
        const data = JSON.parse(localStorage.getItem('wh_permohonan')) || [];
        const index = data.findIndex(x => x.id === id);

        if (index !== -1) {
            const item = data[index];
            item.catatanSlo = note;
            item.sloFile = `SLO_${item.nik}.pdf`;
            item.status = 'SLO Finished'; // Ready for Admin Pelayanan to share

            localStorage.setItem('wh_permohonan', JSON.stringify(data));
            logActivity(currentUser.name, `Menyelesaikan uji kelayakan SLO untuk ${item.namaPelanggan}. Catatan: ${note}`);

            // Notification to Manager
            triggerWhatsAppNotification(
                `*WIN GROUP NOTIFICATION - LAPORAN SLO SELESAI*\n\nHalo Bapak Winata (Manager),\n\nTugas pengujian SLO telah selesai dikerjakan oleh Tenaga Teknik (${currentUser.name}).\n\n*ID:* ${item.id}\n*Pelanggan:* ${item.namaPelanggan}\n*Daya:* ${item.daya}\n*Alamat:* ${item.alamat}\n*Catatan Lapangan:* ${note}\n\nSertifikasi SLO-NIDI kini siap dibagikan ke pelanggan. Terima kasih.`,
                'Manager',
                'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=60'
            );

            Swal.fire({
                title: 'SLO Diterbitkan!',
                text: `Sertifikat Laik Operasi untuk ${item.namaPelanggan} telah dirilis.`,
                icon: 'success'
            }).then(() => {
                renderPortalView();
            });
        }
    }

    // 8K. SHARE DOKUMEN VIEW (Admin Pelayanan)
    function renderShareDokumenView(container) {
        const data = JSON.parse(localStorage.getItem('wh_permohonan')) || [];
        const readyItems = data.filter(x => x.status === 'SLO Finished');

        if (readyItems.length === 0) {
            container.innerHTML = `
                <div class="table-card" style="text-align:center; padding:50px; color:var(--text-muted-dark);">
                    <i class="fas fa-share-alt" style="font-size:48px; margin-bottom:15px; color:var(--primary);"></i>
                    <h4>Tidak Ada Berkas Siap Dibagikan</h4>
                    <p>Semua SLO & NIDI yang rampung telah berhasil dibagikan ke pelanggan Anda.</p>
                </div>
            `;
            return;
        }

        container.innerHTML = `
            <div class="table-card">
                <div class="table-card-header">
                    <h4>Berkas SLO & NIDI Siap Kirim (${readyItems.length} Pelanggan)</h4>
                </div>
                <div class="table-responsive">
                    <table class="custom-table">
                        <thead>
                            <tr>
                                <th>No</th>
                                <th>ID Permohonan</th>
                                <th>Nama Pelanggan</th>
                                <th>Layanan Layanan</th>
                                <th>Catatan Lapangan</th>
                                <th>Daya</th>
                                <th>Metode Bayar</th>
                                <th>Aksi Share</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${readyItems.map((item, idx) => `
                                <tr>
                                    <td>${idx + 1}</td>
                                    <td><strong>${item.id}</strong></td>
                                    <td>${item.namaPelanggan}</td>
                                    <td><span class="badge" style="background:rgba(255,255,255,0.05); color:white;">${item.jenisPermohonan}</span></td>
                                    <td>
                                        <small style="color:var(--text-muted-dark); display:block;">NIDI: ${item.catatanNidi || '-'}</small>
                                        <small style="color:var(--text-muted-dark); display:block;">SLO: ${item.catatanSlo || '-'}</small>
                                    </td>
                                    <td>${item.daya}</td>
                                    <td><span class="badge badge-paid">${item.pembayaranStatus}</span></td>
                                    <td>
                                        <div style="display:flex; gap:5px;">
                                            <button class="btn-action primary btn-share-cust" data-id="${item.id}"><i class="fab fa-whatsapp"></i> Bagikan Pelanggan</button>
                                            <button class="btn-action btn-print-pdf" data-id="${item.id}"><i class="fas fa-file-pdf"></i> PDF</button>
                                        </div>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        `;

        // Bind share click
        document.querySelectorAll('.btn-share-cust').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.getAttribute('data-id');
                const reqs = JSON.parse(localStorage.getItem('wh_permohonan')) || [];
                const req = reqs.find(x => x.id === id);

                if (req) {
                    Swal.fire({
                        title: 'Bagikan Berkas?',
                        text: `Kirimkan tautan resmi berkas SLO & NIDI ke pelanggan *${req.namaPemohon}* via WhatsApp?`,
                        icon: 'question',
                        showCancelButton: true,
                        confirmButtonColor: '#25D366',
                        cancelButtonColor: '#EF4444',
                        confirmButtonText: 'Kirim WhatsApp',
                        cancelButtonText: 'Batal'
                    }).then((result) => {
                        if (result.isConfirmed) {
                            shareToCustomer(id);
                        }
                    });
                }
            });
        });

        // Bind PDF printing click
        document.querySelectorAll('.btn-print-pdf').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.getAttribute('data-id');
                generateOfficialPDF(id);
            });
        });
    }

    function shareToCustomer(id) {
        const data = JSON.parse(localStorage.getItem('wh_permohonan')) || [];
        const index = data.findIndex(x => x.id === id);

        if (index !== -1) {
            const item = data[index];
            item.status = 'Completed';
            item.shared = true;

            localStorage.setItem('wh_permohonan', JSON.stringify(data));
            logActivity(currentUser.name, `Membagikan sertifikat resmi SLO & NIDI REQ ${item.id} ke pelanggan ${item.namaPelanggan}`);

            renderPortalView();

            // WhatsApp Notification to customer
            triggerWhatsAppNotification(
                `*WIN GROUP - SMART ELECTRICAL SERVICE*\n\nHalo *${item.namaPemohon}*,\n\nPermohonan kelistrikan Anda telah *SELESAI & VALID*.\n\n*ID:* ${item.id}\n*Layanan:* ${item.jenisPermohonan}\n*NIDI:* Terbit (${item.nidiFile || '-'})\n*SLO:* Terbit (${item.sloFile || '-'})\n\nSilakan unduh dokumen Anda pada portal resmi WIN Hub. Terima kasih atas kepercayaan Anda menggunakan jasa kami!`,
                item.namaPemohon,
                'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=60',
                item.hp
            );
        }
    }

    // 8L. VERIFIKASI PEMBAYARAN KEUANGAN VIEW
    function renderKeuanganVerifView(container) {
        const data = JSON.parse(localStorage.getItem('wh_permohonan')) || [];
        
        container.innerHTML = `
            <div class="table-card">
                <div class="table-card-header">
                    <h4>Filter & Manajemen Transaksi Masuk</h4>
                    <div class="table-filters">
                        <select id="fin-filter-status" class="table-filter-select">
                            <option value="ALL">Semua Status Bayar</option>
                            <option value="Unpaid">Belum Lunas (Unpaid)</option>
                            <option value="Paid">Lunas (Paid)</option>
                        </select>
                        <select id="fin-filter-kecamatan" class="table-filter-select">
                            <option value="ALL">Semua Wilayah</option>
                            ${[...new Set(data.map(x => x.kecamatan))].map(k => `<option value="${k}">${k}</option>`).join('')}
                        </select>
                        <select id="fin-filter-member" class="table-filter-select">
                            <option value="ALL">Semua Status Member</option>
                            <option value="Area">AREA</option>
                            <option value="Mitra">MITRA</option>
                            <option value="Langganan">LANGGANAN</option>
                            <option value="Banyak dan Rutin">BANYAK & RUTIN</option>
                            <option value="Pelanggan">PELANGGAN</option>
                        </select>
                        <button class="btn-action primary" id="btn-export-csv"><i class="fas fa-file-excel"></i> Export CSV (Excel)</button>
                    </div>
                </div>
                <div class="table-responsive">
                    <table class="custom-table" id="fin-table">
                        <thead>
                            <tr>
                                <th>No</th>
                                <th>ID Permohonan</th>
                                <th>Pelanggan</th>
                                <th>Layanan</th>
                                <th>Metode</th>
                                <th>Biaya</th>
                                <th>Pembayaran</th>
                                <th>Tanggal Masuk</th>
                                <th>Aksi</th>
                            </tr>
                        </thead>
                        <tbody id="fin-table-body">
                            ${renderKeuanganTableRows(data)}
                        </tbody>
                    </table>
                </div>
            </div>
        `;

        // Bind filter change
        const statusFil = document.getElementById('fin-filter-status');
        const kecFil = document.getElementById('fin-filter-kecamatan');
        const memberFil = document.getElementById('fin-filter-member');
        if (statusFil && kecFil && memberFil) {
            [statusFil, kecFil, memberFil].forEach(el => {
                el.addEventListener('change', () => {
                    const status = statusFil.value;
                    const kec = kecFil.value;
                    const member = memberFil.value;

                    const membersMaster = JSON.parse(localStorage.getItem('wh_members')) || [];
                    let filtered = [...data];
                    if (status !== 'ALL') filtered = filtered.filter(x => x.pembayaranStatus === status);
                    if (kec !== 'ALL') filtered = filtered.filter(x => x.kecamatan === kec);
                    if (member !== 'ALL') filtered = filtered.filter(x => resolveStatusMember(x, membersMaster) === member);

                    document.getElementById('fin-table-body').innerHTML = renderKeuanganTableRows(filtered);
                    bindKeuanganVerificationEvents();
                });
            });
        }

        // Export Excel binder
        const exportBtn = document.getElementById('btn-export-csv');
        if (exportBtn) {
            exportBtn.addEventListener('click', () => {
                exportTransactionsToExcel(data);
            });
        }

        bindKeuanganVerificationEvents();
    }

    function renderKeuanganTableRows(filtered) {
        if (filtered.length === 0) {
            return `<tr><td colspan="9" style="text-align:center; color:var(--text-muted-dark);">Tidak ada transaksi yang cocok dengan kriteria filter.</td></tr>`;
        }

        return filtered.map((item, idx) => `
            <tr>
                <td>${idx + 1}</td>
                <td><strong>${item.id}</strong></td>
                <td>${item.namaPelanggan}</td>
                <td><span class="badge" style="background:rgba(255,255,255,0.05); color:white;">${item.jenisPermohonan}</span></td>
                <td>${item.metodePembayaran}</td>
                <td><strong>Rp ${formatCurrency(item.biaya)}</strong></td>
                <td><span class="badge ${item.pembayaranStatus === 'Paid' ? 'badge-paid' : 'badge-unpaid'}">${item.pembayaranStatus}</span></td>
                <td>${formatDateTime(item.tanggalInput)}</td>
                <td>
                    ${item.pembayaranStatus === 'Unpaid' 
                        ? `<button class="btn-action primary btn-verify-pay" data-id="${item.id}"><i class="fas fa-check-double"></i> Verifikasi Lunas</button>`
                        : `<button class="btn-action btn-print-receipt" data-id="${item.id}"><i class="fas fa-print"></i> Cetak Kuitansi</button>`
                    }
                </td>
            </tr>
        `).join('');
    }

    function bindKeuanganVerificationEvents() {
        document.querySelectorAll('.btn-verify-pay').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.getAttribute('data-id');
                const reqs = JSON.parse(localStorage.getItem('wh_permohonan')) || [];
                const item = reqs.find(x => x.id === id);

                if (item) {
                    Swal.fire({
                        title: 'Konfirmasi Pembayaran',
                        text: `Apakah Anda menyatakan pembayaran sebesar Rp ${formatCurrency(item.biaya)} untuk pelanggan ${item.namaPelanggan} telah LUNAS diterima?`,
                        icon: 'question',
                        showCancelButton: true,
                        confirmButtonColor: '#10B981',
                        cancelButtonColor: '#EF4444',
                        confirmButtonText: 'Ya, Lunas!',
                        cancelButtonText: 'Batal'
                    }).then((result) => {
                        if (result.isConfirmed) {
                            verifyPaymentLunas(id);
                        }
                    });
                }
            });
        });

        document.querySelectorAll('.btn-print-receipt').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.getAttribute('data-id');
                printOfficialReceipt(id);
            });
        });
    }

    function verifyPaymentLunas(id) {
        const data = JSON.parse(localStorage.getItem('wh_permohonan')) || [];
        const index = data.findIndex(x => x.id === id);

        if (index !== -1) {
            const item = data[index];
            item.pembayaranStatus = 'Paid';
            item.buktiBayar = 'manual_verified.jpg';

            localStorage.setItem('wh_permohonan', JSON.stringify(data));
            logActivity(currentUser.name, `Memverifikasi LUNAS pembayaran permohonan ${item.id} (${item.namaPelanggan})`);

            // Trigger notification
            triggerWhatsAppNotification(
                `*WIN GROUP PAYMENT VERIFIED*\n\nPembayaran Diterima!\n\n*ID:* ${item.id}\n*Pelanggan:* ${item.namaPelanggan}\n*Biaya:* Rp ${formatCurrency(item.biaya)}\n*Metode:* ${item.metodePembayaran}\n\n*Status:* LUNAS (Paid). Laporan keuangan otomatis terupdate.`,
                'Keuangan',
                'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=100&auto=format&fit=crop&q=60'
            );

            Swal.fire({
                title: 'Pembayaran Diverifikasi',
                text: `Kwitansi pembayaran untuk ${item.namaPelanggan} siap dicetak.`,
                icon: 'success'
            }).then(() => {
                renderPortalView();
            });
        }
    }

    // 8M. MASTER DATA VIEW
    function renderMasterDataView(container) {
        const dayas = JSON.parse(localStorage.getItem('wh_daya')) || [];
        const wilayah = JSON.parse(localStorage.getItem('wh_wilayah')) || {};
        const users = JSON.parse(localStorage.getItem('wh_users')) || [];
        const members = JSON.parse(localStorage.getItem('wh_members')) || [];
        
        let biayas = JSON.parse(localStorage.getItem('wh_biaya'));
        if (!biayas) {
            biayas = [
                { daya: 450, nidi: 45000, slo: 40000, area: 23000, mitra: 70000, langganan: 85000, pelanggan: 135000 },
                { daya: 900, nidi: 90000, slo: 60000, area: 39000, mitra: 130000, langganan: 150000, pelanggan: 200000 },
                { daya: 1300, nidi: 130000, slo: 120000, area: 68000, mitra: 165000, langganan: 250000, pelanggan: 300000 },
                { daya: 2200, nidi: 220000, slo: 135000, area: 91250, mitra: 275000, langganan: 355000, pelanggan: 405000 },
                { daya: 3500, nidi: 350000, slo: 122500, area: 112875, mitra: 400000, langganan: 472500, pelanggan: 522500 },
                { daya: 4400, nidi: 440000, slo: 154000, area: 141900, mitra: 500000, langganan: 594000, pelanggan: 644000 },
                { daya: 5500, nidi: 550000, slo: 192500, area: 177375, mitra: 600000, langganan: 742500, pelanggan: 792500 },
                { daya: 6600, nidi: 660000, slo: 231000, area: 212850, mitra: 750000, langganan: 891000, pelanggan: 991000 },
                { daya: 7700, nidi: 770000, slo: 269500, area: 248325, mitra: 800000, langganan: 1039500, pelanggan: 1089500 },
                { daya: 10600, nidi: 1060000, slo: 318000, area: 323300, mitra: 1100000, langganan: 1378000, pelanggan: 1478000 },
                { daya: 11000, nidi: 1100000, slo: 330000, area: 335500, mitra: 1200000, langganan: 1430000, pelanggan: 1530000 },
                { daya: 13200, nidi: 1320000, slo: 264000, area: 356400, mitra: 1300000, langganan: 1584000, pelanggan: 1684000 },
                { daya: 16500, nidi: 1650000, slo: 495000, area: 503250, mitra: 1800000, langganan: 2145000, pelanggan: 2245000 },
                { daya: 23000, nidi: 1725000, slo: 690000, area: 586500, mitra: 2000000, langganan: 2415000, pelanggan: 2515000 },
                { daya: 33000, nidi: 2475000, slo: 825000, area: 783750, mitra: 2800000, langganan: 3300000, pelanggan: 3400000 },
                { daya: 41500, nidi: 3112500, slo: 1037500, area: 985625, mitra: 3500000, langganan: 4150000, pelanggan: 4250000 },
                { daya: 53000, nidi: 3975000, slo: 1325000, area: 1258750, mitra: 4500000, langganan: 5300000, pelanggan: 5400000 },
                { daya: 66000, nidi: 4950000, slo: 1650000, area: 1567500, mitra: 5600000, langganan: 6600000, pelanggan: 6800000 },
                { daya: 82500, nidi: 4950000, slo: 1650000, area: 1567500, mitra: 5600000, langganan: 6600000, pelanggan: 6800000 },
                { daya: 105000, nidi: 6300000, slo: 2100000, area: 1995000, mitra: 7000000, langganan: 8400000, pelanggan: 8600000 },
                { daya: 131000, nidi: 7860000, slo: 2620000, area: 2489000, mitra: 8900000, langganan: 10480000, pelanggan: 10680000 },
                { daya: 147000, nidi: 8820000, slo: 2940000, area: 2793000, mitra: 9800000, langganan: 11760000, pelanggan: 11960000 },
                { daya: 164000, nidi: 9840000, slo: 3280000, area: 3116000, mitra: 11000000, langganan: 13120000, pelanggan: 13320000 },
                { daya: 197000, nidi: 11820000, slo: 3940000, area: 3743000, mitra: 13000000, langganan: 15760000, pelanggan: 15960000 }
            ];
            localStorage.setItem('wh_biaya', JSON.stringify(biayas));
        }

        // Master Geografis State
        if (!window.selectedGeoState) {
            window.selectedGeoState = {
                provinsiId: '',
                kotaId: '',
                kecamatanId: '',
                desaId: ''
            };
        }

        // Validate and seed selectedGeoState selections sequentially
        if (!wilayah.provinsi) wilayah.provinsi = [];
        if (!wilayah.kota) wilayah.kota = [];
        if (!wilayah.kecamatan) wilayah.kecamatan = [];
        if (!wilayah.desa) wilayah.desa = [];
        if (!wilayah.dusun) wilayah.dusun = [];

        if (!window.selectedGeoState.provinsiId && wilayah.provinsi.length > 0) {
            window.selectedGeoState.provinsiId = wilayah.provinsi[0].id;
        }
        
        const filteredKota = wilayah.kota.filter(k => k.provinsiId === window.selectedGeoState.provinsiId);
        if ((!window.selectedGeoState.kotaId || !filteredKota.some(k => k.id === window.selectedGeoState.kotaId)) && filteredKota.length > 0) {
            window.selectedGeoState.kotaId = filteredKota[0].id;
        }

        const filteredKec = wilayah.kecamatan.filter(k => k.kotaId === window.selectedGeoState.kotaId);
        if ((!window.selectedGeoState.kecamatanId || !filteredKec.some(k => k.id === window.selectedGeoState.kecamatanId)) && filteredKec.length > 0) {
            window.selectedGeoState.kecamatanId = filteredKec[0].id;
        }

        const filteredDesa = wilayah.desa.filter(d => d.kecamatanId === window.selectedGeoState.kecamatanId);
        if ((!window.selectedGeoState.desaId || !filteredDesa.some(d => d.id === window.selectedGeoState.desaId)) && filteredDesa.length > 0) {
            window.selectedGeoState.desaId = filteredDesa[0].id;
        }

        const filteredDusun = wilayah.dusun.filter(d => d.desaId === window.selectedGeoState.desaId);

        container.innerHTML = `
            <div class="charts-grid">
                 <!-- Master Daya -->
                <div class="chart-card" style="grid-column: span 2;">
                    <div class="chart-card-header">
                        <h4>Master Batasan Daya Listrik</h4>
                        <button class="btn-action primary" id="btn-add-daya"><i class="fas fa-plus"></i> Daya Baru</button>
                    </div>
                    <div class="table-responsive" style="max-height: 250px;">
                        <table class="custom-table">
                            <thead>
                                <tr>
                                    <th>No</th>
                                    <th>Daya (VA)</th>
                                    <th>Golongan Umum</th>
                                    <th>Keterangan</th>
                                    <th>Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${dayas.map((d, idx) => `
                                    <tr>
                                        <td>${idx + 1}</td>
                                        <td><strong>${d.daya} VA</strong></td>
                                        <td><span class="badge" style="background:var(--primary); color:white; font-size:11px;">${d.golongan}</span></td>
                                        <td><span style="font-size:12px; color:#cbd5e1;">${d.keterangan}</span></td>
                                        <td>
                                            <div style="display:flex; gap:6px;">
                                                <button class="btn-action btn-edit-daya" data-idx="${idx}" style="color:var(--primary); border-color:rgba(0,74,173,0.1); padding:2px 6px; font-size:10px;"><i class="fas fa-edit"></i></button>
                                                <button class="btn-action btn-del-daya" data-idx="${idx}" style="color:var(--danger); border-color:rgba(239,68,68,0.1); padding:2px 6px; font-size:10px;"><i class="fas fa-trash-alt"></i></button>
                                            </div>
                                        </td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>

                <!-- Manajemen Member -->
                <div class="chart-card" style="grid-column: span 2;">
                    <div class="chart-card-header">
                        <h4>Manajemen Member</h4>
                        <button class="btn-action primary" id="btn-add-member"><i class="fas fa-users"></i> Member Baru</button>
                    </div>
                    <div class="table-responsive">
                        <table class="custom-table">
                            <thead>
                                <tr>
                                    <th>No</th>
                                    <th>Nama Member</th>
                                    <th>Nomor HP</th>
                                    <th>Status</th>
                                    <th>Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${members.map((m, idx) => `
                                    <tr>
                                        <td>${idx + 1}</td>
                                        <td><strong>${m.nama}</strong></td>
                                        <td>${m.hp}</td>
                                        <td><span class="badge" style="background:var(--primary); color:white;">${m.status || 'Pelanggan'}</span></td>
                                        <td>
                                            <button class="btn-action btn-edit-member" data-idx="${idx}" style="color:var(--primary); border-color:rgba(0,74,173,0.1); margin-right:4px; padding:2px 6px; font-size:10px;"><i class="fas fa-edit"></i> Edit</button>
                                            <button class="btn-action btn-del-member" data-idx="${idx}" style="color:var(--danger); border-color:rgba(239,68,68,0.1); padding:2px 6px; font-size:10px;"><i class="fas fa-trash-alt"></i> Hapus</button>
                                        </td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>

                <!-- Manajemen Biaya -->
                <div class="chart-card" style="grid-column: span 2;">
                    <div class="chart-card-header">
                        <h4>Manajemen Biaya (Daya & Status)</h4>
                        <button class="btn-action primary" id="btn-add-biaya"><i class="fas fa-plus"></i> Biaya Baru</button>
                    </div>
                    <div class="table-responsive" style="max-height: 400px;">
                        <table class="custom-table" style="font-size: 11px;">
                            <thead style="position: sticky; top: 0; background: #1e293b; z-index: 10;">
                                <tr>
                                    <th>DAYA (VA)</th>
                                    <th>NIDI</th>
                                    <th>SLO</th>
                                    <th>AREA</th>
                                    <th>MITRA</th>
                                    <th>LANGGANAN</th>
                                    <th>BANYAK & RUTIN</th>
                                    <th>PELANGGAN</th>
                                    <th>AKSI</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${biayas.map((b, idx) => `
                                    <tr>
                                        <td><strong>${b.daya}</strong></td>
                                        <td>Rp ${formatCurrency(b.nidi)}</td>
                                        <td>Rp ${formatCurrency(b.slo)}</td>
                                        <td>Rp ${formatCurrency(b.area)}</td>
                                        <td>Rp ${formatCurrency(b.mitra)}</td>
                                        <td>Rp ${formatCurrency(b.langganan)}</td>
                                        <td><strong>Rp ${formatCurrency(b.banyak_rutin || 0)}</strong></td>
                                        <td><strong>Rp ${formatCurrency(b.pelanggan)}</strong></td>
                                        <td>
                                            <div style="display:flex; gap:6px;">
                                                <button class="btn-action btn-edit-biaya" data-idx="${idx}" style="color:var(--primary); border-color:rgba(0,74,173,0.1); padding:2px 6px; font-size:10px;"><i class="fas fa-edit"></i></button>
                                                <button class="btn-action btn-del-biaya" data-idx="${idx}" style="color:var(--danger); border-color:rgba(239,68,68,0.1); padding:2px 6px; font-size:10px;"><i class="fas fa-trash-alt"></i></button>
                                            </div>
                                        </td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>

                <!-- Panel Master Geografis Wilayah -->
                <div class="chart-card" style="grid-column: span 2;">
                    <div class="chart-card-header">
                        <h4><i class="fas fa-map-marked-alt"></i> Panel Master Geografis Wilayah (Relasional & Hierarkis)</h4>
                    </div>
                    <div style="padding: 10px 20px; font-size: 12px; color: #94a3b8; border-bottom: 1px solid rgba(255,255,255,0.05); background: rgba(30,41,59,0.2);">
                        <i class="fas fa-info-circle"></i> Alur Hubungan Geografis: <strong>Provinsi &rarr; Kota/Kab &rarr; Kecamatan &rarr; Desa/Kel &rarr; Dusun/RT</strong>. Klik baris wilayah untuk memfilter turunan di sebelah kanannya.
                    </div>
                    <div class="geo-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; padding: 20px;">
                        <!-- Provinsi -->
                        <div class="geo-col" style="background: rgba(30,41,59,0.5); border: 1px solid rgba(255,255,255,0.05); border-radius: 8px; padding: 12px;">
                            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                                <h5 style="margin: 0; color: #94a3b8; font-size: 13px;"><i class="fas fa-map"></i> 1. Provinsi</h5>
                                <button class="btn-action primary" id="btn-add-provinsi" style="padding: 2px 6px; font-size: 11px;"><i class="fas fa-plus"></i></button>
                            </div>
                            <div style="max-height: 250px; overflow-y: auto; padding-right: 4px;">
                                ${wilayah.provinsi.length === 0 ? `
                                    <div style="text-align: center; color: #64748b; padding: 20px; font-size: 12px; font-style: italic;">Belum ada data</div>
                                ` : wilayah.provinsi.map(p => `
                                    <div class="geo-row-item prov-click-row ${window.selectedGeoState.provinsiId === p.id ? 'active' : ''}" data-id="${p.id}" style="display: flex; justify-content: space-between; align-items: center; padding: 8px 12px; margin-bottom: 6px; border-radius: 6px; cursor: pointer; transition: all 0.2s; background: ${window.selectedGeoState.provinsiId === p.id ? 'rgba(0,74,173,0.25)' : 'rgba(255,255,255,0.02)'}; border-left: ${window.selectedGeoState.provinsiId === p.id ? '3px solid #3B82F6' : '3px solid transparent'};">
                                        <span style="color: ${window.selectedGeoState.provinsiId === p.id ? '#fff' : '#cbd5e1'}; font-weight: ${window.selectedGeoState.provinsiId === p.id ? '600' : 'normal'}; font-size: 13px;">${p.nama}</span>
                                        <button class="btn-action btn-del-prov" data-id="${p.id}" style="padding: 2px 6px; color:var(--danger); border-color:rgba(239,68,68,0.1); background: transparent; font-size: 10px;"><i class="fas fa-trash-alt"></i></button>
                                    </div>
                                `).join('')}
                            </div>
                        </div>

                        <!-- Kota -->
                        <div class="geo-col" style="background: rgba(30,41,59,0.5); border: 1px solid rgba(255,255,255,0.05); border-radius: 8px; padding: 12px;">
                            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                                <h5 style="margin: 0; color: #94a3b8; font-size: 13px;"><i class="fas fa-city"></i> 2. Kota / Kab</h5>
                                <button class="btn-action primary" id="btn-add-kota" style="padding: 2px 6px; font-size: 11px;"><i class="fas fa-plus"></i></button>
                            </div>
                            <div style="max-height: 250px; overflow-y: auto; padding-right: 4px;">
                                ${filteredKota.length === 0 ? `
                                    <div style="text-align: center; color: #64748b; padding: 20px; font-size: 12px; font-style: italic;">Pilih Provinsi...</div>
                                ` : filteredKota.map(k => `
                                    <div class="geo-row-item kota-click-row ${window.selectedGeoState.kotaId === k.id ? 'active' : ''}" data-id="${k.id}" style="display: flex; justify-content: space-between; align-items: center; padding: 8px 12px; margin-bottom: 6px; border-radius: 6px; cursor: pointer; transition: all 0.2s; background: ${window.selectedGeoState.kotaId === k.id ? 'rgba(0,74,173,0.25)' : 'rgba(255,255,255,0.02)'}; border-left: ${window.selectedGeoState.kotaId === k.id ? '3px solid #3B82F6' : '3px solid transparent'};">
                                        <span style="color: ${window.selectedGeoState.kotaId === k.id ? '#fff' : '#cbd5e1'}; font-weight: ${window.selectedGeoState.kotaId === k.id ? '600' : 'normal'}; font-size: 13px;">${k.nama}</span>
                                        <button class="btn-action btn-del-kota" data-id="${k.id}" style="padding: 2px 6px; color:var(--danger); border-color:rgba(239,68,68,0.1); background: transparent; font-size: 10px;"><i class="fas fa-trash-alt"></i></button>
                                    </div>
                                `).join('')}
                            </div>
                        </div>

                        <!-- Kecamatan -->
                        <div class="geo-col" style="background: rgba(30,41,59,0.5); border: 1px solid rgba(255,255,255,0.05); border-radius: 8px; padding: 12px;">
                            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                                <h5 style="margin: 0; color: #94a3b8; font-size: 13px;"><i class="fas fa-building"></i> 3. Kecamatan</h5>
                                <button class="btn-action primary" id="btn-add-kecamatan" style="padding: 2px 6px; font-size: 11px;"><i class="fas fa-plus"></i></button>
                            </div>
                            <div style="max-height: 250px; overflow-y: auto; padding-right: 4px;">
                                ${filteredKec.length === 0 ? `
                                    <div style="text-align: center; color: #64748b; padding: 20px; font-size: 12px; font-style: italic;">Pilih Kota/Kab...</div>
                                ` : filteredKec.map(k => `
                                    <div class="geo-row-item kec-click-row ${window.selectedGeoState.kecamatanId === k.id ? 'active' : ''}" data-id="${k.id}" style="display: flex; justify-content: space-between; align-items: center; padding: 8px 12px; margin-bottom: 6px; border-radius: 6px; cursor: pointer; transition: all 0.2s; background: ${window.selectedGeoState.kecamatanId === k.id ? 'rgba(0,74,173,0.25)' : 'rgba(255,255,255,0.02)'}; border-left: ${window.selectedGeoState.kecamatanId === k.id ? '3px solid #3B82F6' : '3px solid transparent'};">
                                        <span style="color: ${window.selectedGeoState.kecamatanId === k.id ? '#fff' : '#cbd5e1'}; font-weight: ${window.selectedGeoState.kecamatanId === k.id ? '600' : 'normal'}; font-size: 13px;">${k.nama}</span>
                                        <button class="btn-action btn-del-kec" data-id="${k.id}" style="padding: 2px 6px; color:var(--danger); border-color:rgba(239,68,68,0.1); background: transparent; font-size: 10px;"><i class="fas fa-trash-alt"></i></button>
                                    </div>
                                `).join('')}
                            </div>
                        </div>

                        <!-- Desa -->
                        <div class="geo-col" style="background: rgba(30,41,59,0.5); border: 1px solid rgba(255,255,255,0.05); border-radius: 8px; padding: 12px;">
                            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                                <h5 style="margin: 0; color: #94a3b8; font-size: 13px;"><i class="fas fa-home"></i> 4. Desa / Kel</h5>
                                <button class="btn-action primary" id="btn-add-desa" style="padding: 2px 6px; font-size: 11px;"><i class="fas fa-plus"></i></button>
                            </div>
                            <div style="max-height: 250px; overflow-y: auto; padding-right: 4px;">
                                ${filteredDesa.length === 0 ? `
                                    <div style="text-align: center; color: #64748b; padding: 20px; font-size: 12px; font-style: italic;">Pilih Kecamatan...</div>
                                ` : filteredDesa.map(d => `
                                    <div class="geo-row-item desa-click-row ${window.selectedGeoState.desaId === d.id ? 'active' : ''}" data-id="${d.id}" style="display: flex; justify-content: space-between; align-items: center; padding: 8px 12px; margin-bottom: 6px; border-radius: 6px; cursor: pointer; transition: all 0.2s; background: ${window.selectedGeoState.desaId === d.id ? 'rgba(0,74,173,0.25)' : 'rgba(255,255,255,0.02)'}; border-left: ${window.selectedGeoState.desaId === d.id ? '3px solid #3B82F6' : '3px solid transparent'};">
                                        <span style="color: ${window.selectedGeoState.desaId === d.id ? '#fff' : '#cbd5e1'}; font-weight: ${window.selectedGeoState.desaId === d.id ? '600' : 'normal'}; font-size: 13px;">${d.nama}</span>
                                        <button class="btn-action btn-del-desa" data-id="${d.id}" style="padding: 2px 6px; color:var(--danger); border-color:rgba(239,68,68,0.1); background: transparent; font-size: 10px;"><i class="fas fa-trash-alt"></i></button>
                                    </div>
                                `).join('')}
                            </div>
                        </div>

                        <!-- Dusun -->
                        <div class="geo-col" style="background: rgba(30,41,59,0.5); border: 1px solid rgba(255,255,255,0.05); border-radius: 8px; padding: 12px;">
                            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                                <h5 style="margin: 0; color: #94a3b8; font-size: 13px;"><i class="fas fa-users-cog"></i> 5. Dusun / RT</h5>
                                <button class="btn-action primary" id="btn-add-dusun" style="padding: 2px 6px; font-size: 11px;"><i class="fas fa-plus"></i></button>
                            </div>
                            <div style="max-height: 250px; overflow-y: auto; padding-right: 4px;">
                                ${filteredDusun.length === 0 ? `
                                    <div style="text-align: center; color: #64748b; padding: 20px; font-size: 12px; font-style: italic;">Pilih Desa/Kel...</div>
                                ` : filteredDusun.map(d => `
                                    <div class="geo-row-item" style="display: flex; justify-content: space-between; align-items: center; padding: 8px 12px; margin-bottom: 6px; border-radius: 6px; transition: all 0.2s; background: rgba(255,255,255,0.02); border-left: 3px solid transparent;">
                                        <span style="color: #cbd5e1; font-size: 13px;">${d.nama}</span>
                                        <button class="btn-action btn-del-dusun" data-id="${d.id}" style="padding: 2px 6px; color:var(--danger); border-color:rgba(239,68,68,0.1); background: transparent; font-size: 10px;"><i class="fas fa-trash-alt"></i></button>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Master Users (Only for Manager & Super Admin) -->
                ${(currentUser.role === 'Manager' || currentUser.role === 'Super Admin') ? `
                <div class="chart-card" style="grid-column: span 2;">
                    <div class="chart-card-header">
                        <h4>Manajemen User & Akun Sistem</h4>
                        <button class="btn-action primary" id="btn-add-user"><i class="fas fa-user-plus"></i> Registrasi User</button>
                    </div>
                    <div class="table-responsive">
                        <table class="custom-table">
                            <thead>
                                <tr>
                                    <th>No</th>
                                    <th>Nama</th>
                                    <th>Email</th>
                                    <th>Role Sistem</th>
                                    <th>No. WhatsApp</th>
                                    <th>Avatar</th>
                                    <th>Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${users.map((u, idx) => `
                                    <tr>
                                        <td>${idx + 1}</td>
                                        <td><strong>${u.name}</strong></td>
                                        <td>${u.email}</td>
                                        <td><span class="badge" style="background:var(--primary); color:white;">${u.role}</span></td>
                                        <td>
                                            <input type="text" class="form-input inp-user-phone" data-id="${u.id}" value="${u.phone || ''}" placeholder="Contoh: 628123..." style="width:140px; padding:4px 8px; font-size:12px; height:auto; background:rgba(0,0,0,0.25); text-align:center;">
                                        </td>
                                        <td><span class="user-avatar" style="width:28px; height:28px; font-size:11px;">${u.avatar}</span></td>
                                        <td>
                                            <button class="btn-action btn-edit-user" data-id="${u.id}" style="color:var(--primary); border-color:rgba(0,74,173,0.1); margin-right:4px; padding:2px 6px; font-size:10px;"><i class="fas fa-user-edit"></i> Edit</button>
                                            <button class="btn-action btn-reset-pass" data-id="${u.id}" style="color:#eab308; border-color:rgba(234,179,8,0.1); margin-right:4px; padding:2px 6px; font-size:10px;"><i class="fas fa-key"></i> Reset Sandi</button>
                                            <button class="btn-action btn-del-user" data-id="${u.id}" style="color:var(--danger); border-color:rgba(239,68,68,0.1); padding:2px 6px; font-size:10px;" ${u.id.startsWith('usr-') && parseInt(u.id.split('-')[1]) <= 6 ? 'disabled style="opacity:0.3; cursor:not-allowed;"' : ''}><i class="fas fa-user-times"></i> Hapus</button>
                                        </td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>
                ` : ''}
            </div>
        `;

        // Bind adders
        document.getElementById('btn-add-daya').addEventListener('click', () => {
            Swal.fire({
                title: 'Tambah Master Batasan Daya',
                html: `
                    <div style="text-align: left; margin-bottom: 4px; margin-top: 10px;">
                        <label style="font-size:12px; color:#94a3b8; font-weight:600;">Daya Listrik (VA)</label>
                    </div>
                    <input type="number" id="daya-va" class="swal2-input" placeholder="Contoh: 1300" style="margin-top:0; margin-bottom:10px; width: 78%; height: 50px;">
                    
                    <div style="text-align: left; margin-bottom: 4px;">
                        <label style="font-size:12px; color:#94a3b8; font-weight:600;">Golongan Umum</label>
                    </div>
                    <input type="text" id="daya-golongan" class="swal2-input" placeholder="Contoh: R-1/TR" style="margin-top:0; margin-bottom:10px; width: 78%; height: 50px;">
                    
                    <div style="text-align: left; margin-bottom: 4px;">
                        <label style="font-size:12px; color:#94a3b8; font-weight:600;">Keterangan</label>
                    </div>
                    <input type="text" id="daya-keterangan" class="swal2-input" placeholder="Contoh: Rumah Tangga Sedang" style="margin-top:0; margin-bottom:10px; width: 78%; height: 50px;">
                `,
                focusConfirm: false,
                showCancelButton: true,
                confirmButtonColor: '#004AAD',
                confirmButtonText: 'Simpan',
                cancelButtonText: 'Batal',
                preConfirm: () => {
                    const daya = document.getElementById('daya-va').value.trim();
                    const golongan = document.getElementById('daya-golongan').value.trim();
                    const keterangan = document.getElementById('daya-keterangan').value.trim();
                    if (!daya || !golongan || !keterangan) {
                        Swal.showValidationMessage('Semua kolom wajib diisi!');
                    }
                    return { daya: parseInt(daya), golongan, keterangan };
                }
            }).then((result) => {
                if (result.isConfirmed && result.value) {
                    const list = JSON.parse(localStorage.getItem('wh_daya')) || [];
                    list.push(result.value);
                    localStorage.setItem('wh_daya', JSON.stringify(list));
                    logActivity(currentUser.name, `Menambahkan master daya baru: ${result.value.daya} VA (${result.value.golongan})`);
                    renderPortalView();
                }
            });
        });

        // Bind Edit Daya
        document.querySelectorAll('.btn-edit-daya').forEach(btn => {
            btn.addEventListener('click', () => {
                const idx = parseInt(btn.getAttribute('data-idx'));
                const list = JSON.parse(localStorage.getItem('wh_daya')) || [];
                const item = list[idx];
                if (!item) return;

                Swal.fire({
                    title: 'Edit Master Batasan Daya',
                    html: `
                        <div style="text-align: left; margin-bottom: 4px; margin-top: 10px;">
                            <label style="font-size:12px; color:#94a3b8; font-weight:600;">Daya Listrik (VA)</label>
                        </div>
                        <input type="number" id="edit-daya-va" class="swal2-input" value="${item.daya}" placeholder="Contoh: 1300" style="margin-top:0; margin-bottom:10px; width: 78%; height: 50px;">
                        
                        <div style="text-align: left; margin-bottom: 4px;">
                            <label style="font-size:12px; color:#94a3b8; font-weight:600;">Golongan Umum</label>
                        </div>
                        <input type="text" id="edit-daya-golongan" class="swal2-input" value="${item.golongan}" placeholder="Contoh: R-1/TR" style="margin-top:0; margin-bottom:10px; width: 78%; height: 50px;">
                        
                        <div style="text-align: left; margin-bottom: 4px;">
                            <label style="font-size:12px; color:#94a3b8; font-weight:600;">Keterangan</label>
                        </div>
                        <input type="text" id="edit-daya-keterangan" class="swal2-input" value="${item.keterangan}" placeholder="Contoh: Rumah Tangga Sedang" style="margin-top:0; margin-bottom:10px; width: 78%; height: 50px;">
                    `,
                    focusConfirm: false,
                    showCancelButton: true,
                    confirmButtonColor: '#004AAD',
                    confirmButtonText: 'Simpan',
                    cancelButtonText: 'Batal',
                    preConfirm: () => {
                        const daya = document.getElementById('edit-daya-va').value.trim();
                        const golongan = document.getElementById('edit-daya-golongan').value.trim();
                        const keterangan = document.getElementById('edit-daya-keterangan').value.trim();
                        if (!daya || !golongan || !keterangan) {
                            Swal.showValidationMessage('Semua kolom wajib diisi!');
                        }
                        return { daya: parseInt(daya), golongan, keterangan };
                    }
                }).then((result) => {
                    if (result.isConfirmed && result.value) {
                        list[idx] = result.value;
                        localStorage.setItem('wh_daya', JSON.stringify(list));
                        logActivity(currentUser.name, `Memperbarui master daya: ${item.daya} VA &rarr; ${result.value.daya} VA`);
                        renderPortalView();
                    }
                });
            });
        });

        // Bind click-to-drill-down selections
        document.querySelectorAll('.prov-click-row').forEach(row => {
            row.addEventListener('click', (e) => {
                if (e.target.closest('.btn-del-prov') || e.target.closest('.fas')) return;
                const id = row.getAttribute('data-id');
                window.selectedGeoState.provinsiId = id;
                
                // Cascade select first elements
                const wil = JSON.parse(localStorage.getItem('wh_wilayah')) || {};
                const childKotas = (wil.kota || []).filter(k => k.provinsiId === id);
                if (childKotas.length > 0) {
                    window.selectedGeoState.kotaId = childKotas[0].id;
                    const childKecs = (wil.kecamatan || []).filter(k => k.kotaId === childKotas[0].id);
                    if (childKecs.length > 0) {
                        window.selectedGeoState.kecamatanId = childKecs[0].id;
                        const childDesas = (wil.desa || []).filter(d => d.kecamatanId === childKecs[0].id);
                        if (childDesas.length > 0) {
                            window.selectedGeoState.desaId = childDesas[0].id;
                        } else {
                            window.selectedGeoState.desaId = '';
                        }
                    } else {
                        window.selectedGeoState.kecamatanId = '';
                        window.selectedGeoState.desaId = '';
                    }
                } else {
                    window.selectedGeoState.kotaId = '';
                    window.selectedGeoState.kecamatanId = '';
                    window.selectedGeoState.desaId = '';
                }
                renderPortalView();
            });
        });

        document.querySelectorAll('.kota-click-row').forEach(row => {
            row.addEventListener('click', (e) => {
                if (e.target.closest('.btn-del-kota') || e.target.closest('.fas')) return;
                const id = row.getAttribute('data-id');
                window.selectedGeoState.kotaId = id;
                
                // Cascade select first elements
                const wil = JSON.parse(localStorage.getItem('wh_wilayah')) || {};
                const childKecs = (wil.kecamatan || []).filter(k => k.kotaId === id);
                if (childKecs.length > 0) {
                    window.selectedGeoState.kecamatanId = childKecs[0].id;
                    const childDesas = (wil.desa || []).filter(d => d.kecamatanId === childKecs[0].id);
                    if (childDesas.length > 0) {
                        window.selectedGeoState.desaId = childDesas[0].id;
                    } else {
                        window.selectedGeoState.desaId = '';
                    }
                } else {
                    window.selectedGeoState.kecamatanId = '';
                    window.selectedGeoState.desaId = '';
                }
                renderPortalView();
            });
        });

        document.querySelectorAll('.kec-click-row').forEach(row => {
            row.addEventListener('click', (e) => {
                if (e.target.closest('.btn-del-kec') || e.target.closest('.fas')) return;
                const id = row.getAttribute('data-id');
                window.selectedGeoState.kecamatanId = id;
                
                // Cascade select first elements
                const wil = JSON.parse(localStorage.getItem('wh_wilayah')) || {};
                const childDesas = (wil.desa || []).filter(d => d.kecamatanId === id);
                if (childDesas.length > 0) {
                    window.selectedGeoState.desaId = childDesas[0].id;
                } else {
                    window.selectedGeoState.desaId = '';
                }
                renderPortalView();
            });
        });

        document.querySelectorAll('.desa-click-row').forEach(row => {
            row.addEventListener('click', (e) => {
                if (e.target.closest('.btn-del-desa') || e.target.closest('.fas')) return;
                const id = row.getAttribute('data-id');
                window.selectedGeoState.desaId = id;
                renderPortalView();
            });
        });

        // Adders
        document.getElementById('btn-add-provinsi').addEventListener('click', () => {
            Swal.fire({
                title: 'Tambah Provinsi Baru',
                input: 'text',
                inputPlaceholder: 'Nama Provinsi...',
                showCancelButton: true,
                confirmButtonColor: '#004AAD',
                confirmButtonText: 'Simpan',
                cancelButtonText: 'Batal'
            }).then((result) => {
                if (result.isConfirmed && result.value) {
                    const wil = JSON.parse(localStorage.getItem('wh_wilayah')) || {};
                    if (!wil.provinsi) wil.provinsi = [];
                    const newId = `prov-${Date.now()}`;
                    wil.provinsi.push({ id: newId, nama: result.value });
                    localStorage.setItem('wh_wilayah', JSON.stringify(wil));
                    window.selectedGeoState.provinsiId = newId;
                    logActivity(currentUser.name, `Menambahkan provinsi baru: ${result.value}`);
                    renderPortalView();
                }
            });
        });

        document.getElementById('btn-add-kota').addEventListener('click', () => {
            if (!window.selectedGeoState.provinsiId) {
                Swal.fire('Perhatian', 'Silakan pilih atau tambahkan Provinsi terlebih dahulu!', 'warning');
                return;
            }
            Swal.fire({
                title: 'Tambah Kota / Kabupaten Baru',
                input: 'text',
                inputPlaceholder: 'Nama Kota/Kab...',
                showCancelButton: true,
                confirmButtonColor: '#004AAD',
                confirmButtonText: 'Simpan',
                cancelButtonText: 'Batal'
            }).then((result) => {
                if (result.isConfirmed && result.value) {
                    const wil = JSON.parse(localStorage.getItem('wh_wilayah')) || {};
                    if (!wil.kota) wil.kota = [];
                    const newId = `kota-${Date.now()}`;
                    wil.kota.push({ id: newId, provinsiId: window.selectedGeoState.provinsiId, nama: result.value });
                    localStorage.setItem('wh_wilayah', JSON.stringify(wil));
                    window.selectedGeoState.kotaId = newId;
                    logActivity(currentUser.name, `Menambahkan kota/kab baru: ${result.value}`);
                    renderPortalView();
                }
            });
        });

        document.getElementById('btn-add-kecamatan').addEventListener('click', () => {
            if (!window.selectedGeoState.kotaId) {
                Swal.fire('Perhatian', 'Silakan pilih atau tambahkan Kota / Kabupaten terlebih dahulu!', 'warning');
                return;
            }
            Swal.fire({
                title: 'Tambah Kecamatan Baru',
                input: 'text',
                inputPlaceholder: 'Nama Kecamatan...',
                showCancelButton: true,
                confirmButtonColor: '#004AAD',
                confirmButtonText: 'Simpan',
                cancelButtonText: 'Batal'
            }).then((result) => {
                if (result.isConfirmed && result.value) {
                    const wil = JSON.parse(localStorage.getItem('wh_wilayah')) || {};
                    if (!wil.kecamatan) wil.kecamatan = [];
                    const newId = `kec-${Date.now()}`;
                    wil.kecamatan.push({ id: newId, kotaId: window.selectedGeoState.kotaId, nama: result.value });
                    localStorage.setItem('wh_wilayah', JSON.stringify(wil));
                    window.selectedGeoState.kecamatanId = newId;
                    logActivity(currentUser.name, `Menambahkan kecamatan baru: ${result.value}`);
                    renderPortalView();
                }
            });
        });

        document.getElementById('btn-add-desa').addEventListener('click', () => {
            if (!window.selectedGeoState.kecamatanId) {
                Swal.fire('Perhatian', 'Silakan pilih atau tambahkan Kecamatan terlebih dahulu!', 'warning');
                return;
            }
            Swal.fire({
                title: 'Tambah Desa / Kelurahan Baru',
                input: 'text',
                inputPlaceholder: 'Nama Desa / Kel...',
                showCancelButton: true,
                confirmButtonColor: '#004AAD',
                confirmButtonText: 'Simpan',
                cancelButtonText: 'Batal'
            }).then((result) => {
                if (result.isConfirmed && result.value) {
                    const wil = JSON.parse(localStorage.getItem('wh_wilayah')) || {};
                    if (!wil.desa) wil.desa = [];
                    const newId = `desa-${Date.now()}`;
                    wil.desa.push({ id: newId, kecamatanId: window.selectedGeoState.kecamatanId, nama: result.value });
                    localStorage.setItem('wh_wilayah', JSON.stringify(wil));
                    window.selectedGeoState.desaId = newId;
                    logActivity(currentUser.name, `Menambahkan desa/kelurahan baru: ${result.value}`);
                    renderPortalView();
                }
            });
        });

        document.getElementById('btn-add-dusun').addEventListener('click', () => {
            if (!window.selectedGeoState.desaId) {
                Swal.fire('Perhatian', 'Silakan pilih atau tambahkan Desa / Kelurahan terlebih dahulu!', 'warning');
                return;
            }
            Swal.fire({
                title: 'Tambah Dusun / RT Baru',
                input: 'text',
                inputPlaceholder: 'Nama Dusun / RT...',
                showCancelButton: true,
                confirmButtonColor: '#004AAD',
                confirmButtonText: 'Simpan',
                cancelButtonText: 'Batal'
            }).then((result) => {
                if (result.isConfirmed && result.value) {
                    const wil = JSON.parse(localStorage.getItem('wh_wilayah')) || {};
                    if (!wil.dusun) wil.dusun = [];
                    const newId = `dusun-${Date.now()}`;
                    wil.dusun.push({ id: newId, desaId: window.selectedGeoState.desaId, nama: result.value });
                    localStorage.setItem('wh_wilayah', JSON.stringify(wil));
                    logActivity(currentUser.name, `Menambahkan dusun/RT baru: ${result.value}`);
                    renderPortalView();
                }
            });
        });

        const btnAddUser = document.getElementById('btn-add-user');
        if (btnAddUser) {
            btnAddUser.addEventListener('click', () => {
            Swal.fire({
                title: 'Registrasi User Baru',
                html: `
                    <input type="text" id="reg-name" class="swal2-input" placeholder="Nama Lengkap">
                    <input type="email" id="reg-email" class="swal2-input" placeholder="Email">
                    <input type="text" id="reg-phone" class="swal2-input" placeholder="No. WhatsApp (Contoh: 62812...)">
                    <select id="reg-role" class="swal2-input" style="width: 78%; height: 50px;">
                        <option value="Admin Pelayanan">Admin Pelayanan</option>
                        <option value="Admin Proses">Admin Proses</option>
                        <option value="TT NIDI">TT NIDI</option>
                        <option value="TT SLO">TT SLO</option>
                        <option value="Admin Keuangan">Admin Keuangan</option>
                        <option value="Manager">Manager</option>
                    </select>
                `,
                focusConfirm: false,
                showCancelButton: true,
                confirmButtonColor: '#004AAD',
                confirmButtonText: 'Simpan User',
                cancelButtonText: 'Batal',
                preConfirm: () => {
                    const name = document.getElementById('reg-name').value;
                    const email = document.getElementById('reg-email').value;
                    const phone = document.getElementById('reg-phone').value;
                    const role = document.getElementById('reg-role').value;
                    if (!name || !email) {
                        Swal.showValidationMessage('Mohon isi nama dan email user baru!');
                    }
                    return { name, email, role, phone };
                }
            }).then((result) => {
                if (result.isConfirmed) {
                    const userList = JSON.parse(localStorage.getItem('wh_users')) || [];
                    const letters = result.value.name.split(' ');
                    const avatar = letters.length > 1 ? (letters[0][0] + letters[1][0]).toUpperCase() : result.value.name.substring(0,2).toUpperCase();

                    const newUser = {
                        id: `usr-${Math.floor(100 + Math.random() * 900)}`,
                        email: result.value.email,
                        name: result.value.name,
                        role: result.value.role,
                        avatar: avatar,
                        phone: result.value.phone || ''
                    };

                    userList.push(newUser);
                    localStorage.setItem('wh_users', JSON.stringify(userList));
                    if (typeof syncTableToMySQL === 'function') syncTableToMySQL('users', userList);
                    logActivity(currentUser.name, `Meregistrasikan user baru ${result.value.name} dengan role ${result.value.role}`);
                    renderPortalView();
                }
            });
        });

        // Deletion binders
        document.querySelectorAll('.btn-del-daya').forEach(btn => {
            btn.addEventListener('click', () => {
                const idx = parseInt(btn.getAttribute('data-idx'));
                const list = JSON.parse(localStorage.getItem('wh_daya')) || [];
                const deleted = list[idx];
                list.splice(idx, 1);
                localStorage.setItem('wh_daya', JSON.stringify(list));
                logActivity(currentUser.name, `Menghapus master daya: ${deleted.daya} VA (${deleted.golongan})`);
                renderPortalView();
            });
        });

        // Cascading Deleters
        document.querySelectorAll('.btn-del-prov').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const id = btn.getAttribute('data-id');
                const wil = JSON.parse(localStorage.getItem('wh_wilayah')) || {};
                const pItem = wil.provinsi.find(x => x.id === id);
                if (!pItem) return;
                
                Swal.fire({
                    title: 'Hapus Provinsi?',
                    text: `Menghapus "${pItem.nama}" akan otomatis menghapus semua Kota, Kecamatan, Desa, dan Dusun di dalamnya!`,
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#ef4444',
                    confirmButtonText: 'Ya, Hapus Semua',
                    cancelButtonText: 'Batal'
                }).then((r) => {
                    if (r.isConfirmed) {
                        wil.provinsi = wil.provinsi.filter(x => x.id !== id);
                        
                        // Cascade delete kota
                        const childKotas = (wil.kota || []).filter(x => x.provinsiId === id);
                        wil.kota = (wil.kota || []).filter(x => x.provinsiId !== id);
                        
                        childKotas.forEach(k => {
                            const childKecs = (wil.kecamatan || []).filter(x => x.kotaId === k.id);
                            wil.kecamatan = (wil.kecamatan || []).filter(x => x.kotaId !== k.id);
                            
                            childKecs.forEach(kc => {
                                const childDesas = (wil.desa || []).filter(x => x.kecamatanId === kc.id);
                                wil.desa = (wil.desa || []).filter(x => x.kecamatanId !== kc.id);
                                
                                childDesas.forEach(d => {
                                    wil.dusun = (wil.dusun || []).filter(x => x.desaId !== d.id);
                                });
                            });
                        });
                        
                        localStorage.setItem('wh_wilayah', JSON.stringify(wil));
                        if (window.selectedGeoState.provinsiId === id) {
                            window.selectedGeoState.provinsiId = '';
                            window.selectedGeoState.kotaId = '';
                            window.selectedGeoState.kecamatanId = '';
                            window.selectedGeoState.desaId = '';
                        }
                        logActivity(currentUser.name, `Menghapus provinsi "${pItem.nama}" beserta seluruh data tingkat bawahnya secara cascade.`);
                        renderPortalView();
                    }
                });
            });
        });

        document.querySelectorAll('.btn-del-kota').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const id = btn.getAttribute('data-id');
                const wil = JSON.parse(localStorage.getItem('wh_wilayah')) || {};
                const kItem = wil.kota.find(x => x.id === id);
                if (!kItem) return;

                Swal.fire({
                    title: 'Hapus Kota / Kabupaten?',
                    text: `Menghapus "${kItem.nama}" akan otomatis menghapus seluruh Kecamatan, Desa, dan Dusun di dalamnya!`,
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#ef4444',
                    confirmButtonText: 'Ya, Hapus Semua',
                    cancelButtonText: 'Batal'
                }).then((r) => {
                    if (r.isConfirmed) {
                        wil.kota = wil.kota.filter(x => x.id !== id);
                        
                        // Cascade delete kecamatan
                        const childKecs = (wil.kecamatan || []).filter(x => x.kotaId === id);
                        wil.kecamatan = (wil.kecamatan || []).filter(x => x.kotaId !== id);
                        
                        childKecs.forEach(kc => {
                            const childDesas = (wil.desa || []).filter(x => x.kecamatanId === kc.id);
                            wil.desa = (wil.desa || []).filter(x => x.kecamatanId !== kc.id);
                            
                            childDesas.forEach(d => {
                                wil.dusun = (wil.dusun || []).filter(x => x.desaId !== d.id);
                            });
                        });

                        localStorage.setItem('wh_wilayah', JSON.stringify(wil));
                        if (window.selectedGeoState.kotaId === id) {
                            window.selectedGeoState.kotaId = '';
                            window.selectedGeoState.kecamatanId = '';
                            window.selectedGeoState.desaId = '';
                        }
                        logActivity(currentUser.name, `Menghapus kota/kab "${kItem.nama}" beserta seluruh data tingkat bawahnya secara cascade.`);
                        renderPortalView();
                    }
                });
            });
        });

        document.querySelectorAll('.btn-del-kec').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const id = btn.getAttribute('data-id');
                const wil = JSON.parse(localStorage.getItem('wh_wilayah')) || {};
                const kItem = wil.kecamatan.find(x => x.id === id);
                if (!kItem) return;

                Swal.fire({
                    title: 'Hapus Kecamatan?',
                    text: `Menghapus "${kItem.nama}" akan otomatis menghapus seluruh Desa dan Dusun di dalamnya!`,
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#ef4444',
                    confirmButtonText: 'Ya, Hapus Semua',
                    cancelButtonText: 'Batal'
                }).then((r) => {
                    if (r.isConfirmed) {
                        wil.kecamatan = wil.kecamatan.filter(x => x.id !== id);
                        
                        // Cascade delete desa
                        const childDesas = (wil.desa || []).filter(x => x.kecamatanId === id);
                        wil.desa = (wil.desa || []).filter(x => x.kecamatanId !== id);
                        
                        childDesas.forEach(d => {
                            wil.dusun = (wil.dusun || []).filter(x => x.desaId !== d.id);
                        });

                        localStorage.setItem('wh_wilayah', JSON.stringify(wil));
                        if (window.selectedGeoState.kecamatanId === id) {
                            window.selectedGeoState.kecamatanId = '';
                            window.selectedGeoState.desaId = '';
                        }
                        logActivity(currentUser.name, `Menghapus kecamatan "${kItem.nama}" beserta seluruh data tingkat bawahnya secara cascade.`);
                        renderPortalView();
                    }
                });
            });
        });

        document.querySelectorAll('.btn-del-desa').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const id = btn.getAttribute('data-id');
                const wil = JSON.parse(localStorage.getItem('wh_wilayah')) || {};
                const dItem = wil.desa.find(x => x.id === id);
                if (!dItem) return;

                Swal.fire({
                    title: 'Hapus Desa / Kelurahan?',
                    text: `Menghapus "${dItem.nama}" akan otomatis menghapus seluruh Dusun / RT di dalamnya!`,
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#ef4444',
                    confirmButtonText: 'Ya, Hapus Semua',
                    cancelButtonText: 'Batal'
                }).then((r) => {
                    if (r.isConfirmed) {
                        wil.desa = wil.desa.filter(x => x.id !== id);
                        
                        // Cascade delete dusun
                        wil.dusun = (wil.dusun || []).filter(x => x.desaId !== id);

                        localStorage.setItem('wh_wilayah', JSON.stringify(wil));
                        if (window.selectedGeoState.desaId === id) {
                            window.selectedGeoState.desaId = '';
                        }
                        logActivity(currentUser.name, `Menghapus desa "${dItem.nama}" beserta seluruh data tingkat bawahnya secara cascade.`);
                        renderPortalView();
                    }
                });
            });
        });

        document.querySelectorAll('.btn-del-dusun').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const id = btn.getAttribute('data-id');
                const wil = JSON.parse(localStorage.getItem('wh_wilayah')) || {};
                const dItem = wil.dusun.find(x => x.id === id);
                if (!dItem) return;

                Swal.fire({
                    title: 'Hapus Dusun / RT?',
                    text: `Apakah Anda yakin ingin menghapus "${dItem.nama}"?`,
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#ef4444',
                    confirmButtonText: 'Ya, Hapus',
                    cancelButtonText: 'Batal'
                }).then((r) => {
                    if (r.isConfirmed) {
                        wil.dusun = wil.dusun.filter(x => x.id !== id);
                        localStorage.setItem('wh_wilayah', JSON.stringify(wil));
                        logActivity(currentUser.name, `Menghapus dusun/RT "${dItem.nama}".`);
                        renderPortalView();
                    }
                });
            });
        });

        document.querySelectorAll('.btn-del-user').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.getAttribute('data-id');
                const list = JSON.parse(localStorage.getItem('wh_users')) || [];
                const idx = list.findIndex(x => x.id === id);
                if (idx !== -1) {
                    const name = list[idx].name;
                    Swal.fire({
                        title: 'Konfirmasi Hapus',
                        text: `Apakah Anda yakin ingin menghapus user "${name}"?`,
                        icon: 'warning',
                        showCancelButton: true,
                        confirmButtonColor: '#ef4444',
                        confirmButtonText: 'Ya, Hapus',
                        cancelButtonText: 'Batal'
                    }).then((result) => {
                        if (result.isConfirmed) {
                            list.splice(idx, 1);
                            localStorage.setItem('wh_users', JSON.stringify(list));
                            if (typeof syncTableToMySQL === 'function') syncTableToMySQL('users', list);
                            logActivity(currentUser.name, `Menghapus akun user: ${name}`);
                            Swal.fire('Terhapus!', 'User berhasil dihapus.', 'success');
                            renderPortalView();
                        }
                    });
                }
            });
        });

        // Bind WhatsApp phone saving
        document.querySelectorAll('.inp-user-phone').forEach(input => {
            input.addEventListener('change', () => {
                const id = input.getAttribute('data-id');
                const val = input.value.trim();
                const userList = JSON.parse(localStorage.getItem('wh_users')) || [];
                const idx = userList.findIndex(x => x.id === id);
                if (idx !== -1) {
                    userList[idx].phone = val;
                    localStorage.setItem('wh_users', JSON.stringify(userList));
                    logActivity(currentUser.name, `Memperbarui nomor WhatsApp user ${userList[idx].name} menjadi ${val}`);
                }
            });
        });

        // Bind Reset Password button
        document.querySelectorAll('.btn-reset-pass').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.getAttribute('data-id');
                const list = JSON.parse(localStorage.getItem('wh_users')) || [];
                const user = list.find(x => x.id === id);
                if (!user) return;

                Swal.fire({
                    title: 'Reset/Update Password',
                    text: `Silakan masukkan kata sandi baru untuk pengguna ${user.name}:`,
                    input: 'password',
                    inputPlaceholder: 'Ketik kata sandi baru...',
                    inputAttributes: {
                        autocapitalize: 'off',
                        autocorrect: 'off'
                    },
                    showCancelButton: true,
                    confirmButtonColor: '#eab308',
                    confirmButtonText: 'Update Sandi',
                    cancelButtonText: 'Batal',
                    preConfirm: (newPassword) => {
                        if (!newPassword || newPassword.length < 3) {
                            Swal.showValidationMessage('Kata sandi minimal 3 karakter!');
                        }
                        return newPassword;
                    }
                }).then((result) => {
                    if (result.isConfirmed) {
                        const newPassword = result.value;
                        const idx = list.findIndex(x => x.id === user.id);
                        if (idx !== -1) {
                            list[idx].password = newPassword;
                            localStorage.setItem('wh_users', JSON.stringify(list));
                            
                            // Trigger sync to MySQL if available
                            if (typeof syncTableToMySQL === 'function') {
                                syncTableToMySQL('users', list);
                            }
                        }
                        
                        Swal.fire('Berhasil', `Kata sandi untuk ${user.name} telah berhasil diperbarui!`, 'success');
                        logActivity(currentUser.name, `Me-reset kata sandi untuk akun: ${user.name}`);
                    }
                });
            });
            });
        }

        // Bind Edit User button
        document.querySelectorAll('.btn-edit-user').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.getAttribute('data-id');
                const list = JSON.parse(localStorage.getItem('wh_users')) || [];
                const user = list.find(x => x.id === id);
                if (!user) return;

                Swal.fire({
                    title: 'Edit Profil User',
                    html: `
                        <div style="text-align: left; margin-bottom: 4px; margin-top: 10px;"><label style="font-size:12px; color:#94a3b8; font-weight:600;">Nama Lengkap</label></div>
                        <input type="text" id="edit-name" class="swal2-input" value="${user.name}" placeholder="Nama Lengkap" style="margin-top:0; margin-bottom:10px;">
                        
                        <div style="text-align: left; margin-bottom: 4px;"><label style="font-size:12px; color:#94a3b8; font-weight:600;">Email</label></div>
                        <input type="email" id="edit-email" class="swal2-input" value="${user.email}" placeholder="Email" style="margin-top:0; margin-bottom:10px;">
                        
                        <div style="text-align: left; margin-bottom: 4px;"><label style="font-size:12px; color:#94a3b8; font-weight:600;">No. WhatsApp</label></div>
                        <input type="text" id="edit-phone" class="swal2-input" value="${user.phone || ''}" placeholder="No. WhatsApp (Contoh: 62812...)" style="margin-top:0; margin-bottom:10px;">
                        
                        <div style="text-align: left; margin-bottom: 4px;"><label style="font-size:12px; color:#94a3b8; font-weight:600;">Role Sistem</label></div>
                        <select id="edit-role" class="swal2-input" style="width: 78%; height: 50px; margin-top:0; margin-bottom:10px;">
                            <option value="Admin Pelayanan" ${user.role === 'Admin Pelayanan' ? 'selected' : ''}>Admin Pelayanan</option>
                            <option value="Admin Proses" ${user.role === 'Admin Proses' ? 'selected' : ''}>Admin Proses</option>
                            <option value="TT NIDI" ${user.role === 'TT NIDI' ? 'selected' : ''}>TT NIDI</option>
                            <option value="TT SLO" ${user.role === 'TT SLO' ? 'selected' : ''}>TT SLO</option>
                            <option value="Admin Keuangan" ${user.role === 'Admin Keuangan' ? 'selected' : ''}>Admin Keuangan</option>
                            <option value="Manager" ${user.role === 'Manager' ? 'selected' : ''}>Manager</option>
                        </select>
                    `,
                    focusConfirm: false,
                    showCancelButton: true,
                    confirmButtonColor: '#004AAD',
                    confirmButtonText: 'Simpan Perubahan',
                    cancelButtonText: 'Batal',
                    preConfirm: () => {
                        const name = document.getElementById('edit-name').value.trim();
                        const email = document.getElementById('edit-email').value.trim();
                        const phone = document.getElementById('edit-phone').value.trim();
                        const role = document.getElementById('edit-role').value;
                        if (!name || !email) {
                            Swal.showValidationMessage('Nama dan email tidak boleh kosong!');
                        }
                        return { name, email, role, phone };
                    }
                }).then((result) => {
                    if (result.isConfirmed) {
                        const userList = JSON.parse(localStorage.getItem('wh_users')) || [];
                        const idx = userList.findIndex(x => x.id === id);
                        if (idx !== -1) {
                            userList[idx].name = result.value.name;
                            userList[idx].email = result.value.email;
                            userList[idx].phone = result.value.phone;
                            userList[idx].role = result.value.role;
                            
                            // Re-generate avatar initials
                            const letters = result.value.name.split(' ');
                            userList[idx].avatar = letters.length > 1 ? (letters[0][0] + letters[1][0]).toUpperCase() : result.value.name.substring(0,2).toUpperCase();

                            localStorage.setItem('wh_users', JSON.stringify(userList));
                            if (typeof syncTableToMySQL === 'function') syncTableToMySQL('users', userList);
                            logActivity(currentUser.name, `Memperbarui profil user: ${result.value.name}`);
                            
                            // If editing currently logged in user, also update session
                            if (currentUser.id === id) {
                                currentUser.name = result.value.name;
                                currentUser.email = result.value.email;
                                currentUser.role = result.value.role;
                                localStorage.setItem('wh_current_user', JSON.stringify(currentUser));
                            }

                            renderPortalView();
                        }
                    }
                });
            });
        });

        // Manajemen Member Event Bindings
        const btnAddMember = document.getElementById('btn-add-member');
        if (btnAddMember) {
            btnAddMember.addEventListener('click', () => {
                Swal.fire({
                    title: 'Tambah Member Baru',
                    html: `
                        <div style="text-align: left; margin-bottom: 4px; margin-top: 10px;"><label style="font-size:12px; color:#94a3b8; font-weight:600;">Nama Member</label></div>
                        <input type="text" id="add-member-nama" class="swal2-input" placeholder="Nama Lengkap Member" style="margin-top:0; margin-bottom:10px;">
                        
                        <div style="text-align: left; margin-bottom: 4px;"><label style="font-size:12px; color:#94a3b8; font-weight:600;">Nomor HP</label></div>
                        <input type="text" id="add-member-hp" class="swal2-input" placeholder="Contoh: 081234..." style="margin-top:0; margin-bottom:10px;">

                        <div style="text-align: left; margin-bottom: 4px;"><label style="font-size:12px; color:#94a3b8; font-weight:600;">Status</label></div>
                        <select id="add-member-status" class="swal2-input" style="width: 78%; height: 50px; margin-top:0; margin-bottom:10px;">
                            <option value="Area">AREA</option>
                            <option value="Mitra">MITRA</option>
                            <option value="Langganan">LANGGANAN</option>
                            <option value="Banyak dan Rutin">BANYAK & RUTIN</option>
                            <option value="Pelanggan">PELANGGAN</option>
                        </select>
                    `,
                    focusConfirm: false,
                    showCancelButton: true,
                    confirmButtonColor: '#004AAD',
                    confirmButtonText: 'Simpan',
                    cancelButtonText: 'Batal',
                    preConfirm: () => {
                        const nama = document.getElementById('add-member-nama').value.trim();
                        const hp = document.getElementById('add-member-hp').value.trim();
                        const status = document.getElementById('add-member-status').value;
                        if (!nama || !hp) {
                            Swal.showValidationMessage('Nama dan Nomor HP wajib diisi!');
                        }
                        return { nama, hp, status };
                    }
                }).then((result) => {
                    if (result.isConfirmed && result.value) {
                        const mList = JSON.parse(localStorage.getItem('wh_members')) || [];
                        mList.push({ id: 'mem-' + Date.now(), nama: result.value.nama, hp: result.value.hp, status: result.value.status });
                        localStorage.setItem('wh_members', JSON.stringify(mList));
                        logActivity(currentUser.name, `Menambahkan member baru: ${result.value.nama}`);
                        renderPortalView();
                    }
                });
            });
        }

        document.querySelectorAll('.btn-edit-member').forEach(btn => {
            btn.addEventListener('click', () => {
                const idx = parseInt(btn.getAttribute('data-idx'));
                const mList = JSON.parse(localStorage.getItem('wh_members')) || [];
                const item = mList[idx];
                if (!item) return;

                Swal.fire({
                    title: 'Edit Member',
                    html: `
                        <div style="text-align: left; margin-bottom: 4px; margin-top: 10px;"><label style="font-size:12px; color:#94a3b8; font-weight:600;">Nama Member</label></div>
                        <input type="text" id="edit-member-nama" class="swal2-input" value="${item.nama}" placeholder="Nama Lengkap Member" style="margin-top:0; margin-bottom:10px;">
                        
                        <div style="text-align: left; margin-bottom: 4px;"><label style="font-size:12px; color:#94a3b8; font-weight:600;">Nomor HP</label></div>
                        <input type="text" id="edit-member-hp" class="swal2-input" value="${item.hp}" placeholder="Contoh: 081234..." style="margin-top:0; margin-bottom:10px;">

                        <div style="text-align: left; margin-bottom: 4px;"><label style="font-size:12px; color:#94a3b8; font-weight:600;">Status</label></div>
                        <select id="edit-member-status" class="swal2-input" style="width: 78%; height: 50px; margin-top:0; margin-bottom:10px;">
                            <option value="Area" ${(item.status || 'Pelanggan') === 'Area' ? 'selected' : ''}>AREA</option>
                            <option value="Mitra" ${(item.status || 'Pelanggan') === 'Mitra' ? 'selected' : ''}>MITRA</option>
                            <option value="Langganan" ${(item.status || 'Pelanggan') === 'Langganan' ? 'selected' : ''}>LANGGANAN</option>
                            <option value="Banyak dan Rutin" ${(item.status || 'Pelanggan') === 'Banyak dan Rutin' ? 'selected' : ''}>BANYAK & RUTIN</option>
                            <option value="Pelanggan" ${(item.status || 'Pelanggan') === 'Pelanggan' ? 'selected' : ''}>PELANGGAN</option>
                        </select>
                    `,
                    focusConfirm: false,
                    showCancelButton: true,
                    confirmButtonColor: '#004AAD',
                    confirmButtonText: 'Simpan Perubahan',
                    cancelButtonText: 'Batal',
                    preConfirm: () => {
                        const nama = document.getElementById('edit-member-nama').value.trim();
                        const hp = document.getElementById('edit-member-hp').value.trim();
                        const status = document.getElementById('edit-member-status').value;
                        if (!nama || !hp) {
                            Swal.showValidationMessage('Nama dan Nomor HP wajib diisi!');
                        }
                        return { nama, hp, status };
                    }
                }).then((result) => {
                    if (result.isConfirmed && result.value) {
                        mList[idx].nama = result.value.nama;
                        mList[idx].hp = result.value.hp;
                        mList[idx].status = result.value.status;
                        localStorage.setItem('wh_members', JSON.stringify(mList));
                        logActivity(currentUser.name, `Memperbarui data member: ${result.value.nama}`);
                        renderPortalView();
                    }
                });
            });
        });

        document.querySelectorAll('.btn-del-member').forEach(btn => {
            btn.addEventListener('click', () => {
                const idx = parseInt(btn.getAttribute('data-idx'));
                const mList = JSON.parse(localStorage.getItem('wh_members')) || [];
                const item = mList[idx];
                if (!item) return;

                Swal.fire({
                    title: 'Hapus Member?',
                    text: `Apakah Anda yakin ingin menghapus "${item.nama}"?`,
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#ef4444',
                    confirmButtonText: 'Ya, Hapus',
                    cancelButtonText: 'Batal'
                }).then((r) => {
                    if (r.isConfirmed) {
                        mList.splice(idx, 1);
                        localStorage.setItem('wh_members', JSON.stringify(mList));
                        logActivity(currentUser.name, `Menghapus member: ${item.nama}`);
                        renderPortalView();
                    }
                });
            });
        });

        // Manajemen Biaya Event Bindings
        const btnAddBiaya = document.getElementById('btn-add-biaya');
        if (btnAddBiaya) {
            btnAddBiaya.addEventListener('click', () => {
                Swal.fire({
                    title: 'Tambah Biaya Baru',
                    html: `
                        <input type="number" id="add-b-daya" class="swal2-input" placeholder="Daya (VA)" style="margin-top:10px; margin-bottom:10px; height: 40px; font-size:14px;">
                        <input type="number" id="add-b-nidi" class="swal2-input" placeholder="Biaya NIDI" style="margin-top:0; margin-bottom:10px; height: 40px; font-size:14px;">
                        <input type="number" id="add-b-slo" class="swal2-input" placeholder="Biaya SLO" style="margin-top:0; margin-bottom:10px; height: 40px; font-size:14px;">
                        <input type="number" id="add-b-area" class="swal2-input" placeholder="Biaya Area" style="margin-top:0; margin-bottom:10px; height: 40px; font-size:14px;">
                        <input type="number" id="add-b-mitra" class="swal2-input" placeholder="Biaya Mitra" style="margin-top:0; margin-bottom:10px; height: 40px; font-size:14px;">
                        <input type="number" id="add-b-langganan" class="swal2-input" placeholder="Biaya Langganan" style="margin-top:0; margin-bottom:10px; height: 40px; font-size:14px;">
                        <input type="number" id="add-b-banyak-rutin" class="swal2-input" placeholder="Biaya Banyak & Rutin" style="margin-top:0; margin-bottom:10px; height: 40px; font-size:14px;">
                        <input type="number" id="add-b-pelanggan" class="swal2-input" placeholder="Biaya Pelanggan" style="margin-top:0; margin-bottom:10px; height: 40px; font-size:14px;">
                    `,
                    focusConfirm: false,
                    showCancelButton: true,
                    confirmButtonColor: '#004AAD',
                    confirmButtonText: 'Simpan',
                    preConfirm: () => {
                        return {
                            daya: parseInt(document.getElementById('add-b-daya').value) || 0,
                            nidi: parseInt(document.getElementById('add-b-nidi').value) || 0,
                            slo: parseInt(document.getElementById('add-b-slo').value) || 0,
                            area: parseInt(document.getElementById('add-b-area').value) || 0,
                            mitra: parseInt(document.getElementById('add-b-mitra').value) || 0,
                            langganan: parseInt(document.getElementById('add-b-langganan').value) || 0,
                            banyak_rutin: parseInt(document.getElementById('add-b-banyak-rutin').value) || 0,
                            pelanggan: parseInt(document.getElementById('add-b-pelanggan').value) || 0,
                        };
                    }
                }).then((r) => {
                    if (r.isConfirmed) {
                        const bList = JSON.parse(localStorage.getItem('wh_biaya')) || [];
                        bList.push(r.value);
                        bList.sort((a, b) => a.daya - b.daya);
                        localStorage.setItem('wh_biaya', JSON.stringify(bList));
                        renderPortalView();
                    }
                });
            });
        }

        document.querySelectorAll('.btn-edit-biaya').forEach(btn => {
            btn.addEventListener('click', () => {
                const idx = parseInt(btn.getAttribute('data-idx'));
                const bList = JSON.parse(localStorage.getItem('wh_biaya')) || [];
                const item = bList[idx];
                if (!item) return;

                Swal.fire({
                    title: 'Edit Biaya',
                    html: `
                        <input type="number" id="edit-b-daya" class="swal2-input" value="${item.daya}" placeholder="Daya (VA)" style="margin-top:10px; margin-bottom:10px; height: 40px; font-size:14px;">
                        <input type="number" id="edit-b-nidi" class="swal2-input" value="${item.nidi}" placeholder="Biaya NIDI" style="margin-top:0; margin-bottom:10px; height: 40px; font-size:14px;">
                        <input type="number" id="edit-b-slo" class="swal2-input" value="${item.slo}" placeholder="Biaya SLO" style="margin-top:0; margin-bottom:10px; height: 40px; font-size:14px;">
                        <input type="number" id="edit-b-area" class="swal2-input" value="${item.area}" placeholder="Biaya Area" style="margin-top:0; margin-bottom:10px; height: 40px; font-size:14px;">
                        <input type="number" id="edit-b-mitra" class="swal2-input" value="${item.mitra}" placeholder="Biaya Mitra" style="margin-top:0; margin-bottom:10px; height: 40px; font-size:14px;">
                        <input type="number" id="edit-b-langganan" class="swal2-input" value="${item.langganan}" placeholder="Biaya Langganan" style="margin-top:0; margin-bottom:10px; height: 40px; font-size:14px;">
                        <input type="number" id="edit-b-banyak-rutin" class="swal2-input" value="${item.banyak_rutin || 0}" placeholder="Biaya Banyak & Rutin" style="margin-top:0; margin-bottom:10px; height: 40px; font-size:14px;">
                        <input type="number" id="edit-b-pelanggan" class="swal2-input" value="${item.pelanggan}" placeholder="Biaya Pelanggan" style="margin-top:0; margin-bottom:10px; height: 40px; font-size:14px;">
                    `,
                    focusConfirm: false,
                    showCancelButton: true,
                    confirmButtonColor: '#004AAD',
                    confirmButtonText: 'Simpan',
                    preConfirm: () => {
                        return {
                            daya: parseInt(document.getElementById('edit-b-daya').value) || 0,
                            nidi: parseInt(document.getElementById('edit-b-nidi').value) || 0,
                            slo: parseInt(document.getElementById('edit-b-slo').value) || 0,
                            area: parseInt(document.getElementById('edit-b-area').value) || 0,
                            mitra: parseInt(document.getElementById('edit-b-mitra').value) || 0,
                            langganan: parseInt(document.getElementById('edit-b-langganan').value) || 0,
                            banyak_rutin: parseInt(document.getElementById('edit-b-banyak-rutin').value) || 0,
                            pelanggan: parseInt(document.getElementById('edit-b-pelanggan').value) || 0,
                        };
                    }
                }).then((r) => {
                    if (r.isConfirmed) {
                        bList[idx] = r.value;
                        bList.sort((a, b) => a.daya - b.daya);
                        localStorage.setItem('wh_biaya', JSON.stringify(bList));
                        renderPortalView();
                    }
                });
            });
        });

        document.querySelectorAll('.btn-del-biaya').forEach(btn => {
            btn.addEventListener('click', () => {
                const idx = parseInt(btn.getAttribute('data-idx'));
                const bList = JSON.parse(localStorage.getItem('wh_biaya')) || [];
                const item = bList[idx];
                if (!item) return;

                Swal.fire({
                    title: 'Hapus Biaya?',
                    text: `Yakin menghapus biaya untuk daya ${item.daya} VA?`,
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#ef4444',
                    confirmButtonText: 'Ya, Hapus'
                }).then((r) => {
                    if (r.isConfirmed) {
                        bList.splice(idx, 1);
                        localStorage.setItem('wh_biaya', JSON.stringify(bList));
                        renderPortalView();
                    }
                });
            });
        });
    }

    // 8N. AUDIT TRAIL LOG VIEW
    function renderAuditTrailView(container) {
        const logs = JSON.parse(localStorage.getItem('wh_logs')) || [];

        container.innerHTML = `
            <div class="table-card">
                <div class="table-card-header">
                    <h4>Log Aktivitas Keamanan & Transaksional</h4>
                    <button class="btn-action primary" id="btn-clear-logs"><i class="fas fa-trash"></i> Bersihkan Log</button>
                </div>
                <div style="padding: 20px;">
                    <div class="audit-list">
                        ${logs.map(log => `
                            <div class="audit-item">
                                <div class="audit-item-info">
                                    <span class="audit-action">${log.action}</span>
                                    <span class="audit-time"><i class="far fa-clock"></i> ${formatDateTime(log.time)}</span>
                                </div>
                                <span class="audit-user"><i class="fas fa-user-shield"></i> ${log.user}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;

        document.getElementById('btn-clear-logs').addEventListener('click', () => {
            Swal.fire({
                title: 'Bersihkan Audit Trail?',
                text: 'Log aktivitas sistem akan dihapus permanen. Tindakan ini tidak dapat dibatalkan.',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#EF4444',
                cancelButtonColor: '#004AAD',
                confirmButtonText: 'Ya, Hapus Semua',
                cancelButtonText: 'Batal'
            }).then((result) => {
                if (result.isConfirmed) {
                    localStorage.setItem('wh_logs', JSON.stringify([]));
                    renderPortalView();
                }
            });
        });
    }

    // ============================================
    // UTILITY RENDER HELPERS
    // ============================================
    function renderPermohonanTableRows(data) {
        if (data.length === 0) {
            return `<tr><td colspan="10" style="text-align:center;">Belum ada permohonan yang diinput.</td></tr>`;
        }

        const membersList = JSON.parse(localStorage.getItem('wh_members')) || [];

        return data.map((item, idx) => {
            const resolvedStatus = resolveStatusMember(item, membersList);
            return `
            <tr>
                <td>${idx + 1}</td>
                <td><strong>${item.id}</strong></td>
                <td>${item.namaPelanggan}</td>
                <td><span class="badge" style="background:rgba(255,255,255,0.05); color:#cbd5e1; font-size:10px;">${resolvedStatus}</span><br/><small style="color:var(--text-muted-dark);">${item.namaPemohon || item.namaPelanggan}</small></td>
                <td><span class="badge" style="background:rgba(255,255,255,0.05); color:white;">${item.jenisPermohonan}</span></td>
                <td>${item.daya}</td>
                <td><strong>Rp ${formatCurrency(item.biaya)}</strong></td>
                <td><span class="badge ${getStatusBadgeClass(item.status)}">${item.status}</span></td>
                <td><span class="badge ${item.pembayaranStatus === 'Paid' ? 'badge-paid' : 'badge-unpaid'}">${item.pembayaranStatus}</span></td>
                <td>
                    <button class="btn-action btn-detail-req" data-id="${item.id}"><i class="fas fa-eye"></i> Detail</button>
                </td>
            </tr>
        `}).join('');
    }

    function bindTableActionEvents() {
        document.querySelectorAll('.btn-detail-req').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.getAttribute('data-id');
                openRequestDetailModal(id);
            });
        });
    }

    async function openRequestDetailModal(id) {
        // Bypass cache: Tarik data murni dari server sebelum membuka modal
        try {
            const btnAssign = document.activeElement;
            if (btnAssign) {
                const oriText = btnAssign.innerHTML;
                btnAssign.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
                const response = await fetch('/api/winhub?action=load_all');
                const res = await response.json();
                if (res.success && res.data) {
                    window.isSyncingDown = true;
                    if (res.data.users && res.data.users.length > 0) localStorage.setItem('wh_users', JSON.stringify(res.data.users));
                    if (res.data.permohonan) localStorage.setItem('wh_permohonan', JSON.stringify(res.data.permohonan));
                    window.isSyncingDown = false;
                }
                btnAssign.innerHTML = oriText;
            }
        } catch (e) {
            console.error("Failed to fetch real-time data:", e);
        }

        const data = JSON.parse(localStorage.getItem('wh_permohonan')) || [];
        const item = data.find(x => x.id === id);

        if (!item) return;

        // Modal elements
        const modalOverlay = document.getElementById('modal-overlay');
        const modalBox = document.getElementById('modal-box');

        if (!modalOverlay || !modalBox) return;

        // Build Modal Body based on Role & Status
        let actionFormHtml = '';
        const usersList = JSON.parse(localStorage.getItem('wh_users')) || [];
        const ttNidiOptions = usersList.filter(u => u.role === 'TT NIDI' || u.role === 'Super Admin').map(u => `<option value="${u.id}">${u.name} (${u.role})</option>`).join('');
        const ttSloOptions = usersList.filter(u => u.role === 'TT SLO' || u.role === 'Super Admin').map(u => `<option value="${u.id}">${u.name} (${u.role})</option>`).join('');

        if (currentUser.role === 'Admin Proses' && item.status === 'Waiting Process') {
            // Assign TT NIDI or TT SLO depending on selection
            actionFormHtml = `
                <div class="detail-section-title">Form Penugasan Lapangan</div>
                <div class="form-field">
                    <label>Pilih Tenaga Teknik (TT) NIDI</label>
                    <select id="mdl-assign-tt" class="form-input">
                        ${ttNidiOptions || '<option value="">-- Tidak ada TT NIDI --</option>'}
                    </select>
                </div>
                <div class="form-field">
                    <label>Catatan Instruksi Pekerjaan</label>
                    <textarea id="mdl-notes" class="form-textarea" placeholder="Tulis instruksi khusus untuk TT NIDI..."></textarea>
                </div>
                <button class="btn-action primary" id="btn-mdl-assign-nidi" style="width:100%; justify-content:center;"><i class="fas fa-check"></i> Kirim Tugas ke TT NIDI</button>
            `;
        } 
        else if (currentUser.role === 'Admin Proses' && item.status === 'Waiting SLO') {
            actionFormHtml = `
                <div class="detail-section-title">Form Penugasan SLO</div>
                <div class="form-field">
                    <label>Pilih Tenaga Teknik (TT) SLO</label>
                    <select id="mdl-assign-tt-slo" class="form-input">
                        ${ttSloOptions || '<option value="">-- Tidak ada TT SLO --</option>'}
                    </select>
                </div>
                <div class="form-field">
                    <label>Catatan Instruksi SLO</label>
                    <textarea id="mdl-notes-slo" class="form-textarea" placeholder="Tulis instruksi khusus untuk TT SLO..."></textarea>
                </div>
                <button class="btn-action primary" id="btn-mdl-assign-slo" style="width:100%; justify-content:center;"><i class="fas fa-check"></i> Kirim Tugas ke TT SLO</button>
            `;
        }

        modalBox.innerHTML = `
            <div class="modal-header">
                <h4><i class="fas fa-info-circle"></i> Rincian Permohonan ${item.id}</h4>
                <button class="btn-close-modal" id="btn-close-mdl"><i class="fas fa-times"></i></button>
            </div>
            <div class="modal-body">
                <div class="detail-list">
                    <div class="detail-row"><span class="label">Nama Pemohon:</span><span class="value">${item.namaPemohon}</span></div>
                    <div class="detail-row"><span class="label">NIK KTP:</span><span class="value">${item.nik}</span></div>
                    <div class="detail-row"><span class="label">Nama Pelanggan:</span><span class="value">${item.namaPelanggan}</span></div>
                    <div class="detail-row"><span class="label">Daya Listrik:</span><span class="value">${item.daya}</span></div>
                    <div class="detail-row"><span class="label">Kecamatan:</span><span class="value">${item.kecamatan}</span></div>
                    <div class="detail-row"><span class="label">Alamat Lengkap:</span><span class="value">${item.alamat}</span></div>
                    <div class="detail-row"><span class="label">Layanan:</span><span class="value">${item.jenisPermohonan}</span></div>
                    <div class="detail-row"><span class="label">Biaya:</span><span class="value">Rp ${formatCurrency(item.biaya)}</span></div>
                    <div class="detail-row"><span class="label">Status:</span><span class="value"><span class="badge ${getStatusBadgeClass(item.status)}">${item.status}</span></span></div>
                    <div class="detail-row"><span class="label">Pembayaran:</span><span class="value"><span class="badge ${item.pembayaranStatus === 'Paid' ? 'badge-paid' : 'badge-unpaid'}">${item.pembayaranStatus}</span></span></div>
                </div>

                ${actionFormHtml}
            </div>
            <div class="modal-footer">
                <button class="btn-action" id="btn-copy-siujang"><i class="fas fa-copy"></i> Format Siujang</button>
                <button class="btn-action" id="btn-close-mdl-foot">Tutup</button>
            </div>
        `;

        modalOverlay.classList.add('open');

        // Modal Close Bindings
        const closeMdl = () => modalOverlay.classList.remove('open');
        document.getElementById('btn-close-mdl').addEventListener('click', closeMdl);
        document.getElementById('btn-close-mdl-foot').addEventListener('click', closeMdl);

        // Copy Siujang format
        document.getElementById('btn-copy-siujang').addEventListener('click', () => {
            // Include NIK, Nama, Daya, Lokasi
            const provName = item.provinsi || 'SUMATERA SELATAN';
            const kotaName = item.kota || 'Palembang';
            const formatStr = `NIK: ${item.nik}\nNama Pemohon: ${item.namaPemohon || item.namaPelanggan}\nNomor HP: ${item.hp || '-'}\nNama Pelanggan: ${item.namaPelanggan}\nDaya Listrik: ${item.daya}\nProvinsi: ${provName}\nKab/Kota: ${kotaName}\nKecamatan: ${item.kecamatan}\nAlamat Lengkap: ${item.alamat}`;
            
            Swal.fire({
                title: 'Data Format Siujang',
                html: `
                    <p style="font-size: 13px; color: #94a3b8; margin-bottom: 10px;">Salin data di bawah ini untuk diinputkan ke aplikasi Siujang:</p>
                    <textarea id="siujang-format-text" style="width: 100%; height: 160px; background: rgba(30,41,59,0.5); color: #fff; border: 1px solid rgba(255,255,255,0.1); border-radius: 6px; padding: 10px; font-family: monospace; font-size: 13px; resize: none;" readonly>${formatStr}</textarea>
                `,
                showCancelButton: true,
                confirmButtonColor: '#004AAD',
                confirmButtonText: '<i class="fas fa-copy"></i> Salin Semua',
                cancelButtonText: 'Tutup',
                focusConfirm: false,
                didOpen: () => {
                    const swalContainer = document.querySelector('.swal2-container:not(.swal2-toast)');
                    if (swalContainer) swalContainer.style.zIndex = '99999';
                }
            }).then((result) => {
                if (result.isConfirmed) {
                    const textToCopy = document.getElementById('siujang-format-text').value;
                    navigator.clipboard.writeText(textToCopy).then(() => {
                        Swal.fire({
                            title: 'Tersalin!',
                            text: 'Data telah disalin ke clipboard.',
                            icon: 'success',
                            toast: true,
                            position: 'top-end',
                            timer: 2000,
                            showConfirmButton: false,
                            didOpen: () => {
                                const swalToastContainer = document.querySelector('.swal2-container.swal2-top-end');
                                if (swalToastContainer) swalToastContainer.style.zIndex = '99999';
                            }
                        });
                    }).catch(err => {
                        Swal.fire({
                            title: 'Gagal',
                            text: 'Tidak dapat menyalin ke clipboard secara otomatis. Silakan blok teks dan salin manual.',
                            icon: 'error',
                            didOpen: () => {
                                const swalContainer = document.querySelector('.swal2-container:not(.swal2-toast)');
                                if (swalContainer) swalContainer.style.zIndex = '99999';
                            }
                        });
                    });
                }
            });
        });

        // Assign TT NIDI
        const assignNidiBtn = document.getElementById('btn-mdl-assign-nidi');
        if (assignNidiBtn) {
            assignNidiBtn.addEventListener('click', () => {
                const ttId = document.getElementById('mdl-assign-tt').value;
                const notes = document.getElementById('mdl-notes').value;
                
                assignRequestToTT(item.id, 'Process NIDI', ttId, notes);
                closeMdl();
            });
        }

        // Assign TT SLO
        const assignSloBtn = document.getElementById('btn-mdl-assign-slo');
        if (assignSloBtn) {
            assignSloBtn.addEventListener('click', () => {
                const ttId = document.getElementById('mdl-assign-tt-slo').value;
                const notes = document.getElementById('mdl-notes-slo').value;
                
                assignRequestToTT(item.id, 'Process SLO', ttId, notes);
                closeMdl();
            });
        }
    }

    function assignRequestToTT(id, nextStatus, ttId, notes) {
        const data = JSON.parse(localStorage.getItem('wh_permohonan')) || [];
        const index = data.findIndex(x => x.id === id);

        if (index !== -1) {
            const item = data[index];
            item.status = nextStatus;

            if (nextStatus === 'Process NIDI') {
                item.ttNidi = ttId;
                item.catatanNidi = notes;
            } else if (nextStatus === 'Process SLO') {
                item.ttSlo = ttId;
                item.catatanSlo = notes;
            }

            localStorage.setItem('wh_permohonan', JSON.stringify(data));
            logActivity(currentUser.name, `Menugaskan pekerjaan ${nextStatus === 'Process NIDI' ? 'NIDI' : 'SLO'} REQ ${item.id} ke Tenaga Teknik`);

            // Notifications
            if (nextStatus === 'Process NIDI') {
                triggerWhatsAppNotification(
                    `*WIN GROUP TASKS ASSIGNED*\n\nHalo Tono NIDI,\n\nAnda memiliki tugas inspeksi NIDI baru!\n\n*ID:* ${item.id}\n*Pelanggan:* ${item.namaPelanggan}\n*Daya:* ${item.daya}\n*Kecamatan:* ${item.kecamatan}\n*Alamat:* ${item.alamat}\n\n*Instruksi:* ${notes || 'Lakukan pemeriksaan standar kelayakan kelistrikan.'}`,
                    'Tono NIDI',
                    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=60'
                );
            } else {
                triggerWhatsAppNotification(
                    `*WIN GROUP TASKS ASSIGNED*\n\nHalo Slamet SLO,\n\nAnda memiliki tugas pengujian SLO baru!\n\n*ID:* ${item.id}\n*Pelanggan:* ${item.namaPelanggan}\n*Daya:* ${item.daya}\n*Kecamatan:* ${item.kecamatan}\n*Alamat:* ${item.alamat}\n\n*Instruksi:* ${notes || 'Lakukan megger test & uji pembumian.'}`,
                    'Slamet SLO',
                    'https://images.unsplash.com/photo-1628157582853-a796fa650a6a?w=100&auto=format&fit=crop&q=60'
                );
            }

            Swal.fire({
                title: 'Tugas Terkirim',
                text: `Pekerjaan berhasil dialokasikan ke petugas lapangan.`,
                icon: 'success'
            }).then(() => {
                renderPortalView();
            });
        }
    }

    // ============================================
    // PDF AND EXCEL GENERATORS (HIGH-FIDELITY IMPLEMENTATIONS)
    // ============================================

    // 9A. OFFICIAL PDF GENERATION (Prints directly in browser)
    function generateOfficialPDF(id) {
        const data = JSON.parse(localStorage.getItem('wh_permohonan')) || [];
        const item = data.find(x => x.id === id);

        if (!item) return;

        // Create a new print window
        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
            <html>
            <head>
                <title>Sertifikat Resmi - ${item.id}</title>
                <style>
                    body { font-family: 'Arial', sans-serif; padding: 40px; color: #333; line-height: 1.5; }
                    .header { text-align: center; border-bottom: 3px double #004AAD; padding-bottom: 20px; margin-bottom: 30px; }
                    .header h1 { font-size: 26px; color: #004AAD; margin: 5px 0; text-transform: uppercase; }
                    .header p { font-size: 11px; color: #777; margin: 2px 0; }
                    .cert-title { text-align: center; font-size: 20px; font-weight: bold; text-decoration: underline; margin-bottom: 25px; color: #111; }
                    .cert-body { margin-bottom: 40px; }
                    .grid-table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
                    .grid-table td { padding: 10px; border-bottom: 1px solid #eee; font-size: 13.5px; }
                    .grid-table td.label { font-weight: bold; width: 35%; color: #555; }
                    .footer-grid { width: 100%; margin-top: 50px; }
                    .footer-grid td { text-align: center; font-size: 13px; width: 50%; }
                    .signature-space { height: 80px; }
                    .watermark { position: fixed; top: 35%; left: 15%; font-size: 110px; color: rgba(0, 74, 173, 0.04); transform: rotate(-30deg); z-index: -10; font-weight: bold; }
                    .badge { border: 1px solid green; color: green; padding: 4px 8px; font-weight: bold; text-transform: uppercase; border-radius: 4px; display: inline-block; font-size: 12px; }
                </style>
            </head>
            <body>
                <div class="watermark">WIN GROUP</div>
                
                <div class="header">
                    <h1>WIN GROUP</h1>
                    <p>SMART ELECTRICAL SERVICE PLATFORM & COLLABORATIVE ENERGY</p>
                    <p>Jl. Kol. H. Barlian No. 102, Palembang, Sumatera Selatan | Telp: (0711) 555-WIN</p>
                </div>

                <div class="cert-title">BERKAS BUKTI PENERBITAN KELAYAKAN LISTRIK</div>

                <div class="cert-body">
                    <p>Menyatakan bahwa instalasi listrik di bawah ini telah lulus pengujian kelayakan dan sertifikasi resmi:</p>
                    
                    <table class="grid-table">
                        <tr>
                            <td class="label">Nomor Registrasi:</td>
                            <td><strong>${item.id}</strong></td>
                        </tr>
                        <tr>
                            <td class="label">Nama Pemilik Instalasi:</td>
                            <td>${item.namaPelanggan}</td>
                        </tr>
                        <tr>
                            <td class="label">NIK Pemilik:</td>
                            <td>${item.nik}</td>
                        </tr>
                        <tr>
                            <td class="label">Lokasi Wilayah:</td>
                            <td>Kecamatan ${item.kecamatan}, Palembang, Sumatera Selatan</td>
                        </tr>
                        <tr>
                            <td class="label">Alamat Lengkap:</td>
                            <td>${item.alamat}</td>
                        </tr>
                        <tr>
                            <td class="label">Batas Daya Listrik:</td>
                            <td><strong>${item.daya}</strong></td>
                        </tr>
                        <tr>
                            <td class="label">Layanan Terdaftar:</td>
                            <td>${item.jenisPermohonan}</td>
                        </tr>
                        <tr>
                            <td class="label">Tanggal Registrasi:</td>
                            <td>${formatDateTime(item.tanggalInput)}</td>
                        </tr>
                        <tr>
                            <td class="label">Nomor Identitas NIDI:</td>
                            <td>${item.nidiFile ? `NIDI-${item.nik.substring(0,8)}-VALID` : `<span style="color:red;">Tidak Diterbitkan</span>`}</td>
                        </tr>
                        <tr>
                            <td class="label">Nomor Sertifikat SLO:</td>
                            <td>${item.sloFile ? `SLO-${item.nik.substring(8,16)}-VALID` : `<span style="color:red;">Tidak Diterbitkan</span>`}</td>
                        </tr>
                    </table>

                    <div style="text-align: center; margin-top: 20px;">
                        <span class="badge">STATUS: LULUS & SELESAI</span>
                    </div>
                </div>

                <table class="footer-grid">
                    <tr>
                        <td>
                            Pembuat Laporan,<br>
                            <strong>Admin Pelayanan WIN Hub</strong>
                            <div class="signature-space"></div>
                            (Ilsa Pelayanan)
                        </td>
                        <td>
                            Mengesahkan,<br>
                            <strong>Manager Operasional</strong>
                            <div class="signature-space"></div>
                            (Bapak Winata)
                        </td>
                    </tr>
                </table>

                <script>
                    window.onload = function() { window.print(); window.close(); }
                </script>
            </body>
            </html>
        `);
        printWindow.document.close();
    }

    // 9B. OFFICIAL RECEIPT GENERATION
    function printOfficialReceipt(id) {
        const data = JSON.parse(localStorage.getItem('wh_permohonan')) || [];
        const item = data.find(x => x.id === id);

        if (!item) return;

        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
            <html>
            <head>
                <title>Kwitansi Pembayaran - ${item.id}</title>
                <style>
                    body { font-family: 'Courier New', monospace; padding: 25px; max-width: 600px; margin: 0 auto; color: #333; }
                    .receipt-card { border: 1px solid #ccc; padding: 20px; border-radius: 8px; box-shadow: 0 4px 10px rgba(0,0,0,0.05); }
                    .brand { text-align: center; font-weight: bold; font-size: 20px; color: #004AAD; margin-bottom: 5px; }
                    .brand span { color: #FF6B00; }
                    .brand-sub { text-align: center; font-size: 11px; color: #777; margin-bottom: 20px; border-bottom: 1px dashed #ccc; padding-bottom: 15px; }
                    .receipt-row { display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 13px; }
                    .receipt-row span.label { color: #666; }
                    .receipt-row span.val { font-weight: bold; }
                    .total-box { background: #f9f9f9; border: 1px solid #eee; padding: 12px; border-radius: 4px; display: flex; justify-content: space-between; font-weight: bold; font-size: 16px; margin: 20px 0; color: #FF6B00; }
                    .footer-notes { font-size: 10px; color: #888; text-align: center; margin-top: 30px; border-top: 1px dashed #ccc; padding-top: 15px; }
                    .stamp { border: 2px solid green; color: green; font-weight: bold; padding: 4px 10px; transform: rotate(-5deg); display: inline-block; font-size: 14px; border-radius: 4px; text-transform: uppercase; margin-top: 15px; }
                </style>
            </head>
            <body>
                <div class="receipt-card">
                    <div class="brand">WIN <span>Hub</span></div>
                    <div class="brand-sub">Smart Electrical Service Platform | Kwitansi Resmi</div>

                    <div class="receipt-row"><span class="label">No Resi Transaksi:</span><span class="val">${item.id}</span></div>
                    <div class="receipt-row"><span class="label">Pelanggan:</span><span class="val">${item.namaPelanggan}</span></div>
                    <div class="receipt-row"><span class="label">Batas Daya Listrik:</span><span class="val">${item.daya}</span></div>
                    <div class="receipt-row"><span class="label">Layanan Layanan:</span><span class="val">${item.jenisPermohonan}</span></div>
                    <div class="receipt-row"><span class="label">Metode Bayar:</span><span class="val">${item.metodePembayaran}</span></div>
                    <div class="receipt-row"><span class="label">Tanggal Transaksi:</span><span class="val">${formatDateTime(item.tanggalInput)}</span></div>
                    
                    <div class="total-box">
                        <span>TOTAL LUNAS:</span>
                        <span>Rp ${formatCurrency(item.biaya)}</span>
                    </div>

                    <div style="text-align: right;">
                        <span class="stamp">LUNAS - DISETUJUI</span>
                    </div>

                    <div class="footer-notes">
                        Terima kasih telah mempercayakan permohonan kelistrikan Anda di WIN GROUP.<br>
                        Kwitansi ini adalah bukti pembayaran digital yang sah dan diakui secara resmi.
                    </div>
                </div>

                <script>
                    window.onload = function() { window.print(); window.close(); }
                </script>
            </body>
            </html>
        `);
        printWindow.document.close();
    }

    // 9C. EXPORT TRANSACTIONS TO EXCEL (CSV FORMAT)
    function exportTransactionsToExcel(data) {
        let csvContent = "data:text/csv;charset=utf-8,";
        csvContent += "No,ID Permohonan,Pelanggan,Metode Bayar,Batas Daya,Layanan,Biaya (Rupiah),Status Pembayaran,Tanggal Input\n";

        data.forEach((item, idx) => {
            const row = [
                idx + 1,
                item.id,
                `"${item.namaPelanggan}"`,
                item.metodePembayaran,
                item.daya,
                item.jenisPermohonan,
                item.biaya,
                item.pembayaranStatus,
                item.tanggalInput
            ].join(",");
            csvContent += row + "\n";
        });

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `Laporan_Pembayaran_WIN_Hub_${new Date().toISOString().slice(0,10)}.csv`);
        document.body.appendChild(link); // Required for FF
        link.click();
        document.body.removeChild(link);

        logActivity(currentUser.name, 'Mengekspor laporan keuangan transaksi ke format CSV Excel.');

        Swal.fire({
            title: 'Laporan Diekspor',
            text: 'Berkas CSV berhasil diunduh ke perangkat Anda.',
            icon: 'success',
            toast: true,
            position: 'top-end',
            timer: 2000,
            showConfirmButton: false
        });
    }

    // ============================================
    // AUDIT LOGS AND NOTIFICATIONS
    // ============================================
    function logActivity(user, action) {
        const logs = JSON.parse(localStorage.getItem('wh_logs')) || [];
        logs.unshift({
            user: user,
            action: action,
            time: new Date().toISOString()
        });
        localStorage.setItem('wh_logs', JSON.stringify(logs));
    }

    function triggerWhatsAppNotification(message, title, image, phoneStr = null) {
        const waSim = document.getElementById('whatsapp-simulator');
        const waHeaderImg = document.getElementById('wa-header-img');
        const waHeaderTitle = document.getElementById('wa-header-title');
        const waMsgBody = document.getElementById('wa-msg-body');

        if (!waSim || !waHeaderImg || !waHeaderTitle || !waMsgBody) return;

        // Update elements
        waHeaderTitle.textContent = title;
        waHeaderImg.src = image || 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=100&auto=format&fit=crop&q=60';
        
        // Wrap message styling (bold to bold tags, returns to breaks)
        let formattedMsg = message.replace(/\n/g, '<br>');
        formattedMsg = formattedMsg.replace(/\*(.*?)\*/g, '<strong>$1</strong>');

        // Check if there is an active real phone number configured
        const users = JSON.parse(localStorage.getItem('wh_users')) || [];
        const targetUser = users.find(u => u.name === title || u.role === title);
        
        let finalPhone = phoneStr;
        if (!finalPhone && targetUser && targetUser.phone) {
            finalPhone = targetUser.phone;
        }
        if (!finalPhone) {
            // Coba cari di wh_members (pelanggan) jika tidak ada di wh_users
            const members = JSON.parse(localStorage.getItem('wh_members')) || [];
            const targetMember = members.find(m => m.nama === title);
            if (targetMember && targetMember.hp) {
                finalPhone = targetMember.hp;
            }
        }
        if (!finalPhone) {
            // Fallback default nomor agar tombol tetap muncul jika sama sekali kosong
            finalPhone = '6281234567890';
        }

        let actionBtnHtml = '';
        if (finalPhone) {
            const encodedMsg = encodeURIComponent(message);
            actionBtnHtml = `
                <div style="margin-top: 8px; text-align: right;">
                    <a href="https://web.whatsapp.com/send?phone=${finalPhone}&text=${encodedMsg}" target="whatsapp_chat" onclick="document.getElementById('whatsapp-simulator').style.display='none';" class="btn-action" style="background:#25D366; color:white; border-color:#25D366; padding:4px 8px; font-size:10px; text-decoration:none; display:inline-flex; align-items:center; gap:4px; border-radius:4px; font-weight:bold;">
                        <i class="fab fa-whatsapp"></i> Kirim Chat Asli
                    </a>
                </div>
            `;
        }

        // Add message inside green bubble with local time
        const now = new Date();
        const timeStr = `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`;
        
        waMsgBody.innerHTML = `
            <div class="wa-bubble">
                ${formattedMsg}
                ${actionBtnHtml}
                <span class="time">${timeStr}</span>
            </div>
        `;

        // Display
        waSim.style.display = 'block';
    }

    // Bind Close WA click
    const waCloseBtn = document.getElementById('wa-close-btn');
    if (waCloseBtn) {
        waCloseBtn.addEventListener('click', () => {
            const waSim = document.getElementById('whatsapp-simulator');
            if (waSim) waSim.style.display = 'none';
        });
    }

    // ============================================
    // HELPER FUNCTIONS
    // ============================================
    function resolveStatusMember(item, members) {
        let status = item.statusMember;
        // Jika belum ada attribute statusMember (data lama) atau masih terekam sebagai Pelanggan secara default
        if (!status || status === 'Pelanggan') {
            const match = (members || []).find(m => m.nama === item.namaPemohon || m.nama === item.namaPelanggan);
            if (match && match.status) {
                status = match.status;
            } else {
                status = 'Pelanggan';
            }
        }
        return status;
    }

    function formatCurrency(num) {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }

    function formatDateTime(isoString) {
        const date = new Date(isoString);
        return date.toLocaleDateString('id-ID', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    function getStatusBadgeClass(status) {
        switch (status) {
            case 'Draft': return 'badge-draft';
            case 'Waiting Process': return 'badge-waiting';
            case 'Process NIDI': return 'badge-process-nidi';
            case 'NIDI Finished': return 'badge-nidi-finished';
            case 'Waiting SLO': return 'badge-waiting-slo';
            case 'Process SLO': return 'badge-process-slo';
            case 'SLO Finished': return 'badge-slo-finished';
            case 'Shared': return 'badge-shared';
            case 'Completed': return 'badge-completed';
            default: return '';
        }
    }

    // Global Mobile Sidebar Toggle
    const mobileSidebarToggle = document.getElementById('mobile-sidebar-toggle');
    const portalSidebar = document.querySelector('.portal-sidebar');
    if (mobileSidebarToggle && portalSidebar) {
        mobileSidebarToggle.addEventListener('click', () => {
            portalSidebar.classList.toggle('mobile-open');
        });
        
        // Close sidebar when clicking outside on mobile
        document.addEventListener('click', (e) => {
            if (window.innerWidth <= 576 && portalSidebar.classList.contains('mobile-open')) {
                if (!portalSidebar.contains(e.target) && !mobileSidebarToggle.contains(e.target)) {
                    portalSidebar.classList.remove('mobile-open');
                }
            }
        });
    }

    // ==========================================
    // REAL-TIME MULTI-USER POLLING (5 Seconds)
    // ==========================================
    setInterval(async () => {
        if (!currentUser) return; // Only poll if logged in
        if (Swal.isVisible()) return; // Don't interrupt if user is interacting with Swal
        const modalOverlay = document.getElementById('modal-overlay');
        if (modalOverlay && modalOverlay.style.display === 'flex') return; // Don't interrupt open modals

        try {
            const response = await fetch('/api/winhub?action=load_all');
            const res = await response.json();
            if (res.success && res.data) {
                const currentPermohonan = localStorage.getItem('wh_permohonan');
                const newPermohonan = res.data.permohonan ? JSON.stringify(res.data.permohonan) : currentPermohonan;
                
                const currentUsers = localStorage.getItem('wh_users');
                const newUsers = (res.data.users && res.data.users.length > 0) ? JSON.stringify(res.data.users) : currentUsers;

                if (currentPermohonan !== newPermohonan || currentUsers !== newUsers) {
                    window.isSyncingDown = true;
                    if (res.data.users && res.data.users.length > 0) localStorage.setItem('wh_users', newUsers);
                    if (res.data.permohonan) localStorage.setItem('wh_permohonan', newPermohonan);
                    if (res.data.daya) localStorage.setItem('wh_daya', JSON.stringify(res.data.daya));
                    if (res.data.biaya) localStorage.setItem('wh_biaya', JSON.stringify(res.data.biaya));
                    window.isSyncingDown = false;

                    // Automatically refresh the current view to show new data
                    if (typeof renderPortalView === 'function') {
                        renderPortalView();
                    }
                }
            }
        } catch (e) {
            // Silently ignore network errors during polling
        }
    }, 1500);

});

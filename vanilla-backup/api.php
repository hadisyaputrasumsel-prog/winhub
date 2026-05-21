<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

$host = '127.0.0.1';
$db   = 'winhub';
$user = 'root';
$pass = '';
$charset = 'utf8mb4';

$dsn = "mysql:host=$host;dbname=$db;charset=$charset";
$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES   => false,
];

try {
    $pdo = new PDO($dsn, $user, $pass, $options);
} catch (\PDOException $e) {
    echo json_encode(['success' => false, 'error' => 'Database connection failed: ' . $e->getMessage()]);
    exit;
}

$method = $_SERVER['REQUEST_METHOD'];
$action = isset($_GET['action']) ? $_GET['action'] : '';

$input = [];
if ($method === 'POST') {
    $rawInput = file_get_contents('php::input');
    if (empty($rawInput)) {
        $rawInput = file_get_contents('php://input');
    }
    $input = json_decode($rawInput, true);
    if (isset($input['action'])) {
        $action = $input['action'];
    }
}

// -----------------------------------------------------------------
// GET HANDLERS
// -----------------------------------------------------------------
if ($method === 'GET') {
    if ($action === 'load_all') {
        try {
            // Load users
            $usersStmt = $pdo->query("SELECT * FROM users");
            $users = $usersStmt->fetchAll();
            
            // Load daya
            $dayaStmt = $pdo->query("SELECT * FROM daya ORDER BY id ASC");
            $dayas = $dayaStmt->fetchAll();
            $dayaArray = array_column($dayas, 'nilai');
            
            // Load kecamatan
            $kecStmt = $pdo->query("SELECT * FROM kecamatan ORDER BY id ASC");
            $kecamatans = $kecStmt->fetchAll();
            $kecArray = array_column($kecamatans, 'nama');
            
            // Load permohonan
            $permStmt = $pdo->query("SELECT * FROM permohonan ORDER BY tanggalInput DESC");
            $permohonan = $permStmt->fetchAll();
            foreach ($permohonan as &$p) {
                $p['shared'] = $p['shared'] == 1;
                $p['biaya'] = (int)$p['biaya'];
            }
            
            // Load logs
            $logsStmt = $pdo->query("SELECT * FROM logs ORDER BY time DESC LIMIT 200");
            $logs = $logsStmt->fetchAll();
            foreach ($logs as &$l) {
                $l['time'] = date('c', strtotime($l['time']));
            }
            
            echo json_encode([
                'success' => true,
                'data' => [
                    'users' => $users,
                    'daya' => $dayaArray,
                    'wilayah' => [
                        'provinsi' => 'Sumatera Selatan',
                        'kabupaten' => 'Palembang',
                        'kecamatan' => $kecArray
                    ],
                    'permohonan' => $permohonan,
                    'logs' => $logs
                ]
            ]);
        } catch (Exception $e) {
            echo json_encode(['success' => false, 'error' => $e->getMessage()]);
        }
        exit;
    }
}

// -----------------------------------------------------------------
// POST HANDLERS (MUTATIONS)
// -----------------------------------------------------------------
if ($method === 'POST') {
    // Sync Table
    if ($action === 'sync_table') {
        try {
            $table = $input['table'];
            $data = $input['data'];
            
            if ($table === 'permohonan') {
                $pdo->exec("SET FOREIGN_KEY_CHECKS = 0");
                $pdo->exec("TRUNCATE TABLE permohonan");
                $stmt = $pdo->prepare("INSERT INTO permohonan (
                    id, namaPemohon, nik, namaPelanggan, daya, alamat, kecamatan, biaya, metodePembayaran,
                    jenisPermohonan, status, ttNidi, ttSlo, catatanNidi, catatanSlo, pembayaranStatus, shared,
                    tanggalInput, nidiFile, sloFile, buktiBayar
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
                
                foreach ($data as $p) {
                    $stmt->execute([
                        $p['id'],
                        $p['namaPemohon'],
                        $p['nik'],
                        $p['namaPelanggan'],
                        $p['daya'],
                        $p['alamat'],
                        $p['kecamatan'],
                        $p['biaya'],
                        $p['metodePembayaran'],
                        $p['jenisPermohonan'],
                        $p['status'],
                        $p['ttNidi'],
                        $p['ttSlo'],
                        $p['catatanNidi'],
                        $p['catatanSlo'],
                        $p['pembayaranStatus'],
                        $p['shared'] ? 1 : 0,
                        date('Y-m-d H:i:s', strtotime($p['tanggalInput'])),
                        $p['nidiFile'],
                        $p['sloFile'],
                        $p['buktiBayar']
                    ]);
                }
                $pdo->exec("SET FOREIGN_KEY_CHECKS = 1");
            }
            else if ($table === 'logs') {
                $pdo->exec("TRUNCATE TABLE logs");
                $stmt = $pdo->prepare("INSERT INTO logs (user, action, time) VALUES (?, ?, ?)");
                foreach ($data as $l) {
                    $stmt->execute([
                        $l['user'],
                        $l['action'],
                        date('Y-m-d H:i:s', strtotime($l['time']))
                    ]);
                }
            }
            else if ($table === 'users') {
                $pdo->exec("SET FOREIGN_KEY_CHECKS = 0");
                $pdo->exec("TRUNCATE TABLE users");
                $stmt = $pdo->prepare("INSERT INTO users (id, email, name, role, avatar) VALUES (?, ?, ?, ?, ?)");
                foreach ($data as $u) {
                    $stmt->execute([
                        $u['id'],
                        $u['email'],
                        $u['name'],
                        $u['role'],
                        $u['avatar']
                    ]);
                }
                $pdo->exec("SET FOREIGN_KEY_CHECKS = 1");
            }
            else if ($table === 'daya') {
                $pdo->exec("TRUNCATE TABLE daya");
                $stmt = $pdo->prepare("INSERT INTO daya (nilai) VALUES (?)");
                foreach ($data as $d) {
                    $stmt->execute([$d]);
                }
            }
            else if ($table === 'wilayah') {
                $pdo->exec("TRUNCATE TABLE kecamatan");
                $stmt = $pdo->prepare("INSERT INTO kecamatan (nama) VALUES (?)");
                foreach ($data['kecamatan'] as $k) {
                    $stmt->execute([$k]);
                }
            }
            
            echo json_encode(['success' => true, 'message' => "Table $table synchronized successfully!"]);
        } catch (Exception $e) {
            echo json_encode(['success' => false, 'error' => $e->getMessage()]);
        }
        exit;
    }
}

echo json_encode(['success' => false, 'error' => 'Invalid action or method.']);

<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login - WIN Hub</title>
    <link rel="stylesheet" href="{{ asset('style.css') }}?v={{ time() }}">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link rel="icon" type="image/png" href="{{ asset('logo/logo winhub1.png?v=2') }}">
</head>
<body style="display:flex; align-items:center; justify-content:center; min-height:100vh; background:#F8FAFC;">
    <div class="login-card" style="width: 100%; max-width: 400px; padding: 40px; background: white; border-radius: 16px; box-shadow: 0 10px 30px rgba(0,0,0,0.05);">
        <div class="login-header" style="text-align: center; margin-bottom: 30px;">
            <img src="{{ asset('logo/logo winhub1.png?v=2') }}" alt="WIN Hub" class="login-logo" style="width: 80px; margin-bottom: 15px;">
            <h2 style="font-size: 24px; color: #0B1E43; font-weight: 800;">Portal Enterprise WIN Hub</h2>
            <p style="color: #64748B; font-size: 14px;">Silakan masuk menggunakan akun resmi Anda</p>
        </div>
        
        @if ($errors->any())
            <div style="background: #FEE2E2; color: #EF4444; padding: 10px 15px; border-radius: 8px; margin-bottom: 20px; font-size: 14px;">
                @foreach ($errors->all() as $error)
                    {{ $error }}
                @endforeach
            </div>
        @endif

        <form action="{{ route('login') }}" method="POST">
            @csrf
            <div class="input-group" style="margin-bottom: 20px;">
                <label for="email" style="display: block; margin-bottom: 8px; font-size: 14px; font-weight: 600; color: #334155;">Alamat Email Kerja</label>
                <div class="input-wrapper" style="position: relative;">
                    <i class="fas fa-envelope" style="position: absolute; left: 15px; top: 50%; transform: translateY(-50%); color: #94A3B8;"></i>
                    <input type="email" id="email" name="email" value="{{ old('email') }}" style="width: 100%; padding: 12px 15px 12px 40px; border: 1px solid #CBD5E1; border-radius: 8px; font-size: 14px;" placeholder="nama@winhub.com" required>
                </div>
            </div>
            
            <div class="input-group" style="margin-bottom: 25px;">
                <label for="password" style="display: block; margin-bottom: 8px; font-size: 14px; font-weight: 600; color: #334155;">Kata Sandi</label>
                <div class="input-wrapper" style="position: relative;">
                    <i class="fas fa-lock" style="position: absolute; left: 15px; top: 50%; transform: translateY(-50%); color: #94A3B8;"></i>
                    <input type="password" id="password" name="password" style="width: 100%; padding: 12px 15px 12px 40px; border: 1px solid #CBD5E1; border-radius: 8px; font-size: 14px;" placeholder="Masukkan kata sandi" required>
                </div>
            </div>
            
            <button type="submit" style="width: 100%; padding: 12px; background: #004AAD; color: white; border: none; border-radius: 8px; font-size: 15px; font-weight: 600; cursor: pointer; transition: background 0.3s;">
                <i class="fas fa-sign-in-alt" style="margin-right: 8px;"></i> Masuk Ke Portal
            </button>
        </form>

        <div style="text-align: center; margin-top: 25px;">
            <a href="{{ route('landing') }}" style="color: #64748B; text-decoration: none; font-size: 14px; display: inline-flex; align-items: center; gap: 8px;">
                <i class="fas fa-arrow-left"></i> Kembali ke Beranda
            </a>
        </div>
    </div>
</body>
</html>

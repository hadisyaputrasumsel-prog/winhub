@extends('layouts.app')

@section('header_title', 'Dashboard Utama')
@section('header_subtitle', 'Ringkasan operasional dan status permohonan terkini.')

@section('content')
<div class="view-content active" id="dashboard-view" style="animation: fadeUp 0.4s ease-out;">
    <div class="stats-grid">
        <div class="stat-card">
            <div class="stat-card-icon"><i class="fas fa-file-alt"></i></div>
            <div class="stat-card-details">
                <h3>Total Permohonan</h3>
                <h2>{{ number_format($totalPermohonan, 0, ',', '.') }}</h2>
                <span class="stat-trend trend-up"><i class="fas fa-arrow-up"></i> Total Sistem</span>
            </div>
        </div>
        <div class="stat-card">
            <div class="stat-card-icon" style="background: rgba(245, 158, 11, 0.15); color: #F59E0B;"><i class="fas fa-clock"></i></div>
            <div class="stat-card-details">
                <h3>Sedang Proses</h3>
                <h2>{{ number_format($sedangProses, 0, ',', '.') }}</h2>
                <span class="stat-trend text-neutral">Menunggu tindakan</span>
            </div>
        </div>
        <div class="stat-card">
            <div class="stat-card-icon" style="background: rgba(16, 185, 129, 0.15); color: #10B981;"><i class="fas fa-check-circle"></i></div>
            <div class="stat-card-details">
                <h3>Selesai (SLO/NIDI Terbit)</h3>
                <h2>{{ number_format($selesai, 0, ',', '.') }}</h2>
                <span class="stat-trend trend-up"><i class="fas fa-check"></i> Selesai</span>
            </div>
        </div>
        <div class="stat-card">
            <div class="stat-card-icon" style="background: rgba(236, 72, 153, 0.15); color: #EC4899;"><i class="fas fa-wallet"></i></div>
            <div class="stat-card-details">
                <h3>Pendapatan Total</h3>
                <h2>Rp {{ number_format($revenue, 0, ',', '.') }}</h2>
                <span class="stat-trend text-neutral">Berdasarkan data Paid</span>
            </div>
        </div>
    </div>

    <div class="charts-grid">
        <div class="chart-card">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 20px;">
                <h3 style="margin:0; font-size: 16px; color: white;">Statistik Permohonan Terkini</h3>
                <select class="filter-select" id="chart-filter">
                    <option value="7d">7 Hari Terakhir</option>
                    <option value="30d">30 Hari Terakhir</option>
                </select>
            </div>
            <canvas id="mainChart" style="width: 100%; height: 250px;"></canvas>
        </div>

        <div class="chart-card">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 20px; padding: 0 20px;">
                <h3 style="margin:0; font-size: 16px; color: white;">Aktivitas Terkini</h3>
                <button class="btn-action" style="font-size: 12px; padding: 6px 12px;">Lihat Semua</button>
            </div>
            <div class="activity-timeline" id="recent-activities">
                @if($logs->count() > 0)
                    @foreach($logs as $log)
                        <div class="timeline-item">
                            <div class="timeline-dot"></div>
                            <div class="timeline-content">
                                <p class="timeline-text"><strong>{{ $log->user }}</strong> {{ $log->action }}</p>
                                <span class="timeline-time">{{ \Carbon\Carbon::parse($log->time)->diffForHumans() }}</span>
                            </div>
                        </div>
                    @endforeach
                @else
                    <div style="text-align:center; padding: 20px; color:#94A3B8;">
                        Belum ada aktivitas.
                    </div>
                @endif
            </div>
        </div>
    </div>
</div>

<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
<script>
    document.addEventListener('DOMContentLoaded', function() {
        const ctx = document.getElementById('mainChart').getContext('2d');
        
        // Gradient for line chart
        const gradient = ctx.createLinearGradient(0, 0, 0, 400);
        gradient.addColorStop(0, 'rgba(0, 74, 173, 0.5)');
        gradient.addColorStop(1, 'rgba(0, 74, 173, 0.0)');

        new Chart(ctx, {
            type: 'line',
            data: {
                labels: {!! json_encode($chartLabels) !!},
                datasets: [{
                    label: 'Jumlah Permohonan',
                    data: {!! json_encode($chartData) !!},
                    borderColor: '#004AAD',
                    backgroundColor: gradient,
                    borderWidth: 2,
                    pointBackgroundColor: '#fff',
                    pointBorderColor: '#004AAD',
                    pointBorderWidth: 2,
                    pointRadius: 4,
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        backgroundColor: '#1E293B',
                        padding: 10,
                        titleColor: '#F8FAFC',
                        bodyColor: '#F8FAFC',
                        displayColors: false,
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(255, 255, 255, 0.05)',
                            drawBorder: false,
                        },
                        ticks: {
                            color: '#94A3B8',
                            stepSize: 1
                        }
                    },
                    x: {
                        grid: {
                            display: false,
                            drawBorder: false,
                        },
                        ticks: {
                            color: '#94A3B8'
                        }
                    }
                }
            }
        });
    });
</script>
@endsection

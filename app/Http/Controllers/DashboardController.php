<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function index()
    {
        $user = auth()->user();
        $query = DB::table('permohonan');

        // 1. Role-based filtering
        if ($user) {
            if ($user->role === 'TT NIDI') {
                $query->whereIn('status', ['Proses NIDI', 'NIDI Selesai', 'Completed']);
            } elseif ($user->role === 'TT SLO') {
                $query->whereIn('status', ['Proses SLO', 'SLO Selesai', 'Completed']);
            } elseif ($user->role === 'Admin Keuangan') {
                // Example filter for Keuangan (maybe all, or just paid/unpaid focus, here we show all for revenue focus)
            }
        }

        // Clone query for different stats to avoid modifying the base query for each
        $totalPermohonan = (clone $query)->count();
        $sedangProses = (clone $query)->whereNotIn('status', ['Completed', 'NIDI Selesai', 'SLO Selesai', 'Draft'])->count();
        $selesai = (clone $query)->whereIn('status', ['Completed', 'NIDI Selesai', 'SLO Selesai'])->count();
        
        $revenue = (clone $query)->where('pembayaranStatus', 'Paid')->sum('biaya');

        $logs = DB::table('logs')->orderBy('time', 'desc')->limit(5)->get();

        // 2. Chart Data (Last 7 Days)
        $chartData = [];
        $chartLabels = [];
        for ($i = 6; $i >= 0; $i--) {
            $date = \Carbon\Carbon::today()->subDays($i);
            $chartLabels[] = $date->format('d M');
            
            // Count permohonan for this date
            $count = (clone $query)
                ->whereDate('tanggalInput', $date->toDateString())
                ->count();
            $chartData[] = $count;
        }

        return view('dashboard.index', compact('totalPermohonan', 'sedangProses', 'selesai', 'revenue', 'logs', 'chartLabels', 'chartData'));
    }
}

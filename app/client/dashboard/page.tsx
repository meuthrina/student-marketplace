import React from 'react';
import Link from 'next/link';
import { mockProjects, mockBids } from '@/lib/mockData';
import { GlassCard } from '@/components/ui/GlassCard';
import { Badge } from '@/components/ui/Badge';
import { ScopeBadge } from '@/components/ui/ScopeBadge';

/**
 * ClientDashboardPage (React Server Component)
 *
 * Dashboard manajemen proyek dan pemantauan escrow bagi pengguna berkedudukan
 * sebagai Klien / Pemberi Kerja (Aliran DFD F3, F4, dan F9).
 */
export default async function ClientDashboardPage() {
  const clientProjects = mockProjects;
  const totalBidsCount = mockBids.length + 4; // Mock total across client projects
  const totalEscrowFund = clientProjects.reduce((acc, p) => acc + p.budget, 0);

  return (
    <main className="w-full min-h-screen bg-[#F0F1FB] py-6 sm:py-8">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-8">
        
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="text-xs text-[#78859D]">
          <ol className="flex items-center gap-2">
            <li>
              <Link href="/" className="hover:text-[#4338CA] transition-colors">
                Beranda
              </Link>
            </li>
            <li>/</li>
            <li className="font-semibold text-[#0F172A]">Dashboard Klien</li>
          </ol>
        </nav>

        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2">
              <Badge variant="default" size="sm" className="min-h-[28px]">
                💼 Mode Klien
              </Badge>
              <span className="text-xs font-semibold text-[#475569]">
                Aliran DFD F3 & F9
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-[#0F172A]">
              Dashboard Klien & Kontrak Kerja
            </h1>
            <p className="text-sm text-[#475569]">
              Kelola proyek aktif, pantau penawaran mahasiswa, dan awasi keamanan dana escrow Anda.
            </p>
          </div>

          <Link
            href="/client/projects/create"
            className="min-h-[48px] px-6 rounded-full bg-[#4338CA] hover:bg-[#3730A3] text-white font-bold text-sm inline-flex items-center justify-center shrink-0 shadow-md transition-colors gap-2 cursor-pointer"
          >
            <svg
              className="w-4 h-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            <span>+ Buat Proyek Baru</span>
          </Link>
        </div>

        {/* 1. Quick Stats Metrics (3 Cards) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <GlassCard className="p-6 rounded-[22px] bg-white/75 border border-white flex flex-col gap-2 shadow-xs">
            <span className="text-xs font-semibold text-[#78859D] uppercase tracking-wider">
              Proyek Aktif
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-[#0F172A]">
                {clientProjects.length}
              </span>
              <span className="text-xs font-medium text-emerald-600">
                Lowongan Terbuka
              </span>
            </div>
            <p className="text-xs text-[#475569]">
              Menerima penawaran proposal dari mahasiswa terverifikasi
            </p>
          </GlassCard>

          <GlassCard className="p-6 rounded-[22px] bg-white/75 border border-white flex flex-col gap-2 shadow-xs">
            <span className="text-xs font-semibold text-[#78859D] uppercase tracking-wider">
              Total Proposal Masuk (DFD F4)
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-[#4338CA]">
                {totalBidsCount}
              </span>
              <span className="text-xs font-medium text-[#4338CA]">
                Pelamar
              </span>
            </div>
            <p className="text-xs text-[#475569]">
              Mahasiswa aktif Universitas Pertamina & talenta umum
            </p>
          </GlassCard>

          <GlassCard className="p-6 rounded-[22px] bg-white/75 border border-white flex flex-col gap-2 shadow-xs">
            <span className="text-xs font-semibold text-[#78859D] uppercase tracking-wider">
              Proteksi Dana Escrow (DFD F9)
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-extrabold text-[#0F766E]">
                Rp{totalEscrowFund.toLocaleString('id-ID')}
              </span>
            </div>
            <p className="text-xs text-emerald-700 font-medium">
              ✓ 100% Aman di rekening penampung pihak ketiga
            </p>
          </GlassCard>
        </div>

        {/* 2. Escrow Status Highlight Card */}
        <div className="w-full p-6 sm:p-7 rounded-[24px] bg-gradient-to-br from-[#1E1B4B] to-[#312E81] text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex flex-col gap-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-emerald-400/20 text-emerald-300 text-xs font-bold border border-emerald-400/30">
                🔒 Rekening Penampung Escrow Aktif
              </span>
              <span className="text-xs text-indigo-200">
                Keamanan Transaksi Kampus
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
              Dana Anda Dijamin Utuh Hingga Pekerjaan Selesai
            </h2>
            <p className="text-xs sm:text-sm text-indigo-200/90 leading-relaxed">
              Sistem Escrow Studance menahan dana proyek secara transparan. Pembayaran hanya akan dicairkan ke dompet mahasiswa setelah Anda meninjau dan menyetujui hasil deliverables akhir.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0 w-full sm:w-auto">
            <Link
              href="/projects"
              className="min-h-[44px] px-5 rounded-full bg-white text-[#1E1B4B] font-bold text-xs inline-flex items-center justify-center hover:bg-indigo-50 transition-colors shadow-sm"
            >
              Lihat Katalog Proyek
            </Link>
          </div>
        </div>

        {/* 3. Daftar Proyek Milik Klien (Aliran DFD F3) */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-bold text-[#0F172A]">
                Daftar Proyek Klien
              </h2>
              <span className="px-2.5 py-0.5 rounded-full bg-[#E8E7FC] text-[#4338CA] text-[11px] font-bold uppercase tracking-wider">
                Aliran DFD F3
              </span>
            </div>
            <span className="text-xs text-[#78859D]">
              Menampilkan {clientProjects.length} proyek terdaftar
            </span>
          </div>

          <div className="grid grid-cols-1 gap-4 w-full">
            {clientProjects.map((project) => {
              const projectBidsCount = mockBids.filter((b) => b.projectId === project.id).length;
              const formattedDate = project.deadline
                ? new Date(project.deadline).toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })
                : '24 Okt 2026';

              return (
                <GlassCard
                  key={project.id}
                  className="p-6 rounded-[22px] bg-white/80 border border-white flex flex-col md:flex-row md:items-center justify-between gap-5 hover:border-[#4338CA]/30 transition-all shadow-xs"
                >
                  <div className="flex flex-col gap-2 min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <ScopeBadge scope={project.scope} targetCampus={project.targetCampus} size="sm" />
                      <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-[#475569] text-xs font-semibold">
                        {project.category}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-200">
                        Status: {project.status}
                      </span>
                    </div>

                    <h3 className="text-lg sm:text-xl font-bold text-[#0F172A] truncate">
                      {project.title}
                    </h3>
                    <p className="text-xs text-[#475569] line-clamp-2">
                      {project.description}
                    </p>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-[#78859D] pt-1">
                      <span>Anggaran: <strong className="text-[#0F172A]">Rp{project.budget.toLocaleString('id-ID')}</strong></span>
                      <span>•</span>
                      <span>Deadline: <strong className="text-[#0F172A]">{formattedDate}</strong></span>
                      <span>•</span>
                      <span className="text-[#4338CA] font-semibold">
                        {projectBidsCount > 0 ? `${projectBidsCount} Proposal Masuk` : 'Belum Ada Pelamar'}
                      </span>
                    </div>
                  </div>

                  <div className="flex sm:flex-row md:flex-col items-center md:items-end gap-2 shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100">
                    <Link
                      href={`/projects/${project.id}`}
                      className="min-h-[42px] px-5 rounded-full bg-[#4338CA] hover:bg-[#3730A3] text-white text-xs font-bold inline-flex items-center justify-center transition-colors shadow-2xs w-full sm:w-auto"
                    >
                      Tinjau Proposal Masuk ↗
                    </Link>
                  </div>
                </GlassCard>
              );
            })}
          </div>
        </div>

      </div>
    </main>
  );
}

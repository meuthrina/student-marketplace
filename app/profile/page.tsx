import React from 'react';
import Link from 'next/link';
import {
  mockCurrentUser,
  mockServices,
  mockProjects,
  mockPortfolios,
} from '@/lib/mockData';
import { VerifiedBadge } from '@/components/ui/VerifiedBadge';
import { GlassCard } from '@/components/ui/GlassCard';
import { Badge } from '@/components/ui/Badge';
import { ServiceCard } from '@/components/features/services/ServiceCard';
import { ProfileHeaderCard } from '@/components/features/profile/ProfileHeaderCard';

/**
 * ProfilePage (React Server Component)
 *
 * Menampilkan profil pengguna dan status verifikasi kampus SSO Universitas Pertamina.
 * Menggunakan arsitektur RSC siap integrasi Prisma ORM (Tugas 2).
 */
export default async function ProfilePage() {
  const user = mockCurrentUser;
  const userServices = mockServices.slice(0, 2);
  const activeProjectsCount = mockProjects.length;

  return (
    <main className="w-full min-h-screen bg-[#F0F1FB] py-6 sm:py-8">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-8">
        
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="text-xs text-[#475569]">
          <ol className="flex items-center gap-2">
            <li>
              <Link href="/" className="hover:text-[#4338CA] transition-colors">Beranda</Link>
            </li>
            <li>/</li>
            <li className="font-semibold text-[#0F172A]">Profil Saya</li>
          </ol>
        </nav>

        {/* Profile Header & Identity Card */}
        <div className="w-full grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_420px] gap-6 lg:gap-8 items-start">
          
          {/* Main Profile Info (Interactive Client Component with Edit Mode) */}
          <ProfileHeaderCard user={user} />

          {/* Campus Verification Status Card (Sidebar) */}
          <div className="flex flex-col gap-6 w-full">
            <GlassCard className="p-6 rounded-[24px] flex flex-col gap-4 bg-white/70 border border-white">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-[#475569]">
                  STATUS VERIFIKASI KAMPUS
                </span>
                <Badge variant="success" size="sm" className="min-h-[28px]">
                  Aktif & Terverifikasi
                </Badge>
              </div>

              <div className="p-4 rounded-[16px] bg-[#ECFDF5] border border-emerald-100 flex flex-col gap-1.5">
                <div className="flex items-center gap-2 text-emerald-800 font-semibold text-sm">
                  <svg
                    className="w-5 h-5 text-emerald-600 shrink-0"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    <path d="m9 12 2 2 4-4" />
                  </svg>
                  <span>Mahasiswa Resmi Universitas Pertamina</span>
                </div>
                <p className="text-xs text-emerald-700 leading-relaxed">
                  Identitas Anda telah diverifikasi melalui protokol HMAC OTP email institusi <strong>student.universitaspertamina.ac.id</strong>.
                </p>
              </div>

              <div className="flex flex-col gap-2 text-xs text-[#475569]">
                <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                  <span>Hak Akses Proyek Kampus</span>
                  <span className="font-semibold text-emerald-600">Terbuka (Full)</span>
                </div>
                <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                  <span>Bidding Proposal</span>
                  <span className="font-semibold text-emerald-600">Diizinkan</span>
                </div>
                <div className="flex items-center justify-between py-1.5">
                  <span>Pencairan Dana Escrow</span>
                  <span className="font-semibold text-emerald-600">Siap Pakai</span>
                </div>
              </div>

              <Link
                href="/auth/verify-student"
                className="min-h-[44px] w-full rounded-full bg-slate-100 hover:bg-slate-200 text-[#475569] text-xs font-semibold flex items-center justify-center transition-colors"
              >
                Cek Riwayat Autentikasi Kampus
              </Link>
            </GlassCard>

            {/* Quick Stats Summary */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-5 rounded-[20px] bg-white/70 border border-white shadow-xs flex flex-col gap-1">
                <span className="text-xs text-[#475569]">Jasa Aktif</span>
                <span className="text-2xl font-bold text-[#4338CA]">
                  {userServices.length}
                </span>
              </div>
              <div className="p-5 rounded-[20px] bg-white/70 border border-white shadow-xs flex flex-col gap-1">
                <span className="text-xs text-[#475569]">Proyek Tersedia</span>
                <span className="text-2xl font-bold text-[#0F766E]">
                  {activeProjectsCount}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* User Active Services / Portfolio */}
        <div className="flex flex-col gap-4 pt-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl sm:text-2xl font-bold text-[#0F172A]">
              Layanan Jasa yang Ditawarkan
            </h2>
            <Link
              href="/services"
              className="text-xs font-semibold text-[#4338CA] hover:underline"
            >
              Lihat Semua Jasa ↗
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
            {userServices.map((service) => (
              <ServiceCard key={`profile-service-${service.id}`} service={service} />
            ))}
          </div>
        </div>

        {/* Portofolio Terverifikasi Mahasiswa (Aliran DFD F1) */}
        <div className="flex flex-col gap-4 pt-6 border-t border-slate-200/70">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-bold text-[#0F172A]">
                Portofolio Terverifikasi Mahasiswa
              </h2>
              <span className="px-2.5 py-0.5 rounded-full bg-[#E8E7FC] text-[#4338CA] text-[11px] font-bold uppercase tracking-wider">
                Aliran DFD F1
              </span>
            </div>
            <span className="text-xs font-semibold text-[#475569]">
              {mockPortfolios.length} Karya Terverifikasi
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
            {mockPortfolios.map((portfolio) => (
              <GlassCard
                key={portfolio.id}
                className="p-6 rounded-[20px] bg-white/75 border border-white flex flex-col justify-between gap-4 hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col gap-2">
                  <div className="flex items-start justify-between gap-2">
                    <span className="px-3 py-1 rounded-full bg-slate-100 text-[#475569] text-xs font-semibold">
                      {portfolio.category}
                    </span>
                    {portfolio.isVerifiedWork && (
                      <VerifiedBadge
                        size="sm"
                        label="Karya Terverifikasi"
                        campusDomain="universitaspertamina.ac.id"
                      />
                    )}
                  </div>

                  <h3 className="text-lg font-bold text-[#0F172A] mt-1">
                    {portfolio.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#475569] leading-relaxed">
                    {portfolio.description}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs text-[#475569]">
                  <div className="flex items-center gap-2">
                    <svg
                      className="w-4 h-4 text-[#4338CA]"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                    </svg>
                    <span>{portfolio.fileUrl.split('/').pop()} · {portfolio.fileSize}</span>
                  </div>
                  <span>
                    {new Date(portfolio.uploadDate).toLocaleDateString('id-ID', {
                      month: 'short',
                      year: 'numeric',
                    })}
                  </span>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>

      </div>
    </main>
  );
}

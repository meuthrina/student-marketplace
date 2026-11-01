import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { GlassCard } from '@/components/ui/GlassCard';
import { Badge } from '@/components/ui/Badge';
import { CreateProjectForm } from '@/components/features/client/CreateProjectForm';

export const metadata: Metadata = {
  title: 'Publikasikan Proyek | Studance Klien',
  description: 'Pasang kebutuhan proyek baru dan rekrut talenta mahasiswa terverifikasi Universitas Pertamina.',
};

/**
 * CreateProjectPage (React Server Component)
 *
 * Halaman Server Component untuk alur penerbitan proyek Klien (DFD F3).
 * Menjalankan render kerangka utama, breadcrumb, dan panduan di sisi server,
 * serta mendelegasikan formulir interaktif ke Client Component `CreateProjectForm`.
 */
export default async function CreateProjectPage() {
  return (
    <main className="w-full min-h-screen bg-[#F0F1FB] py-6 sm:py-8">
      <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-8">
        
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="text-xs text-[#78859D]">
          <ol className="flex items-center gap-2">
            <li>
              <Link href="/" className="hover:text-[#4338CA] transition-colors">
                Beranda
              </Link>
            </li>
            <li>/</li>
            <li>
              <Link href="/client/dashboard" className="hover:text-[#4338CA] transition-colors">
                Dashboard Klien
              </Link>
            </li>
            <li>/</li>
            <li className="font-semibold text-[#0F172A]">Buat Proyek Baru</li>
          </ol>
        </nav>

        {/* Page Header */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <Badge variant="default" size="sm" className="min-h-[28px]">
              Aliran DFD F3: Posting Proyek
            </Badge>
            <span className="text-xs font-semibold text-[#475569]">
              Formulir Klien
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-[#0F172A]">
            Publikasikan Kebutuhan Proyek Anda
          </h1>
          <p className="text-sm text-[#475569] max-w-2xl leading-relaxed">
            Tentukan ruang lingkup proyek, tetapkan anggaran dengan proteksi escrow, dan jangkau talenta mahasiswa terverifikasi Universitas Pertamina.
          </p>
        </div>

        {/* 2-Column Responsive Layout: Form (Client) + Guidance (Server) */}
        <div className="w-full grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_340px] gap-8 items-start">
          
          {/* Main Form (Client Leaf Component) */}
          <CreateProjectForm />

          {/* Right Guidance Sidebar (Server-rendered static info) */}
          <div className="flex flex-col gap-5">
            <GlassCard className="p-6 rounded-[22px] bg-white/75 border border-white flex flex-col gap-3 shadow-2xs">
              <span className="text-xs font-bold text-[#4338CA] uppercase tracking-wider">
                💡 Petunjuk Pasang Proyek
              </span>
              <ul className="space-y-2 text-xs text-[#475569] leading-relaxed">
                <li className="flex items-start gap-2">
                  <span className="text-[#4338CA] font-bold">1.</span>
                  <span><strong>Khusus Kampus:</strong> Centang opsi eksklusif Universitas Pertamina untuk menjamin pelamar adalah mahasiswa aktif dengan verifikasi email resmi.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#4338CA] font-bold">2.</span>
                  <span><strong>Proteksi Escrow:</strong> Anggaran ditampung di sistem penampung Studance sampai Anda puas dengan deliverables.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#4338CA] font-bold">3.</span>
                  <span><strong>Batas Waktu:</strong> Berikan waktu pengerjaan yang wajar agar kualitas pekerjaan mahasiswa optimal.</span>
                </li>
              </ul>
            </GlassCard>

            <GlassCard className="p-6 rounded-[22px] bg-gradient-to-br from-[#EEF2FF] to-[#E0E7FF] border border-indigo-200/60 flex flex-col gap-2 shadow-2xs">
              <span className="text-xs font-bold text-[#3730A3]">
                Aliran Data Diagram (DFD Level 0)
              </span>
              <p className="text-xs text-[#4338CA] leading-relaxed">
                Formulir ini mengeksekusi <strong>Aliran DFD F3 (Data Kebutuhan Proyek)</strong> yang disimpan dan dipublikasikan ke katalog penawaran mahasiswa.
              </p>
            </GlassCard>
          </div>

        </div>

      </div>
    </main>
  );
}

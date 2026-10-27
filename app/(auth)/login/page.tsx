import React from 'react';
import Link from 'next/link';
import { GlassCard } from '@/components/ui/GlassCard';
import { Badge } from '@/components/ui/Badge';
import { LoginForm } from '@/components/features/auth/LoginForm';

export const metadata = {
  title: 'Masuk | Studance — Marketplace Mahasiswa Terverifikasi',
  description:
    'Akses platform kolaborasi, proyek industri, dan jasa profesional mahasiswa Universitas Pertamina.',
};

/**
 * Halaman Masuk Akun (Figma Node 11:644)
 * Menampilkan antarmuka otentikasi terpusat dengan ikon perisai keamanan dan LoginForm.
 */
export default function LoginPage() {
  return (
    <main className="w-full min-h-screen bg-[#F0F1FB] py-10 sm:py-16 flex items-center justify-center">
      <div className="w-full max-w-md mx-auto px-4 flex flex-col gap-6">
        
        {/* Header Branding dengan Ikon Perisai */}
        <div className="flex flex-col items-center text-center gap-2.5">
          <Link href="/" className="inline-flex items-center gap-2 group">
            <span className="text-2xl sm:text-3xl font-black tracking-tight text-[#4338CA] group-hover:text-[#3730A3] transition-colors">
              Studance<span className="text-emerald-500">.</span>
            </span>
          </Link>

          {/* Ikon Perisai Keamanan (Figma Spec) */}
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#EEF2FF] to-[#E0E7FF] border border-indigo-200/80 flex items-center justify-center text-[#4338CA] shadow-2xs mt-1">
            <svg
              className="w-6 h-6"
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
          </div>

          <div className="flex items-center gap-2">
            <Badge variant="default" size="sm" className="min-h-[26px]">
              Otentikasi Klien & Mahasiswa
            </Badge>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#0F172A]">
            Masuk ke Studance
          </h1>
          <p className="text-xs sm:text-sm text-[#475569] max-w-sm leading-relaxed">
            Akses platform kolaborasi, kelola posting proyek, dan tawarkan talenta terverifikasi Universitas Pertamina.
          </p>
        </div>

        {/* Card Formulir Masuk */}
        <GlassCard className="p-6 sm:p-8 rounded-[24px] bg-white/90 border border-white shadow-sm flex flex-col gap-5">
          <LoginForm />
        </GlassCard>

        {/* Kembali ke Beranda */}
        <div className="text-center text-xs text-[#78859D]">
          <Link href="/" className="hover:text-[#4338CA] transition-colors font-medium">
            &larr; Kembali ke Beranda Utama
          </Link>
        </div>

      </div>
    </main>
  );
}

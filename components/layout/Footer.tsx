'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export const Footer: React.FC = () => {
  const pathname = usePathname();

  if (pathname === '/') {
    return null;
  }

  if (pathname.startsWith('/projects/') || pathname.startsWith('/services/')) {
    return (
      <footer className="w-full border-t border-[var(--color-border)] bg-[var(--color-surface-soft)] px-5 py-3 text-xs leading-relaxed text-[var(--color-text-muted)] sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl space-y-1">
          <p className="font-semibold text-[var(--color-primary)]">MVP - View 1 - FR01 - discovery</p>
          <p>Contoh statis. Filter keyword, kategori, anggaran, dan kampus perlu diimplementasi. Semua Kampus = seluruh katalog MVP Universitas Pertamina.</p>
          <p>© 2026 Studance - Universitas Pertamina. Seluruh hak cipta dilindungi.</p>
        </div>
      </footer>
    );
  }

  return (
    <footer
      aria-label="Penutup Halaman dan Informasi Hak Cipta"
      className="w-full mt-16 pb-24 md:pb-12 px-4 sm:px-6 lg:px-8 border-t border-[var(--color-border)] bg-[var(--color-surface-muted)]"
    >
      <div className="mx-auto max-w-7xl space-y-8 pb-6 pt-10">
        {/* 1. Trust Engine Feature Block ("Kolaborasi dengan Kepercayaan") */}
        <div className="glass-card p-6 sm:p-8 rounded-[var(--radius-xl)] space-y-4">
          <div className="space-y-2">
            <h2 className="text-lg sm:text-xl font-bold tracking-tight text-[var(--color-text-primary)]">
              Kolaborasi dengan Kepercayaan
            </h2>
            <p className="text-xs sm:text-sm text-[var(--color-text-secondary)] leading-relaxed max-w-3xl">
              Identitas kampus terverifikasi, lingkup proyek transparan, dan portofolio terikat dengan hasil kerja yang jelas untuk keamanan dan kenyamanan bertransaksi.
            </p>
          </div>

          {/* Feature Pills */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="text-[0.75rem] font-semibold text-[var(--color-teal)] bg-[var(--color-success-bg)] px-3 py-1 rounded-full border border-[rgba(15,146,149,0.2)]">
              Verified Student
            </span>
            <span className="text-[0.75rem] font-semibold text-[var(--color-primary)] bg-[var(--color-info-bg)] px-3 py-1 rounded-full border border-[rgba(98,82,204,0.2)]">
              Public / Campus-Specific
            </span>
            <span className="text-[0.75rem] font-semibold text-[var(--color-amber)] bg-[var(--color-warning-bg)] px-3 py-1 rounded-full border border-[rgba(245,160,0,0.2)]">
              Portofolio Terverifikasi
            </span>
          </div>
        </div>

        {/* 2. Main Navigation & Links Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 pt-4">
          {/* Brand & Platform Info */}
          <div className="space-y-3">
            <Link
              href="/"
              className="inline-block font-extrabold text-2xl tracking-tight"
              aria-label="Studance Beranda"
            >
              <span className="bg-brand-gradient bg-clip-text text-transparent">
                studance
              </span>
            </Link>
            <p className="text-xs text-[var(--color-text-secondary)] leading-normal">
              Marketplace talenta dan jasa profesional mahasiswa terverifikasi. Menghubungkan potensi akademik dengan kebutuhan industri.
            </p>
          </div>

          {/* Quick Navigation Links */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-primary)]">
              Navigasi Platform
            </h3>
            <ul className="space-y-2 text-xs font-medium text-[var(--color-text-secondary)]">
              <li>
                <Link href="/projects" className="hover:text-[var(--color-primary)] transition-colors">
                  Eksplorasi Proyek
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-[var(--color-primary)] transition-colors">
                  Katalog Jasa Mahasiswa
                </Link>
              </li>
              <li>
                <Link href="/auth/verify-student" className="hover:text-[var(--color-primary)] transition-colors">
                  Verifikasi Identitas Kampus
                </Link>
              </li>
            </ul>
          </div>

          {/* Academic & Security Integration Notes */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-primary)]">
              Standar & Keamanan
            </h3>
            <ul className="space-y-2 text-xs text-[var(--color-text-secondary)]">
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-emerald)]"></span>
                <span>Aksesibilitas WCAG 2.2 AA</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary)]"></span>
                <span>Audit OWASP Top 10:2025</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-teal)]"></span>
                <span>Integritas HMAC OTP</span>
              </li>
            </ul>
          </div>

          {/* Pilot Institution */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-primary)]">
              Ekosistem Pilot
            </h3>
            <p className="text-xs text-[var(--color-text-secondary)]">
              Dikembangkan sebagai Pilot Project terintegrasi untuk mahasiswa Universitas Pertamina.
            </p>
            <span className="inline-block text-xs font-semibold text-[var(--color-primary)] bg-[var(--color-primary-light)] px-2.5 py-1 rounded-md">
              Pilot Version v0.1
            </span>
          </div>
        </div>

        {/* 3. Bottom Copyright */}
        <div className="border-t border-[var(--color-border)] pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[0.75rem] text-[var(--color-text-muted)]">
          <p>© 2026 Studance - Universitas Pertamina. Seluruh hak cipta dilindungi.</p>
          <div className="flex items-center gap-4">
            <span className="hover:text-[var(--color-text-primary)] transition-colors cursor-pointer">
              Privasi & PDP
            </span>
            <span>•</span>
            <span className="hover:text-[var(--color-text-primary)] transition-colors cursor-pointer">
              Syarat & Ketentuan
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
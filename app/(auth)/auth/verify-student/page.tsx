import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import { VerifyStudentWizard } from '@/components/features/auth/VerifyStudentWizard';

export const metadata: Metadata = {
  title: 'Verifikasi Mahasiswa Kampus | Studance',
  description:
    'Validasi identitas akademik mahasiswa aktif Universitas Pertamina via email .ac.id dan token OTP berbatas waktu 15 menit.',
};

/**
 * VerifyStudentPage (React Server Component)
 *
 * Halaman Server Component yang menyajikan wizard verifikasi email kampus dan OTP.
 * Komponen interaktif didelegasikan ke Client Leaf Component `VerifyStudentWizard`.
 */
export default async function VerifyStudentPage() {
  return (
    <main className="w-full min-h-screen bg-[#F0F1FB] py-6 sm:py-8">
      <Suspense
        fallback={
          <div className="mx-auto max-w-xl py-16 text-center text-xs font-bold text-[var(--color-text-muted)]">
            Memuat Halaman Verifikasi...
          </div>
        }
      >
        <VerifyStudentWizard />
      </Suspense>
    </main>
  );
}

import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Tentang | Studance — Student Freelance Marketplace',
  description: 'Mengenal ekosistem freelance mahasiswa terverifikasi kampus di Studance.',
};

export default function HalamanTentang() {
  return (
    <main id="konten" className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="rounded-3xl border border-slate-200 bg-white/70 p-8 shadow-sm backdrop-blur-md">
        <span className="inline-block rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">
          Tentang Studance
        </span>
        <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
          Jembatan Peluang Proyek Riil bagi Mahasiswa Kampus
        </h1>
        <p className="mt-4 text-base leading-relaxed text-slate-600">
          Studance adalah platform student freelance marketplace yang menghubungkan mahasiswa aktif pencari pengalaman kerja dan portofolio dengan klien, dosen, serta UMKM yang membutuhkan talenta terpercaya.
        </p>

        <div className="mt-8 grid gap-6 sm:grid-cols-2">
          <div className="rounded-2xl border border-slate-100 bg-slate-50/60 p-5">
            <h2 className="text-base font-semibold text-slate-900">🎓 Mahasiswa Terverifikasi</h2>
            <p className="mt-2 text-sm text-slate-600">
              Validasi status mahasiswa aktif menggunakan email domain kampus resmi dan token integritas kriptografi HMAC-SHA256.
            </p>
          </div>
          <div className="rounded-2xl border border-slate-100 bg-slate-50/60 p-5">
            <h2 className="text-base font-semibold text-slate-900">💼 Proyek Fleksibel</h2>
            <p className="mt-2 text-sm text-slate-600">
              Mendukung kompetisi proyek terbuka (Public Scope) maupun proyek khusus internal institusi (Campus-Specific Scope).
            </p>
          </div>
        </div>

        <div className="mt-8 flex items-center justify-between border-t border-slate-200/60 pt-6">
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
          >
            Jelajah Proyek
          </Link>
          <Link href="/" className="text-sm font-medium text-slate-500 hover:text-slate-800">
            ← Kembali ke Beranda
          </Link>
        </div>
      </div>
    </main>
  );
}
'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';

interface ProjectDetailErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
  retry?: () => void;
}

/**
 * Error Boundary Segmen Dinamis Detail Proyek (Pekan 7 PAW - Modul 7)
 * Menangkap galat tak terduga (misalnya galat database P2025 ketika data proyek telah dihapus di tab lain)
 * agar tidak menumpahkan stack trace mentah ke pengguna dan memfasilitasi rekonsiliasi state via retry().
 */
export default function ProjectDetailError({
  error,
  reset,
  retry,
}: ProjectDetailErrorProps) {
  useEffect(() => {
    // Mencatat detail galat pada konsol browser untuk keperluan audit debugging
    console.error('ProjectDetailError caught:', error);
  }, [error]);

  const handleRetry = () => {
    if (typeof retry === 'function') {
      retry();
    } else {
      reset();
    }
  };

  return (
    <div className="w-full min-h-[65vh] flex items-center justify-center px-4 bg-[#F0F1FB]">
      <div
        role="alert"
        aria-live="assertive"
        className="max-w-lg w-full rounded-[24px] border border-rose-200 bg-white/95 p-8 text-center shadow-lg backdrop-blur-md"
      >
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-50 text-rose-600 text-2xl font-bold mb-5 border border-rose-100">
          ⚠️
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
          Proyek Gagal Diproses
        </h2>
        <p className="mt-2.5 text-sm text-slate-600 leading-relaxed">
          Terjadi kendala saat memuat atau memutasi data proyek ini. Kemungkinan data telah dipindahkan,
          dihapus pada sesi lain, atau koneksi basis data mengalami gangguan sesaat.
        </p>

        {error.digest && (
          <div className="mt-4 p-3 bg-slate-50 rounded-xl border border-slate-200 text-left">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-1">
              Kode Rujukan (Error Digest):
            </span>
            <code className="font-mono text-xs text-rose-700 break-all select-all">
              {error.digest}
            </code>
          </div>
        )}

        <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            type="button"
            onClick={handleRetry}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold shadow-sm transition-all cursor-pointer"
          >
            Coba Lagi (Retry)
          </button>
          <Link
            href="/projects"
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold transition-all text-center"
          >
            Kembali ke Katalog
          </Link>
        </div>
      </div>
    </div>
  );
}

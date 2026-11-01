'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function ClientAreaError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log galat internal pada konsol pemantauan klien tanpa memaparkannya ke UI pengguna
    console.error('Client Management Error caught:', error);
  }, [error]);

  return (
    <div className="w-full min-h-[70vh] flex items-center justify-center px-4 bg-[#F0F1FB]">
      <div
        role="alert"
        aria-live="assertive"
        className="max-w-md w-full rounded-3xl border border-rose-200 bg-white p-8 text-center shadow-md"
      >
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-rose-50 text-rose-600 font-bold text-lg mb-4">
          !
        </div>
        <h2 className="text-xl font-bold text-slate-900">Kendala Area Manajemen Klien</h2>
        <p className="mt-2 text-sm text-slate-600">
          Terjadi kesalahan saat memproses data proyek atau dashboard klien. Silakan coba muat ulang atau kembali ke dashboard.
        </p>

        {error.digest && (
          <p className="mt-3 font-mono text-xs text-slate-400 bg-slate-50 p-2 rounded-lg border border-slate-100">
            Kode Referensi: {error.digest}
          </p>
        )}

        <div className="mt-6 flex flex-col sm:flex-row items-center gap-3">
          <button
            type="button"
            onClick={() => reset()}
            className="w-full rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 cursor-pointer"
          >
            Coba Muat Ulang
          </button>
          <Link
            href="/client/dashboard"
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-xs transition hover:bg-slate-50 text-center"
          >
            Ke Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}


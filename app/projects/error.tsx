'use client';

import { useEffect } from 'react';

export default function ProjectsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Tercatat pada konsol pemantauan klien
    console.error('Projects Error Boundary caught:', error);
  }, [error]);

  return (
    <div className="w-full min-h-[70vh] flex items-center justify-center px-4 bg-[#F0F1FB]">
      <div role="alert" className="max-w-md w-full rounded-3xl border border-rose-200 bg-white p-8 text-center shadow-md">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-rose-50 text-rose-600 font-bold text-lg mb-4">
          !
        </div>
        <h2 className="text-xl font-bold text-slate-900">Gagal Memuat Segmen Proyek</h2>
        <p className="mt-2 text-sm text-slate-600">
          Terjadi kendala teknis saat memproses data penawaran atau daftar proyek mahasiswa.
        </p>
        {error.digest && (
          <p className="mt-3 font-mono text-xs text-slate-400 bg-slate-50 p-2 rounded-lg border border-slate-100">
            Digest: {error.digest}
          </p>
        )}
        <button
          type="button"
          onClick={() => reset()}
          className="mt-6 w-full rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
        >
          Coba Muat Ulang
        </button>
      </div>
    </div>
  );
}
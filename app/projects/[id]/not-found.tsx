import Link from 'next/link';

export default function ProjectNotFound() {
  return (
    <main id="konten" className="w-full min-h-[75vh] flex items-center justify-center px-4 bg-[#F0F1FB]">
      <div className="max-w-md w-full rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-amber-50 text-amber-600 font-bold text-lg mb-4">
          ?
        </div>
        <h1 className="text-2xl font-bold text-slate-900">Proyek Tidak Ditemukan</h1>
        <p className="mt-2 text-sm text-slate-600">
          Proyek freelance mahasiswa yang Anda tuju mungkin telah kedaluwarsa, ditutup, atau ID tautan tidak terdaftar.
        </p>
        <Link
          href="/projects"
          className="mt-6 inline-block w-full rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
        >
          Kembali ke Katalog Proyek
        </Link>
      </div>
    </main>
  );
}
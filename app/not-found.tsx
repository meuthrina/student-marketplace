import Link from 'next/link';

export default function GlobalNotFound() {
  return (
    <main id="konten" className="w-full min-h-[75vh] flex items-center justify-center px-4 bg-[#F0F1FB]">
      <div className="max-w-md w-full rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <span className="text-6xl font-extrabold text-indigo-600">404</span>
        <h1 className="mt-4 text-2xl font-bold text-slate-900">Halaman Tidak Ditemukan</h1>
        <p className="mt-2 text-sm text-slate-600">
          Maaf, alamat URL yang Anda masukkan tidak ada pada ekosistem platform Studance.
        </p>
        <Link
          href="/"
          className="mt-6 inline-block w-full rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
        >
          Kembali ke Beranda
        </Link>
      </div>
    </main>
  );
}
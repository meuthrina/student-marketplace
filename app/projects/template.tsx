'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function ProjectsTemplate({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  // State ini otomatis ter-reset ke timestamp baru setiap kali segmen berubah rute
  const [sessionTime, setSessionTime] = useState<string>('');

  useEffect(() => {
    const timer = setTimeout(() => {
      setSessionTime(new Date().toLocaleTimeString());
    }, 0);
    return () => clearTimeout(timer);
    // Di sini nantinya terhubung ke Audit Log DFD F9 (T33)
  }, [pathname]);

  return (
    <div className="w-full animate-in fade-in duration-300">
      {/* Indikator Sesi Rute Aktif (Hanya muncul saat dev / verifikasi dokumen) */}
      <div className="bg-slate-900 text-slate-300 text-[11px] px-4 py-1.5 flex justify-between items-center font-mono border-b border-slate-800">
        <span>Rute Segmen: <strong className="text-emerald-400">{pathname}</strong></span>
        <span>Sesi Mount (Template): <strong className="text-amber-400">{sessionTime || 'Menginisialisasi...'}</strong></span>
      </div>
      {children}
    </div>
  );
}
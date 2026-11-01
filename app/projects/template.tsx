'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';

function RouteIndicator() {
  const pathname = usePathname();
  const [sessionTime, setSessionTime] = useState<string>('');

  useEffect(() => {
    const timer = setTimeout(() => {
      setSessionTime(new Date().toLocaleTimeString());
    }, 0);
    return () => clearTimeout(timer);
  }, [pathname]);

  return (
    <div className="bg-slate-900 text-slate-300 text-[11px] px-4 py-1.5 flex justify-between items-center font-mono border-b border-slate-800">
      <span>Rute Segmen: <strong className="text-emerald-400">{pathname}</strong></span>
      <span>Sesi Mount (Template): <strong className="text-amber-400">{sessionTime || 'Menginisialisasi...'}</strong></span>
    </div>
  );
}

export default function ProjectsTemplate({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-full animate-in fade-in duration-300">
      <Suspense fallback={<div className="bg-slate-900 text-slate-300 text-[11px] px-4 py-1.5 font-mono border-b border-slate-800">Memuat rute...</div>}>
        <RouteIndicator />
      </Suspense>
      {children}
    </div>
  );
}

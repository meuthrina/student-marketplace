import React, { Suspense } from 'react';
import Link from 'next/link';
import { mockServices } from '@/lib/mockData';
import { ServiceCard } from '@/components/features/services/ServiceCard';
import { GlassCard } from '@/components/ui/GlassCard';
import { Badge } from '@/components/ui/Badge';

/**
 * ServicesPage (React Server Component)
 *
 * Menampilkan katalog layanan dan keahlian mahasiswa terverifikasi.
 * Menggunakan arsitektur RSC siap integrasi Prisma ORM (Tugas 2) dan Suspense untuk searchParams.
 */
interface ServicesPageProps {
  searchParams?: Promise<{ cat?: string; q?: string }>;
}

async function ServicesCatalog({ searchParams }: ServicesPageProps) {
  const resolvedParams = searchParams ? await searchParams : {};
  const currentCat = resolvedParams.cat?.toLowerCase() || 'all';

  const categoryTabs = [
    { label: 'Semua Jasa', value: 'all', href: '/services' },
    { label: 'Web Development', value: 'web', href: '/services?cat=web' },
    { label: 'UI/UX Design', value: 'ui-ux', href: '/services?cat=ui-ux' },
    { label: 'Analisis Data', value: 'data', href: '/services?cat=data' },
  ];

  // Filter jasa berdasarkan parameter kategori di URL
  const services = mockServices.filter((service) => {
    if (currentCat === 'web') {
      return service.category.toLowerCase().includes('web');
    }
    if (currentCat === 'ui-ux' || currentCat === 'ui/ux') {
      return service.category.toLowerCase().includes('ui');
    }
    if (currentCat === 'data') {
      return service.category.toLowerCase().includes('data');
    }
    return true;
  });

  return (
    <>
      {/* Quick Filter Categories */}
      <div className="flex flex-wrap items-center gap-2">
        {categoryTabs.map((tab) => {
          const isActive = currentCat === tab.value;
          return (
            <Link
              key={tab.value}
              href={tab.href}
              className={`min-h-[44px] px-4 py-2.5 rounded-full text-xs font-semibold inline-flex items-center justify-center transition-colors ${
                isActive
                  ? 'bg-[#4338CA] text-white shadow-xs'
                  : 'bg-white/80 hover:bg-white text-[#475569] border border-[#D8DDEC]'
              }`}
            >
              {tab.label}
            </Link>
          );
        })}
      </div>

      {/* Services Grid (Adaptive Responsive 1-col mobile, 2-col tablet, 3-col desktop) */}
      {services.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
          {services.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      ) : (
        <GlassCard className="p-8 rounded-[24px] text-center bg-white/70 flex flex-col items-center gap-2">
          <p className="text-sm font-semibold text-[#0F172A]">Tidak ada jasa dengan kategori ini</p>
          <Link href="/services" className="text-xs text-[#4338CA] font-medium hover:underline">
            Lihat semua jasa
          </Link>
        </GlassCard>
      )}
    </>
  );
}

export default function ServicesPage({ searchParams }: ServicesPageProps) {
  return (
    <main className="w-full min-h-screen bg-[#F0F1FB] py-6 sm:py-8">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-8">
        
        {/* Page Header */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <Badge variant="default" size="sm" className="min-h-[32px]">
              Katalog Jasa Mahasiswa
            </Badge>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-[#0F172A]">
            Eksplorasi Jasa & Talenta Mahasiswa
          </h1>
          <p className="text-sm sm:text-base text-[#475569] max-w-2xl leading-relaxed">
            Dapatkan bantuan profesional langsung dari mahasiswa bertalenta dengan identitas kampus terverifikasi dan portofolio berkualitas.
          </p>
        </div>

        <Suspense
          fallback={
            <div className="w-full p-8 text-center text-xs text-[#475569]">
              Memuat katalog jasa...
            </div>
          }
        >
          <ServicesCatalog searchParams={searchParams} />
        </Suspense>

        {/* Call-to-Action for Students */}
        <GlassCard className="w-full p-6 sm:p-8 rounded-[24px] flex flex-col sm:flex-row items-center justify-between gap-6 bg-white/80">
          <div className="flex flex-col gap-2 text-center sm:text-left">
            <h2 className="text-xl sm:text-2xl font-bold text-[#0F172A]">
              Punya Keahlian? Tawarkan Jasa Anda di Studance
            </h2>
            <p className="text-sm text-[#475569] max-w-xl">
              Verifikasi akun mahasiswa Anda dan mulailah menerima proyek dari sesama civitas akademika maupun klien industri.
            </p>
          </div>

          <Link
            href="/auth/verify-student"
            className="min-h-[48px] px-6 rounded-full bg-[#4338CA] hover:bg-[#3730A3] text-white font-bold text-sm inline-flex items-center justify-center shrink-0 shadow-md transition-colors"
          >
            Verifikasi Mahasiswa Sekarang
          </Link>
        </GlassCard>

      </div>
    </main>
  );
}

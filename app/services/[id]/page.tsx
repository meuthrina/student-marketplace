import React, { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { mockServices } from '@/lib/mockData';
import { ServiceDetailClient } from '@/components/features/services/ServiceDetailClient';

interface ServiceDetailPageProps {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  return mockServices.map((s) => ({
    id: s.id,
  }));
}

async function ServiceDetailFetcher({ params }: ServiceDetailPageProps) {
  const { id } = await params;

  // Server-side lookup (nantinya: await prisma.service.findUnique({ where: { id } }))
  const service = mockServices.find((item) => item.id === id);

  if (!service) {
    notFound();
  }

  return <ServiceDetailClient service={service} />;
}

/**
 * ServiceDetailPage (React Server Component)
 *
 * Mengambil data detail jasa mahasiswa secara asynchronous di sisi server untuk persiapan integrasi Prisma ORM,
 * lalu merender Client Component interaktif `ServiceDetailClient` di dalam Suspense boundary.
 */
export default function ServiceDetailPage(props: ServiceDetailPageProps) {
  return (
    <main className="w-full min-h-screen">
      <Suspense
        fallback={
          <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-16 text-center text-sm font-medium text-[#78859D]">
            Memuat detail jasa mahasiswa...
          </div>
        }
      >
        <ServiceDetailFetcher {...props} />
      </Suspense>
    </main>
  );
}

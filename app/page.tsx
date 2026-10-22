import React, { Suspense } from 'react';
import { mockProjects, mockServices } from '@/lib/mockData';
import { HomeClientCatalog } from '@/components/features/home/HomeClientCatalog';

/**
 * HomePage (React Server Component)
 *
 * Mengambil data awal secara asynchronous di sisi server untuk persiapan integrasi Prisma ORM,
 * kemudian meneruskan data awal (initial data) ke Client Component terpisah.
 */
export default async function HomePage() {
  // Simulasi fetch server-side (nantinya: await prisma.project.findMany(...))
  const initialProjects = mockProjects;
  const initialServices = mockServices;

  return (
    <main className="w-full min-h-screen">
      <Suspense
        fallback={
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center text-sm font-medium text-[#78859D]">
            Memuat katalog Studance...
          </div>
        }
      >
        <HomeClientCatalog
          initialProjects={initialProjects}
          initialServices={initialServices}
        />
      </Suspense>
    </main>
  );
}
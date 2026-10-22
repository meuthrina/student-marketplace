import React from 'react';
import { Project, ServiceOffering } from '@/types';
import { ProjectCard } from '@/components/features/projects/ProjectCard';
import { ServiceCard } from '@/components/features/services/ServiceCard';
import { GlassCard } from '@/components/ui/GlassCard';

interface CatalogResultsProps {
  activeTab: 'PROJECTS' | 'SERVICES';
  projects: Project[];
  services: ServiceOffering[];
  resultCount: number;
}

/**
 * CatalogResults Component
 *
 * Menampilkan tajuk hasil ("Proyek untuk Anda" / "{count} hasil")
 * serta grid 2-kolom pada tablet (Figma specs: 352px card width, 16px gap).
 */
export function CatalogResults({
  activeTab,
  projects,
  services,
  resultCount,
}: CatalogResultsProps) {
  return (
    <div className="w-full flex flex-col gap-4">
      {/* ── Section Title & Count ── */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg sm:text-[22px] font-semibold sm:leading-[28.6px] text-[#0F172A] m-0">
          {activeTab === 'PROJECTS' ? 'Proyek untuk Anda' : 'Jasa mahasiswa pilihan'}
        </h2>
        <span className="text-xs font-medium text-[#475569]">
          {resultCount} hasil
        </span>
      </div>

      {/* ── Grid: 1-col on mobile, 2-col on tablet (sm:grid-cols-2), 3-col on desktop (lg:grid-cols-3) ── */}
      {activeTab === 'PROJECTS' ? (
        projects.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        ) : (
          <EmptyState message="Tidak ada proyek yang sesuai filter pencarian" />
        )
      ) : services.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {services.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      ) : (
        <EmptyState message="Tidak ada jasa mahasiswa yang ditemukan" />
      )}
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <GlassCard className="p-8 text-center flex flex-col items-center justify-center gap-2 bg-white/70">
      <p className="text-sm font-bold text-[#0F172A] m-0">{message}</p>
      <p className="text-xs text-[#475569] m-0">
        Coba sesuaikan kata kunci, kategori, atau batas anggaran Anda.
      </p>
    </GlassCard>
  );
}

export default CatalogResults;

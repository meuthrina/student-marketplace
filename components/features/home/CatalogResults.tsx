import { Project, ServiceOffering } from '@/types';
import { ProjectCard } from '@/components/features/projects/ProjectCard';
import { ServiceCard } from '@/components/features/services/ServiceCard';

interface CatalogResultsProps {
  activeTab: 'PROJECTS' | 'SERVICES';
  projects: Project[];
  services: ServiceOffering[];
  resultCount: number;
}

export function CatalogResults({
  activeTab,
  projects,
  services,
  resultCount,
}: CatalogResultsProps) {
  return (
    <div className="min-w-0 flex-1">
      <div className="mb-2 flex items-center justify-between">
        <h2 className="text-sm font-bold text-[var(--color-text-primary)] sm:text-base">
          {activeTab === 'PROJECTS' ? 'Proyek untuk Anda' : 'Jasa mahasiswa pilihan'}
        </h2>
        <span className="text-[0.563rem] text-[var(--color-text-muted)]">{resultCount} hasil</span>
      </div>

      {activeTab === 'PROJECTS' ? (
        projects.length > 0 ? (
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        ) : (
          <EmptyState message="Tidak ada proyek yang sesuai filter pencarian" />
        )
      ) : services.length > 0 ? (
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      ) : (
        <EmptyState message="Tidak ada jasa mahasiswa yang ditemukan" />
      )}

      {activeTab === 'PROJECTS' && services.length > 0 && (
        <section className="mt-5 hidden space-y-2 lg:block" aria-labelledby="desktop-services-heading">
          <div className="flex items-center justify-between">
            <h2 id="desktop-services-heading" className="text-sm font-bold text-[var(--color-text-primary)]">
              Jasa mahasiswa pilihan
            </h2>
            <span className="text-[0.563rem] text-[var(--color-text-muted)]">Keahlian siap untuk membantu proyek Anda.</span>
          </div>
          <div className="grid grid-cols-2 gap-2 xl:grid-cols-3">
            {services.map((service) => (
              <ServiceCard key={`desktop-${service.id}`} service={service} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="glass-card space-y-2 rounded-[var(--radius-lg)] p-8 text-center">
      <p className="text-sm font-bold text-[var(--color-text-primary)]">{message}</p>
      <p className="text-xs text-[var(--color-text-muted)]">Coba sesuaikan kata kunci, kategori, atau batas anggaran Anda.</p>
    </div>
  );
}

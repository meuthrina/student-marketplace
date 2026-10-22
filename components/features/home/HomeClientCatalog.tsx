'use client';

import React from 'react';
import { Project, ServiceOffering } from '@/types';
import { HeroSection } from '@/components/features/home/HeroSection';
import { ScopeFilterBar } from '@/components/features/home/ScopeFilterBar';
import { CatalogResults } from '@/components/features/home/CatalogResults';
import { ServiceCard } from '@/components/features/services/ServiceCard';
import { GlassCard } from '@/components/ui/GlassCard';
import { Badge } from '@/components/ui/Badge';
import { useProjectFilter } from '@/hooks/useProjectFilter';

export interface HomeClientCatalogProps {
  initialProjects?: Project[];
  initialServices?: ServiceOffering[];
}

export function HomeClientCatalog({
  initialProjects,
  initialServices,
}: HomeClientCatalogProps) {
  const {
    setSearchQuery,
    selectedScope,
    setSelectedScope,
    budgetRange,
    setBudgetRange,
    selectedCategory,
    setSelectedCategory,
    activeTab,
    setActiveTab,
    filteredProjects,
    filteredServices,
    activeResultCount,
  } = useProjectFilter({
    initialProjects,
    initialServices,
  });

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-2 lg:pt-4 pb-12 flex flex-col gap-8">
      {/* 1. Hero Banner & Search Section */}
      <HeroSection
        onSearchChange={setSearchQuery}
        onCategorySelect={(cat) => {
          if (cat === 'PROJECTS') setActiveTab('PROJECTS');
          else if (cat === 'SERVICES') setActiveTab('SERVICES');
          else setSelectedCategory(cat);
        }}
        selectedCategory={activeTab === 'SERVICES' ? 'SERVICES' : selectedCategory}
      />

      {/* 2. Filter Glass Panel + Catalog Results (Desktop: side-by-side flex-row) */}
      <div className="w-full flex flex-col lg:flex-row lg:items-start gap-6">
        <div className="w-full lg:w-[280px] lg:shrink-0">
          <ScopeFilterBar
            selectedScope={selectedScope}
            onScopeChange={setSelectedScope}
            priceRange={budgetRange}
            onPriceRangeChange={setBudgetRange}
            showScopeControls={activeTab === 'PROJECTS'}
          />
        </div>

        <div className="w-full lg:flex-1 lg:min-w-0">
          <CatalogResults
            activeTab={activeTab}
            projects={filteredProjects}
            services={filteredServices}
            resultCount={activeResultCount}
          />
        </div>
      </div>

      {/* 3. Dedicated "Jasa mahasiswa pilihan" Section */}
      {activeTab === 'PROJECTS' && (
        <section
          aria-label="Rekomendasi Jasa Mahasiswa Pilihan"
          className="hidden lg:flex flex-col gap-4 w-full"
        >
          <div className="flex flex-col gap-1">
            <h2 className="text-[22px] font-semibold leading-[28.6px] text-[#0F172A] m-0">
              Jasa mahasiswa pilihan
            </h2>
            <p className="text-sm font-normal leading-[21px] text-[#475569] m-0">
              Keahlian siap pakai untuk membantu proyek Anda.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
            {filteredServices.slice(0, 3).map((service) => (
              <ServiceCard key={`desktop-featured-${service.id}`} service={service} />
            ))}
          </div>
        </section>
      )}

      {/* 4. Trust / Glass Panel */}
      <GlassCard className="w-full flex flex-col gap-4">
        <h2 className="text-[22px] font-semibold leading-[28.6px] text-[#0F172A] m-0">
          Kolaborasi dengan kepercayaan
        </h2>
        <p className="text-sm font-normal leading-[21px] text-[#475569] m-0">
          Identitas kampus terverifikasi, lingkup proyek transparan, dan portofolio dengan hasil kerja yang jelas.
        </p>

        {/* Category badges */}
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="default" size="sm" className="min-h-[32px]">
            Verified Student
          </Badge>
          <Badge variant="default" size="sm" className="min-h-[32px]">
            Public / Campus-Specific
          </Badge>
          <Badge variant="default" size="sm" className="min-h-[32px]">
            Portofolio terverifikasi
          </Badge>
        </div>

        <p className="text-xs font-medium text-[#475569] m-0">
          © 2026 Studance · Universitas Pertamina
        </p>
      </GlassCard>
    </div>
  );
}

export default HomeClientCatalog;

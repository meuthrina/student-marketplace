'use client';

import React, { useState, useMemo } from 'react';
import { HeroSection } from '@/components/features/home/HeroSection';
import { ScopeFilterBar } from '@/components/features/home/ScopeFilterBar';
import { CatalogResults } from '@/components/features/home/CatalogResults';
import { mockProjects, mockServices } from '@/lib/mockData';
import { ProjectScope } from '@/types';
import { filterProjects, filterServices } from '@/lib/catalog/filterCatalog';

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<'PROJECTS' | 'SERVICES'>('PROJECTS');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [selectedScope, setSelectedScope] = useState<'ALL' | ProjectScope>('ALL');
  const [priceRange, setPriceRange] = useState<[number, number]>([100000, 5000000]);

  // Filtering Logic Projects
  const filteredProjects = useMemo(() => {
    return filterProjects(mockProjects, {
      searchQuery,
      selectedCategory,
      selectedScope,
      maxPrice: priceRange[1],
    });
  }, [searchQuery, selectedCategory, selectedScope, priceRange]);

  // Filtering Logic Services
  const filteredServices = useMemo(() => {
    return filterServices(mockServices, {
      searchQuery,
      selectedCategory,
      selectedScope,
      maxPrice: priceRange[1],
    });
  }, [searchQuery, selectedCategory, selectedScope, priceRange]);

  const activeResultCount =
    activeTab === 'PROJECTS' ? filteredProjects.length : filteredServices.length;

  return (
    <div className="mx-auto max-w-[1160px] space-y-5 pb-8 sm:pb-12 lg:space-y-6">
      {/* 1. Hero Banner & Search Section */}
      <HeroSection
        onSearchChange={setSearchQuery}
        onCategorySelect={setSelectedCategory}
        selectedCategory={selectedCategory}
      />

      {/* 2. Main Tab Switcher & Filter Controls */}
      <div className="space-y-4 px-5 sm:px-6 lg:px-0">
        <div className="flex items-center justify-between">
          <div className="inline-flex rounded-full border border-[var(--color-border)] bg-[var(--color-surface-soft)] p-0.5">
            <button
              type="button"
              onClick={() => setActiveTab('PROJECTS')}
              className={`min-h-8 rounded-full px-3 text-[0.563rem] font-extrabold transition-all duration-150 sm:px-4 sm:text-xs ${
                activeTab === 'PROJECTS'
                  ? 'bg-[var(--color-primary)] text-white shadow-md'
                  : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
              }`}
            >
              Temukan Proyek
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('SERVICES')}
              className={`min-h-8 rounded-full px-3 text-[0.563rem] font-extrabold transition-all duration-150 sm:px-4 sm:text-xs ${
                activeTab === 'SERVICES'
                  ? 'bg-[var(--color-primary)] text-white shadow-md'
                  : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
              }`}
            >
              Jasa Mahasiswa
            </button>
          </div>
        </div>

        {/* Filter Control Bar */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start">
          <ScopeFilterBar
            selectedScope={selectedScope}
            onScopeChange={setSelectedScope}
            priceRange={priceRange}
            onPriceRangeChange={setPriceRange}
            showScopeControls={activeTab === 'PROJECTS'}
          />

          <CatalogResults
            activeTab={activeTab}
            projects={filteredProjects}
            services={filteredServices}
            resultCount={activeResultCount}
          />
        </div>

        <section className="space-y-1.5 pt-1" aria-labelledby="trust-heading">
          <h2 id="trust-heading" className="text-sm font-bold text-[var(--color-text-primary)] sm:text-base">
            Kolaborasi dengan kepercayaan
          </h2>
          <p className="text-[0.625rem] leading-relaxed text-[var(--color-text-secondary)]">
            Identitas kampus terverifikasi, lingkup proyek transparan, dan portofolio dengan hasil kerja yang jelas.
          </p>
          <div className="flex flex-wrap gap-1.5">
            <span className="rounded-full bg-[var(--color-success-bg)] px-2.5 py-1 text-[0.5rem] font-semibold text-[var(--color-teal)]">Verified Student</span>
            <span className="rounded-full bg-[var(--color-info-bg)] px-2.5 py-1 text-[0.5rem] font-semibold text-[var(--color-primary)]">Public / Campus-Specific</span>
            <span className="rounded-full bg-[var(--color-warning-bg)] px-2.5 py-1 text-[0.5rem] font-semibold text-[var(--color-amber)]">Portofolio terverifikasi</span>
          </div>
        </section>
      </div>
    </div>
  );
}
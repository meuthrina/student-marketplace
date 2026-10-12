import React from 'react';

interface HeroSectionProps {
  /** Callback saat kata kunci pencarian berubah */
  onSearchChange?: (query: string) => void;
  /** Callback saat tab kategori dipilih */
  onCategorySelect?: (category: string) => void;
  selectedCategory?: string;
}

/**
 * HeroSection Component
 *
 * Seksi banner utama beranda (FR-01) yang menampilkan proposisi nilai utama,
 * bilah pencarian interaktif, dan tag kategori cepat.
 * Mematuhi kriteria WCAG 2.2 AA (semantic section & accessible form control).
 */
export const HeroSection: React.FC<HeroSectionProps> = ({
  onSearchChange,
  onCategorySelect,
  selectedCategory = 'Semua',
}) => {
  const categories = [
    'Semua',
    'UI/UX',
    'Web Dev',
    'Mobile',
    'Data',
    'Content',
    'Translation',
  ];

  return (
    <section
      aria-label="Banner Utama dan Pencarian Marketplace"
      className="w-full px-5 pb-4 pt-4 sm:px-6 lg:px-0 lg:pt-2"
    >
      <div className="mx-auto max-w-[1160px] space-y-3">
        
        {/* Main Headline */}
        <div className="max-w-[820px] space-y-2">
          <h1 className="max-w-[700px] text-[1.55rem] font-extrabold leading-[1.05] tracking-tight text-[var(--color-text-primary)] sm:text-3xl lg:text-[2rem]">
            Talenta Mahasiswa Terverifikasi untuk Proyek Anda
          </h1>
          <p className="text-[0.688rem] leading-relaxed text-[var(--color-text-secondary)] sm:text-xs">
            Temukan kolaborator kampus. Ubah ide menjadi karya nyata bersama talenta terverifikasi.
          </p>
        </div>

        {/* Interactive Search Bar */}
        <div className="w-full max-w-[820px] space-y-2">
          <div className="relative">
            <label htmlFor="search-hero" className="sr-only">
              Cari proyek atau jasa mahasiswa
            </label>
            <input
              id="search-hero"
              type="text"
              placeholder="Cari kata kunci, keahlian, atau judul proyek..."
              onChange={(e) => onSearchChange?.(e.target.value)}
              className="glass-input w-full rounded-[var(--radius-md)] py-2.5 pl-9 pr-4 text-[0.688rem] shadow-sm"
            />
            <svg
              className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-text-muted)]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          {/* Quick Category Chips */}
          <div className="flex flex-wrap items-center gap-1.5" role="group" aria-label="Kategori Populer">
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => onCategorySelect?.(cat)}
                  aria-pressed={isSelected}
                  className={`rounded-full px-2.5 py-1 text-[0.563rem] font-semibold transition-all duration-150 ${
                    isSelected
                      ? 'bg-[var(--color-primary)] text-white shadow-sm'
                      : 'bg-[var(--color-surface)] text-[var(--color-text-secondary)] border border-[var(--color-border)] hover:bg-[var(--color-surface-soft)]'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
};

export default HeroSection;
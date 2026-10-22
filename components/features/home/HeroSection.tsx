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
 * Seksi banner utama beranda (FR-01) sesuai spesifikasi Figma Tablet (720px) & Mobile:
 * - Headline: Inter 700 36px / lh 43.2px, color #0F172A
 * - Subtitle: Inter 400 16px / lh 24px, color #475569
 * - Search field: Label 14px/400, Input 52px tall, p-14px, rounded-16px, border #D8DDEC
 * - Catalog switch: 31px pills, active #4338CA, inactive #E8E7FC
 * - Categories: 6 pills on single row on tablet (UI/UX, Web Dev, Mobile, Data, Content, Translation)
 *
 * Menggunakan Tailwind CSS murni, tanpa default style property inline.
 */
export const HeroSection: React.FC<HeroSectionProps> = ({
  onSearchChange,
  onCategorySelect,
  selectedCategory = 'Semua',
}) => {
  const categories = [
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
      className="w-full flex flex-col gap-4"
    >
      {/* ── Main Headline (36px/700/lh:43.2px, max 850px on desktop) ── */}
      <h1 className="w-full lg:max-w-[850px] text-[36px] font-bold leading-[43.2px] text-[#0F172A] m-0">
        Talenta Mahasiswa Terverifikasi untuk Proyek Anda
      </h1>

      {/* ── Description (16px/400/lh:24px) ── */}
      <p className="w-full text-base font-normal leading-6 text-[#475569] m-0">
        Temukan kolaborator kampus. Ubah ide menjadi karya nyata bersama talenta terverifikasi.
      </p>

      {/* ── Search Form Field (label + input, gap 8px) ── */}
      <div className="flex w-full flex-col gap-2">
        <label
          htmlFor="search-hero"
          className="text-sm font-normal leading-[21px] text-[#0F172A]"
        >
          Cari proyek atau jasa
        </label>

        <div className="relative w-full">
          <input
            id="search-hero"
            type="text"
            placeholder="⌕  Kata kunci, keahlian, atau judul"
            onChange={(e) => onSearchChange?.(e.target.value)}
            className="w-full h-[52px] px-[14px] py-[14px] rounded-[16px] bg-white border border-[#D8DDEC] text-sm text-[#0F172A] placeholder-[#475569] focus:outline-none focus:ring-2 focus:ring-[#4338CA]/20 focus:border-[#4338CA] transition-colors"
          />
        </div>
      </div>

      {/* ── Catalog Switch (Temukan Proyek / Jasa Mahasiswa) ── */}
      <div
        className="flex w-full items-center gap-2"
        role="group"
        aria-label="Pilih Katalog"
      >
        <button
          type="button"
          aria-pressed={selectedCategory !== 'SERVICES'}
          onClick={() => onCategorySelect?.('PROJECTS')}
          className={`min-h-[44px] px-4 py-2.5 rounded-full text-xs font-semibold inline-flex items-center whitespace-nowrap transition-colors cursor-pointer ${
            selectedCategory !== 'SERVICES'
              ? 'bg-[#4338CA] text-white shadow-xs'
              : 'bg-[#E8E7FC] text-[#4338CA] hover:bg-[#d8ddec]'
          }`}
        >
          Temukan Proyek
        </button>

        <button
          type="button"
          aria-pressed={selectedCategory === 'SERVICES'}
          onClick={() => onCategorySelect?.('SERVICES')}
          className={`min-h-[44px] px-4 py-2.5 rounded-full text-xs font-semibold inline-flex items-center whitespace-nowrap transition-colors cursor-pointer ${
            selectedCategory === 'SERVICES'
              ? 'bg-[#4338CA] text-white shadow-xs'
              : 'bg-[#E8E7FC] text-[#4338CA] hover:bg-[#d8ddec]'
          }`}
        >
          Jasa Mahasiswa
        </button>
      </div>

      {/* ── Category Chips (Single row on tablet, wraps on narrow screens) ── */}
      <div
        className="flex flex-wrap sm:flex-nowrap items-center gap-2 w-full"
        role="group"
        aria-label="Filter Kategori"
      >
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => onCategorySelect?.(cat)}
            className="min-h-[44px] px-4 py-2.5 rounded-full text-xs font-semibold bg-[#E8E7FC] text-[#4338CA] hover:bg-[#d8ddec] transition-colors inline-flex items-center whitespace-nowrap cursor-pointer"
          >
            {cat}
          </button>
        ))}
      </div>
    </section>
  );
};

export default HeroSection;
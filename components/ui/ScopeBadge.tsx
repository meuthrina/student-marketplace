import React from 'react';
import { ProjectScope } from '@/types';

export interface ScopeBadgeProps {
  /** Cakupan proyek: 'CAMPUS_SPECIFIC' atau 'PUBLIC' */
  scope: ProjectScope;
  /** Nama kampus target jika scope adalah 'CAMPUS_SPECIFIC', misal: "Universitas Pertamina" */
  targetCampus?: string;
  /** Ukuran visual badge: 'sm' untuk kartu/katalog, 'md' untuk detail proyek/modal */
  size?: 'sm' | 'md';
  /** Kustomisasi kelas Tailwind tambahan */
  className?: string;
}

/**
 * ScopeBadge Component
 *
 * Indikator visual cakupan aksesibilitas proyek (Eksklusif Kampus vs Publik).
 * Mematuhi standar aksesibilitas WCAG 2.2 AA (kontras warna & ARIA status)
 * serta menggunakan variabel CSS dari styles/globals.css.
 */
export const ScopeBadge: React.FC<ScopeBadgeProps> = ({
  scope,
  targetCampus,
  size = 'sm',
  className = '',
}) => {
  const isCampusSpecific = scope === 'CAMPUS_SPECIFIC';

  // Penyesuaian ukuran padding, font, dan ikon
  const sizeClasses =
    size === 'sm'
      ? 'px-2.5 py-1 text-[0.75rem] gap-1.5'
      : 'px-3.5 py-1.5 text-[0.875rem] gap-2';

  const iconSizes = size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4';

  // Label teks yang dinamis
  const displayLabel = isCampusSpecific
    ? `Campus-Specific: ${targetCampus || 'Kampus Khusus'}`
    : 'Public Project';

  return (
    <span
      role="status"
      aria-label={`Cakupan Proyek: ${displayLabel}`}
      className={`inline-flex max-w-full min-w-0 items-center font-medium rounded-[var(--radius-pill)] transition-all duration-150 border ${sizeClasses} ${className}`}
      style={{
        backgroundColor: isCampusSpecific
          ? 'var(--color-warning-bg)'
          : 'var(--color-info-bg)',
        color: isCampusSpecific
          ? 'var(--color-amber)'
          : 'var(--color-primary)',
        borderColor: isCampusSpecific
          ? 'rgba(245, 160, 0, 0.3)'
          : 'rgba(98, 82, 204, 0.25)',
      }}
    >
      {/* SVG Icon: Gembok Shield untuk Campus-Specific, Globe/Layers untuk Public */}
      {isCampusSpecific ? (
        <svg
          className={`${iconSizes} shrink-0`}
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-0.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z"
            clipRule="evenodd"
          />
        </svg>
      ) : (
        <svg
          className={`${iconSizes} shrink-0`}
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zM4.332 8.027a6.012 6.012 0 011.912-2.706C6.512 5.73 6.974 6 7.5 6A1.5 1.5 0 019 7.5V8a2 2 0 002 2h.5a.5.5 0 01.5.5v1.5a.5.5 0 01-.5.5h-2a.5.5 0 01-.5-.5v-.5a1 1 0 00-1-1H7.5a1.5 1.5 0 01-1.5-1.5v-.473z"
            clipRule="evenodd"
          />
        </svg>
      )}

      {/* Label Teks */}
      <span className="min-w-0 truncate font-semibold">{displayLabel}</span>
    </span>
  );
};

export default ScopeBadge;
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

  const sizeClasses =
    size === 'sm'
      ? 'px-3 py-[7px] text-xs gap-1.5'
      : 'px-3.5 py-2 text-sm gap-2';

  const displayLabel = isCampusSpecific
    ? `Campus-Specific: ${targetCampus || 'Universitas Pertamina'}`
    : 'Public Project';

  return (
    <span
      role="status"
      title={displayLabel}
      aria-label={`Cakupan Proyek: ${displayLabel}`}
      className={`inline-flex max-w-full min-w-0 items-center font-medium rounded-full overflow-hidden transition-all duration-150 ${sizeClasses} ${
        isCampusSpecific
          ? 'bg-[#FEF3C7] text-[#78350F]'
          : 'bg-[#DBEAFE] text-[#1E40AF]'
      } ${className}`}
    >
      {/* SVG Icon: shield-check as per Figma design system */}
      <svg
        className="w-4 h-4 shrink-0"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <path d="m9 12 2 2 4-4" />
      </svg>

      {/* Label Teks */}
      <span className="min-w-0 truncate">{displayLabel}</span>
    </span>
  );
};

export default ScopeBadge;
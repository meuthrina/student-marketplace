import React from 'react';

export type VerifiedBadgeSize = 'sm' | 'md';

export interface VerifiedBadgeProps {
  /** Domain kampus terverifikasi (opsional), misal: "universitaspertamina.ac.id" */
  campusDomain?: string;
  /** Ukuran visual badge: 'sm' untuk kartu/tabel/katalog, 'md' untuk detail proyek/modal */
  size?: VerifiedBadgeSize;
  /** Kustomisasi kelas Tailwind tambahan */
  className?: string;
  /** Teks label (default: "Verified Student") */
  label?: string;
}

/**
 * VerifiedBadge Component
 *
 * Indikator visual resmi identitas mahasiswa terverifikasi kampus.
 * Menggunakan standar warna konsisten:
 * - Background: #CFFAFE (Cyan 100)
 * - Teks & Ikon: #115E59 (Teal 800, WCAG 2.2 AA compliant)
 * - Border: #0F766E/20 (Teal 700 subtle border)
 * Serta atribut aksesibilitas semantik `role="status"` dan `aria-label`.
 */
export const VerifiedBadge: React.FC<VerifiedBadgeProps> = ({
  campusDomain,
  size = 'sm',
  className = '',
  label = 'Verified Student',
}) => {
  const sizeClasses =
    size === 'sm'
      ? 'px-3 py-[7px] text-xs gap-1.5'
      : 'px-3.5 py-2 text-sm gap-2';

  const iconSizes = size === 'sm' ? 'w-4 h-4' : 'w-4.5 h-4.5';

  const fullLabel = campusDomain
    ? `${label} (${campusDomain})`
    : label;

  return (
    <span
      role="status"
      aria-label="Mahasiswa Terverifikasi"
      title={fullLabel}
      className={`inline-flex max-w-full min-w-0 items-center font-medium rounded-full bg-[#CFFAFE] text-[#115E59] border border-[#0F766E]/20 transition-all select-none ${sizeClasses} ${className}`}
    >
      {/* SVG Icon: Shield with Checkmark (WCAG Semantic) */}
      <svg
        className={`${iconSizes} shrink-0 text-[#115E59]`}
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

      {/* Label Text */}
      <span className="min-w-0 truncate">
        {label}
        {campusDomain && (
          <span className="ml-1 font-normal opacity-80">
            ({campusDomain})
          </span>
        )}
      </span>
    </span>
  );
};

export default VerifiedBadge;
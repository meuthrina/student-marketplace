import React from 'react';

export interface VerifiedBadgeProps {
  /** Domain kampus terverifikasi (opsional), misal: "universitaspertamina.ac.id" */
  campusDomain?: string;
  /** Ukuran visual badge: 'sm' untuk kartu/tabel, 'md' untuk header/modal */
  size?: 'sm' | 'md';
  /** Kustomisasi kelas Tailwind tambahan */
  className?: string;
  /** Teks label khusus jika ingin mengganti default "Verified Student" */
  label?: string;
}

/**
 * VerifiedBadge Component
 *
 * Indikator visual status mahasiswa terverifikasi kampus.
 * Menggunakan prinsip WCAG 2.2 AA (kontras warna & SVG semantik)
 * serta token Liquid Glassmorphism dari styles/globals.css.
 */
export const VerifiedBadge: React.FC<VerifiedBadgeProps> = ({
  campusDomain,
  size = 'sm',
  className = '',
  label = 'Verified Student',
}) => {
  // Penyesuaian ukuran padding, font, dan ikon berdasarkan prop size
  const sizeClasses =
    size === 'sm'
      ? 'px-2.5 py-0.5 text-[0.75rem] gap-1'
      : 'px-3 py-1 text-[0.875rem] gap-1.5';

  const iconSizes = size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4';

  return (
    <span
      role="status"
      aria-label={`${label}${campusDomain ? ` - ${campusDomain}` : ''}`}
      className={`inline-flex min-w-0 max-w-full items-center font-medium rounded-[var(--radius-pill)] transition-all duration-150 border ${sizeClasses} ${className}`}
      style={{
        backgroundColor: 'var(--color-success-bg)',
        color: 'var(--color-teal)',
        borderColor: 'rgba(15, 146, 149, 0.25)',
      }}
    >
      {/* SVG Icon Checkmark Shield / Badge */}
      <svg
        className={`${iconSizes} shrink-0`}
        viewBox="0 0 20 20"
        fill="currentColor"
        aria-hidden="true"
      >
        <path
          fillRule="evenodd"
          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
          clipRule="evenodd"
        />
      </svg>

      {/* Label Teks */}
      <span className="min-w-0 truncate">
        {label}
        {campusDomain && (
          <span className="ml-1 inline-block max-w-[180px] truncate align-bottom font-normal opacity-80 sm:max-w-[220px]">
            ({campusDomain})
          </span>
        )}
      </span>
    </span>
  );
};

export default VerifiedBadge;
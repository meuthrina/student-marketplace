'use client';

import React, { useState } from 'react';

export type AvatarSize = 'sm' | 'md' | 'lg' | 'xl';

export interface AvatarProps {
  /** Inisial pengguna jika foto tidak tersedia (misal: "NP", "RA") */
  initials?: string;
  /** URL foto avatar pengguna */
  src?: string;
  /** Teks alternatif untuk pembaca layar (screen reader) */
  alt?: string;
  /** Ukuran avatar: sm (32px), md (44px), lg (48px), xl (64px) */
  size?: AvatarSize;
  /** Apakah mahasiswa telah terverifikasi kampus (menampilkan badge centang hijau) */
  verified?: boolean;
  /** Kelas Tailwind tambahan */
  className?: string;
}

const sizeStyles: Record<AvatarSize, { container: string; text: string; badge: string; icon: string }> = {
  sm: {
    container: 'w-8 h-8',
    text: 'text-xs',
    badge: 'w-2.5 h-2.5 right-0 bottom-0 border-[1.5px]',
    icon: 'w-1.5 h-1.5',
  },
  md: {
    container: 'w-11 h-11',
    text: 'text-sm',
    badge: 'w-3.5 h-3.5 right-0 bottom-0 border-2',
    icon: 'w-2 h-2',
  },
  lg: {
    container: 'w-12 h-12',
    text: 'text-base',
    badge: 'w-4 h-4 right-0 bottom-0 border-2',
    icon: 'w-2.5 h-2.5',
  },
  xl: {
    container: 'w-16 h-16',
    text: 'text-[22px]',
    badge: 'w-5 h-5 right-0.5 bottom-0.5 border-2',
    icon: 'w-3 h-3',
  },
};

/**
 * Avatar Component
 *
 * Komponen avatar terstandarisasi untuk mahasiswa dan klien:
 * - Menampilkan gambar (`src`) dengan fallback otomatis ke inisial nama.
 * - Kontras rasio WCAG AA (#4338CA pada #E1DEFB).
 * - Indikator status verifikasi terintegrasi di pojok kanan bawah.
 */
export const Avatar: React.FC<AvatarProps> = ({
  initials,
  src,
  alt = 'Avatar Pengguna',
  size = 'md',
  verified = false,
  className = '',
}) => {
  const [imageError, setImageError] = useState(false);
  const selectedSize = sizeStyles[size] || sizeStyles.md;

  const displayInitials = initials
    ? initials.trim().slice(0, 2).toUpperCase()
    : alt
    ? alt
        .split(' ')
        .map((w) => w[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : 'U';

  const shouldRenderImage = Boolean(src && !imageError);

  return (
    <div
      className={`relative inline-flex shrink-0 items-center justify-center rounded-full select-none ${selectedSize.container} ${className}`}
    >
      {shouldRenderImage ? (
        <img
          src={src}
          alt={alt}
          onError={() => setImageError(true)}
          className="h-full w-full rounded-full object-cover border border-white"
        />
      ) : (
        <div
          aria-label={alt}
          className={`flex h-full w-full items-center justify-center rounded-full bg-[#E1DEFB] border border-white font-semibold text-[#4338CA] tracking-tight ${selectedSize.text}`}
        >
          {displayInitials}
        </div>
      )}

      {/* Indikator Verifikasi Kampus (Centang Hijau) */}
      {verified && (
        <span
          title="Mahasiswa Terverifikasi"
          aria-label="Mahasiswa Terverifikasi"
          className={`absolute flex items-center justify-center rounded-full bg-[#10B981] border-white text-white shadow-xs ${selectedSize.badge}`}
        >
          <svg
            className={`${selectedSize.icon} stroke-current`}
            viewBox="0 0 24 24"
            fill="none"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </span>
      )}
    </div>
  );
};

export default Avatar;

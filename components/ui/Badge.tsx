import React from 'react';

export type BadgeVariant = 'default' | 'success' | 'warning' | 'outline';
export type BadgeSize = 'sm' | 'md';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Gaya visual varian badge: default (indigo), success (cyan/teal), warning (amber), outline (neutral) */
  variant?: BadgeVariant;
  /** Ukuran badge: sm (kecil, 12px), md (sedang, 14px) */
  size?: BadgeSize;
  /** Kustomisasi kelas Tailwind tambahan */
  className?: string;
  children: React.ReactNode;
}

const variantStyles: Record<BadgeVariant, string> = {
  default: 'bg-[#E8E7FC] text-[#4338CA] border border-[#4338CA]/15',
  success: 'bg-[#CFFAFE] text-[#115E59] border border-[#0F766E]/20',
  warning: 'bg-[#FEF3C7] text-[#78350F] border border-amber-300/40',
  outline: 'bg-white/90 text-[#475569] border border-[#D8DDEC] shadow-2xs',
};

const sizeStyles: Record<BadgeSize, string> = {
  sm: 'px-2.5 py-1 text-xs gap-1.5',
  md: 'px-3.5 py-1.5 text-sm gap-2',
};

/**
 * Generic Badge Component
 *
 * Komponen lencana generik serbaguna untuk tag kategori, status, dan label singkat.
 */
export const Badge: React.FC<BadgeProps> = ({
  variant = 'default',
  size = 'sm',
  className = '',
  children,
  ...props
}) => {
  return (
    <span
      role="status"
      className={`inline-flex max-w-full min-w-0 items-center font-medium rounded-full transition-colors select-none ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      {...props}
    >
      <span className="truncate">{children}</span>
    </span>
  );
};

export default Badge;

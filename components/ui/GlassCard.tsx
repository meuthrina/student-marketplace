import React from 'react';

export interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Elemen konten di dalam kartu */
  children: React.ReactNode;
  /** Kustomisasi kelas Tailwind tambahan */
  className?: string;
  /** Fungsi handler saat kartu diklik */
  onClick?: () => void;
  /** Apakah efek bayangan hover & elevasi mikro diaktifkan */
  hoverEffect?: boolean;
  /** Tag elemen semantik yang digunakan (default: 'div') */
  as?: 'div' | 'article' | 'section';
}

/**
 * GlassCard Component
 *
 * Wrapper kontainer kartu modular dengan gaya Liquid Glassmorphism khas Studance.
 * Menggabungkan backdrop blur, border semi-transparan, radius 24px, dan bayangan lembut.
 */
export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className = '',
  onClick,
  hoverEffect = false,
  as: Component = 'div',
  ...props
}) => {
  const isInteractive = Boolean(onClick);

  return (
    <Component
      onClick={onClick}
      role={isInteractive ? 'button' : undefined}
      tabIndex={isInteractive ? 0 : undefined}
      onKeyDown={
        isInteractive
          ? (e: React.KeyboardEvent<HTMLDivElement>) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onClick?.();
              }
            }
          : undefined
      }
      className={`bg-white/65 backdrop-blur-[20px] border border-white rounded-[24px] p-5 shadow-[0_8px_24px_rgba(27,35,69,0.06)] ${
        hoverEffect
          ? 'hover:shadow-[0_16px_32px_rgba(27,35,69,0.12)] hover:-translate-y-0.5 transition-all duration-200'
          : 'transition-shadow duration-200'
      } ${isInteractive ? 'cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4338CA]' : ''} ${className}`}
      {...props}
    >
      {children}
    </Component>
  );
};

export default GlassCard;

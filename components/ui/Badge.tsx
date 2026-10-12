import React from 'react';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'primary' | 'success' | 'warning' | 'info' | 'muted';
  size?: 'sm' | 'md';
}

const variants = {
  primary: 'bg-[var(--color-primary-light)] text-[var(--color-primary)]',
  success: 'bg-[var(--color-success-bg)] text-[var(--color-teal)]',
  warning: 'bg-[var(--color-warning-bg)] text-[var(--color-amber)]',
  info: 'bg-[var(--color-info-bg)] text-[var(--color-primary)]',
  muted: 'bg-[var(--color-surface-soft)] text-[var(--color-text-secondary)]',
};

const sizes = {
  sm: 'px-2 py-0.5 text-[0.5rem]',
  md: 'px-3 py-1 text-[0.75rem]',
};

export function Badge({
  variant = 'primary',
  size = 'sm',
  className = '',
  ...props
}: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full font-medium ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    />
  );
}

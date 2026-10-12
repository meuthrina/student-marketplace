import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'gradient';
  size?: 'sm' | 'md';
}

const variants = {
  primary: 'bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-hover)]',
  secondary: 'bg-white text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-soft)]',
  gradient: 'bg-brand-gradient text-white hover:opacity-90',
};

const sizes = {
  sm: 'py-2.5 text-xs',
  md: 'py-3 text-xs',
};

export function Button({
  variant = 'primary',
  size = 'md',
  className = '',
  ...props
}: ButtonProps) {
  return (
    <button
      className={`rounded-[var(--radius-pill)] font-bold shadow-md transition-all disabled:cursor-not-allowed disabled:bg-gray-300 ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    />
  );
}

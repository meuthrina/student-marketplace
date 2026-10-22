'use client';

import React from 'react';

export interface NavbarSearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const NavbarSearchBar: React.FC<NavbarSearchBarProps> = ({
  value,
  onChange,
  onSubmit,
}) => {
  return (
    <form
      onSubmit={onSubmit}
      className="hidden lg:flex flex-1 max-w-[748px] h-11 items-center gap-2.5 px-3.5 rounded-full bg-[#F0F1FB] border border-[#D8DDEC] focus-within:border-[#4338CA] focus-within:ring-2 focus-within:ring-[#4338CA]/15 transition-all"
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#475569"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        className="shrink-0"
      >
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
      <input
        type="text"
        aria-label="Cari talenta atau proyek"
        placeholder="Cari talenta atau proyek"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-transparent text-sm text-[#0F172A] placeholder-[#475569] focus:outline-none"
      />
    </form>
  );
};

export default NavbarSearchBar;

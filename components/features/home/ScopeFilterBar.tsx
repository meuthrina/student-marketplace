'use client';

import React from 'react';
import { ProjectScope } from '@/types';

interface ScopeFilterBarProps {
  selectedScope: 'ALL' | ProjectScope;
  onScopeChange: (scope: 'ALL' | ProjectScope) => void;
  priceRange: [number, number];
  onPriceRangeChange: (range: [number, number]) => void;
  showScopeControls?: boolean;
}

export const ScopeFilterBar: React.FC<ScopeFilterBarProps> = ({
  selectedScope,
  onScopeChange,
  priceRange,
  onPriceRangeChange,
  showScopeControls = true,
}) => {
  return (
    <div className="glass-card w-full space-y-4 rounded-[var(--radius-xl)] p-5 lg:w-[320px] lg:shrink-0 lg:self-start">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium leading-[1.4] text-[var(--color-text-primary)]">
          Filter pencarian
        </h2>
        <svg
          className="h-5 w-5 shrink-0 text-[var(--color-primary-hover)]"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          aria-hidden="true"
        >
          <path strokeLinecap="round" d="M4 6h16M4 12h16M4 18h16" />
          <path strokeLinecap="round" d="M8 4v4M16 10v4M10 16v4" />
        </svg>
      </div>

      <div className="space-y-1">
        <p className="text-xs font-medium leading-[1.4] text-[var(--color-text-secondary)]">
          Anggaran / harga mulai
        </p>
        <p className="text-base font-semibold leading-normal text-[var(--color-text-primary)]">
          Rp{priceRange[0].toLocaleString('id-ID')} – Rp{priceRange[1].toLocaleString('id-ID')}
        </p>
      </div>

      <div className="relative flex h-6 items-center">
        <div className="absolute left-2 right-2 h-1 rounded-full bg-[var(--color-primary-hover)]" />
        <span className="absolute left-0 h-5 w-5 rounded-full border-[3px] border-[var(--color-primary-hover)] bg-white" />
        <span className="pointer-events-none absolute right-0 h-5 w-5 rounded-full border-[3px] border-[var(--color-primary-hover)] bg-white" />
        <input
          type="range"
          min={100000}
          max={5000000}
          step={100000}
          value={priceRange[1]}
          onChange={(e) => onPriceRangeChange([priceRange[0], Number(e.target.value)])}
          className="relative z-10 h-6 w-full cursor-pointer appearance-none bg-transparent accent-[var(--color-primary-hover)]"
          aria-label="Atur Anggaran Maksimum"
        />
      </div>

      {showScopeControls && (
        <>
          <p className="text-xs font-medium leading-[1.4] text-[var(--color-text-secondary)]">
            Lingkup kampus
          </p>
          <div role="radiogroup" aria-label="Lingkup Kampus" className="flex flex-wrap gap-2">
            <button
              type="button"
              role="radio"
              aria-checked={selectedScope === 'ALL'}
              onClick={() => onScopeChange('ALL')}
              className={`rounded-full px-3 py-2 text-xs font-semibold transition-all duration-150 ${
                selectedScope === 'ALL'
                  ? 'bg-[var(--color-primary-hover)] text-white shadow-sm'
                  : 'bg-[var(--color-primary-light)] text-[var(--color-primary-hover)] hover:brightness-95'
              }`}
            >
              Semua Kampus
            </button>
            <button
              type="button"
              role="radio"
              aria-checked={selectedScope === 'CAMPUS_SPECIFIC'}
              onClick={() => onScopeChange('CAMPUS_SPECIFIC')}
              className={`rounded-full px-3 py-2 text-xs font-semibold transition-all duration-150 ${
                selectedScope === 'CAMPUS_SPECIFIC'
                  ? 'bg-[var(--color-primary-hover)] text-white shadow-sm'
                  : 'bg-[var(--color-primary-light)] text-[var(--color-primary-hover)] hover:brightness-95'
              }`}
            >
              Eksklusif Kampus Saya
            </button>
          </div>
          <p className="text-xs font-medium leading-[1.4] text-[var(--color-text-secondary)]">
            Katalog Universitas Pertamina
          </p>
        </>
      )}
    </div>
  );
};

export default ScopeFilterBar;

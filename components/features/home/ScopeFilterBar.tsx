'use client';

import React from 'react';
import { ProjectScope } from '@/types';
import { GlassCard } from '@/components/ui/GlassCard';

interface ScopeFilterBarProps {
  selectedScope: 'ALL' | ProjectScope;
  onScopeChange: (scope: 'ALL' | ProjectScope) => void;
  priceRange: [number, number];
  onPriceRangeChange: (range: [number, number]) => void;
  showScopeControls?: boolean;
  className?: string;
}

/**
 * ScopeFilterBar – Glass Filter Panel
 */
export const ScopeFilterBar: React.FC<ScopeFilterBarProps> = ({
  selectedScope,
  onScopeChange,
  priceRange,
  onPriceRangeChange,
  showScopeControls = true,
  className = '',
}) => {
  return (
    <GlassCard className={`w-full lg:w-[248px] lg:shrink-0 p-5 flex flex-col gap-4 bg-white/70 ${className}`}>
      {/* ── Heading: "Filter pencarian" + sliders icon ── */}
      <div className="flex items-center justify-between">
        <span className="text-lg font-medium text-[#0F172A]">
          Filter pencarian
        </span>
        {/* Sliders icon — stroke #4338CA, 20×20px */}
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#4338CA"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <line x1="4" y1="21" x2="4" y2="14" />
          <line x1="4" y1="10" x2="4" y2="3" />
          <line x1="12" y1="21" x2="12" y2="12" />
          <line x1="12" y1="8" x2="12" y2="3" />
          <line x1="20" y1="21" x2="20" y2="16" />
          <line x1="20" y1="12" x2="20" y2="3" />
          <line x1="1" y1="14" x2="7" y2="14" />
          <line x1="9" y1="8" x2="15" y2="8" />
          <line x1="17" y1="16" x2="23" y2="16" />
        </svg>
      </div>

      {/* ── Budget Controls (Min & Max Inputs + Range Slider) ── */}
      <div className="flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <label htmlFor="budget-min-input" className="text-xs font-medium text-[#475569]">
            Rentang Anggaran
          </label>
          <span className="text-xs font-semibold text-[#4338CA]">
            Rp{priceRange[0].toLocaleString('id-ID')} – Rp{priceRange[1].toLocaleString('id-ID')}
          </span>
        </div>

        {/* Dual Input Controls: Min & Max */}
        <div className="grid grid-cols-2 gap-2">
          <div className="flex flex-col gap-1">
            <label htmlFor="budget-min-input" className="text-xs font-medium text-[#78859D]">
              Batas Min
            </label>
            <div className="relative flex items-center">
              <span className="absolute left-2.5 text-xs text-[#78859D] font-medium select-none">
                Rp
              </span>
              <input
                id="budget-min-input"
                type="number"
                min={0}
                max={priceRange[1]}
                step={50000}
                value={priceRange[0]}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  onPriceRangeChange([Math.min(val, priceRange[1]), priceRange[1]]);
                }}
                className="w-full h-11 pl-7 pr-2 rounded-[10px] bg-white border border-[#D8DDEC] text-xs font-semibold text-[#0F172A] focus:outline-none focus:border-[#4338CA] focus:ring-1 focus:ring-[#4338CA]"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="budget-max-input" className="text-xs font-medium text-[#78859D]">
              Batas Maks
            </label>
            <div className="relative flex items-center">
              <span className="absolute left-2.5 text-xs text-[#78859D] font-medium select-none">
                Rp
              </span>
              <input
                id="budget-max-input"
                type="number"
                min={priceRange[0]}
                max={10000000}
                step={50000}
                value={priceRange[1]}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  onPriceRangeChange([priceRange[0], Math.max(val, priceRange[0])]);
                }}
                className="w-full h-11 pl-7 pr-2 rounded-[10px] bg-white border border-[#D8DDEC] text-xs font-semibold text-[#0F172A] focus:outline-none focus:border-[#4338CA] focus:ring-1 focus:ring-[#4338CA]"
              />
            </div>
          </div>
        </div>

        {/* Functional Max Range Slider */}
        <div className="flex flex-col gap-1 pt-1">
          <input
            id="budget-slider"
            type="range"
            min={100000}
            max={5000000}
            step={50000}
            value={priceRange[1]}
            onChange={(e) =>
              onPriceRangeChange([priceRange[0], Math.max(priceRange[0], Number(e.target.value))])
            }
            className="w-full h-2 bg-[#E2E8F0] rounded-full cursor-pointer accent-[#4338CA] focus:outline-none"
            aria-label="Atur Anggaran Maksimum Slider"
          />

          <div className="flex items-center justify-between text-xs text-[#78859D] px-0.5">
            <span>Min: Rp100 rb</span>
            <span>Maks: Rp5 jt</span>
          </div>
        </div>
      </div>

      {showScopeControls && (
        <>
          {/* ── Scope label ── */}
          <span className="text-xs font-medium text-[#475569]">
            Lingkup kampus
          </span>

          {/* ── Scope chips (stacked vertically on tablet as per Figma) ── */}
          <div
            className="flex flex-col items-start gap-3"
            role="radiogroup"
            aria-label="Lingkup Kampus"
          >
            <button
              type="button"
              role="radio"
              aria-checked={selectedScope === 'ALL'}
              onClick={() => onScopeChange('ALL')}
              className={`min-h-[44px] px-4 py-2.5 rounded-full text-xs font-semibold inline-flex items-center whitespace-nowrap transition-colors ${
                selectedScope === 'ALL'
                  ? 'bg-[#4338CA] text-white'
                  : 'bg-[#E8E7FC] text-[#4338CA] hover:bg-[#d8ddec]'
              }`}
            >
              Semua Kampus
            </button>

            <button
              type="button"
              role="radio"
              aria-checked={selectedScope === 'CAMPUS_SPECIFIC'}
              onClick={() => onScopeChange('CAMPUS_SPECIFIC')}
              className={`min-h-[44px] px-4 py-2.5 rounded-full text-xs font-semibold inline-flex items-center whitespace-nowrap transition-colors ${
                selectedScope === 'CAMPUS_SPECIFIC'
                  ? 'bg-[#4338CA] text-white'
                  : 'bg-[#E8E7FC] text-[#4338CA] hover:bg-[#d8ddec]'
              }`}
            >
              Eksklusif Kampus Saya
            </button>
          </div>

          {/* ── Footer label ── */}
          <span className="text-xs font-medium text-[#475569]">
            Katalog Universitas Pertamina
          </span>
        </>
      )}
    </GlassCard>
  );
};

export default ScopeFilterBar;

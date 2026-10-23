'use client';

import { useState, useMemo, useCallback, useRef } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { mockProjects, mockServices } from '@/lib/mockData';
import { Project, ServiceOffering, ProjectScope } from '@/types';
import { filterProjects, filterServices } from '@/lib/catalog/filterCatalog';

export type CatalogTab = 'PROJECTS' | 'SERVICES';

export interface UseProjectFilterReturn {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedScope: 'ALL' | ProjectScope;
  setSelectedScope: (scope: 'ALL' | ProjectScope) => void;
  budgetRange: [number, number];
  setBudgetRange: (range: [number, number]) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  activeTab: CatalogTab;
  setActiveTab: (tab: CatalogTab) => void;
  filteredProjects: Project[];
  filteredServices: ServiceOffering[];
  activeResultCount: number;
  resetFilters: () => void;
}

export interface UseProjectFilterOptions {
  initialProjects?: Project[];
  initialServices?: ServiceOffering[];
}

/**
 * useProjectFilter Custom Hook
 *
 * Mengelola state pencarian & filtering katalog Studance secara modular:
 * - Menyinkronkan kueri pencarian (q), cakupan kampus (scope), kategori (cat),
 *   rentang anggaran (min & max), serta tab aktif dengan URL Query Parameters.
 * - Menggunakan debounce ringkas saat mengupdate URL agar pengalaman mengetik tetap instan dan lancar.
 * - Menghasilkan daftar `filteredProjects` dan `filteredServices` secara reaktif.
 */
export function useProjectFilter(options?: UseProjectFilterOptions): UseProjectFilterReturn {
  const projectsData = options?.initialProjects ?? mockProjects;
  const servicesData = options?.initialServices ?? mockServices;

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Helper untuk membaca nilai awal dari searchParams
  const initialQuery = searchParams.get('q') ?? '';
  const initialCategory = searchParams.get('cat') ?? 'Semua';
  const rawScope = searchParams.get('scope');
  const initialScope: 'ALL' | ProjectScope =
    rawScope === 'CAMPUS_SPECIFIC' || rawScope === 'UP'
      ? 'CAMPUS_SPECIFIC'
      : rawScope === 'PUBLIC'
      ? 'PUBLIC'
      : 'ALL';

  const initialMin = searchParams.get('min') ? Number(searchParams.get('min')) : 100000;
  const initialMax = searchParams.get('max') ? Number(searchParams.get('max')) : 2000000;
  const initialTab: CatalogTab =
    searchParams.get('tab') === 'SERVICES' ? 'SERVICES' : 'PROJECTS';

  // State Lokal
  const [searchQuery, setSearchQueryState] = useState<string>(initialQuery);
  const [selectedCategory, setSelectedCategoryState] = useState<string>(initialCategory);
  const [selectedScope, setSelectedScopeState] = useState<'ALL' | ProjectScope>(initialScope);
  const [budgetRange, setBudgetRangeState] = useState<[number, number]>([initialMin, initialMax]);
  const [activeTab, setActiveTabState] = useState<CatalogTab>(initialTab);

  // Sync state lokal ketika searchParams di URL berubah dari luar (misal: browser Back/Forward atau Navbar)
  const currentParamsStr = searchParams.toString();
  const [prevParamsStr, setPrevParamsStr] = useState<string>(currentParamsStr);

  if (prevParamsStr !== currentParamsStr) {
    setPrevParamsStr(currentParamsStr);

    const q = searchParams.get('q') ?? '';
    if (q !== searchQuery) {
      setSearchQueryState(q);
    }

    const cat = searchParams.get('cat') ?? 'Semua';
    if (cat !== selectedCategory) {
      setSelectedCategoryState(cat);
    }

    const sc = searchParams.get('scope');
    const parsedScope: 'ALL' | ProjectScope =
      sc === 'CAMPUS_SPECIFIC' || sc === 'UP'
        ? 'CAMPUS_SPECIFIC'
        : sc === 'PUBLIC'
        ? 'PUBLIC'
        : 'ALL';
    if (parsedScope !== selectedScope) {
      setSelectedScopeState(parsedScope);
    }

    const min = searchParams.get('min') ? Number(searchParams.get('min')) : 100000;
    const max = searchParams.get('max') ? Number(searchParams.get('max')) : 2000000;
    if (min !== budgetRange[0] || max !== budgetRange[1]) {
      setBudgetRangeState([min, max]);
    }

    const tab = searchParams.get('tab') === 'SERVICES' ? 'SERVICES' : 'PROJECTS';
    if (tab !== activeTab) {
      setActiveTabState(tab);
    }
  }

  // Ref untuk debounce URL update
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  const updateUrlParams = useCallback(
    (updates: {
      q?: string;
      cat?: string;
      scope?: 'ALL' | ProjectScope;
      min?: number;
      max?: number;
      tab?: CatalogTab;
    }) => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      debounceTimerRef.current = setTimeout(() => {
        const params = new URLSearchParams(searchParams.toString());

        const targetQ = updates.q !== undefined ? updates.q : searchQuery;
        if (targetQ.trim()) params.set('q', targetQ.trim());
        else params.delete('q');

        const targetCat = updates.cat !== undefined ? updates.cat : selectedCategory;
        if (targetCat && targetCat !== 'Semua') params.set('cat', targetCat);
        else params.delete('cat');

        const targetScope = updates.scope !== undefined ? updates.scope : selectedScope;
        if (targetScope && targetScope !== 'ALL') {
          params.set('scope', targetScope === 'CAMPUS_SPECIFIC' ? 'UP' : targetScope);
        } else {
          params.delete('scope');
        }

        const targetMin = updates.min !== undefined ? updates.min : budgetRange[0];
        const targetMax = updates.max !== undefined ? updates.max : budgetRange[1];
        if (targetMin !== 100000) params.set('min', String(targetMin));
        else params.delete('min');
        if (targetMax !== 2000000) params.set('max', String(targetMax));
        else params.delete('max');

        const targetTab = updates.tab !== undefined ? updates.tab : activeTab;
        if (targetTab !== 'PROJECTS') params.set('tab', targetTab);
        else params.delete('tab');

        const queryString = params.toString();
        const targetUrl = queryString ? `${pathname}?${queryString}` : pathname;
        router.replace(targetUrl, { scroll: false });
      }, 250);
    },
    [router, pathname, searchParams, searchQuery, selectedCategory, selectedScope, budgetRange, activeTab]
  );

  // Handlers
  const setSearchQuery = useCallback(
    (query: string) => {
      setSearchQueryState(query);
      updateUrlParams({ q: query });
    },
    [updateUrlParams]
  );

  const setSelectedCategory = useCallback(
    (cat: string) => {
      setSelectedCategoryState(cat);
      updateUrlParams({ cat });
    },
    [updateUrlParams]
  );

  const setSelectedScope = useCallback(
    (scope: 'ALL' | ProjectScope) => {
      setSelectedScopeState(scope);
      updateUrlParams({ scope });
    },
    [updateUrlParams]
  );

  const setBudgetRange = useCallback(
    (range: [number, number]) => {
      setBudgetRangeState(range);
      updateUrlParams({ min: range[0], max: range[1] });
    },
    [updateUrlParams]
  );

  const setActiveTab = useCallback(
    (tab: CatalogTab) => {
      setActiveTabState(tab);
      updateUrlParams({ tab });
    },
    [updateUrlParams]
  );

  const resetFilters = useCallback(() => {
    setSearchQueryState('');
    setSelectedCategoryState('Semua');
    setSelectedScopeState('ALL');
    setBudgetRangeState([100000, 2000000]);
    setActiveTabState('PROJECTS');
    router.replace(pathname, { scroll: false });
  }, [router, pathname]);

  // Kalkulasi Hasil Filter untuk Projects
  const filteredProjects = useMemo(() => {
    return filterProjects(projectsData, {
      searchQuery,
      selectedCategory,
      selectedScope,
      minPrice: budgetRange[0],
      maxPrice: budgetRange[1],
    });
  }, [projectsData, searchQuery, selectedCategory, selectedScope, budgetRange]);

  // Kalkulasi Hasil Filter untuk Services
  const filteredServices = useMemo(() => {
    return filterServices(servicesData, {
      searchQuery,
      selectedCategory,
      selectedScope,
      minPrice: budgetRange[0],
      maxPrice: budgetRange[1],
    });
  }, [servicesData, searchQuery, selectedCategory, selectedScope, budgetRange]);

  const activeResultCount =
    activeTab === 'PROJECTS' ? filteredProjects.length : filteredServices.length;

  return {
    searchQuery,
    setSearchQuery,
    selectedScope,
    setSelectedScope,
    budgetRange,
    setBudgetRange,
    selectedCategory,
    setSelectedCategory,
    activeTab,
    setActiveTab,
    filteredProjects,
    filteredServices,
    activeResultCount,
    resetFilters,
  };
}

export default useProjectFilter;

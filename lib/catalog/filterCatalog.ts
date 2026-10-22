import { Project, ProjectScope, ServiceOffering } from '@/types';

export interface CatalogFilters {
  searchQuery: string;
  selectedCategory: string;
  selectedScope: 'ALL' | ProjectScope;
  minPrice?: number;
  maxPrice: number;
}

const includesQuery = (value: string, query: string) =>
  value.toLowerCase().includes(query.toLowerCase());

export function filterProjects(projects: Project[], filters: CatalogFilters) {
  return projects.filter((project) => {
    const matchesSearch =
      includesQuery(project.title, filters.searchQuery) ||
      includesQuery(project.description, filters.searchQuery) ||
      project.skillTags.some((tag) => includesQuery(tag, filters.searchQuery));
    const matchesCategory =
      filters.selectedCategory === 'Semua' ||
      includesQuery(project.category, filters.selectedCategory);
    const matchesScope =
      filters.selectedScope === 'ALL' || project.scope === filters.selectedScope;
    const matchesMinPrice =
      typeof filters.minPrice === 'number' ? project.budget >= filters.minPrice : true;
    const matchesMaxPrice = project.budget <= filters.maxPrice;

    return (
      matchesSearch &&
      matchesCategory &&
      matchesScope &&
      matchesMinPrice &&
      matchesMaxPrice
    );
  });
}

export function filterServices(services: ServiceOffering[], filters: CatalogFilters) {
  return services.filter((service) => {
    const matchesSearch =
      includesQuery(service.title, filters.searchQuery) ||
      includesQuery(service.description, filters.searchQuery);
    const matchesCategory =
      filters.selectedCategory === 'Semua' ||
      includesQuery(service.category, filters.selectedCategory);
    const matchesMinPrice =
      typeof filters.minPrice === 'number' ? service.price >= filters.minPrice : true;
    const matchesMaxPrice = service.price <= filters.maxPrice;

    return matchesSearch && matchesCategory && matchesMinPrice && matchesMaxPrice;
  });
}

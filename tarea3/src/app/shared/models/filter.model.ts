export type SearchCriterion = 'all' | 'title' | 'director' | 'producer' | 'genre' | 'year';

export type SortOption = 'year-desc' | 'year-asc' | 'rating-desc' | 'title-asc';

export interface FilterChip {
  id: string;
  label: string;
  filterValue: string;
}

import { signal } from '@angular/core';
import { Movie } from '../models/movie.model';
import { SearchCriterion } from '../models/filter.model';

import { initialMovies } from '../mocks/initial-movies';

const STORAGE_FAVORITES_KEY = 'streamov_user_favorites';

export class MovieService {
  public readonly movies = signal<Movie[]>(initialMovies);
  public readonly favorites = signal<string[]>(this.loadFavoritesFromStorage());
  public readonly searchQuery = signal<string>('');
  public readonly searchCriterion = signal<SearchCriterion>('all');
  public readonly selectedChip = signal<string>('all');

  public readonly featuredMovie = () => {
    return this.movies().find((m) => m.isFeatured) ?? this.movies()[0];
  };

  public favoriteMovies = () => {
    const favIds = new Set(this.favorites());
    return this.movies().filter((m) => favIds.has(m.id));
  };

  public readonly favoritesCount = () => this.favoriteMovies().length;

  private loadFavoritesFromStorage(): string[] {
    // if localStorage is not available, return default favorites
    const stored = localStorage.getItem(STORAGE_FAVORITES_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
    return ['dune-2', 'inception', 'interstellar'];
  }

  private persistFavorites(favs: string[]): void {
    localStorage.setItem(STORAGE_FAVORITES_KEY, JSON.stringify(favs));
  }

  public isFavorite(movieId: string): boolean {
    return this.favorites().includes(movieId);
  }

  public toggleFavorite(movieId: string): boolean {
    const current = this.favorites();
    let updated: string[];
    let nowActive = false;

    if (current.includes(movieId)) {
      updated = current.filter((id) => id !== movieId);
      nowActive = false;
    } else {
      updated = [...current, movieId];
      nowActive = true;
    }

    this.favorites.set(updated);
    this.persistFavorites(updated);
    return nowActive;
  }

  public clearFavorites(): void {
    this.favorites.set([]);
    this.persistFavorites([]);
  }

  public getMovieById(id: string): Movie | undefined {
    return this.movies().find((m) => m.id === id);
  }

  public setSearchQuery(query: string): void {
    this.searchQuery.set(query);
  }

  public setSearchCriterion(criterion: SearchCriterion): void {
    this.searchCriterion.set(criterion);
  }

  public setSelectedChip(chip: string): void {
    this.selectedChip.set(chip);
  }

  public resetFilters(): void {
    this.searchQuery.set('');
    this.searchCriterion.set('all');
    this.selectedChip.set('all');
  }
}

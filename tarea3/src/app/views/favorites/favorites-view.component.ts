import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MovieService } from '../../shared/services/movie.service';
import { ToastService } from '../../shared/services/toast.service';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { MovieCardComponent } from '../../shared/components/movie-card/movie-card.component';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';

type FavSort = 'year-desc' | 'year-asc' | 'rating-desc' | 'title-asc';

@Component({
  selector: 'app-favorites-view',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    NavbarComponent,
    MovieCardComponent,
    EmptyStateComponent,
  ],
  templateUrl: './favorites-view.component.html',
  styleUrl: './favorites-view.component.scss',
})
export class FavoritesViewComponent {
  public readonly movieService = inject(MovieService);
  private readonly toastService = inject(ToastService);

  public readonly filterTerm = signal<string>('');
  public readonly currentSort = signal<FavSort>('year-desc');

  readonly sortOptions: { value: FavSort; label: string }[] = [
    { value: 'year-desc', label: 'Año (más recientes)' },
    { value: 'year-asc', label: 'Año (más antiguas)' },
    { value: 'rating-desc', label: 'Mejor valoradas' },
    { value: 'title-asc', label: 'Título (A - Z)' },
  ];

  public readonly processedFavorites = computed(() => {
    let list = [...this.movieService.favoriteMovies()];
    const query = this.filterTerm().trim().toLowerCase();

    if (query) {
      list = list.filter(
        (m) =>
          m.title.toLowerCase().includes(query) ||
          m.director.toLowerCase().includes(query) ||
          m.genres.some((g) => g.toLowerCase().includes(query))
      );
    }

    const sort = this.currentSort();
    list.sort((a, b) => {
      switch (sort) {
        case 'year-asc':
          return a.year - b.year;
        case 'year-desc':
          return b.year - a.year;
        case 'rating-desc':
          return b.rating - a.rating;
        case 'title-asc':
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });

    return list;
  });

  onSearchChange(value: string): void {
    this.filterTerm.set(value);
  }

  clearSearchTerm(): void {
    this.filterTerm.set('');
  }

  onSortChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.currentSort.set(select.value as FavSort);
  }

  clearAllFavorites(): void {
    if (this.movieService.favoritesCount() === 0) return;
    this.movieService.clearFavorites();
    this.toastService.show('Se han vaciado todas tus películas favoritas', 'delete_sweep', 'info');
  }
}

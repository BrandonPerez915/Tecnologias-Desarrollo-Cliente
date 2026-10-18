import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MovieService } from '../../shared/services/movie.service';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { SearchBarComponent } from '../../shared/components/search-bar/search-bar.component';
import { FilterChipsComponent } from '../../shared/components/filter-chips/filter-chips.component';
import { HeroSpotlightComponent } from '../../shared/components/hero-spotlight/hero-spotlight.component';
import { MovieCardComponent } from '../../shared/components/movie-card/movie-card.component';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';

@Component({
  selector: 'app-catalog-view',
  standalone: true,
  imports: [
    CommonModule,
    NavbarComponent,
    SearchBarComponent,
    FilterChipsComponent,
    HeroSpotlightComponent,
    MovieCardComponent,
    EmptyStateComponent,
  ],
  templateUrl: './catalog-view.component.html',
  styleUrl: './catalog-view.component.scss',
})
export class CatalogViewComponent {
  public readonly movieService = inject(MovieService);

  get filteredMovies() {
    return this.movieService.filteredMovies();
  }

  get featuredMovie() {
    return this.movieService.featuredMovie();
  }

  resetAllFilters(): void {
    this.movieService.resetFilters();
  }
}

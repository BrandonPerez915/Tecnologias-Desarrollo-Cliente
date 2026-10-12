import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MovieService } from '../../services/movie.service';
import { SearchCriterion } from '../../models/filter.model';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './search-bar.component.html',
  styleUrl: './search-bar.component.scss',
})
export class SearchBarComponent {
  private readonly movieService = inject(MovieService);

  get query(): string {
    return this.movieService.searchQuery();
  }

  get criterion(): SearchCriterion {
    return this.movieService.searchCriterion();
  }

  onQueryChange(value: string): void {
    this.movieService.setSearchQuery(value);
  }

  onCriterionChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.movieService.setSearchCriterion(target.value as SearchCriterion);
  }

  clearSearch(): void {
    this.movieService.setSearchQuery('');
  }
}

import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MovieService } from '../../services/movie.service';
import { FilterChip } from '../../models/filter.model';

@Component({
  selector: 'app-filter-chips',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './filter-chips.component.html',
  styleUrl: './filter-chips.component.scss',
})
export class FilterChipsComponent {
  private readonly movieService = inject(MovieService);

  readonly chips: FilterChip[] = [
    { id: 'all', label: 'Todos', filterValue: 'all' },
    { id: 'sci-fi', label: 'Ciencia Ficción', filterValue: 'ciencia ficcion' },
    { id: 'drama', label: 'Drama', filterValue: 'drama' },
    { id: 'action', label: 'Acción', filterValue: 'accion' },
    { id: 'thriller', label: 'Suspense', filterValue: 'suspense' },
    { id: 'animation', label: 'Animación', filterValue: 'animacion' }
  ];

  get activeChip(): string {
    return this.movieService.selectedChip();
  }

  selectChip(filterValue: string): void {
    this.movieService.setSelectedChip(filterValue);
  }
}

import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MovieService } from '../../services/movie.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-favorite-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './favorite-button.component.html',
  styleUrl: './favorite-button.component.scss',
})
export class FavoriteButtonComponent {
  @Input({ required: true }) movieId!: string;
  @Input() movieTitle?: string;
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Input() variant: 'circle' | 'pill' = 'circle';

  private readonly movieService = inject(MovieService);
  private readonly toastService = inject(ToastService);

  public isAnimating = false;

  get isFavorite(): boolean {
    return this.movieService.isFavorite(this.movieId);
  }

  toggleFavorite(event: Event): void {
    event.preventDefault();
    event.stopPropagation();

    this.isAnimating = true;
    setTimeout(() => {
      this.isAnimating = false;
    }, 250);

    const isNowFav = this.movieService.toggleFavorite(this.movieId);
    const title = this.movieTitle ? `"${this.movieTitle}" ` : '';

    if (isNowFav) {
      this.toastService.show(`${title}agregada a Favoritos`, 'favorite', 'success');
    } else {
      this.toastService.show(`${title}eliminada de Favoritos`, 'heart_broken', 'info');
    }
  }
}

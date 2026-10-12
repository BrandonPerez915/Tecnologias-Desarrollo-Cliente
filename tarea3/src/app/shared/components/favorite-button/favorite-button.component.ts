import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

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

  public isFavorite = false;
  public isAnimating = false;

  toggleFavorite(event: Event): void {
    event.preventDefault();
    event.stopPropagation();

    this.isAnimating = true;
    setTimeout(() => {
      this.isAnimating = false;
      this.isFavorite = !this.isFavorite;
    }, 250);
  }
}

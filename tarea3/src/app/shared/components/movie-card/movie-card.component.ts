import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Movie } from '../../models/movie.model';
import { FavoriteButtonComponent } from '../favorite-button/favorite-button.component';
import { RatingBadgeComponent } from '../rating-badge/rating-badge.component';

@Component({
  selector: 'app-movie-card',
  standalone: true,
  imports: [CommonModule, RouterModule, FavoriteButtonComponent, RatingBadgeComponent],
  templateUrl: './movie-card.component.html',
  styleUrl: './movie-card.component.scss',
})
export class MovieCardComponent {
  @Input({ required: true }) movie!: Movie;
  @Input() layout: 'horizontal' | 'grid' | 'favorite' = 'horizontal';
  @Output() removeFavorite = new EventEmitter<string>();

  onRemoveClick(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.removeFavorite.emit(this.movie.id);
  }
}

import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Movie } from '../../models/movie.model';
import { FavoriteButtonComponent } from '../favorite-button/favorite-button.component';
import { RatingBadgeComponent } from '../rating-badge/rating-badge.component';

@Component({
  selector: 'app-hero-spotlight',
  standalone: true,
  imports: [CommonModule, RouterModule, FavoriteButtonComponent, RatingBadgeComponent],
  templateUrl: './hero-spotlight.component.html',
  styleUrl: './hero-spotlight.component.scss',
})
export class HeroSpotlightComponent {
  @Input({ required: true }) movie!: Movie;
}

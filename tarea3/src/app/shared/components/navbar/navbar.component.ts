import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { MovieService } from '../../services/movie.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent {
  @Input() pageTitle = 'Películas';
  @Input() showBackButton = false;

  private readonly router = inject(Router);
  public readonly movieService = inject(MovieService);

  get favoritesCount(): number {
    return this.movieService.favoritesCount();
  }

  goBack(): void {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      this.router.navigate(['/movies']);
    }
  }
}

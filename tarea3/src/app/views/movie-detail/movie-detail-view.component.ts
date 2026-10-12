import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { MovieService } from '../../shared/services/movie.service';
import { ToastService } from '../../shared/services/toast.service';
import { Movie } from '../../shared/models/movie.model';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { CastCardComponent } from '../../shared/components/cast-card/cast-card.component';
import { TechnicalSpecsComponent } from '../../shared/components/technical-specs/technical-specs.component';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';

@Component({
  selector: 'app-movie-detail-view',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    NavbarComponent,
    CastCardComponent,
    TechnicalSpecsComponent,
    EmptyStateComponent,
  ],
  templateUrl: './movie-detail-view.component.html',
  styleUrl: './movie-detail-view.component.scss',
})
export class MovieDetailViewComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  public readonly movieService = inject(MovieService);
  private readonly toastService = inject(ToastService);

  public readonly movie = signal<Movie | null>(null);
  public readonly isFavPulse = signal<boolean>(false);

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        const found = this.movieService.getMovieById(id);
        this.movie.set(found ?? null);
      }
    });
  }

  get isFavorite(): boolean {
    const current = this.movie();
    return current ? this.movieService.isFavorite(current.id) : false;
  }

  toggleFavorite(): void {
    const current = this.movie();
    if (!current) return;

    this.isFavPulse.set(true);
    setTimeout(() => this.isFavPulse.set(false), 250);

    const nowFav = this.movieService.toggleFavorite(current.id);
    if (nowFav) {
      this.toastService.show(`"${current.title}" agregada a Favoritos`, 'favorite', 'success');
    } else {
      this.toastService.show(`"${current.title}" eliminada de Favoritos`, 'heart_broken', 'info');
    }
  }

  shareMovie(): void {
    const current = this.movie();
    if (!current) return;

    if (navigator.share) {
      navigator
        .share({
          title: `${current.title} (${current.year})`,
          text: `Mira ${current.title} en Streamov Movie Catalog`,
          url: window.location.href,
        })
        .catch(() => {});
    } else {
      navigator.clipboard?.writeText(window.location.href);
      this.toastService.show('Enlace copiado al portapapeles', 'link', 'info');
    }
  }

  playTrailer(): void {
    const current = this.movie();
    if (!current) return;
    this.toastService.show(`Reproduciendo tráiler oficial de ${current.title}...`, 'play_circle', 'success');
  }

  downloadSpecs(): void {
    const current = this.movie();
    if (!current) return;
    this.toastService.show('Descargando ficha técnica oficial (PDF)...', 'download_done', 'success');
  }

  goBack(): void {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      this.router.navigate(['/movies']);
    }
  }
}

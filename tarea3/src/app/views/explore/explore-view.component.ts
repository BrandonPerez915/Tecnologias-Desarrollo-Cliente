import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { MovieService } from '../../shared/services/movie.service';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';

@Component({
  selector: 'app-explore-view',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent],
  templateUrl: './explore-view.component.html',
  styleUrl: './explore-view.component.scss',
})
export class ExploreViewComponent {
  public readonly movieService = inject(MovieService);
  private readonly router = inject(Router);

  readonly genreCategories = [
    { name: 'Ciencia Ficción', icon: 'rocket_launch', count: 4, filter: 'ciencia ficcion' },
    { name: 'Drama', icon: 'theater_comedy', count: 4, filter: 'drama' },
    { name: 'Acción', icon: 'local_fire_department', count: 3, filter: 'accion' },
    { name: 'Suspense', icon: 'psychology', count: 3, filter: 'suspense' },
    { name: 'Animación', icon: 'animation', count: 1, filter: 'animacion' },
  ];

  readonly featuredDirectors = [
    {
      name: 'Christopher Nolan',
      movies: ['Oppenheimer', 'Inception', 'Interstellar'],
      avatar:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuDclqH2X9o6VrbzasQFoO9fArALy3cWbYZYh223Ay_0xEEDttzZeQhKrsaCXjGDEY4iqxbUqqqBiMnw396xkGFq6oIChBEX8_bUZZvwtfSMiAivKeyc_JpS6F6jsFRTkZm0PM8jwvZiv00yZdRIwhMFmxtjENvYJfb55nj8rrNjW0XmG9hENZ-h22-hv3Uk0Zdg0Z7cmO4z9rly53SWwzK-TL_b6WtUhvXN4IFJYOm-bwk6RnQbjTI',
      filter: 'nolan',
    },
    {
      name: 'Denis Villeneuve',
      movies: ['Dune: Parte Dos'],
      avatar:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuDIC7lWjTpwcYYa1L5NvQC_euB7mOzpWCpmAHod99c8YEi9vwXzJdVHMCGDdkBv3nwKnQ16QDCA0VGUA9uQrEtWThT_Z1PVIW1UQD_n4HJ5PENaj7P-GBSl0sqVwgS7eFAw2vJKkb0Mp5q5TtGssseEBies_em2kodbfpv-eZJBvFf8iluNiSv9tx9_5qowWlEtGniAfUXpdWo7THizK2FKn94pwWno58qE4cxef9zJ4hZLJEe-Xyo',
      filter: 'denis villeneuve',
    },
    {
      name: 'Quentin Tarantino',
      movies: ['Pulp Fiction'],
      avatar:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuASy05JjI-9L-C1EV-TBmEGzmxOM8pGhxCQIc0TochyE5xFfHqVB4R3ttZur9C0oIng4Y-Qbr1Ggg8JsQkIw2fpQ6qs03Hbxkhpyx4c00V6R6FVROr86NE7f30hhh-Yg1-84x2IAILKQ6rAXRpCIdee1y-EssIBwC6CjnLgO5c791CaolBZIhRrlJQKMNric9v1nv_MYf4AODyNCvnmsX5k7hIcgU3T5NTVliRReM-p3jdVOSeM6UA',
      filter: 'quentin tarantino',
    },
    {
      name: 'Bong Joon-ho',
      movies: ['Parasite'],
      avatar:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuADQxi9MYQksONBlAFoffVaLffFxfH4cujCrJAxtOde3TiWmTa_AimwbwE3XCqvwQlysgmlCd7nicfyBuIwCHrofewtgIBIx6I5o1GxyG3pOEtEzWlg2D3-ZE-rvjf68TC5CoYoEvzZeJaogpV0l68J6VoEVmGFuRg6k33V5EBJogZbqbMTtjDbNO3RM_GfLQvJ8ewGlNadPtKl7f3DX9Bt8EAFJkHZ6kGnKadarghtUb-96AOBSW4',
      filter: 'bong joon-ho',
    },
  ];

  exploreByGenre(filter: string): void {
    this.movieService.setSelectedChip(filter);
    this.router.navigate(['/movies']);
  }

  exploreByDirector(director: string): void {
    this.movieService.setSearchQuery(director);
    this.movieService.setSearchCriterion('director');
    this.router.navigate(['/movies']);
  }
}

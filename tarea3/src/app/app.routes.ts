import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'movies',
    pathMatch: 'full',
  },
  {
    path: 'movies',
    loadComponent: () =>
      import('./views/catalog/catalog-view.component').then(
        (m) => m.CatalogViewComponent
      ),
  },
  {
    path: 'movies/:id',
    loadComponent: () =>
      import('./views/movie-detail/movie-detail-view.component').then(
        (m) => m.MovieDetailViewComponent
      ),
  },
  {
    path: 'favorites',
    loadComponent: () =>
      import('./views/favorites/favorites-view.component').then(
        (m) => m.FavoritesViewComponent
      ),
  },
  {
    path: 'explore',
    loadComponent: () =>
      import('./views/explore/explore-view.component').then(
        (m) => m.ExploreViewComponent
      ),
  },
  {
    path: '**',
    redirectTo: 'movies',
  },
];

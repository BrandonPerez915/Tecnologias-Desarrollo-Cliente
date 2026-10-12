import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'componentes',
    loadComponent: () =>
      import('./pages/components-preview/components-preview').then((m) => m.ComponentsPreview),
  },
  { path: '', redirectTo: 'componentes', pathMatch: 'full' },
];

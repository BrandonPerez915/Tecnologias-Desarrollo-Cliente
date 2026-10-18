import { Routes } from '@angular/router';
import { AppShell } from './layout/app-shell/app-shell';

export const routes: Routes = [
  {
    path: '',
    component: AppShell,
    children: [
      {
        path: 'componentes',
        title: 'ImeiHub · Componentes',
        loadComponent: () =>
          import('./pages/components-preview/components-preview').then((m) => m.ComponentsPreview),
      },
      { path: '', redirectTo: 'componentes', pathMatch: 'full' },
    ],
  },
  { path: '**', redirectTo: '' },
];

import { Injectable, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Notifications } from './notifications';

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  storeName: string;
  stallNumber: string;
}

const MOCK_USER: User = {
  id: 'usr_ada_okafor',
  name: 'Ada Okafor',
  email: 'ada.okafor@imeihub.com',
  role: 'Propietaria',
  storeName: 'SmartFix Celulares',
  stallNumber: 'A-18',
};

@Injectable({ providedIn: 'root' })
export class Auth {
  private readonly router = inject(Router);
  private readonly notifications = inject(Notifications);
  private readonly currentUser = signal<User | null>(MOCK_USER);

  readonly user = this.currentUser.asReadonly();
  readonly isAuthenticated = computed(() => this.currentUser() !== null);
  readonly initials = computed(() => {
    const parts = (this.currentUser()?.name ?? '').trim().split(/\s+/);
    return parts
      .slice(0, 2)
      .map((p) => p[0] ?? '')
      .join('')
      .toUpperCase();
  });

  logout() {
    this.currentUser.set(null);
    this.notifications.show('Sesión cerrada correctamente', 'neutral');
    this.router.navigate(['/login']);
  }
}

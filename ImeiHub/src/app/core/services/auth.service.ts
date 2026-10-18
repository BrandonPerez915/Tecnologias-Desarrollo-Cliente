import { Injectable, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { NotificationService } from './notification.service';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: string;
  storeName: string;
  stallNumber: string;
}

const DEFAULT_USER: AuthUser = {
  id: 'usr_ada_okafor',
  name: 'Ada Okafor',
  email: 'ada.okafor@imeihub.com',
  role: 'Propietaria',
  storeName: 'SmartFix Celulares',
  stallNumber: 'A-18'
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Purely in-memory session (no localStorage persistence)
  private userSignal = signal<AuthUser | null>(DEFAULT_USER);
  private tokenSignal = signal<string | null>('jwt_mock_token_imeihub_2026');

  user = this.userSignal.asReadonly();
  token = this.tokenSignal.asReadonly();
  isAuthenticated = computed(() => !!this.userSignal() && !!this.tokenSignal());

  constructor(
    private router: Router,
    private notify: NotificationService
  ) {}

  login(credentials: { email: string; password: string }): Promise<AuthUser> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const user: AuthUser = {
          id: 'usr_' + Date.now(),
          name: credentials.email.split('@')[0] || 'Ada Okafor',
          email: credentials.email,
          role: 'Propietaria',
          storeName: 'SmartFix Celulares',
          stallNumber: 'A-18'
        };
        const token = 'jwt_token_' + Math.random().toString(36).substring(2);

        this.userSignal.set(user);
        this.tokenSignal.set(token);
        this.notify.success(`¡Bienvenido de nuevo, ${user.name}!`);
        this.router.navigate(['/dashboard']);
        resolve(user);
      }, 300);
    });
  }

  register(data: { name: string; storeName: string; email: string; phone?: string; password: string }): Promise<AuthUser> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const user: AuthUser = {
          id: 'usr_' + Date.now(),
          name: data.name,
          email: data.email,
          role: 'Propietaria',
          storeName: data.storeName,
          stallNumber: 'A-18'
        };
        const token = 'jwt_token_' + Math.random().toString(36).substring(2);

        this.userSignal.set(user);
        this.tokenSignal.set(token);
        this.notify.success(`¡Cuenta creada para ${user.storeName}! Bienvenido, ${user.name}`);
        this.router.navigate(['/dashboard']);
        resolve(user);
      }, 300);
    });
  }

  logout() {
    this.userSignal.set(null);
    this.tokenSignal.set(null);
    this.notify.show('Sesión cerrada correctamente', 'neutral');
    this.router.navigate(['/login']);
  }
}

import { Injectable, signal, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { NotificationService } from './notification.service';
import { ApiService } from './api.service';
import { InventoryService } from './inventory.service';
import { CashService } from './cash.service';
import { LoansService } from './loans.service';
import { OrdersService } from './orders.service';
import { AuthResponse, AuthUser, JwtPayload, ROLE_LABELS, Role } from '../../types/auth';

export type { AuthUser } from '../../types/auth';

const STORAGE_KEY_TOKEN = 'imeihub_auth_token';
const DEFAULT_ROUTE = '/dashboard';

// Reads the payload of a JWT, the signature is validated by the API
function decodeToken(token: string): JwtPayload | null {
  try {
    const payload = token.split('.')[1];
    const json = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
    const decoded = JSON.parse(decodeURIComponent(escape(json))) as JwtPayload;
    return decoded?.sub && decoded?.exp ? decoded : null;
  } catch {
    return null;
  }
}

function isExpired(payload: JwtPayload): boolean {
  return payload.exp * 1000 <= Date.now();
}

function readStoredToken(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEY_TOKEN);
  } catch {
    return null;
  }
}

// Avoids open redirects, only internal paths are accepted
export function safeReturnUrl(url: string | null | undefined): string {
  if (!url || !url.startsWith('/') || url.startsWith('//')) return DEFAULT_ROUTE;
  if (url.startsWith('/login') || url.startsWith('/register')) return DEFAULT_ROUTE;
  return url;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private api = inject(ApiService);
  private router = inject(Router);
  private notify = inject(NotificationService);
  private inventoryService = inject(InventoryService);
  private cashService = inject(CashService);
  private loansService = inject(LoansService);
  private ordersService = inject(OrdersService);

  private tokenSignal = signal<string | null>(null);
  private userSignal = signal<AuthUser | null>(null);
  private expiryTimer: ReturnType<typeof setTimeout> | null = null;

  token = this.tokenSignal.asReadonly();
  user = this.userSignal.asReadonly();
  isAuthenticated = computed(() => !!this.tokenSignal() && !!this.userSignal());
  role = computed<Role | null>(() => this.userSignal()?.role ?? null);
  roleLabel = computed(() => {
    const role = this.role();
    return role ? ROLE_LABELS[role] : '';
  });

  constructor() {
    this.restoreSession();
  }

  hasRole(roles: Role | readonly Role[] | null | undefined): boolean {
    const current = this.role();
    if (!current) return false;
    if (!roles || (Array.isArray(roles) && roles.length === 0)) return true;
    return Array.isArray(roles) ? roles.includes(current) : roles === current;
  }

  login(credentials: { email: string; password: string }, returnUrl?: string | null): Promise<AuthUser> {
    return new Promise((resolve, reject) => {
      this.api.post<AuthResponse>('/auth/login', credentials).subscribe({
        next: (res) => {
          this.startSession(res);
          this.notify.success(`¡Bienvenido de nuevo, ${res.user.name}!`);
          this.router.navigateByUrl(safeReturnUrl(returnUrl));
          resolve(res.user);
        },
        error: (err) => reject(new Error(err?.message || 'Correo o contraseña incorrectos'))
      });
    });
  }

  register(data: {
    name: string;
    email: string;
    password: string;
    storeName?: string;
    stallNumber?: string;
    phone?: string;
  }): Promise<AuthUser> {
    return new Promise((resolve, reject) => {
      this.api.post<AuthResponse>('/auth/register', data).subscribe({
        next: (res) => {
          this.startSession(res);
          this.notify.success(`Cuenta de "${data.storeName || 'ImeiHub'}" creada con éxito`);
          this.router.navigateByUrl(DEFAULT_ROUTE);
          resolve(res.user);
        },
        error: (err) => reject(new Error(err?.message || 'No fue posible registrar la cuenta'))
      });
    });
  }

  logout(): void {
    this.clearSession();
    this.notify.info('Has cerrado sesión correctamente');
    this.router.navigate(['/login']);
  }

  // Called by the error interceptor on any 401 and by the expiry timer
  handleUnauthorized(message = 'Tu sesión expiró, inicia sesión de nuevo'): void {
    if (!this.tokenSignal()) return;

    const currentUrl = this.router.url;
    this.clearSession();
    this.notify.warning(message);
    this.router.navigate(['/login'], {
      queryParams: { returnUrl: safeReturnUrl(currentUrl), reason: 'expired' }
    });
  }

  private restoreSession(): void {
    const token = readStoredToken();
    if (!token) return;

    const payload = decodeToken(token);
    if (!payload || isExpired(payload)) {
      this.removeStoredToken();
      if (payload) {
        this.notify.warning('Tu sesión expiró, inicia sesión de nuevo');
      }
      return;
    }

    // The token already carries the user basics, /auth/me fills the rest
    this.tokenSignal.set(token);
    this.userSignal.set({
      id: payload.sub,
      name: payload.name,
      email: payload.email,
      role: payload.role,
      storeName: '',
      stallNumber: ''
    });
    this.scheduleExpiry(payload);

    // Deferred so the interceptors can inject this service once it is built
    queueMicrotask(() => this.loadProfile());
  }

  private loadProfile(): void {
    this.api.get<{ user: AuthUser }>('/auth/me').subscribe({
      next: (res) => {
        this.userSignal.set(res.user);
        this.refreshUserData();
      },
      error: () => {
        // 401 is handled by the error interceptor
      }
    });
  }

  private startSession(res: AuthResponse): void {
    this.tokenSignal.set(res.token);
    this.userSignal.set(res.user);
    try {
      localStorage.setItem(STORAGE_KEY_TOKEN, res.token);
    } catch {
      // Private mode, the session lives only in memory
    }
    const payload = decodeToken(res.token);
    if (payload) this.scheduleExpiry(payload);
    this.refreshUserData();
  }

  private scheduleExpiry(payload: JwtPayload): void {
    this.clearExpiryTimer();
    const remaining = payload.exp * 1000 - Date.now();
    // setTimeout overflows above ~24.8 days
    if (remaining > 2_147_483_647) return;
    this.expiryTimer = setTimeout(() => this.handleUnauthorized(), Math.max(remaining, 0));
  }

  private clearExpiryTimer(): void {
    if (this.expiryTimer !== null) {
      clearTimeout(this.expiryTimer);
      this.expiryTimer = null;
    }
  }

  private refreshUserData(): void {
    this.inventoryService.fetchProducts();
    this.cashService.fetchCash();
    this.loansService.fetchLoans();
    this.ordersService.fetchOrders();
  }

  private removeStoredToken(): void {
    try {
      localStorage.removeItem(STORAGE_KEY_TOKEN);
      // Key used by the previous version of the app
      localStorage.removeItem('imeihub_auth_user');
    } catch {
      // Nothing to clean
    }
  }

  private clearSession(): void {
    this.clearExpiryTimer();
    this.userSignal.set(null);
    this.tokenSignal.set(null);
    this.removeStoredToken();
    this.inventoryService.clear();
    this.cashService.clear();
    this.loansService.clear();
    this.ordersService.clear();
  }
}

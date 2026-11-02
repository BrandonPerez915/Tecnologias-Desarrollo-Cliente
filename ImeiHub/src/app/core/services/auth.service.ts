import { Injectable, signal, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { NotificationService } from './notification.service';
import { ApiService } from './api.service';
import { InventoryService } from './inventory.service';
import { CashService } from './cash.service';
import { LoansService } from './loans.service';
import { OrdersService } from './orders.service';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: string;
  storeName: string;
  stallNumber: string;
  phone?: string;
}

const STORAGE_KEY_TOKEN = 'imeihub_auth_token';
const STORAGE_KEY_USER = 'imeihub_auth_user';

function getInitialSession(): { token: string | null; user: AuthUser | null } {
  try {
    if (typeof localStorage !== 'undefined') {
      const token = localStorage.getItem(STORAGE_KEY_TOKEN);
      const userRaw = localStorage.getItem(STORAGE_KEY_USER);
      if (token && userRaw) {
        return { token, user: JSON.parse(userRaw) as AuthUser };
      }
    }
  } catch (e) {
    console.warn('Error reading session from localStorage', e);
  }
  return { token: null, user: null };
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

  private initialSession = getInitialSession();
  private userSignal = signal<AuthUser | null>(this.initialSession.user);
  private tokenSignal = signal<string | null>(this.initialSession.token);

  user = this.userSignal.asReadonly();
  token = this.tokenSignal.asReadonly();
  isAuthenticated = computed(() => !!this.userSignal() && !!this.tokenSignal());

  constructor() {
    // Si hay un token persistido
    if (this.tokenSignal()) {
      this.validateSession();
    }
  }

  private validateSession() {
    this.api.get<{ user: AuthUser }>('/auth/me').subscribe({
      next: (res) => {
        if (res && res.user) {
          this.userSignal.set(res.user);
          localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(res.user));
          this.refreshUserData();
        }
      },
      error: () => {
        // Token inválido o expirado en el servidor
        this.clearSession();
      }
    });
  }

  private refreshUserData() {
    this.inventoryService.fetchProducts();
    this.cashService.fetchCash();
    this.loansService.fetchLoans();
    this.ordersService.fetchOrders();
  }

  login(credentials: { email: string; password: string }): Promise<AuthUser> {
    return new Promise((resolve, reject) => {
      this.api.post<{ token: string; user: AuthUser; message?: string }>('/auth/login', credentials).subscribe({
        next: (res) => {
          this.userSignal.set(res.user);
          this.tokenSignal.set(res.token);

          try {
            localStorage.setItem(STORAGE_KEY_TOKEN, res.token);
            localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(res.user));
          } catch (e) {
            console.warn('Could not persist to localStorage', e);
          }

          // Cargar exclusivamente los datos del usuario autenticado
          this.refreshUserData();

          this.notify.success(`¡Bienvenido de nuevo, ${res.user.name}!`);
          this.router.navigate(['/dashboard']);
          resolve(res.user);
        },
        error: (err) => {
          const message = err?.error?.message || err?.message || 'Correo o contraseña incorrectos';
          reject(new Error(message));
        }
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
      this.api.post<{ token: string; user: AuthUser; message?: string }>('/auth/register', data).subscribe({
        next: (res) => {
          this.userSignal.set(res.user);
          this.tokenSignal.set(res.token);

          try {
            localStorage.setItem(STORAGE_KEY_TOKEN, res.token);
            localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(res.user));
          } catch (e) {
            console.warn('Could not persist to localStorage', e);
          }

          // Al ser nuevo usuario, todo inicia vacío
          this.refreshUserData();

          this.notify.success(`Cuenta de "${data.storeName || 'ImeiHub'}" creada con éxito`);
          this.router.navigate(['/dashboard']);
          resolve(res.user);
        },
        error: (err) => {
          const message = err?.error?.message || err?.message || 'No fue posible registrar la cuenta';
          reject(new Error(message));
        }
      });
    });
  }

  logout(): void {
    this.clearSession();
    this.notify.info('Has cerrado sesión correctamente');
    this.router.navigate(['/login']);
  }

  private clearSession(): void {
    this.userSignal.set(null);
    this.tokenSignal.set(null);
    try {
      localStorage.removeItem(STORAGE_KEY_TOKEN);
      localStorage.removeItem(STORAGE_KEY_USER);
    } catch (e) {
      console.warn('Could not clear localStorage', e);
    }
    this.inventoryService.clear();
    this.cashService.clear();
    this.loansService.clear();
    this.ordersService.clear();
  }
}

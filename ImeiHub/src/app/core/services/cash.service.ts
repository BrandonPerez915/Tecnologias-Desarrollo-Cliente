import { Injectable, signal, computed, inject } from '@angular/core';
import { CashEntry } from '../../types/cash';
import { ApiService } from './api.service';
import { NotificationService } from './notification.service';
import { finalize } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CashService {
  private api = inject(ApiService);
  private notify = inject(NotificationService);

  private initialBaseSignal = signal<number>(0);
  private entriesSignal = signal<CashEntry[]>([]);
  private loadingSignal = signal<boolean>(false);
  private errorSignal = signal<string | null>(null);

  entries = this.entriesSignal.asReadonly();
  initialBase = this.initialBaseSignal.asReadonly();
  loading = this.loadingSignal.asReadonly();
  error = this.errorSignal.asReadonly();

  totalSalesToday = computed(() => {
    return this.entriesSignal()
      .filter((e) => e.kind === 'in')
      .reduce((acc, curr) => {
        const val = Number(curr.amount.replace(/[^0-9]/g, '')) || 0;
        return acc + val;
      }, 0);
  });

  totalExpensesToday = computed(() => {
    return this.entriesSignal()
      .filter((e) => e.kind === 'out')
      .reduce((acc, curr) => {
        const val = Number(curr.amount.replace(/[^0-9]/g, '')) || 0;
        return acc + val;
      }, 0);
  });

  expectedCash = computed(() => {
    return this.initialBaseSignal() + this.totalSalesToday() - this.totalExpensesToday();
  });

  constructor() {
    this.fetchCash();
  }

  fetchCash(): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    this.api.get<{ initialBase: number; entries: CashEntry[] }>('/cash')
      .pipe(finalize(() => this.loadingSignal.set(false)))
      .subscribe({
        next: (data) => {
          this.initialBaseSignal.set(data.initialBase || 9834);
          this.entriesSignal.set(data.entries || []);
        },
        error: (err) => {
          this.errorSignal.set(err.message || 'No fue posible sincronizar los movimientos de caja');
        }
      });
  }

  registerExpense(
    amountOrObj: number | { amount: number; category: string; note: string },
    category?: string,
    note?: string
  ): boolean {
    let amount: number;
    let cat: string;
    let n: string;

    if (typeof amountOrObj === 'object') {
      amount = amountOrObj.amount;
      cat = amountOrObj.category;
      n = amountOrObj.note;
    } else {
      amount = amountOrObj;
      cat = category || 'General';
      n = note || 'Gasto registrado';
    }

    if (!amount || amount <= 0) {
      this.notify.error('El importe del gasto debe ser mayor a 0');
      return false;
    }
    if (!n.trim()) {
      this.notify.error('Debes ingresar una nota descriptiva para el gasto');
      return false;
    }

    this.api.post<CashEntry>('/cash/entries', {
      title: n.trim(),
      note: `${cat} · Ada Okafor`,
      amount,
      kind: 'out'
    }).subscribe({
      next: (entry) => {
        this.entriesSignal.update((list) => [entry, ...list]);
        this.notify.success(`Gasto de MXN ${amount.toLocaleString('es-MX')} registrado`);
      }
    });

    return true;
  }

  registerSale(
    amountOrObj: number | { amount: number; paymentMethod?: string; description?: string },
    paymentMethod?: string,
    productTitle?: string
  ): boolean {
    let amount: number;
    let method: string;
    let title: string;

    if (typeof amountOrObj === 'object') {
      amount = amountOrObj.amount;
      method = amountOrObj.paymentMethod || 'Efectivo';
      title = amountOrObj.description || 'Venta de mostrador';
    } else {
      amount = amountOrObj;
      method = paymentMethod || 'Efectivo';
      title = productTitle || 'Venta de mostrador';
    }

    if (!amount || amount <= 0) {
      this.notify.error('El importe de la venta debe ser mayor a 0');
      return false;
    }

    this.api.post<CashEntry>('/cash/entries', {
      title,
      note: `Venta · ${method} · Ada Okafor`,
      amount,
      kind: 'in'
    }).subscribe({
      next: (entry) => {
        this.entriesSignal.update((list) => [entry, ...list]);
        this.notify.success(`Venta de MXN ${amount.toLocaleString('es-MX')} añadida a caja`);
      }
    });

    return true;
  }

  closeCashRegister(countedAmount: number, notes?: string): { success: boolean; difference: number } {
    const expected = this.expectedCash();
    const difference = countedAmount - expected;

    this.api.post('/cash/close', {
      countedCash: countedAmount,
      expectedCash: expected,
      difference,
      notes: notes || 'Cierre regular de jornada'
    }).subscribe({
      next: () => {
        this.notify.success(
          difference === 0
            ? 'Caja cuadrada exactamente al centavo'
            : difference > 0
              ? `Cierre con sobrante de MXN ${difference.toLocaleString('es-MX')}`
              : `Cierre con faltante de MXN ${Math.abs(difference).toLocaleString('es-MX')}`
        );
      }
    });

    return { success: true, difference };
  }

  clear(): void {
    this.initialBaseSignal.set(0);
    this.entriesSignal.set([]);
  }
}

import { Injectable, signal, computed } from '@angular/core';
import { cashEntries } from '../../data/mockData';
import { CashEntry } from '../../types/cash';
import { NotificationService } from './notification.service';

@Injectable({
  providedIn: 'root'
})
export class CashService {
  private initialBaseSignal = signal<number>(9834);
  private entriesSignal = signal<CashEntry[]>([...cashEntries]);

  entries = this.entriesSignal.asReadonly();
  initialBase = this.initialBaseSignal.asReadonly();

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

  constructor(private notify: NotificationService) {}

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

    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newEntry: CashEntry = {
      time: timeStr,
      title: n.trim(),
      note: `${cat} · Ada Okafor`,
      amount: `−${amount.toLocaleString('es-MX')}`,
      kind: 'out'
    };

    this.entriesSignal.update((list) => [newEntry, ...list]);
    this.notify.success(`Gasto de MXN ${amount.toLocaleString('es-MX')} registrado`);
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

    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newEntry: CashEntry = {
      time: timeStr,
      title: title,
      note: `Venta · ${method} · Ada Okafor`,
      amount: `+${amount.toLocaleString('es-MX')}`,
      kind: 'in'
    };

    this.entriesSignal.update((list) => [newEntry, ...list]);
    this.notify.success(`Venta de MXN ${amount.toLocaleString('es-MX')} añadida a caja`);
    return true;
  }

  closeCashRegister(countedAmount: number, notes?: string): { success: boolean; difference: number } {
    const expected = this.expectedCash();
    const difference = countedAmount - expected;

    this.notify.success(
      difference === 0
        ? 'Caja cuadrada exactamente al centavo'
        : difference > 0
          ? `Cierre con sobrante de MXN ${difference.toLocaleString('es-MX')}`
          : `Cierre con faltante de MXN ${Math.abs(difference).toLocaleString('es-MX')}`
    );

    return { success: true, difference };
  }
}

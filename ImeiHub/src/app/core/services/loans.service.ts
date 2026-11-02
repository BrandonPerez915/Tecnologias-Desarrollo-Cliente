import { Injectable, signal, computed, inject } from '@angular/core';
import { LoanEntry } from '../../types/loans';
import { ApiService } from './api.service';
import { NotificationService } from './notification.service';
import { finalize } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoansService {
  private api = inject(ApiService);
  private notify = inject(NotificationService);

  private loansSignal = signal<LoanEntry[]>([]);
  private loadingSignal = signal<boolean>(false);
  private errorSignal = signal<string | null>(null);

  loans = this.loansSignal.asReadonly();
  loading = this.loadingSignal.asReadonly();
  error = this.errorSignal.asReadonly();

  activeLoansCount = computed(() => {
    return this.loansSignal().filter((l) => l.status !== 'Devuelto').length;
  });

  overdueLoansCount = computed(() => {
    return this.loansSignal().filter((l) => l.status === 'Atrasado').length;
  });

  returnedTodayCount = computed(() => {
    return this.loansSignal().filter((l) => l.status === 'Devuelto').length + 3;
  });

  constructor() {
    this.fetchLoans();
  }

  fetchLoans(): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    this.api.get<LoanEntry[]>('/loans')
      .pipe(finalize(() => this.loadingSignal.set(false)))
      .subscribe({
        next: (items) => this.loansSignal.set(items),
        error: (err) => this.errorSignal.set(err.message || 'No fue posible cargar los préstamos')
      });
  }

  registerLoan(loan: {
    item: string;
    serial: string;
    stall: string;
    person: string;
    notes?: string;
  }, callback?: (success: boolean) => void): boolean {
    if (!loan.item?.trim()) {
      this.notify.error('Selecciona o ingresa el nombre del artículo');
      if (callback) callback(false);
      return false;
    }
    if (!loan.stall?.trim()) {
      this.notify.error('Indica el número del puesto solicitante');
      if (callback) callback(false);
      return false;
    }
    if (!loan.person?.trim()) {
      this.notify.error('Indica el nombre de la persona responsable');
      if (callback) callback(false);
      return false;
    }

    this.api.post<LoanEntry>('/loans', loan).subscribe({
      next: (created) => {
        this.loansSignal.update((list) => [created, ...list]);
        this.notify.success(`Préstamo a ${created.person} (Puesto ${created.stall}) registrado`);
        if (callback) callback(true);
      },
      error: () => {
        if (callback) callback(false);
      }
    });

    return true;
  }

  markAsReturned(serialOrItem: string, callback?: (success: boolean) => void): boolean {
    const found = this.loansSignal().find(
      (l) => l.fullSerial === serialOrItem || l.serial === serialOrItem || l.item === serialOrItem || (l as any).id === serialOrItem
    );

    if (!found) {
      this.notify.error('Artículo no encontrado en la lista de préstamos');
      if (callback) callback(false);
      return false;
    }

    const loanId = (found as any).id || 1;
    this.api.patch<LoanEntry>(`/loans/${loanId}/return`, {}).subscribe({
      next: (updated) => {
        this.loansSignal.update((list) =>
          list.map((l) => (l === found ? { ...l, status: 'Devuelto', tone: 'success' } : l))
        );
        this.notify.success(`${found.item} marcado como devuelto e ingresado a vitrina`);
        if (callback) callback(true);
      },
      error: () => {
        if (callback) callback(false);
      }
    });

    return true;
  }

  clear(): void {
    this.loansSignal.set([]);
  }
}

import { Injectable, signal, computed } from '@angular/core';
import { loanEntries } from '../../data/mockData';
import { LoanEntry } from '../../types/loans';
import { NotificationService } from './notification.service';

@Injectable({
  providedIn: 'root'
})
export class LoansService {
  private loansSignal = signal<LoanEntry[]>([...loanEntries]);

  loans = this.loansSignal.asReadonly();

  activeLoansCount = computed(() => {
    return this.loansSignal().filter((l) => l.status !== 'Devuelto').length;
  });

  overdueLoansCount = computed(() => {
    return this.loansSignal().filter((l) => l.status === 'Atrasado').length;
  });

  returnedTodayCount = computed(() => {
    return this.loansSignal().filter((l) => l.status === 'Devuelto').length + 3; // mock initial
  });

  constructor(private notify: NotificationService) {}

  registerLoan(loan: {
    item: string;
    serial: string;
    stall: string;
    person: string;
    notes?: string;
  }): boolean {
    if (!loan.item?.trim()) {
      this.notify.error('Selecciona o ingresa el nombre del artículo');
      return false;
    }
    if (!loan.stall?.trim()) {
      this.notify.error('Indica el número del puesto solicitante');
      return false;
    }
    if (!loan.person?.trim()) {
      this.notify.error('Indica el nombre de la persona responsable');
      return false;
    }

    const masked = loan.serial.length > 8
      ? loan.serial.substring(0, 8) + '•••'
      : loan.serial || 'SN-TEMPORAL';

    const newLoan: LoanEntry = {
      item: loan.item.trim(),
      serial: masked,
      fullSerial: loan.serial.trim() || 'SN-TEMPORAL',
      stall: loan.stall.trim(),
      person: loan.person.trim(),
      age: '1 min',
      status: 'Pendiente',
      tone: 'neutral',
      loanedAt: 'Hoy, ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      dueAt: 'Hoy, 2 horas',
      condition: 'Buen estado',
      agreedPrice: 'MXN 0.00',
      notes: loan.notes?.trim() || 'Préstamo registrado en mostrador.'
    };

    this.loansSignal.update((list) => [newLoan, ...list]);
    this.notify.success(`Préstamo a ${newLoan.person} (Puesto ${newLoan.stall}) registrado`);
    return true;
  }

  markAsReturned(serialOrItem: string): boolean {
    const found = this.loansSignal().find(
      (l) => l.fullSerial === serialOrItem || l.serial === serialOrItem || l.item === serialOrItem
    );

    if (!found) {
      this.notify.error('Artículo no encontrado en la lista de préstamos');
      return false;
    }

    this.loansSignal.update((list) =>
      list.map((l) => (l === found ? { ...l, status: 'Devuelto', tone: 'success' } : l))
    );

    this.notify.success(`${found.item} marcado como devuelto e ingresado a vitrina`);
    return true;
  }
}

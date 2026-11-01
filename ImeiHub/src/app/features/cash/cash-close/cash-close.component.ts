import { Component, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AmountComponent } from '../../../components/ui/amount/amount.component';
import { ButtonComponent } from '../../../components/ui/button/button.component';
import { IconComponent } from '../../../components/ui/icon/icon.component';
import { PageHeadingComponent } from '../../../components/ui/page-heading/page-heading.component';
import { StatusBadgeComponent } from '../../../components/ui/status-badge/status-badge.component';
import { FieldComponent } from '../../../components/ui/field/field.component';
import { CashService } from '../../../core/services/cash.service';
import { AuthService } from '../../../core/services/auth.service';
import { NotificationService } from '../../../core/services/notification.service';
import { SoldProduct } from '../../../types/cash';

const defaultSoldProducts: SoldProduct[] = [
  { time: '12:42', product: 'iPhone 13 Pro · 256GB', quantity: 1, method: 'Tarjeta', total: '15,999' },
  { time: '09:14', product: 'Samsung Galaxy A54 · 128GB', quantity: 1, method: 'Transferencia', total: '6,499' },
  { time: '10:36', product: 'Cargador rápido Oraimo 20W', quantity: 2, method: 'Efectivo', total: '698' },
];

@Component({
  selector: 'app-cash-close',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AmountComponent,
    ButtonComponent,
    IconComponent,
    PageHeadingComponent,
    StatusBadgeComponent,
    FieldComponent,
  ],
  templateUrl: './cash-close.component.html',
  styleUrls: ['./cash-close.component.css']
})
export class CashCloseComponent {
  cashService = inject(CashService);
  private authService = inject(AuthService);
  private router = inject(Router);
  private notify = inject(NotificationService);

  currentUser = this.authService.user;
  products = defaultSoldProducts;

  // Angular Reactive Forms
  closeForm = new FormGroup({
    countedCash: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.min(0)]
    }),
    notes: new FormControl('', { nonNullable: true })
  });

  closing = signal(false);

  todayFormatted = new Intl.DateTimeFormat('es-MX', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(new Date());

  cashDifference = computed(() => {
    const val = parseFloat(this.closeForm.controls.countedCash.value);
    if (isNaN(val)) return 0;
    return val - this.cashService.expectedCash();
  });

  diffStatusClass = computed(() => {
    const d = this.cashDifference();
    if (d === 0) return 'diff-exact';
    return d > 0 ? 'diff-positive' : 'diff-negative';
  });

  diffText = computed(() => {
    const d = this.cashDifference();
    if (d === 0) return 'MXN 0.00 (Exacta)';
    if (d > 0) return `+ MXN ${d.toFixed(2)} (Sobrante)`;
    return `- MXN ${Math.abs(d).toFixed(2)} (Faltante)`;
  });

  diffExplanation = computed(() => {
    const d = this.cashDifference();
    if (d === 0) return 'El efectivo físico coincide perfectamente con el total registrado por el sistema.';
    if (d > 0) return 'Hay más dinero físico en caja que el calculado en el registro.';
    return 'Falta dinero físico respecto al cálculo de ventas y salidas.';
  });

  goToDashboard() {
    this.router.navigate(['/dashboard']);
  }

  goToCash() {
    this.router.navigate(['/cash']);
  }

  get countedError(): string {
    const ctrl = this.closeForm.controls.countedCash;
    if (!ctrl.touched && !ctrl.dirty) return '';
    const val = parseFloat(ctrl.value);
    if (isNaN(val) || val < 0) {
      return 'Ingresa una cantidad válida de efectivo contado';
    }
    return '';
  }

  saveSummary() {
    const user = this.currentUser();
    const countedVal = parseFloat(this.closeForm.controls.countedCash.value);
    const summary = {
      fecha: this.todayFormatted,
      puesto: user?.stallNumber || 'A-18',
      responsable: user?.name || 'Ada Okafor',
      apertura: '08:32',
      fondoInicial: this.cashService.initialBase(),
      ventasTotales: this.cashService.totalSalesToday(),
      salidasTotales: this.cashService.totalExpensesToday(),
      efectivoEsperado: this.cashService.expectedCash(),
      efectivoContado: !isNaN(countedVal) ? countedVal : this.cashService.expectedCash(),
      diferencia: this.cashDifference(),
      notas: this.closeForm.controls.notes.value || 'Cierre regular de jornada',
      movimientos: this.cashService.entries()
    };

    const blob = new Blob([JSON.stringify(summary, null, 2)], {
      type: 'application/json;charset=utf-8',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `cierre-caja-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
    this.notify.success('Comprobante de cierre guardado en el dispositivo');
  }

  finishClose() {
    if (this.closeForm.invalid) {
      this.closeForm.markAllAsTouched();
      this.notify.error('Debes indicar el conteo de efectivo físico para conciliar');
      return;
    }

    this.closing.set(true);
    const counted = parseFloat(this.closeForm.controls.countedCash.value);

    this.cashService.closeCashRegister(counted, this.closeForm.controls.notes.value);
    this.closing.set(false);
    this.router.navigate(['/dashboard']);
  }
}

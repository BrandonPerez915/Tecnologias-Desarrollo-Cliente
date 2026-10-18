import { Component, output, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonComponent } from '../../../components/ui/button/button.component';
import { FieldComponent } from '../../../components/ui/field/field.component';
import { IconComponent } from '../../../components/ui/icon/icon.component';
import { SheetComponent } from '../../../components/ui/sheet/sheet.component';
import { CashService } from '../../../core/services/cash.service';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-expense-sheet',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonComponent,
    FieldComponent,
    IconComponent,
    SheetComponent,
  ],
  templateUrl: './expense-sheet.component.html',
  styleUrls: ['./expense-sheet.component.css']
})
export class ExpenseSheetComponent {
  private cashService = inject(CashService);
  private notify = inject(NotificationService);

  close = output<void>();

  selectedCategory = signal<'merchandise' | 'food' | 'transport' | 'other'>('merchandise');
  amount = signal('');
  note = signal('');
  amountError = signal('');
  noteError = signal('');
  submitting = signal(false);

  projectedCash = computed(() => {
    const val = parseFloat(this.amount()) || 0;
    return Math.max(0, this.cashService.expectedCash() - val);
  });

  onAmountChange(val: string) {
    this.amount.set(val);
    if (this.amountError()) this.validateAmount();
  }

  onNoteChange(val: string) {
    this.note.set(val);
    if (this.noteError()) this.validateNote();
  }

  validateAmount(): boolean {
    const val = parseFloat(this.amount());
    if (isNaN(val) || val <= 0) {
      this.amountError.set('Ingresa un importe mayor a cero');
      return false;
    }
    if (val > this.cashService.expectedCash()) {
      this.amountError.set(`El importe excede el efectivo actual disponible (MXN ${this.cashService.expectedCash().toFixed(2)})`);
      return false;
    }
    this.amountError.set('');
    return true;
  }

  validateNote(): boolean {
    if (!this.note().trim()) {
      this.noteError.set('Describe el motivo del gasto');
      return false;
    }
    this.noteError.set('');
    return true;
  }

  submitForm(event: Event) {
    event.preventDefault();
    const v1 = this.validateAmount();
    const v2 = this.validateNote();

    if (!v1 || !v2) return;

    this.submitting.set(true);
    const amountNum = parseFloat(this.amount());

    const categoryLabels: Record<string, string> = {
      merchandise: 'Compra de mercancía',
      food: 'Comida / refrigerios',
      transport: 'Transporte',
      other: 'Gastos generales'
    };

    this.cashService.registerExpense({
      category: categoryLabels[this.selectedCategory()] || 'Otros',
      amount: amountNum,
      note: this.note().trim()
    });

    this.notify.success(`Gasto de MXN ${amountNum.toFixed(2)} registrado en caja`);
    this.submitting.set(false);
    this.close.emit();
  }
}

import { Component, output, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
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
    ReactiveFormsModule,
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

  // Angular Reactive Forms - FormGroup y FormControls
  expenseForm = new FormGroup({
    category: new FormControl<'merchandise' | 'food' | 'transport' | 'other'>('merchandise', {
      nonNullable: true,
      validators: [Validators.required]
    }),
    amount: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.min(0.01)]
    }),
    note: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(3)]
    })
  });

  submitting = signal(false);

  projectedCash = computed(() => {
    const val = parseFloat(this.expenseForm.controls.amount.value) || 0;
    return Math.max(0, this.cashService.expectedCash() - val);
  });

  setCategory(cat: 'merchandise' | 'food' | 'transport' | 'other') {
    this.expenseForm.controls.category.setValue(cat);
  }

  get amountError(): string {
    const ctrl = this.expenseForm.controls.amount;
    if (!ctrl.touched && !ctrl.dirty) return '';
    const val = parseFloat(ctrl.value);
    if (isNaN(val) || val <= 0) return 'Ingresa un importe mayor a cero';
    if (val > this.cashService.expectedCash()) {
      return `El importe excede el efectivo actual disponible (MXN ${this.cashService.expectedCash().toFixed(2)})`;
    }
    return '';
  }

  get noteError(): string {
    const ctrl = this.expenseForm.controls.note;
    if (!ctrl.touched && !ctrl.dirty) return '';
    if (ctrl.hasError('required')) return 'Describe el motivo del gasto';
    if (ctrl.hasError('minlength')) return 'La descripción debe tener al menos 3 caracteres';
    return '';
  }

  submitForm(event: Event) {
    event.preventDefault();

    if (this.expenseForm.invalid || (parseFloat(this.expenseForm.controls.amount.value) > this.cashService.expectedCash())) {
      this.expenseForm.markAllAsTouched();
      return;
    }

    this.submitting.set(true);
    const formVal = this.expenseForm.getRawValue();
    const amountNum = parseFloat(formVal.amount);

    const categoryLabels: Record<string, string> = {
      merchandise: 'Compra de mercancía',
      food: 'Comida / refrigerios',
      transport: 'Transporte',
      other: 'Gastos generales'
    };

    this.cashService.registerExpense({
      category: categoryLabels[formVal.category] || 'Otros',
      amount: amountNum,
      note: formVal.note.trim()
    });

    this.notify.success(`Gasto de MXN ${amountNum.toFixed(2)} registrado en caja`);
    this.submitting.set(false);
    this.close.emit();
  }
}

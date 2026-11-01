import { Component, output, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { ButtonComponent } from '../../../components/ui/button/button.component';
import { FieldComponent } from '../../../components/ui/field/field.component';
import { IconComponent } from '../../../components/ui/icon/icon.component';
import { SheetComponent } from '../../../components/ui/sheet/sheet.component';
import { Product } from '../../../types/inventory';
import { Overlay } from '../../../types/navigation';
import { LoansService } from '../../../core/services/loans.service';
import { InventoryService } from '../../../core/services/inventory.service';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-loan-sheet',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonComponent,
    FieldComponent,
    IconComponent,
    SheetComponent,
  ],
  templateUrl: './loan-sheet.component.html',
  styleUrls: ['./loan-sheet.component.css']
})
export class LoanSheetComponent {
  private loansService = inject(LoansService);
  private inventoryService = inject(InventoryService);
  private notify = inject(NotificationService);

  open = output<Overlay>();
  close = output<void>();

  // Angular Reactive Forms - FormGroup y FormControls
  loanForm = new FormGroup({
    item: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required]
    }),
    serial: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(4)]
    }),
    stall: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required]
    }),
    person: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(2)]
    })
  });

  loanProductSearchOpen = signal(false);
  submitting = signal(false);

  loanProductSuggestions = computed(() => {
    const query = this.loanForm.controls.item.value.trim().toLowerCase();
    return query
      ? this.inventoryService.products()
          .filter((p) => p.name.toLowerCase().includes(query))
          .slice(0, 5)
      : [];
  });

  onSearchChange(value: string) {
    this.loanForm.controls.item.setValue(value);
    this.loanProductSearchOpen.set(true);
  }

  onBlur() {
    window.setTimeout(() => this.loanProductSearchOpen.set(false), 200);
  }

  selectProduct(product: Product) {
    this.loanForm.controls.item.setValue(product.name);
    this.loanProductSearchOpen.set(false);
  }

  get productError(): string {
    const ctrl = this.loanForm.controls.item;
    if (!ctrl.touched && !ctrl.dirty) return '';
    if (ctrl.hasError('required')) return 'Ingresa el nombre del artículo a prestar';
    return '';
  }

  get serialError(): string {
    const ctrl = this.loanForm.controls.serial;
    if (!ctrl.touched && !ctrl.dirty) return '';
    if (ctrl.hasError('required')) return 'Ingresa el número de serie o IMEI';
    if (ctrl.hasError('minlength')) return 'El serial o IMEI debe tener al menos 4 caracteres';
    return '';
  }

  get stallError(): string {
    const ctrl = this.loanForm.controls.stall;
    if (!ctrl.touched && !ctrl.dirty) return '';
    if (ctrl.hasError('required')) return 'Indica el puesto o local solicitante (ej. B-14)';
    return '';
  }

  get personError(): string {
    const ctrl = this.loanForm.controls.person;
    if (!ctrl.touched && !ctrl.dirty) return '';
    if (ctrl.hasError('required')) return 'Indica el nombre de quien se lleva el artículo';
    if (ctrl.hasError('minlength')) return 'Ingresa un nombre válido';
    return '';
  }

  submitForm(event: Event) {
    event.preventDefault();

    if (this.loanForm.invalid) {
      this.loanForm.markAllAsTouched();
      return;
    }

    this.submitting.set(true);
    const val = this.loanForm.getRawValue();

    const success = this.loansService.registerLoan({
      item: val.item.trim(),
      serial: val.serial.trim(),
      stall: val.stall.trim(),
      person: val.person.trim()
    });

    this.submitting.set(false);
    if (success) {
      this.close.emit();
    }
  }
}

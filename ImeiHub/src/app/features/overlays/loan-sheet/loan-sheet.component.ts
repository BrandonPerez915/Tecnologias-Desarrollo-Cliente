import { Component, output, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
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
    FormsModule,
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

  loanProductSearch = signal('');
  loanProductSearchOpen = signal(false);
  serialNumber = signal('');
  stallNumber = signal('');
  personName = signal('');

  productError = signal('');
  serialError = signal('');
  stallError = signal('');
  personError = signal('');
  submitting = signal(false);

  loanProductSuggestions = computed(() => {
    const query = this.loanProductSearch().trim().toLowerCase();
    return query
      ? this.inventoryService.products()
          .filter((p) => p.name.toLowerCase().includes(query))
          .slice(0, 5)
      : [];
  });

  onSearchChange(value: string) {
    this.loanProductSearch.set(value);
    this.loanProductSearchOpen.set(true);
    if (this.productError()) this.validateProduct();
  }

  onBlur() {
    window.setTimeout(() => this.loanProductSearchOpen.set(false), 200);
  }

  selectProduct(product: Product) {
    this.loanProductSearch.set(product.name);
    this.loanProductSearchOpen.set(false);
    this.productError.set('');
  }

  onSerialChange(val: string) {
    this.serialNumber.set(val);
    if (this.serialError()) this.validateSerial();
  }

  onStallChange(val: string) {
    this.stallNumber.set(val);
    if (this.stallError()) this.validateStall();
  }

  onPersonChange(val: string) {
    this.personName.set(val);
    if (this.personError()) this.validatePerson();
  }

  validateProduct(): boolean {
    if (!this.loanProductSearch().trim()) {
      this.productError.set('Ingresa el nombre del artículo a prestar');
      return false;
    }
    this.productError.set('');
    return true;
  }

  validateSerial(): boolean {
    if (!this.serialNumber().trim()) {
      this.serialError.set('Ingresa el número de serie o IMEI');
      return false;
    }
    if (this.serialNumber().trim().length < 4) {
      this.serialError.set('El serial o IMEI debe tener al menos 4 caracteres');
      return false;
    }
    this.serialError.set('');
    return true;
  }

  validateStall(): boolean {
    if (!this.stallNumber().trim()) {
      this.stallError.set('Indica el puesto o local solicitante (ej. B-14)');
      return false;
    }
    this.stallError.set('');
    return true;
  }

  validatePerson(): boolean {
    if (!this.personName().trim()) {
      this.personError.set('Indica el nombre de quien se lleva el artículo');
      return false;
    }
    if (this.personName().trim().length < 2) {
      this.personError.set('Ingresa un nombre válido');
      return false;
    }
    this.personError.set('');
    return true;
  }

  submitForm(event: Event) {
    event.preventDefault();
    const v1 = this.validateProduct();
    const v2 = this.validateSerial();
    const v3 = this.validateStall();
    const v4 = this.validatePerson();

    if (!v1 || !v2 || !v3 || !v4) return;

    this.submitting.set(true);

    const success = this.loansService.registerLoan({
      item: this.loanProductSearch().trim(),
      serial: this.serialNumber().trim(),
      stall: this.stallNumber().trim(),
      person: this.personName().trim()
    });

    this.submitting.set(false);
    if (success) {
      this.close.emit();
    }
  }
}

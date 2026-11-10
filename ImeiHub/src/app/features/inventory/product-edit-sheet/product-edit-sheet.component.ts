import { Component, input, output, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { ButtonComponent } from '../../../components/ui/button/button.component';
import { FieldComponent } from '../../../components/ui/field/field.component';
import { IconComponent } from '../../../components/ui/icon/icon.component';
import { SheetComponent } from '../../../components/ui/sheet/sheet.component';
import { Product } from '../../../types/inventory';
import { InventoryService } from '../../../core/services/inventory.service';
import { NotificationService } from '../../../core/services/notification.service';

function editPriceValidator(control: AbstractControl): ValidationErrors | null {
  const minPrice = parseFloat(control.get('minPrice')?.value);
  const price = parseFloat(control.get('price')?.value);

  if (!isNaN(minPrice) && !isNaN(price) && price < minPrice) {
    return { priceBelowMin: true };
  }
  return null;
}

@Component({
  selector: 'app-product-edit-sheet',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonComponent,
    FieldComponent,
    IconComponent,
    SheetComponent,
  ],
  templateUrl: './product-edit-sheet.component.html',
  styleUrls: ['./product-edit-sheet.component.css']
})
export class ProductEditSheetComponent implements OnInit {
  private inventoryService = inject(InventoryService);
  private notify = inject(NotificationService);

  product = input.required<Product>();
  close = output<void>();

  // Angular Reactive Forms - FormGroup y FormControls
  editForm = new FormGroup({
    name: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required]
    }),
    sku: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required]
    }),
    price: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.min(0.01)]
    }),
    minPrice: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.min(0.01)]
    }),
    cost: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.min(0.01)]
    }),
    stock: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.min(0)]
    })
  }, { validators: editPriceValidator });

  submitting = signal(false);

  ngOnInit() {
    const p = this.product();
    const min = this.inventoryService.minPrices()[p.id];
    const resolvedMin = min ? min.replace(/,/g, '') : (parseFloat(p.price.replace(/,/g, '')) * 0.9).toString();

    this.editForm.setValue({
      name: p.name,
      sku: p.sku,
      price: p.price.replace(/,/g, ''),
      minPrice: resolvedMin,
      cost: p.cost.replace(/,/g, ''),
      stock: p.stock.toString()
    });
  }

  get nameError(): string {
    const ctrl = this.editForm.controls.name;
    if (!ctrl.touched && !ctrl.dirty) return '';
    if (ctrl.hasError('required')) return 'El nombre no puede estar vacío';
    return '';
  }

  get skuError(): string {
    const ctrl = this.editForm.controls.sku;
    if (!ctrl.touched && !ctrl.dirty) return '';
    if (ctrl.hasError('required')) return 'Ingresa un SKU para el producto';
    return '';
  }

  get priceError(): string {
    const ctrl = this.editForm.controls.price;
    if (!ctrl.touched && !ctrl.dirty) return '';
    if (ctrl.hasError('required') || ctrl.hasError('min')) return 'Ingresa un precio mayor a 0';
    if (this.editForm.hasError('priceBelowMin')) return 'El precio ideal no puede ser menor al precio mínimo';
    return '';
  }

  get minPriceError(): string {
    const ctrl = this.editForm.controls.minPrice;
    if (!ctrl.touched && !ctrl.dirty) return '';
    if (ctrl.hasError('required') || ctrl.hasError('min')) return 'Ingresa un precio mínimo válido';
    return '';
  }

  get costError(): string {
    const ctrl = this.editForm.controls.cost;
    if (!ctrl.touched && !ctrl.dirty) return '';
    if (ctrl.hasError('required') || ctrl.hasError('min')) return 'Ingresa un costo válido';
    return '';
  }

  get stockError(): string {
    const ctrl = this.editForm.controls.stock;
    if (!ctrl.touched && !ctrl.dirty) return '';
    if (ctrl.hasError('required') || ctrl.hasError('min')) return 'El stock debe ser un entero mayor o igual a 0';
    return '';
  }

  submitForm(event: Event) {
    event.preventDefault();

    if (this.editForm.invalid) {
      this.editForm.markAllAsTouched();
      return;
    }

    this.submitting.set(true);
    const formVal = this.editForm.getRawValue();

    const priceNum = parseFloat(formVal.price);
    const costNum = parseFloat(formVal.cost);
    const minPriceNum = parseFloat(formVal.minPrice);
    const stockNum = parseInt(formVal.stock, 10);

    this.inventoryService.updateProduct(this.product().id, {
      name: formVal.name.trim(),
      sku: formVal.sku.trim(),
      price: priceNum.toLocaleString('es-MX'),
      cost: costNum.toLocaleString('es-MX'),
      minPrice: minPriceNum.toLocaleString('es-MX'),
      stock: stockNum
    }, (success) => {
      this.submitting.set(false);
      if (success) {
        this.close.emit();
      }
    });
  }
}

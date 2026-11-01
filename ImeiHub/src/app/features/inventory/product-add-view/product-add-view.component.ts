import { Component, output, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { ButtonComponent } from '../../../components/ui/button/button.component';
import { FieldComponent } from '../../../components/ui/field/field.component';
import { IconComponent } from '../../../components/ui/icon/icon.component';
import { PageHeadingComponent } from '../../../components/ui/page-heading/page-heading.component';
import { NewProductVariantRow } from '../../../types/inventory';
import { InventoryService } from '../../../core/services/inventory.service';
import { NotificationService } from '../../../core/services/notification.service';

function priceHierarchyValidator(control: AbstractControl): ValidationErrors | null {
  const cost = parseFloat(control.get('cost')?.value);
  const minPrice = parseFloat(control.get('minPrice')?.value);
  const price = parseFloat(control.get('price')?.value);

  if (!isNaN(cost) && !isNaN(minPrice) && minPrice < cost) {
    return { minBelowCost: true };
  }
  if (!isNaN(minPrice) && !isNaN(price) && price < minPrice) {
    return { priceBelowMin: true };
  }
  return null;
}

@Component({
  selector: 'app-product-add-view',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonComponent,
    FieldComponent,
    IconComponent,
    PageHeadingComponent,
  ],
  templateUrl: './product-add-view.component.html',
  styleUrls: ['./product-add-view.component.css']
})
export class ProductAddViewComponent {
  private inventoryService = inject(InventoryService);
  private notify = inject(NotificationService);

  close = output<void>();

  productForm = new FormGroup({
    name: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(3)]
    }),
    brand: new FormControl('', { nonNullable: true }),
    model: new FormControl('', { nonNullable: true }),
    type: new FormControl('Smartphones', { nonNullable: true }),
    category: new FormControl('Phones', { nonNullable: true }),
    condition: new FormControl('Nuevo', { nonNullable: true }),
    description: new FormControl('', { nonNullable: true }),
    sku: new FormControl('', { nonNullable: true }),
    barcode: new FormControl('', { nonNullable: true }),
    serial: new FormControl('', { nonNullable: true }),
    cost: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.min(0.01)]
    }),
    minPrice: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.min(0.01)]
    }),
    price: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.min(0.01)]
    }),
    location: new FormControl('', { nonNullable: true }),
    supplier: new FormControl('', { nonNullable: true })
  }, { validators: priceHierarchyValidator });

  submitting = signal(false);

  newProductVariants = signal<NewProductVariantRow[]>([
    { id: 1, color: 'Negro', stock: '1' },
  ]);

  colorList = [
    'Amarillo',
    'Rojo',
    'Negro',
    'Blanco',
    'Azul',
    'Verde',
    'Morado',
    'Dorado',
    'Grafito',
    'Plata',
    'Titanio natural',
  ];

  get totalNewProductStock(): number {
    return this.newProductVariants().reduce(
      (total, v) => total + (Number(v.stock) || 0),
      0
    );
  }

  get nameError(): string {
    const ctrl = this.productForm.controls.name;
    if (!ctrl.touched && !ctrl.dirty) return '';
    if (ctrl.hasError('required')) return 'Ingresa el nombre del producto';
    if (ctrl.hasError('minlength')) return 'El nombre debe tener al menos 3 caracteres';
    return '';
  }

  get costError(): string {
    const ctrl = this.productForm.controls.cost;
    if (!ctrl.touched && !ctrl.dirty) return '';
    if (ctrl.hasError('required') || ctrl.hasError('min')) return 'Ingresa un costo de compra mayor a 0';
    return '';
  }

  get minPriceError(): string {
    const ctrl = this.productForm.controls.minPrice;
    if (!ctrl.touched && !ctrl.dirty) return '';
    if (ctrl.hasError('required') || ctrl.hasError('min')) return 'Ingresa un precio mínimo válido';
    if (this.productForm.hasError('minBelowCost')) return 'El precio mínimo no debería ser menor al costo';
    return '';
  }

  get priceError(): string {
    const ctrl = this.productForm.controls.price;
    if (!ctrl.touched && !ctrl.dirty) return '';
    if (ctrl.hasError('required') || ctrl.hasError('min')) return 'Ingresa un precio de venta mayor a 0';
    if (this.productForm.hasError('priceBelowMin')) return 'El precio ideal no puede ser menor al precio mínimo';
    return '';
  }

  onCostChange(val: string) {
    this.productForm.controls.cost.setValue(val);
    this.productForm.updateValueAndValidity();
  }

  onMinPriceChange(val: string) {
    this.productForm.controls.minPrice.setValue(val);
    this.productForm.updateValueAndValidity();
  }

  onPriceChange(val: string) {
    this.productForm.controls.price.setValue(val);
    this.productForm.updateValueAndValidity();
  }

  updateVariant(id: number, field: 'color' | 'stock', value: string) {
    this.newProductVariants.update((variants) =>
      variants.map((v) => (v.id === id ? { ...v, [field]: value } : v))
    );
  }

  addVariant() {
    this.newProductVariants.update((variants) => [
      ...variants,
      {
        id: Math.max(...variants.map((v) => v.id), 0) + 1,
        color: 'Negro',
        stock: '1',
      },
    ]);
  }

  removeVariant(id: number) {
    this.newProductVariants.update((variants) =>
      variants.length === 1 ? variants : variants.filter((v) => v.id !== id)
    );
  }

  submitForm(event: Event) {
    event.preventDefault();

    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      this.notify.error('Por favor completa todos los campos requeridos correctamente');
      return;
    }

    this.submitting.set(true);
    const formVal = this.productForm.getRawValue();

    const variants = this.newProductVariants().map((v) => ({
      color: v.color || 'Estándar',
      stock: parseInt(v.stock, 10) || 0
    }));

    this.inventoryService.addProduct({
      name: formVal.name.trim(),
      brand: formVal.brand.trim() || 'Genérico',
      model: formVal.model.trim() || 'Estándar',
      type: formVal.type,
      category: formVal.category,
      cost: parseFloat(formVal.cost),
      minPrice: parseFloat(formVal.minPrice),
      price: parseFloat(formVal.price),
      sku: formVal.sku.trim() || `SKU-${Date.now().toString().slice(-6)}`,
      serial: formVal.serial.trim() || undefined,
      variants,
      location: formVal.location.trim() || 'Vitrina Principal'
    }, (success) => {
      this.submitting.set(false);
      if (success) {
        this.close.emit();
      }
    });
  }
}

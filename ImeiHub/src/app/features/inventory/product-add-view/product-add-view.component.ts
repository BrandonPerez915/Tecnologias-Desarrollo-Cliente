import { Component, output, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonComponent } from '../../../components/ui/button/button.component';
import { FieldComponent } from '../../../components/ui/field/field.component';
import { IconComponent } from '../../../components/ui/icon/icon.component';
import { PageHeadingComponent } from '../../../components/ui/page-heading/page-heading.component';
import { NewProductVariantRow } from '../../../types/inventory';
import { InventoryService } from '../../../core/services/inventory.service';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-product-add-view',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
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

  name = signal('');
  brand = signal('');
  model = signal('');
  type = signal('Smartphones');
  category = signal('Phones');
  condition = signal('Nuevo');
  description = signal('');
  sku = signal('');
  barcode = signal('');
  serial = signal('');
  cost = signal('');
  minPrice = signal('');
  price = signal('');
  location = signal('');
  supplier = signal('');

  nameError = signal('');
  costError = signal('');
  minPriceError = signal('');
  priceError = signal('');
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

  onNameChange(val: string) {
    this.name.set(val);
    if (this.nameError()) this.validateName();
  }

  onCostChange(val: string) {
    this.cost.set(val);
    if (this.costError()) this.validateCost();
  }

  onMinPriceChange(val: string) {
    this.minPrice.set(val);
    if (this.minPriceError()) this.validateMinPrice();
  }

  onPriceChange(val: string) {
    this.price.set(val);
    if (this.priceError()) this.validatePrice();
  }

  validateName(): boolean {
    if (!this.name().trim()) {
      this.nameError.set('Ingresa el nombre del producto');
      return false;
    }
    if (this.name().trim().length < 3) {
      this.nameError.set('El nombre debe tener al menos 3 caracteres');
      return false;
    }
    this.nameError.set('');
    return true;
  }

  validateCost(): boolean {
    const val = parseFloat(this.cost());
    if (isNaN(val) || val <= 0) {
      this.costError.set('Ingresa un costo válido mayor a 0');
      return false;
    }
    this.costError.set('');
    return true;
  }

  validateMinPrice(): boolean {
    const min = parseFloat(this.minPrice());
    const c = parseFloat(this.cost()) || 0;
    if (isNaN(min) || min <= 0) {
      this.minPriceError.set('Ingresa un precio mínimo válido');
      return false;
    }
    if (c > 0 && min < c) {
      this.minPriceError.set('El precio mínimo no debería ser menor al costo');
    } else {
      this.minPriceError.set('');
    }
    return true;
  }

  validatePrice(): boolean {
    const p = parseFloat(this.price());
    const min = parseFloat(this.minPrice()) || 0;
    if (isNaN(p) || p <= 0) {
      this.priceError.set('Ingresa un precio de venta mayor a 0');
      return false;
    }
    if (min > 0 && p < min) {
      this.priceError.set('El precio ideal no puede ser menor al precio mínimo');
      return false;
    }
    this.priceError.set('');
    return true;
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
    const v1 = this.validateName();
    const v2 = this.validateCost();
    const v3 = this.validateMinPrice();
    const v4 = this.validatePrice();

    if (!v1 || !v2 || !v3 || !v4) {
      this.notify.error('Por favor revisa los campos obligatorios del producto');
      return;
    }

    this.submitting.set(true);

    const variants = this.newProductVariants().map((v) => ({
      color: v.color || 'Estándar',
      stock: parseInt(v.stock, 10) || 0
    }));

    const success = this.inventoryService.addProduct({
      name: this.name().trim(),
      brand: this.brand().trim() || 'Genérico',
      model: this.model().trim() || 'Estándar',
      type: this.type(),
      category: this.category(),
      cost: parseFloat(this.cost()),
      minPrice: parseFloat(this.minPrice()),
      price: parseFloat(this.price()),
      sku: this.sku().trim() || `SKU-${Date.now().toString().slice(-6)}`,
      serial: this.serial().trim() || undefined,
      variants,
      location: this.location().trim() || 'Vitrina Principal'
    });

    this.submitting.set(false);
    if (success) {
      this.close.emit();
    }
  }
}

import { Component, input, output, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonComponent } from '../../../components/ui/button/button.component';
import { FieldComponent } from '../../../components/ui/field/field.component';
import { IconComponent } from '../../../components/ui/icon/icon.component';
import { SheetComponent } from '../../../components/ui/sheet/sheet.component';
import { Product } from '../../../types/inventory';
import { InventoryService } from '../../../core/services/inventory.service';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-product-edit-sheet',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
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

  name = signal('');
  sku = signal('');
  price = signal('');
  minPrice = signal('');
  cost = signal('');
  stock = signal('');

  nameError = signal('');
  skuError = signal('');
  priceError = signal('');
  minPriceError = signal('');
  costError = signal('');
  stockError = signal('');
  submitting = signal(false);

  ngOnInit() {
    const p = this.product();
    this.name.set(p.name);
    this.sku.set(p.sku);
    this.price.set(p.price.replace(/,/g, ''));
    this.cost.set(p.cost.replace(/,/g, ''));
    this.stock.set(p.stock.toString());

    const min = this.inventoryService.minPrices()[p.id];
    this.minPrice.set(min ? min.replace(/,/g, '') : (parseFloat(p.price.replace(/,/g, '')) * 0.9).toString());
  }

  onNameChange(val: string) {
    this.name.set(val);
    if (this.nameError()) this.validateName();
  }

  onSkuChange(val: string) {
    this.sku.set(val);
    if (this.skuError()) this.validateSku();
  }

  onPriceChange(val: string) {
    this.price.set(val);
    if (this.priceError()) this.validatePrice();
  }

  onMinPriceChange(val: string) {
    this.minPrice.set(val);
    if (this.minPriceError()) this.validateMinPrice();
  }

  onCostChange(val: string) {
    this.cost.set(val);
    if (this.costError()) this.validateCost();
  }

  onStockChange(val: string) {
    this.stock.set(val);
    if (this.stockError()) this.validateStock();
  }

  validateName(): boolean {
    if (!this.name().trim()) {
      this.nameError.set('El nombre no puede estar vacío');
      return false;
    }
    this.nameError.set('');
    return true;
  }

  validateSku(): boolean {
    if (!this.sku().trim()) {
      this.skuError.set('El SKU es obligatorio');
      return false;
    }
    this.skuError.set('');
    return true;
  }

  validatePrice(): boolean {
    const val = parseFloat(this.price());
    if (isNaN(val) || val <= 0) {
      this.priceError.set('Ingresa un precio válido');
      return false;
    }
    this.priceError.set('');
    return true;
  }

  validateMinPrice(): boolean {
    const val = parseFloat(this.minPrice());
    const p = parseFloat(this.price()) || 0;
    if (isNaN(val) || val <= 0) {
      this.minPriceError.set('Ingresa un precio mínimo válido');
      return false;
    }
    if (p > 0 && val > p) {
      this.minPriceError.set('El precio mínimo no puede ser mayor al precio ideal');
      return false;
    }
    this.minPriceError.set('');
    return true;
  }

  validateCost(): boolean {
    const val = parseFloat(this.cost());
    if (isNaN(val) || val <= 0) {
      this.costError.set('Ingresa un costo válido');
      return false;
    }
    this.costError.set('');
    return true;
  }

  validateStock(): boolean {
    const val = parseInt(this.stock(), 10);
    if (isNaN(val) || val < 0) {
      this.stockError.set('El stock debe ser un entero mayor o igual a 0');
      return false;
    }
    this.stockError.set('');
    return true;
  }

  submitForm(event: Event) {
    event.preventDefault();
    const v1 = this.validateName();
    const v2 = this.validateSku();
    const v3 = this.validatePrice();
    const v4 = this.validateMinPrice();
    const v5 = this.validateCost();
    const v6 = this.validateStock();

    if (!v1 || !v2 || !v3 || !v4 || !v5 || !v6) return;

    this.submitting.set(true);

    const priceNum = parseFloat(this.price());
    const costNum = parseFloat(this.cost());
    const stockNum = parseInt(this.stock(), 10);

    const success = this.inventoryService.updateProduct(this.product().id, {
      name: this.name().trim(),
      sku: this.sku().trim(),
      price: priceNum.toLocaleString('es-MX'),
      cost: costNum.toLocaleString('es-MX'),
      stock: stockNum
    });

    this.submitting.set(false);
    if (success) {
      this.close.emit();
    }
  }
}

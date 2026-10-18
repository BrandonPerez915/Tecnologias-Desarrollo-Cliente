import { Component, output, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AmountComponent } from '../../../components/ui/amount/amount.component';
import { ButtonComponent } from '../../../components/ui/button/button.component';
import { IconComponent } from '../../../components/ui/icon/icon.component';
import { SheetComponent } from '../../../components/ui/sheet/sheet.component';
import { Overlay } from '../../../types/navigation';
import { InventoryService } from '../../../core/services/inventory.service';
import { CashService } from '../../../core/services/cash.service';
import { NotificationService } from '../../../core/services/notification.service';
import { Product } from '../../../types/inventory';

@Component({
  selector: 'app-sale-sheet',
  standalone: true,
  imports: [CommonModule, FormsModule, AmountComponent, ButtonComponent, IconComponent, SheetComponent],
  templateUrl: './sale-sheet.component.html',
  styleUrls: ['./sale-sheet.component.css']
})
export class SaleSheetComponent {
  private inventoryService = inject(InventoryService);
  private cashService = inject(CashService);
  private notify = inject(NotificationService);

  open = output<Overlay>();
  close = output<void>();

  selectedPayment = signal<'cash' | 'transfer' | 'card'>('cash');
  selectedProduct = signal<Product | null>(null);
  quantity = signal<number>(1);
  searchQuery = '';
  isSearching = signal(false);
  itemError = signal(false);
  submitting = signal(false);

  constructor() {
    const list = this.inventoryService.products();
    if (list.length > 0) {
      this.selectedProduct.set(list[0]);
    }
  }

  searchResults = computed(() => {
    const q = this.searchQuery.toLowerCase().trim();
    if (!q) return [];
    return this.inventoryService.products().filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.sku.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q)
    ).slice(0, 5);
  });

  parsePrice(val: string): number {
    if (!val) return 0;
    return parseFloat(val.replace(/,/g, '')) || 0;
  }

  totalAmount = computed(() => {
    const p = this.selectedProduct();
    if (!p) return 0;
    return this.parsePrice(p.price) * this.quantity();
  });

  onSearchChange() {
    this.isSearching.set(this.searchQuery.trim().length > 0);
  }

  selectProduct(product: Product) {
    this.selectedProduct.set(product);
    this.quantity.set(1);
    this.isSearching.set(false);
    this.searchQuery = '';
    this.itemError.set(false);
  }

  clearProduct() {
    this.selectedProduct.set(null);
    this.quantity.set(1);
  }

  incrementQty() {
    const p = this.selectedProduct();
    if (p && this.quantity() < p.stock) {
      this.quantity.update(q => q + 1);
    }
  }

  decrementQty() {
    if (this.quantity() > 1) {
      this.quantity.update(q => q - 1);
    }
  }

  submitForm(event: Event) {
    event.preventDefault();
    const product = this.selectedProduct();
    if (!product) {
      this.itemError.set(true);
      this.notify.error('Debes seleccionar un artículo para la venta');
      return;
    }

    const qty = this.quantity();
    if (qty <= 0 || qty > product.stock) {
      this.notify.error(`Cantidad inválida (disponible: ${product.stock})`);
      return;
    }

    this.submitting.set(true);
    const amount = this.totalAmount();
    const paymentLabel = {
      cash: 'Efectivo',
      transfer: 'Transferencia',
      card: 'Tarjeta'
    }[this.selectedPayment()];

    this.cashService.registerSale({
      description: `Venta: ${product.name} (x${qty})`,
      amount,
      paymentMethod: paymentLabel
    });

    this.inventoryService.decrementStock(product.id, qty);

    this.notify.success(`Venta completada: MXN ${amount.toFixed(2)} (${paymentLabel})`);
    this.submitting.set(false);
    this.close.emit();
  }
}

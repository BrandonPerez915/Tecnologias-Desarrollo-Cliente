import { Component, input, output, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../../../components/ui/button/button.component';
import { IconComponent } from '../../../components/ui/icon/icon.component';
import { StatusBadgeComponent } from '../../../components/ui/status-badge/status-badge.component';
import { AmountComponent } from '../../../components/ui/amount/amount.component';
import {
  categoryLabels,
  colorLabels,
  minimumPrices,
  productIdentifiers,
  typeLabels,
} from '../../../data/mockData';
import { Product } from '../../../types/inventory';
import { Overlay } from '../../../types/navigation';
import { InventoryService } from '../../../core/services/inventory.service';

@Component({
  selector: 'app-product-detail-modal',
  standalone: true,
  imports: [
    CommonModule,
    ButtonComponent,
    IconComponent,
    StatusBadgeComponent,
    AmountComponent,
  ],
  templateUrl: './product-detail-modal.component.html',
  styleUrls: ['./product-detail-modal.component.css']
})
export class ProductDetailModalComponent implements OnInit, OnDestroy {
  private inventoryService = inject(InventoryService);

  product = input.required<Product>();
  detailColor = input.required<string>();
  detailColorChange = output<string>();
  open = output<Overlay>();
  edit = output<void>();
  close = output<void>();

  categoryLabels = categoryLabels;
  colorLabels = colorLabels;
  typeLabels = typeLabels;

  getCategoryLabel(category: string): string {
    return this.categoryLabels[category] || category;
  }

  getColorLabel(color: string): string {
    return this.colorLabels[color] || color;
  }

  getTypeLabel(type: string): string {
    return this.typeLabels[type] || type;
  }

  getMinPrice(): string {
    const id = this.product().id;
    return this.inventoryService.minPrices()[id] || (parseFloat(this.product().price.replace(/,/g, '')) * 0.9).toLocaleString('es-MX');
  }

  getIdentifier() {
    const id = this.product().id;
    const fromService = this.inventoryService.identifiers()[id];
    if (fromService) return fromService;
    return {
      barcode: '8901420' + String(id).padStart(6, '0'),
      serial: 'SN-' + id + '-DEMO',
      condition: 'Nuevo',
      added: 'Hoy'
    };
  }

  handleDelete() {
    if (confirm(`¿Estás seguro de eliminar "${this.product().name}" del inventario?`)) {
      this.inventoryService.deleteProduct(this.product().id);
      this.close.emit();
    }
  }

  private onKey = (event: KeyboardEvent) => {
    if (event.key === 'Escape') this.close.emit();
  };

  ngOnInit() {
    window.addEventListener('keydown', this.onKey);
  }

  ngOnDestroy() {
    window.removeEventListener('keydown', this.onKey);
  }

  get currentVariantStock(): number {
    return (
      this.product().variants.find((v) => v.color === this.detailColor())?.stock ?? 0
    );
  }

  get totalVariantStock(): number {
    return this.product().variants.reduce((total, v) => total + v.stock, 0);
  }

  getSwatchClass(color: string): string {
    return color.toLowerCase().replaceAll(' ', '-');
  }

  onBackdropClick(event: MouseEvent) {
    if (event.target === event.currentTarget) {
      this.close.emit();
    }
  }
}

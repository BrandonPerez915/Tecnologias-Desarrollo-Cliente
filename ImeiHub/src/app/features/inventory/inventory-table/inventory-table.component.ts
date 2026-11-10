import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../../../components/ui/button/button.component';
import { IconComponent } from '../../../components/ui/icon/icon.component';
import { colorLabels } from '../../../data/mockData';
import { Product, ProductVariant } from '../../../types/inventory';

@Component({
  selector: 'app-inventory-table',
  standalone: true,
  imports: [CommonModule, ButtonComponent, IconComponent],
  templateUrl: './inventory-table.component.html',
  styleUrls: ['./inventory-table.component.css']
})
export class InventoryTableComponent {
  products = input.required<Product[]>();
  selectedId = input.required<number>();
  colorFilter = input.required<string>();
  currentPage = input.required<number>();
  totalPages = input.required<number>();
  totalProductsCount = input.required<number>();
  productsPerPage = input.required<number>();
  selectProduct = output<Product>();
  pageChange = output<number>();
  resetCategory = output<void>();

  colorLabels = colorLabels;
  Math = Math;

  getColorLabel(color: string): string {
    return this.colorLabels[color] || color;
  }

  getDisplayedVariants(product: Product): ProductVariant[] {
    return this.colorFilter() === 'All variants'
      ? product.variants.slice(0, 3)
      : product.variants.filter((variant) => variant.color === this.colorFilter());
  }

  getDisplayedStock(product: Product): number {
    return this.colorFilter() === 'All variants'
      ? product.variants.reduce((total, variant) => total + variant.stock, 0)
      : this.getDisplayedVariants(product)[0]?.stock ?? 0;
  }

  getSwatchClass(color: string): string {
    return color.toLowerCase().replaceAll(' ', '-');
  }

  pages(): number[] {
    return Array.from({ length: this.totalPages() }, (_, index) => index + 1);
  }
}

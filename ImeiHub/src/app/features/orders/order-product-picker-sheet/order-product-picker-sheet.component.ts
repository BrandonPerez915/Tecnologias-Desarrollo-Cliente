import { Component, input, output, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonComponent } from '../../../components/ui/button/button.component';
import { IconComponent } from '../../../components/ui/icon/icon.component';
import { SheetComponent } from '../../../components/ui/sheet/sheet.component';
import { typeLabels } from '../../../data/mockData';
import { Product } from '../../../types/inventory';

@Component({
  selector: 'app-order-product-picker-sheet',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonComponent, IconComponent, SheetComponent],
  templateUrl: './order-product-picker-sheet.component.html',
  styleUrls: ['./order-product-picker-sheet.component.css']
})
export class OrderProductPickerSheetComponent {
  products = input.required<Product[]>();
  items = input.required<Record<number, number>>();
  totalItemsCount = input.required<number>();
  addProduct = output<{ id: number; name: string }>();
  close = output<void>();

  orderSearch = '';
  orderProductType = 'All types';
  orderStockFilter = 'Any stock';

  typeLabels = typeLabels;
  typeOptions = [
    'All types',
    'Smartphones',
    'Laptops',
    'Tablets',
    'Accessories',
  ];

  getTypeLabel(type: string): string {
    return this.typeLabels[type] || type;
  }

  filteredProducts = computed(() => {
    const list = this.products();
    const query = this.orderSearch.trim().toLowerCase();
    const pType = this.orderProductType;
    const sFilter = this.orderStockFilter;

    return list.filter((product) => {
      const matchesSearch =
        !query ||
        product.name.toLowerCase().includes(query) ||
        product.sku.toLowerCase().includes(query);
      const matchesType =
        pType === 'All types' || product.type === pType;
      const matchesStock =
        sFilter === 'Any stock' ||
        (sFilter === 'In stock' && product.stock > 2) ||
        (sFilter === 'Low stock' &&
          product.stock > 0 &&
          product.stock <= 2);
      return matchesSearch && matchesType && matchesStock;
    });
  });
}

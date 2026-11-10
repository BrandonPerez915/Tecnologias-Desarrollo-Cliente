import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonComponent } from '../../../components/ui/button/button.component';
import { SheetComponent } from '../../../components/ui/sheet/sheet.component';
import { colorLabels } from '../../../data/mockData';

@Component({
  selector: 'app-inventory-filters-sheet',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonComponent, SheetComponent],
  templateUrl: './inventory-filters-sheet.component.html',
  styleUrls: ['./inventory-filters-sheet.component.css']
})
export class InventoryFiltersSheetComponent {
  colors = input.required<string[]>();
  color = input.required<string>();
  colorChange = output<string>();
  minPrice = input.required<string>();
  minPriceChange = output<string>();
  maxPrice = input.required<string>();
  maxPriceChange = output<string>();
  stockStatus = input.required<string>();
  stockStatusChange = output<string>();
  sortBy = input.required<string>();
  sortByChange = output<string>();
  activeFilterCount = input.required<number>();
  visibleCount = input.required<number>();
  resetFilters = output<void>();
  close = output<void>();

  colorLabels = colorLabels;

  getColorLabel(color: string): string {
    return this.colorLabels[color] || color;
  }

  stockOptions = [
    { value: 'Any stock', label: 'Cualquier nivel' },
    { value: 'In stock', label: 'Disponible' },
    { value: 'Low stock', label: 'Stock bajo' },
    { value: 'Out of stock', label: 'Agotado' },
  ];

  sortOptions = [
    { value: 'Name A–Z', label: 'Nombre A–Z' },
    { value: 'Price: low to high', label: 'Precio: menor a mayor' },
    { value: 'Price: high to low', label: 'Precio: mayor a menor' },
    { value: 'Stock: high to low', label: 'Stock: mayor a menor' },
  ];
}

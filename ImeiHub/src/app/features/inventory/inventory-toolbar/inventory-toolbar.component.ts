import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonComponent } from '../../../components/ui/button/button.component';
import { IconComponent } from '../../../components/ui/icon/icon.component';
import { typeLabels } from '../../../data/mockData';
import { Product } from '../../../types/inventory';
import { Overlay } from '../../../types/navigation';

@Component({
  selector: 'app-inventory-toolbar',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonComponent, IconComponent],
  templateUrl: './inventory-toolbar.component.html',
  styleUrls: ['./inventory-toolbar.component.css']
})
export class InventoryToolbarComponent {
  inventorySearch = input.required<string>();
  inventorySearchChange = output<string>();
  inventorySearchOpen = input.required<boolean>();
  inventorySearchOpenChange = output<boolean>();
  inventorySuggestions = input.required<Product[]>();
  selectSuggestion = output<Product>();
  open = output<Overlay>();
  categories = input.required<string[]>();
  category = input.required<string>();
  categoryChange = output<string>();
  activeFilterCount = input.required<number>();
  openFilters = output<void>();

  typeLabels = typeLabels;

  onSearchChange(value: string) {
    this.inventorySearchChange.emit(value);
    this.inventorySearchOpenChange.emit(true);
  }

  onBlur() {
    window.setTimeout(() => this.inventorySearchOpenChange.emit(false), 120);
  }
}

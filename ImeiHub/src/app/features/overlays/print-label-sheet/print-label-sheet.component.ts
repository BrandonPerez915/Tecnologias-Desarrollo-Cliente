import { Component, inject, output, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonComponent } from '../../../components/ui/button/button.component';
import { IconComponent } from '../../../components/ui/icon/icon.component';
import { SheetComponent } from '../../../components/ui/sheet/sheet.component';
import { InventoryService } from '../../../core/services/inventory.service';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-print-label-sheet',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonComponent, IconComponent, SheetComponent],
  templateUrl: './print-label-sheet.component.html',
  styleUrls: ['./print-label-sheet.component.css']
})
export class PrintLabelSheetComponent {
  private inventoryService = inject(InventoryService);
  private notifyService = inject(NotificationService);

  close = output<void>();
  notify = output<string>();

  products = this.inventoryService.products;
  selectedProductId = signal<number>(this.products()[0]?.id ?? 1);

  selectedProduct = computed(() => {
    return this.products().find(p => p.id === Number(this.selectedProductId())) || this.products()[0];
  });

  printCopies = 1;
  Math = Math;

  onSelectProduct(val: any) {
    this.selectedProductId.set(Number(val));
  }

  handlePrint() {
    const p = this.selectedProduct();
    const msg = `${this.printCopies} ${
      this.printCopies === 1 ? 'etiqueta enviada' : 'etiquetas enviadas'
    } de "${p?.name || 'producto'}" a la impresora T8`;
    this.notifyService.show(msg, 'success');
    this.notify.emit(msg);
    this.close.emit();
  }
}

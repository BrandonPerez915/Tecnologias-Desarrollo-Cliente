import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../../../components/ui/icon/icon.component';
import { SheetComponent } from '../../../components/ui/sheet/sheet.component';
import { Order } from '../../../types/orders';

@Component({
  selector: 'app-open-orders-sheet',
  standalone: true,
  imports: [CommonModule, IconComponent, SheetComponent],
  templateUrl: './open-orders-sheet.component.html',
  styleUrls: ['./open-orders-sheet.component.css']
})
export class OpenOrdersSheetComponent {
  orders = input.required<Order[]>();
  activeOrder = input.required<string>();
  selectOrderChange = output<string>();
  close = output<void>();

  selectOrder(orderId: string) {
    this.selectOrderChange.emit(orderId);
    this.close.emit();
  }
}

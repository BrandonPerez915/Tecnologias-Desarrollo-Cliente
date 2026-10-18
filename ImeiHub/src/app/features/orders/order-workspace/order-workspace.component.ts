import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AmountComponent } from '../../../components/ui/amount/amount.component';
import { ButtonComponent } from '../../../components/ui/button/button.component';
import { IconComponent } from '../../../components/ui/icon/icon.component';
import { Product } from '../../../types/inventory';

export interface ActiveOrderItem {
  product: Product;
  quantity: number;
}

@Component({
  selector: 'app-order-workspace',
  standalone: true,
  imports: [CommonModule, AmountComponent, ButtonComponent, IconComponent],
  templateUrl: './order-workspace.component.html',
  styleUrls: ['./order-workspace.component.css']
})
export class OrderWorkspaceComponent {
  activeOrderName = input.required<string>();
  activeOrderCustomer = input.required<string>();
  customOrderType = input.required<string>();
  activeOrder = input.required<string>();
  ordersCount = input.required<number>();
  activeItems = input.required<ActiveOrderItem[]>();
  total = input.required<number>();
  openOrders = output<void>();
  openPicker = output<void>();
  updateQuantity = output<{ id: number; change: number }>();
  continueToCheckout = output<void>();

  get totalItemQuantity(): number {
    return this.activeItems().reduce((sum, item) => sum + item.quantity, 0);
  }

  get formattedTotal(): string {
    return this.total().toLocaleString('es-MX');
  }

  getSubtotal(item: ActiveOrderItem): string {
    const unitPrice = Number(item.product.price.replaceAll(',', ''));
    return (unitPrice * item.quantity).toLocaleString('es-MX');
  }
}

import { Component, output, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../../../components/ui/button/button.component';
import { PageHeadingComponent } from '../../../components/ui/page-heading/page-heading.component';
import { NewOrderSheetComponent } from '../new-order-sheet/new-order-sheet.component';
import { OpenOrdersSheetComponent } from '../open-orders-sheet/open-orders-sheet.component';
import { OrderCheckoutViewComponent } from '../order-checkout-view/order-checkout-view.component';
import { OrderProductPickerSheetComponent } from '../order-product-picker-sheet/order-product-picker-sheet.component';
import { OrderWorkspaceComponent, ActiveOrderItem } from '../order-workspace/order-workspace.component';
import { Order } from '../../../types/orders';
import { InventoryService } from '../../../core/services/inventory.service';
import { OrdersService } from '../../../core/services/orders.service';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [
    CommonModule,
    ButtonComponent,
    PageHeadingComponent,
    NewOrderSheetComponent,
    OpenOrdersSheetComponent,
    OrderCheckoutViewComponent,
    OrderProductPickerSheetComponent,
    OrderWorkspaceComponent,
  ],
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent {
  inventoryService = inject(InventoryService);
  private ordersService = inject(OrdersService);
  private notifyService = inject(NotificationService);

  notify = output<string>();

  private ordersList = signal<Order[]>([
    {
      id: '1042',
      name: '#1042',
      customer: 'Cliente de mostrador',
      items: 3,
      total: '18,247',
    },
    {
      id: '1041',
      name: '#1041',
      customer: 'María Santos',
      items: 2,
      total: '6,948',
    },
    {
      id: '1040',
      name: '#1040',
      customer: 'Emeka Phones',
      items: 4,
      total: '26,847',
    },
  ]);

  private orderItemsStore = signal<Record<string, Record<number, number>>>({
    '1042': { 1: 1, 3: 2 },
    '1041': { 2: 1, 4: 1 },
    '1040': { 1: 2, 5: 2 },
  });

  activeOrder = signal('1042');
  showPicker = signal(false);
  showCheckout = signal(false);
  showOrders = signal(false);
  showNewOrder = signal(false);
  customOrderType = signal('');

  items = computed<Record<number, number>>(() => {
    return this.orderItemsStore()[this.activeOrder()] || {};
  });

  orders = computed<Order[]>(() => {
    const prods = this.inventoryService.products();
    const store = this.orderItemsStore();
    return this.ordersList().map((order) => {
      const orderItems = store[order.id] || {};
      const count = Object.values(orderItems).reduce(
        (sum, quantity) => sum + quantity,
        0
      );
      const totalNum = Object.entries(orderItems).reduce((sum, [id, qty]) => {
        const p = prods.find((pr) => pr.id === Number(id));
        return sum + (p ? Number(String(p.price).replace(/,/g, '')) * qty : 0);
      }, 0);

      return {
        ...order,
        items: count,
        total: totalNum > 0 ? totalNum.toLocaleString('es-MX') : order.total,
      };
    });
  });

  activeItems = computed<ActiveOrderItem[]>(() => {
    const prods = this.inventoryService.products();
    return Object.entries(this.items())
      .map(([id, quantity]) => {
        const prod = prods.find((p) => p.id === Number(id));
        return prod ? { product: prod, quantity } : null;
      })
      .filter((item): item is ActiveOrderItem => item !== null);
  });

  total = computed(() => {
    return this.activeItems().reduce(
      (sum, item) =>
        sum + Number(String(item.product.price).replaceAll(',', '')) * item.quantity,
      0
    );
  });

  totalItemCount = computed(() =>
    this.activeItems().reduce((sum, item) => sum + item.quantity, 0)
  );

  activeOrderRecord = computed(() =>
    this.orders().find((o) => o.id === this.activeOrder())
  );

  activeOrderName = computed(
    () => this.activeOrderRecord()?.name ?? `#${this.activeOrder()}`
  );

  activeOrderCustomer = computed(
    () => this.activeOrderRecord()?.customer ?? 'Sin cliente asignado'
  );

  updateQuantity(id: number, change: number) {
    const currentOrderId = this.activeOrder();
    this.orderItemsStore.update((store) => {
      const current = store[currentOrderId] || {};
      const next = Math.max(0, (current[id] ?? 0) + change);
      let updatedOrderItems: Record<number, number>;
      if (next === 0) {
        const { [id]: _removed, ...rest } = current;
        updatedOrderItems = rest;
      } else {
        updatedOrderItems = { ...current, [id]: next };
      }
      return { ...store, [currentOrderId]: updatedOrderItems };
    });
  }

  handleAddProduct(productId: number, productName: string) {
    this.updateQuantity(productId, 1);
    this.notifyService.success(`${productName} añadido a la orden`);
  }

  handleCreateNewOrder(name: string, type: string) {
    const existingIds = this.ordersList()
      .map((o) => parseInt(o.id.replace(/\D/g, ''), 10))
      .filter((n) => !isNaN(n));
    const nextNum = existingIds.length > 0 ? Math.max(...existingIds) + 1 : 1043;
    const nextId = String(nextNum);
    const orderName = name.trim() || `#${nextId}`;
    const customer = type === 'Mayorista' ? 'Distribuidor mayorista' : 'Cliente minorista';

    const newOrder: Order = {
      id: nextId,
      name: orderName,
      customer,
      items: 0,
      total: '0',
    };

    this.ordersList.update((list) => [newOrder, ...list]);
    this.orderItemsStore.update((store) => ({ ...store, [nextId]: {} }));
    this.activeOrder.set(nextId);
    this.customOrderType.set(type);
    this.showNewOrder.set(false);
    this.notifyService.success(`Orden ${orderName} creada exitosamente`);
  }

  onCheckoutComplete() {
    for (const item of this.activeItems()) {
      this.inventoryService.decrementStock(item.product.id, item.quantity);
    }
    const currentOrderId = this.activeOrder();
    this.orderItemsStore.update((store) => ({ ...store, [currentOrderId]: {} }));
    this.showCheckout.set(false);
  }
}

import { Injectable, signal, computed } from '@angular/core';
import { Product } from '../../types/inventory';
import { NotificationService } from './notification.service';
import { CashService } from './cash.service';

export interface OrderEntry {
  id: number;
  name: string;
  customer: string;
  status: 'En espera' | 'Completada' | 'Pagada';
  itemsCount: number;
}

export interface OrderItem {
  product: Product;
  quantity: number;
}

const initialOrders: OrderEntry[] = [
  { id: 1042, name: '#1042', customer: 'Cliente de mostrador', status: 'En espera', itemsCount: 3 },
  { id: 1041, name: '#1041', customer: 'María Santos', status: 'En espera', itemsCount: 2 },
  { id: 1040, name: '#1040', customer: 'Emeka Phones', status: 'Pagada', itemsCount: 4 },
];

@Injectable({
  providedIn: 'root'
})
export class OrdersService {
  private ordersSignal = signal<OrderEntry[]>([...initialOrders]);
  private orderItemsSignal = signal<Record<number, OrderItem[]>>({});
  private activeOrderIdSignal = signal<number>(initialOrders[0].id);

  orders = this.ordersSignal.asReadonly();
  activeOrderId = this.activeOrderIdSignal.asReadonly();

  activeOrder = computed(() => {
    return this.ordersSignal().find((o) => o.id === this.activeOrderIdSignal()) || this.ordersSignal()[0];
  });

  activeOrderItems = computed(() => {
    return this.orderItemsSignal()[this.activeOrderIdSignal()] || [];
  });

  activeOrderTotal = computed(() => {
    return this.activeOrderItems().reduce((total, item) => {
      const price = Number(item.product.price.replace(/,/g, '')) || 0;
      return total + price * item.quantity;
    }, 0);
  });

  constructor(
    private notify: NotificationService,
    private cashService: CashService
  ) {}

  selectOrder(id: number) {
    this.activeOrderIdSignal.set(id);
  }

  createOrder(customerName?: string): OrderEntry {
    const nextId = Math.max(...this.ordersSignal().map((o) => o.id), 0) + 1;
    const newOrder: OrderEntry = {
      id: nextId,
      name: `#${nextId}`,
      customer: customerName?.trim() || 'Cliente en mostrador',
      status: 'En espera',
      itemsCount: 0
    };

    this.ordersSignal.update((list) => [newOrder, ...list]);
    this.orderItemsSignal.update((map) => ({ ...map, [nextId]: [] }));
    this.activeOrderIdSignal.set(nextId);
    this.notify.success(`Nueva orden ${newOrder.name} creada`);
    return newOrder;
  }

  addItemToActiveOrder(product: Product) {
    const orderId = this.activeOrderIdSignal();
    const current = this.orderItemsSignal()[orderId] || [];
    const existingIndex = current.findIndex((i) => i.product.id === product.id);

    let updated: OrderItem[];
    if (existingIndex >= 0) {
      updated = current.map((item, idx) =>
        idx === existingIndex ? { ...item, quantity: item.quantity + 1 } : item
      );
    } else {
      updated = [...current, { product, quantity: 1 }];
    }

    this.orderItemsSignal.update((map) => ({ ...map, [orderId]: updated }));
    this.updateOrderSummary(orderId, updated);
  }

  updateItemQuantity(productId: number, delta: number) {
    const orderId = this.activeOrderIdSignal();
    const current = this.orderItemsSignal()[orderId] || [];
    const updated = current
      .map((item) =>
        item.product.id === productId
          ? { ...item, quantity: Math.max(0, item.quantity + delta) }
          : item
      )
      .filter((item) => item.quantity > 0);

    this.orderItemsSignal.update((map) => ({ ...map, [orderId]: updated }));
    this.updateOrderSummary(orderId, updated);
  }

  checkoutActiveOrder(paymentMethod: string, amount: number) {
    const order = this.activeOrder();
    this.cashService.registerSale(amount, paymentMethod, `Orden ${order.name}`);

    // Update order status
    this.ordersSignal.update((list) =>
      list.map((o) => (o.id === order.id ? { ...o, status: 'Pagada' as any } : o))
    );
  }

  private updateOrderSummary(orderId: number, items: OrderItem[]) {
    const count = items.reduce((sum, i) => sum + i.quantity, 0);
    this.ordersSignal.update((list) =>
      list.map((o) => (o.id === orderId ? { ...o, itemsCount: count } : o))
    );
  }
}

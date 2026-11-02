import { Injectable, signal, computed, inject } from '@angular/core';
import { Product } from '../../types/inventory';
import { NotificationService } from './notification.service';
import { CashService } from './cash.service';
import { ApiService } from './api.service';

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

@Injectable({
  providedIn: 'root'
})
export class OrdersService {
  private api = inject(ApiService);
  private notify = inject(NotificationService);
  private cashService = inject(CashService);

  private ordersSignal = signal<OrderEntry[]>([]);
  private orderItemsSignal = signal<Record<number, OrderItem[]>>({});
  private activeOrderIdSignal = signal<number>(0);

  private loadingSignal = signal<boolean>(false);
  private errorSignal = signal<string | null>(null);

  orders = this.ordersSignal.asReadonly();
  activeOrderId = this.activeOrderIdSignal.asReadonly();
  loading = this.loadingSignal.asReadonly();
  error = this.errorSignal.asReadonly();

  activeOrder = computed(() => {
    return this.ordersSignal().find((o) => o.id === this.activeOrderIdSignal()) || this.ordersSignal()[0];
  });

  activeOrderItems = computed(() => {
    const id = this.activeOrderIdSignal();
    return id ? (this.orderItemsSignal()[id] || []) : [];
  });

  activeOrderTotal = computed(() => {
    return this.activeOrderItems().reduce((total, item) => {
      const price = Number(item.product.price.replace(/,/g, '')) || 0;
      return total + price * item.quantity;
    }, 0);
  });

  constructor() {
    this.fetchOrders();
  }

  fetchOrders() {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.api.get<OrderEntry[]>('/orders').subscribe({
      next: (data) => {
        if (data && data.length > 0) {
          this.ordersSignal.set(data);
          this.activeOrderIdSignal.set(data[0].id);
        } else {
          this.ordersSignal.set([]);
          this.activeOrderIdSignal.set(0);
        }
        this.loadingSignal.set(false);
      },
      error: (err) => {
        this.errorSignal.set(err?.message || 'Error al cargar órdenes');
        this.loadingSignal.set(false);
      }
    });
  }

  clear() {
    this.ordersSignal.set([]);
    this.orderItemsSignal.set({});
    this.activeOrderIdSignal.set(0);
  }

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

    // Optimistic update
    this.ordersSignal.update((list) => [newOrder, ...list]);
    this.orderItemsSignal.update((map) => ({ ...map, [nextId]: [] }));
    this.activeOrderIdSignal.set(nextId);

    this.api.post<OrderEntry>('/orders', newOrder).subscribe({
      next: (created) => {
        this.notify.success(`Nueva orden ${created.name} creada`);
      },
      error: () => {
        // Keeps optimistic for offline resilience
        this.notify.success(`Nueva orden ${newOrder.name} creada (local)`);
      }
    });

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

    // Update order status in UI
    this.ordersSignal.update((list) =>
      list.map((o) => (o.id === order.id ? { ...o, status: 'Pagada' as any } : o))
    );

    this.api.post(`/orders/${order.id}/checkout`, { paymentMethod, amount }).subscribe({
      next: () => {
        this.notify.success(`Orden ${order.name} cobrada con éxito`);
      },
      error: () => {
        this.notify.info(`Orden ${order.name} cobrada`);
      }
    });
  }

  private updateOrderSummary(orderId: number, items: OrderItem[]) {
    const count = items.reduce((sum, i) => sum + i.quantity, 0);
    this.ordersSignal.update((list) =>
      list.map((o) => (o.id === orderId ? { ...o, itemsCount: count } : o))
    );
  }
}

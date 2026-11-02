import { Injectable, signal, inject } from '@angular/core';
import { Product, ProductIdentifier } from '../../types/inventory';

import { ApiService } from './api.service';
import { NotificationService } from './notification.service';
import { finalize } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InventoryService {
  private api = inject(ApiService);
  private notify = inject(NotificationService);

  private productsSignal = signal<Product[]>([]);
  private identifiersSignal = signal<Record<number, ProductIdentifier>>({});
  private minPricesSignal = signal<Record<number, string>>({});

  private loadingSignal = signal<boolean>(false);
  private errorSignal = signal<string | null>(null);

  products = this.productsSignal.asReadonly();
  identifiers = this.identifiersSignal.asReadonly();
  minPrices = this.minPricesSignal.asReadonly();
  loading = this.loadingSignal.asReadonly();
  error = this.errorSignal.asReadonly();

  constructor() {
    this.fetchProducts();
  }

  fetchProducts(): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    this.api.get<Product[]>('/products')
      .pipe(finalize(() => this.loadingSignal.set(false)))
      .subscribe({
        next: (items) => {
          this.productsSignal.set(items);

          const idMap: Record<number, ProductIdentifier> = {};
          const minMap: Record<number, string> = {};

          for (const item of items) {
            if (item.identifier) {
              idMap[item.id] = item.identifier;
            } else {
              idMap[item.id] = {
                barcode: '8901420' + String(item.id).padStart(6, '0'),
                serial: 'SN-' + item.id + '-TEMPORAL',
                condition: 'Nuevo · Sellado',
                added: 'Hoy'
              };
            }
            minMap[item.id] = item.minPrice || (parseFloat(String(item.price).replace(/,/g, '')) * 0.9).toLocaleString('es-MX');
          }

          this.identifiersSignal.set(idMap);
          this.minPricesSignal.set(minMap);
        },
        error: (err) => {
          const msg = err.message || 'No fue posible cargar el inventario desde el servidor';
          this.errorSignal.set(msg);
        }
      });
  }

  getProductById(id: number): Product | undefined {
    return this.productsSignal().find((p) => p.id === id);
  }

  addProduct(newProduct: {
    name: string;
    brand: string;
    model: string;
    type: string;
    category: string;
    price: number;
    cost: number;
    minPrice: number;
    sku: string;
    serial?: string;
    variants: { color: string; stock: number }[];
    location?: string;
  }, callback?: (success: boolean) => void): void {
    if (!newProduct.name?.trim()) {
      this.notify.error('El nombre del producto es obligatorio');
      if (callback) callback(false);
      return;
    }
    if (!newProduct.price || newProduct.price <= 0) {
      this.notify.error('El precio debe ser un número mayor a 0');
      if (callback) callback(false);
      return;
    }

    this.api.post<Product>('/products', newProduct).subscribe({
      next: (created) => {
        this.productsSignal.update((list) => [created, ...list]);

        if (created.identifier) {
          this.identifiersSignal.update((map) => ({ ...map, [created.id]: created.identifier! }));
        }
        if (created.minPrice) {
          this.minPricesSignal.update((map) => ({ ...map, [created.id]: created.minPrice! }));
        }

        this.notify.success(`Producto "${created.name}" agregado con éxito`);
        if (callback) callback(true);
      },
      error: () => {
        if (callback) callback(false);
      }
    });
  }

  updateProduct(id: number, changes: Partial<Product>, callback?: (success: boolean) => void): void {
    this.api.put<Product>(`/products/${id}`, changes).subscribe({
      next: (updated) => {
        this.productsSignal.update((list) =>
          list.map((p) => (p.id === id ? { ...p, ...updated } : p))
        );
        if (updated.minPrice) {
          this.minPricesSignal.update((map) => ({ ...map, [id]: updated.minPrice! }));
        }
        this.notify.success(`Datos de "${updated.name}" actualizados`);
        if (callback) callback(true);
      },
      error: () => {
        if (callback) callback(false);
      }
    });
  }

  deleteProduct(id: number, callback?: (success: boolean) => void): void {
    const exists = this.getProductById(id);
    this.api.delete<{ message: string; id: number }>(`/products/${id}`).subscribe({
      next: () => {
        this.productsSignal.update((list) => list.filter((p) => p.id !== id));
        this.notify.show(`"${exists?.name || 'Producto'}" eliminado del inventario`, 'neutral');
        if (callback) callback(true);
      },
      error: () => {
        if (callback) callback(false);
      }
    });
  }

  findProductByCode(code: string): Product | undefined {
    const clean = code.trim().toLowerCase();
    if (!clean) return undefined;

    const direct = this.productsSignal().find(
      (p) =>
        p.sku.toLowerCase() === clean ||
        p.name.toLowerCase().includes(clean)
    );
    if (direct) return direct;

    const idMap = this.identifiersSignal();
    for (const [idStr, ident] of Object.entries(idMap)) {
      if (
        ident.barcode.toLowerCase() === clean ||
        ident.serial.toLowerCase() === clean
      ) {
        return this.getProductById(Number(idStr));
      }
    }

    return undefined;
  }

  decrementStock(id: number, quantity = 1) {
    const prod = this.getProductById(id);
    if (prod) {
      const nextStock = Math.max(0, prod.stock - quantity);
      this.updateProduct(id, { stock: nextStock });
    }
  }

  clear(): void {
    this.productsSignal.set([]);
    this.identifiersSignal.set({});
    this.minPricesSignal.set({});
  }
}

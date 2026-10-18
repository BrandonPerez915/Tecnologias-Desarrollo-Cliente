import { Injectable, signal } from '@angular/core';
import { products, productIdentifiers, minimumPrices } from '../../data/mockData';
import { Product, ProductIdentifier } from '../../types/inventory';
import { NotificationService } from './notification.service';

@Injectable({
  providedIn: 'root'
})
export class InventoryService {
  private productsSignal = signal<Product[]>([...products]);
  private identifiersSignal = signal<Record<number, ProductIdentifier>>({ ...productIdentifiers });
  private minPricesSignal = signal<Record<number, string>>({ ...minimumPrices });

  products = this.productsSignal.asReadonly();
  identifiers = this.identifiersSignal.asReadonly();
  minPrices = this.minPricesSignal.asReadonly();

  constructor(private notify: NotificationService) {}

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
  }): boolean {
    if (!newProduct.name?.trim()) {
      this.notify.error('El nombre del producto es obligatorio');
      return false;
    }
    if (!newProduct.price || newProduct.price <= 0) {
      this.notify.error('El precio debe ser un número mayor a 0');
      return false;
    }

    const nextId = Math.max(...this.productsSignal().map((p) => p.id), 0) + 1;
    const totalStock = newProduct.variants.reduce((sum, v) => sum + (v.stock || 0), 0);

    const product: Product = {
      id: nextId,
      name: newProduct.name.trim(),
      sku: newProduct.sku?.trim() || `SKU-${nextId}`,
      stock: totalStock,
      price: newProduct.price.toLocaleString('es-MX'),
      cost: (newProduct.cost || newProduct.price * 0.85).toLocaleString('es-MX'),
      type: newProduct.type || 'Accessories',
      category: newProduct.category || 'Phones',
      location: newProduct.location || 'Vitrina Principal',
      variants: newProduct.variants.length > 0 ? newProduct.variants : [{ color: 'Estándar', stock: 1 }]
    };

    this.productsSignal.update((list) => [product, ...list]);

    // Always ensure identifiers exist for any product
    this.identifiersSignal.update((map) => ({
      ...map,
      [nextId]: {
        barcode: '8901420' + String(nextId).padStart(6, '0'),
        serial: newProduct.serial?.trim() || `SN-${nextId}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
        condition: 'Nuevo',
        added: 'Hoy'
      }
    }));

    this.minPricesSignal.update((map) => ({
      ...map,
      [nextId]: (newProduct.minPrice || newProduct.price * 0.9).toLocaleString('es-MX')
    }));

    this.notify.success(`Producto "${product.name}" agregado con éxito`);
    return true;
  }

  updateProduct(id: number, changes: Partial<Product>): boolean {
    const exists = this.getProductById(id);
    if (!exists) {
      this.notify.error('Producto no encontrado');
      return false;
    }

    this.productsSignal.update((list) =>
      list.map((p) => (p.id === id ? { ...p, ...changes } : p))
    );
    this.notify.success(`Datos de "${exists.name}" actualizados`);
    return true;
  }

  deleteProduct(id: number): boolean {
    const exists = this.getProductById(id);
    if (!exists) {
      this.notify.error('Producto no encontrado');
      return false;
    }

    this.productsSignal.update((list) => list.filter((p) => p.id !== id));
    this.notify.show(`"${exists.name}" eliminado del inventario`, 'neutral');
    return true;
  }

  findProductByCode(code: string): Product | undefined {
    const clean = code.trim().toLowerCase();
    if (!clean) return undefined;

    // Check SKU or Name in products
    const direct = this.productsSignal().find(
      (p) =>
        p.sku.toLowerCase() === clean ||
        p.name.toLowerCase().includes(clean)
    );
    if (direct) return direct;

    // Check barcode or serial in identifiers
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
    this.productsSignal.update((list) =>
      list.map((p) => (p.id === id ? { ...p, stock: Math.max(0, p.stock - quantity) } : p))
    );
  }
}

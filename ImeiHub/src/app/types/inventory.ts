export interface ProductVariant {
  color: string;
  stock: number;
}

export interface Product {
  id: number;
  name: string;
  sku: string;
  stock: number;
  price: string;
  cost: string;
  type: string;
  category: string;
  location: string;
  variants: ProductVariant[];
}

export interface ProductIdentifier {
  barcode: string;
  serial: string;
  condition: string;
  added: string;
}

export interface NewProductVariantRow {
  id: number;
  color: string;
  stock: string;
}

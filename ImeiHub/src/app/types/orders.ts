export interface Order {
  id: string;
  name: string;
  customer: string;
  items: number;
  total: string;
}

export type PaymentMethod = "Efectivo" | "Transferencia" | "Tarjeta";

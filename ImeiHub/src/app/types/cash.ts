export interface CashEntry {
  id?: number | string;
  time: string;
  title: string;
  note: string;
  amount: string;
  kind: "in" | "out";
}

export interface SoldProduct {
  time: string;
  product: string;
  quantity: number;
  method: string;
  total: string;
}

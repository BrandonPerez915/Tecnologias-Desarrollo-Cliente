export interface LoanEntry {
  item: string;
  serial: string;
  fullSerial: string;
  stall: string;
  person: string;
  age: string;
  status: string;
  tone: 'success' | 'warning' | 'danger' | 'neutral';
  loanedAt: string;
  dueAt: string;
  condition: string;
  agreedPrice: string;
  notes: string;
}

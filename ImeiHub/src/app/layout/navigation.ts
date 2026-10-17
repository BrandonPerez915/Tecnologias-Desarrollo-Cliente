import { IconName } from '../shared/components/icon/icon';

export interface NavItem {
  path: string;
  label: string;
  shortLabel?: string;
  icon: IconName;
  badge?: number;
}

export const NAV_ITEMS: NavItem[] = [
  { path: '/dashboard', label: 'Panel', icon: 'home' },
  { path: '/cash', label: 'Movimientos', shortLabel: 'Movim.', icon: 'cash' },
  { path: '/orders', label: 'Órdenes', icon: 'receipt', badge: 3 },
  { path: '/inventory', label: 'Inventario', icon: 'box' },
  { path: '/loans', label: 'Préstamos', shortLabel: 'Prést.', icon: 'swap', badge: 4 },
];

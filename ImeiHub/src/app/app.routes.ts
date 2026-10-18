import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { guestGuard } from './core/guards/guest.guard';
import { LoginComponent } from './features/auth/login/login.component';
import { RegisterComponent } from './features/auth/register/register.component';
import { AppShellComponent } from './components/layout/app-shell/app-shell.component';
import { DashboardComponent } from './features/dashboard/dashboard/dashboard.component';
import { CashFlowComponent } from './features/cash/cash-flow/cash-flow.component';
import { OrdersComponent } from './features/orders/orders/orders.component';
import { InventoryComponent } from './features/inventory/inventory/inventory.component';
import { LoansComponent } from './features/loans/loans/loans.component';
import { CashCloseComponent } from './features/cash/cash-close/cash-close.component';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [guestGuard],
    title: 'ImeiHub · Iniciar sesión'
  },
  {
    path: 'register',
    component: RegisterComponent,
    canActivate: [guestGuard],
    title: 'ImeiHub · Crear cuenta'
  },
  {
    path: '',
    component: AppShellComponent,
    canActivate: [authGuard],
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        component: DashboardComponent,
        title: 'ImeiHub · Panel'
      },
      {
        path: 'cash',
        component: CashFlowComponent,
        title: 'ImeiHub · Movimientos de caja'
      },
      {
        path: 'orders',
        component: OrdersComponent,
        title: 'ImeiHub · Órdenes de venta'
      },
      {
        path: 'inventory',
        component: InventoryComponent,
        title: 'ImeiHub · Inventario y series'
      },
      {
        path: 'loans',
        component: LoansComponent,
        title: 'ImeiHub · Préstamos entre puestos'
      },
      {
        path: 'close',
        component: CashCloseComponent,
        title: 'ImeiHub · Cierre de turno'
      }
    ]
  },
  {
    path: '**',
    redirectTo: 'dashboard'
  }
];

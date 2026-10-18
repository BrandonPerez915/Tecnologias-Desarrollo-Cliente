import { Component, input, output, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AmountComponent } from '../../../components/ui/amount/amount.component';
import { ButtonComponent } from '../../../components/ui/button/button.component';
import { FieldComponent } from '../../../components/ui/field/field.component';
import { IconComponent } from '../../../components/ui/icon/icon.component';
import { PageHeadingComponent } from '../../../components/ui/page-heading/page-heading.component';
import { StatusBadgeComponent } from '../../../components/ui/status-badge/status-badge.component';
import { PaymentMethod } from '../../../types/orders';
import { IconName } from '../../../types/icons';
import { ActiveOrderItem } from '../order-workspace/order-workspace.component';
import { OrdersService } from '../../../core/services/orders.service';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-order-checkout-view',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    AmountComponent,
    ButtonComponent,
    FieldComponent,
    IconComponent,
    PageHeadingComponent,
    StatusBadgeComponent,
  ],
  templateUrl: './order-checkout-view.component.html',
  styleUrls: ['./order-checkout-view.component.css']
})
export class OrderCheckoutViewComponent {
  private ordersService = inject(OrdersService);
  private notifyService = inject(NotificationService);

  activeOrderName = input.required<string>();
  activeOrderCustomer = input.required<string>();
  activeItems = input.required<ActiveOrderItem[]>();
  total = input.required<number>();
  back = output<void>();
  complete = output<void>();
  notify = output<string>();

  paymentMethod: PaymentMethod = 'Efectivo';
  generateInvoice = false;
  printTicket = true;

  cashReceived = signal('');
  cashError = signal('');

  transferRef = signal('');

  cardLast4 = signal('');
  cardAuth = signal('');
  cardAuthError = signal('');

  invoiceName = signal('');
  invoiceRfc = signal('');
  invoiceEmail = signal('');
  invoiceNameError = signal('');
  invoiceRfcError = signal('');
  invoiceEmailError = signal('');

  paymentMethods: { name: PaymentMethod; icon: IconName; detail: string }[] = [
    { name: 'Efectivo', icon: 'cash', detail: 'Pago en caja' },
    { name: 'Transferencia', icon: 'swap', detail: 'Transferencia bancaria' },
    { name: 'Tarjeta', icon: 'cash', detail: 'Débito o crédito' },
  ];

  get totalItemCount(): number {
    return this.activeItems().reduce((sum, item) => sum + item.quantity, 0);
  }

  get estimatedChange(): string {
    const val = parseFloat(this.cashReceived()) || 0;
    return Math.max(0, val - this.total()).toLocaleString('es-MX');
  }

  getSubtotal(item: ActiveOrderItem): string {
    const unitPrice = Number(item.product.price.replaceAll(',', ''));
    return (unitPrice * item.quantity).toLocaleString('es-MX');
  }

  onCashReceivedChange(value: string) {
    this.cashReceived.set(value);
    if (this.cashError()) this.validateCashReceived();
  }

  validateCashReceived(): boolean {
    const val = parseFloat(this.cashReceived());
    if (isNaN(val) || val <= 0) {
      this.cashError.set('Ingresa la cantidad recibida');
      return false;
    }
    if (val < this.total()) {
      this.cashError.set(`El importe recibido debe cubrir al menos MXN ${this.total().toLocaleString('es-MX')}`);
      return false;
    }
    this.cashError.set('');
    return true;
  }

  onCardAuthChange(value: string) {
    this.cardAuth.set(value);
    if (this.cardAuthError()) this.validateCardAuth();
  }

  validateCardAuth(): boolean {
    if (!this.cardAuth().trim()) {
      this.cardAuthError.set('Ingresa el código de autorización del voucher');
      return false;
    }
    this.cardAuthError.set('');
    return true;
  }

  onInvoiceNameChange(val: string) {
    this.invoiceName.set(val);
    if (this.invoiceNameError()) this.validateInvoiceName();
  }

  validateInvoiceName(): boolean {
    if (!this.invoiceName().trim()) {
      this.invoiceNameError.set('Ingresa la razón social');
      return false;
    }
    this.invoiceNameError.set('');
    return true;
  }

  onInvoiceRfcChange(val: string) {
    this.invoiceRfc.set(val);
    if (this.invoiceRfcError()) this.validateInvoiceRfc();
  }

  validateInvoiceRfc(): boolean {
    const rfc = this.invoiceRfc().trim().toUpperCase();
    if (!rfc) {
      this.invoiceRfcError.set('Ingresa el RFC del cliente');
      return false;
    }
    if (rfc.length < 12 || rfc.length > 13) {
      this.invoiceRfcError.set('El RFC debe contener entre 12 y 13 caracteres');
      return false;
    }
    this.invoiceRfcError.set('');
    return true;
  }

  onInvoiceEmailChange(val: string) {
    this.invoiceEmail.set(val);
    if (this.invoiceEmailError()) this.validateInvoiceEmail();
  }

  validateInvoiceEmail(): boolean {
    const email = this.invoiceEmail().trim();
    if (!email) {
      this.invoiceEmailError.set('Ingresa el correo para envío de factura');
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      this.invoiceEmailError.set('Ingresa un correo electrónico válido');
      return false;
    }
    this.invoiceEmailError.set('');
    return true;
  }

  submitPayment(event: Event) {
    event.preventDefault();

    if (this.paymentMethod === 'Efectivo') {
      if (!this.validateCashReceived()) return;
    } else if (this.paymentMethod === 'Tarjeta') {
      if (!this.validateCardAuth()) return;
    }

    if (this.generateInvoice) {
      const v1 = this.validateInvoiceName();
      const v2 = this.validateInvoiceRfc();
      const v3 = this.validateInvoiceEmail();
      if (!v1 || !v2 || !v3) return;
    }

    this.ordersService.checkoutActiveOrder(this.paymentMethod, this.total());

    const message = `Pago con ${this.paymentMethod.toLowerCase()} de MXN ${this.total().toLocaleString('es-MX')} registrado correctamente${
      this.printTicket ? ' · Ticket enviado a impresión' : ''
    }${this.generateInvoice ? ' · Factura timbrada' : ''}`;

    this.notifyService.success(message);
    this.notify.emit(message);
    this.complete.emit();
  }
}

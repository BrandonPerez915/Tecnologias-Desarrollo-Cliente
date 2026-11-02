import { Component, input, output, signal, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
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
    ReactiveFormsModule,
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

  checkoutForm = new FormGroup({
    paymentMethod: new FormControl<PaymentMethod>('Efectivo', { nonNullable: true }),
    cashReceived: new FormControl('', { nonNullable: true }),
    transferRef: new FormControl('', { nonNullable: true }),
    cardAuth: new FormControl('', { nonNullable: true }),
    generateInvoice: new FormControl(false, { nonNullable: true }),
    printTicket: new FormControl(true, { nonNullable: true }),
    invoiceName: new FormControl('', { nonNullable: true }),
    invoiceRfc: new FormControl('', { nonNullable: true }),
    invoiceEmail: new FormControl('', { nonNullable: true })
  });

  paymentMethods: { name: PaymentMethod; icon: IconName; detail: string }[] = [
    { name: 'Efectivo', icon: 'cash', detail: 'Pago en caja' },
    { name: 'Transferencia', icon: 'swap', detail: 'Transferencia bancaria' },
    { name: 'Tarjeta', icon: 'cash', detail: 'Débito o crédito' },
  ];

  get paymentMethod(): PaymentMethod {
    return this.checkoutForm.controls.paymentMethod.value;
  }

  get generateInvoice(): boolean {
    return this.checkoutForm.controls.generateInvoice.value;
  }

  get printTicket(): boolean {
    return this.checkoutForm.controls.printTicket.value;
  }

  get totalItemCount(): number {
    return this.activeItems().reduce((sum, item) => sum + item.quantity, 0);
  }

  get estimatedChange(): string {
    const val = parseFloat(this.checkoutForm.controls.cashReceived.value) || 0;
    return Math.max(0, val - this.total()).toLocaleString('es-MX');
  }

  getSubtotal(item: ActiveOrderItem): string {
    const unitPrice = Number(item.product.price.replaceAll(',', ''));
    return (unitPrice * item.quantity).toLocaleString('es-MX');
  }

  setPaymentMethod(method: PaymentMethod) {
    this.checkoutForm.controls.paymentMethod.setValue(method);
  }

  toggleInvoice(checked: boolean) {
    this.checkoutForm.controls.generateInvoice.setValue(checked);
  }

  togglePrintTicket(checked: boolean) {
    this.checkoutForm.controls.printTicket.setValue(checked);
  }

  get cashError(): string {
    const ctrl = this.checkoutForm.controls.cashReceived;
    if (!ctrl.touched && !ctrl.dirty) return '';
    const val = parseFloat(ctrl.value);
    if (isNaN(val) || val <= 0) return 'Ingresa la cantidad recibida';
    if (val < this.total()) return `El importe debe cubrir al menos MXN ${this.total().toLocaleString('es-MX')}`;
    return '';
  }

  get cardAuthError(): string {
    const ctrl = this.checkoutForm.controls.cardAuth;
    if (!ctrl.touched && !ctrl.dirty) return '';
    if (!ctrl.value.trim()) return 'Ingresa el código de autorización del voucher';
    return '';
  }

  get invoiceNameError(): string {
    const ctrl = this.checkoutForm.controls.invoiceName;
    if (!ctrl.touched && !ctrl.dirty) return '';
    if (!ctrl.value.trim()) return 'Ingresa la razón social';
    return '';
  }

  get invoiceRfcError(): string {
    const ctrl = this.checkoutForm.controls.invoiceRfc;
    if (!ctrl.touched && !ctrl.dirty) return '';
    const rfc = ctrl.value.trim().toUpperCase();
    if (!rfc) return 'Ingresa el RFC del cliente';
    if (rfc.length < 12 || rfc.length > 13) return 'El RFC debe contener entre 12 y 13 caracteres';
    return '';
  }

  get invoiceEmailError(): string {
    const ctrl = this.checkoutForm.controls.invoiceEmail;
    if (!ctrl.touched && !ctrl.dirty) return '';
    const email = ctrl.value.trim();
    if (!email) return 'Ingresa el correo para envío de factura';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Ingresa un correo electrónico válido';
    return '';
  }

  isFormValid(): boolean {
    const values = this.checkoutForm.getRawValue();
    const tot = this.total();

    if (values.paymentMethod === 'Efectivo') {
      const cash = parseFloat(values.cashReceived);
      if (isNaN(cash) || cash < tot) return false;
    } else if (values.paymentMethod === 'Tarjeta') {
      if (!values.cardAuth.trim()) return false;
    }

    if (values.generateInvoice) {
      if (!values.invoiceName.trim()) return false;
      const rfc = values.invoiceRfc.trim();
      if (rfc.length < 12 || rfc.length > 13) return false;
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.invoiceEmail.trim())) return false;
    }

    return true;
  }

  submitPayment(event: Event) {
    event.preventDefault();

    if (!this.isFormValid()) {
      this.checkoutForm.markAllAsTouched();
      return;
    }

    const formValues = this.checkoutForm.getRawValue();

    this.ordersService.checkoutActiveOrder(formValues.paymentMethod, this.total());

    const message = `Pago con ${formValues.paymentMethod.toLowerCase()} de MXN ${this.total().toLocaleString('es-MX')} registrado correctamente${
      formValues.printTicket ? ' · Ticket enviado a impresión' : ''
    }${formValues.generateInvoice ? ' · Factura timbrada' : ''}`;

    this.notifyService.success(message);
    this.notify.emit(message);
    this.complete.emit();
  }
}

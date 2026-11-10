import { Component, inject, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScannerModalComponent } from '../scanner-modal/scanner-modal.component';
import { QuickActionsSheetComponent } from '../quick-actions-sheet/quick-actions-sheet.component';
import { ExpenseSheetComponent } from '../expense-sheet/expense-sheet.component';
import { SaleSheetComponent } from '../sale-sheet/sale-sheet.component';
import { PrintLabelSheetComponent } from '../print-label-sheet/print-label-sheet.component';
import { LoanSheetComponent } from '../loan-sheet/loan-sheet.component';
import { Overlay } from '../../../types/navigation';
import { OverlayService } from '../../../core/services/overlay.service';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-overlay-manager',
  standalone: true,
  imports: [
    CommonModule,
    ScannerModalComponent,
    QuickActionsSheetComponent,
    ExpenseSheetComponent,
    SaleSheetComponent,
    PrintLabelSheetComponent,
    LoanSheetComponent,
  ],
  templateUrl: './overlay-manager.component.html'
})
export class OverlayManagerComponent {
  private overlayService = inject(OverlayService);
  private notifyService = inject(NotificationService);

  overlayInput = input<Overlay>(null, { alias: 'overlay' });
  close = output<void>();
  open = output<Overlay>();
  notify = output<string>();

  get activeOverlay(): () => Overlay {
    return () => this.overlayInput() || this.overlayService.overlay();
  }

  handleClose() {
    this.overlayService.close();
    this.close.emit();
  }

  handleOpen(target: Overlay) {
    this.overlayService.open(target);
    this.open.emit(target);
  }

  handleNotify(msg: string) {
    this.notifyService.show(msg);
    this.notify.emit(msg);
  }
}

import { Component, output, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../../../components/ui/button/button.component';
import { IconComponent } from '../../../components/ui/icon/icon.component';
import { PageHeadingComponent } from '../../../components/ui/page-heading/page-heading.component';
import { StatusBadgeComponent } from '../../../components/ui/status-badge/status-badge.component';
import { ConfirmReturnModalComponent } from '../confirm-return-modal/confirm-return-modal.component';
import { LoanDetailModalComponent } from '../loan-detail-modal/loan-detail-modal.component';
import { LoanEntry } from '../../../types/loans';
import { Overlay } from '../../../types/navigation';
import { LoansService } from '../../../core/services/loans.service';
import { OverlayService } from '../../../core/services/overlay.service';

@Component({
  selector: 'app-loans',
  standalone: true,
  imports: [
    CommonModule,
    ButtonComponent,
    IconComponent,
    PageHeadingComponent,
    StatusBadgeComponent,
    ConfirmReturnModalComponent,
    LoanDetailModalComponent,
  ],
  templateUrl: './loans.component.html',
  styleUrls: ['./loans.component.css']
})
export class LoansComponent {
  loansService = inject(LoansService);
  private overlayService = inject(OverlayService);

  open = output<Overlay>();
  notify = output<string>();

  selectedLoan = signal<LoanEntry | null>(null);
  confirmReturnLoan = signal<LoanEntry | null>(null);

  openLoanSheet() {
    this.open.emit('loan');
    this.overlayService.open('loan');
  }

  handleReturnSuccess(loan: LoanEntry) {
    this.loansService.markAsReturned(loan.fullSerial || loan.serial || loan.item);
    this.confirmReturnLoan.set(null);
    this.selectedLoan.set(null);
  }

  onRowKeyDown(event: KeyboardEvent, loan: LoanEntry) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.selectedLoan.set(loan);
    }
  }
}

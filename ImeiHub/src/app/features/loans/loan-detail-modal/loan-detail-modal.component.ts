import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../../../components/ui/button/button.component';
import { IconComponent } from '../../../components/ui/icon/icon.component';
import { SheetComponent } from '../../../components/ui/sheet/sheet.component';
import { StatusBadgeComponent } from '../../../components/ui/status-badge/status-badge.component';
import { LoanEntry } from '../../../types/loans';

@Component({
  selector: 'app-loan-detail-modal',
  standalone: true,
  imports: [
    CommonModule,
    ButtonComponent,
    IconComponent,
    SheetComponent,
    StatusBadgeComponent,
  ],
  templateUrl: './loan-detail-modal.component.html',
  styleUrls: ['./loan-detail-modal.component.css']
})
export class LoanDetailModalComponent {
  loan = input.required<LoanEntry>();
  confirmReturn = output<LoanEntry>();
  close = output<void>();
}

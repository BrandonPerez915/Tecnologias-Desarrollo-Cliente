import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../../../components/ui/button/button.component';
import { IconComponent } from '../../../components/ui/icon/icon.component';
import { SheetComponent } from '../../../components/ui/sheet/sheet.component';
import { LoanEntry } from '../../../types/loans';

@Component({
  selector: 'app-confirm-return-modal',
  standalone: true,
  imports: [CommonModule, ButtonComponent, IconComponent, SheetComponent],
  templateUrl: './confirm-return-modal.component.html',
  styleUrls: ['./confirm-return-modal.component.css']
})
export class ConfirmReturnModalComponent {
  loan = input.required<LoanEntry>();
  success = output<LoanEntry>();
  close = output<void>();
}

import { Component, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../../../components/ui/icon/icon.component';
import { SheetComponent } from '../../../components/ui/sheet/sheet.component';
import { Overlay } from '../../../types/navigation';

@Component({
  selector: 'app-quick-actions-sheet',
  standalone: true,
  imports: [CommonModule, IconComponent, SheetComponent],
  templateUrl: './quick-actions-sheet.component.html',
  styleUrls: ['./quick-actions-sheet.component.css']
})
export class QuickActionsSheetComponent {
  open = output<Overlay>();
  close = output<void>();
}

import { Component, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../../../components/ui/icon/icon.component';
import { Overlay, Screen } from '../../../types/navigation';

@Component({
  selector: 'app-quick-actions-grid',
  standalone: true,
  imports: [CommonModule, IconComponent],
  templateUrl: './quick-actions-grid.component.html',
  styleUrls: ['./quick-actions-grid.component.css']
})
export class QuickActionsGridComponent {
  open = output<Overlay>();
  navigate = output<Screen>();
}

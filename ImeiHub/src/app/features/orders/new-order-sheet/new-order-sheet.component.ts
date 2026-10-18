import { Component, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonComponent } from '../../../components/ui/button/button.component';
import { IconComponent } from '../../../components/ui/icon/icon.component';
import { SheetComponent } from '../../../components/ui/sheet/sheet.component';

@Component({
  selector: 'app-new-order-sheet',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonComponent, IconComponent, SheetComponent],
  templateUrl: './new-order-sheet.component.html',
  styleUrls: ['./new-order-sheet.component.css']
})
export class NewOrderSheetComponent {
  createOrder = output<{ name: string; type: string }>();
  close = output<void>();

  newOrderName = '';
  newOrderType = 'Minorista';

  submitForm() {
    this.createOrder.emit({
      name: this.newOrderName,
      type: this.newOrderType,
    });
  }
}

import { Component, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { ButtonComponent } from '../../../components/ui/button/button.component';
import { IconComponent } from '../../../components/ui/icon/icon.component';
import { SheetComponent } from '../../../components/ui/sheet/sheet.component';

@Component({
  selector: 'app-new-order-sheet',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ButtonComponent, IconComponent, SheetComponent],
  templateUrl: './new-order-sheet.component.html',
  styleUrls: ['./new-order-sheet.component.css']
})
export class NewOrderSheetComponent {
  createOrder = output<{ name: string; type: string }>();
  close = output<void>();

  orderForm = new FormGroup({
    name: new FormControl('', { nonNullable: true }),
    type: new FormControl<'Minorista' | 'Mayorista'>('Minorista', {
      nonNullable: true,
      validators: [Validators.required]
    })
  });

  selectType(type: 'Minorista' | 'Mayorista') {
    this.orderForm.controls.type.setValue(type);
  }

  submitForm() {
    if (this.orderForm.invalid) {
      return;
    }
    const val = this.orderForm.getRawValue();
    this.createOrder.emit({
      name: val.name.trim(),
      type: val.type,
    });
  }
}

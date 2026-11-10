import { Component, input, output, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IconComponent } from '../icon/icon.component';
import { IconName } from '../../../types/icons';

@Component({
  selector: 'app-field',
  standalone: true,
  imports: [CommonModule, FormsModule, IconComponent],
  encapsulation: ViewEncapsulation.None,
  templateUrl: './field.component.html',
  styleUrls: ['./field.component.css']
})
export class FieldComponent {
  label = input.required<string>();
  placeholder = input<string>('');
  type = input<string>('text');
  inputMode = input<string>('text');
  min = input<number | undefined>(undefined);
  icon = input<IconName | undefined>(undefined);
  value = input<string>('');
  autocomplete = input<string>('');
  disabled = input<boolean>(false);
  required = input<boolean>(false);
  hint = input<string>('');
  valueChange = output<string>();
  blur = output<void>();
  error = input<string>('');

  onValueChange(val: string) {
    this.valueChange.emit(val);
  }
}

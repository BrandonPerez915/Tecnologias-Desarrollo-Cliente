import { Component, input, output, signal, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'app-password-field',
  standalone: true,
  imports: [CommonModule, FormsModule, IconComponent],
  encapsulation: ViewEncapsulation.None,
  templateUrl: './password-field.component.html',
  styleUrls: ['./password-field.component.css']
})
export class PasswordFieldComponent {
  id = input<string>('password-input');
  label = input<string>('Contraseña');
  placeholder = input<string>('••••••••');
  autocomplete = input<string>('current-password');
  disabled = input<boolean>(false);
  required = input<boolean>(false);
  value = input<string>('');
  error = input<string>('');
  hint = input<string>('');

  valueChange = output<string>();
  blur = output<void>();

  showPassword = signal(false);

  toggleShowPassword() {
    this.showPassword.update((val) => !val);
  }

  onValueChange(val: string) {
    this.valueChange.emit(val);
  }
}

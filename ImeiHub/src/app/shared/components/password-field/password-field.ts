import {
  ChangeDetectionStrategy,
  Component,
  booleanAttribute,
  input,
  model,
  output,
  signal,
} from '@angular/core';
import { Icon } from '../icon/icon';

let nextId = 0;

@Component({
  selector: 'app-password-field',
  imports: [Icon],
  templateUrl: './password-field.html',
  styleUrl: './password-field.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PasswordField {
  readonly label = input('Contraseña');
  readonly value = model('');
  readonly placeholder = input('••••••••');
  readonly autocomplete = input('current-password');
  readonly hint = input('');
  readonly error = input('');
  readonly required = input(false, { transform: booleanAttribute });
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly blurred = output<void>();

  protected readonly inputId = `password-${nextId++}`;
  protected readonly visible = signal(false);

  protected toggle() {
    this.visible.update((v) => !v);
  }

  protected onInput(event: Event) {
    this.value.set((event.target as HTMLInputElement).value);
  }
}

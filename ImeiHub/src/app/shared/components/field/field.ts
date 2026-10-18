import {
  ChangeDetectionStrategy,
  Component,
  booleanAttribute,
  input,
  model,
  output,
} from '@angular/core';
import { Icon, IconName } from '../icon/icon';

@Component({
  selector: 'app-field',
  imports: [Icon],
  templateUrl: './field.html',
  styleUrl: './field.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Field {
  readonly label = input.required<string>();
  readonly value = model('');
  readonly type = input('text');
  readonly placeholder = input('');
  readonly inputMode = input('text');
  readonly autocomplete = input<string | null>(null);
  readonly icon = input<IconName | null>(null);
  readonly hint = input('');
  readonly error = input('');
  readonly required = input(false, { transform: booleanAttribute });
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly blurred = output<void>();

  protected onInput(event: Event) {
    this.value.set((event.target as HTMLInputElement).value);
  }
}

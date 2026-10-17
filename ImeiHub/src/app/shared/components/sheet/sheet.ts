import { ChangeDetectionStrategy, Component, booleanAttribute, input, output } from '@angular/core';
import { IconButton } from '../icon-button/icon-button';

let nextId = 0;

@Component({
  selector: 'app-sheet',
  imports: [IconButton],
  templateUrl: './sheet.html',
  styleUrl: './sheet.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '(document:keydown.escape)': 'closed.emit()',
  },
})
export class Sheet {
  readonly title = input.required<string>();
  readonly subtitle = input('');
  readonly wide = input(false, { transform: booleanAttribute });
  readonly closed = output<void>();

  protected readonly titleId = `sheet-title-${nextId++}`;

  protected onBackdrop(event: MouseEvent) {
    if (event.target === event.currentTarget) {
      this.closed.emit();
    }
  }
}

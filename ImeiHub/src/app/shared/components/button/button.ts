import { ChangeDetectionStrategy, Component, booleanAttribute, input } from '@angular/core';
import { Icon, IconName } from '../icon/icon';

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost';

@Component({
  selector: 'button[app-button]',
  imports: [Icon],
  templateUrl: './button.html',
  styleUrl: './button.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': '"btn-" + variant()',
    '[class.full]': 'fullWidth()',
    '[class.has-badge]': 'badge() !== null',
    '[attr.type]': 'type()',
  },
})
export class Button {
  readonly variant = input<ButtonVariant>('primary');
  readonly icon = input<IconName | null>(null);
  readonly type = input<'button' | 'submit' | 'reset'>('button');
  readonly fullWidth = input(false, { transform: booleanAttribute });
  readonly badge = input<number | string | null>(null);
}

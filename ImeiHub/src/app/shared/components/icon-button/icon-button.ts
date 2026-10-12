import { ChangeDetectionStrategy, Component, booleanAttribute, input } from '@angular/core';
import { Icon, IconName } from '../icon/icon';

export type IconButtonVariant = 'outline' | 'soft' | 'bare';

@Component({
  selector: 'button[app-icon-button]',
  imports: [Icon],
  template: `
    <app-icon [name]="icon()" />
    @if (dot()) {
      <span class="dot"></span>
    }
  `,
  styleUrl: './icon-button.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    type: 'button',
    '[class]': 'variant()',
    '[attr.aria-label]': 'label()',
  },
})
export class IconButton {
  readonly icon = input.required<IconName>();
  readonly label = input.required<string>();
  readonly variant = input<IconButtonVariant>('outline');
  readonly dot = input(false, { transform: booleanAttribute });
}

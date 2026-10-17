import { ChangeDetectionStrategy, Component, input } from '@angular/core';

export type AmountSize = 'normal' | 'large' | 'hero';

@Component({
  selector: 'app-amount',
  template: `
    <span class="currency">{{ currency() }}</span>
    <span><ng-content /></span>
  `,
  styleUrl: './amount.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'size()',
  },
})
export class Amount {
  readonly size = input<AmountSize>('normal');
  readonly currency = input('MXN');
}

import { ChangeDetectionStrategy, Component, booleanAttribute, input } from '@angular/core';

export type StatusTone = 'success' | 'warning' | 'danger' | 'neutral';

@Component({
  selector: 'app-status-badge',
  template: `
    @if (dot()) {
      <span class="dot"></span>
    }
    <ng-content />
  `,
  styleUrl: './status-badge.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'tone()',
  },
})
export class StatusBadge {
  readonly tone = input<StatusTone>('neutral');
  readonly dot = input(true, { transform: booleanAttribute });
}

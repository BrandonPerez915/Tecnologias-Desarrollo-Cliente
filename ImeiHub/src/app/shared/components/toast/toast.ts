import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { NotificationTone } from '../../../core/services/notifications';
import { Icon, IconName } from '../icon/icon';

const icons: Record<NotificationTone, IconName> = {
  success: 'check',
  warning: 'warning',
  danger: 'warning',
  neutral: 'bell',
};

@Component({
  selector: 'app-toast',
  imports: [Icon],
  template: `
    <span class="icon"><app-icon [name]="icon()" [size]="16" /></span>
    <strong>{{ message() }}</strong>
  `,
  styleUrl: './toast.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    role: 'status',
    'aria-live': 'polite',
    '[class]': 'tone()',
  },
})
export class Toast {
  readonly message = input.required<string>();
  readonly tone = input<NotificationTone>('success');

  protected readonly icon = computed(() => icons[this.tone()]);
}

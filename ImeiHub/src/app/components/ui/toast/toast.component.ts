import { Component, input, computed, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../icon/icon.component';
import { IconName } from '../../../types/icons';
import { NotificationType } from '../../../core/services/notification.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule, IconComponent],
  encapsulation: ViewEncapsulation.None,
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.css']
})
export class ToastComponent {
  message = input.required<string>();
  type = input<NotificationType>('success');

  iconName = computed<IconName>(() => {
    switch (this.type()) {
      case 'error':
      case 'danger':
        return 'close';
      case 'warning':
        return 'warning';
      case 'info':
      case 'neutral':
        return 'info';
      case 'success':
      default:
        return 'check';
    }
  });

  toastClass = computed<string>(() => {
    switch (this.type()) {
      case 'error':
      case 'danger':
        return 'toast--danger';
      case 'warning':
        return 'toast--warning';
      case 'info':
      case 'neutral':
        return 'toast--info';
      case 'success':
      default:
        return 'toast--success';
    }
  });

  ariaRole = computed<'alert' | 'status'>(() => {
    const type = this.type();
    return type === 'error' || type === 'danger' || type === 'warning' ? 'alert' : 'status';
  });
}

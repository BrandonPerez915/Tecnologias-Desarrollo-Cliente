import { Injectable, signal } from '@angular/core';

export type NotificationType = 'success' | 'danger' | 'warning' | 'neutral';

export interface ToastNotification {
  id: number;
  message: string;
  type: NotificationType;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private currentToast = signal<ToastNotification | null>(null);
  private timer: number | null = null;
  private counter = 0;

  toast = this.currentToast.asReadonly();

  show(message: string, type: NotificationType = 'success', duration = 2800) {
    if (this.timer !== null) {
      window.clearTimeout(this.timer);
    }

    const toast: ToastNotification = {
      id: ++this.counter,
      message,
      type
    };

    this.currentToast.set(toast);

    this.timer = window.setTimeout(() => {
      this.clear();
    }, duration);
  }

  success(message: string, duration?: number) {
    this.show(message, 'success', duration);
  }

  error(message: string, duration?: number) {
    this.show(message, 'danger', duration);
  }

  warning(message: string, duration?: number) {
    this.show(message, 'warning', duration);
  }

  clear() {
    this.currentToast.set(null);
    if (this.timer !== null) {
      window.clearTimeout(this.timer);
      this.timer = null;
    }
  }
}

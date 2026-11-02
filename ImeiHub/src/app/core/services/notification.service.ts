import { Injectable, signal } from '@angular/core';

export type NotificationType = 'success' | 'error' | 'danger' | 'warning' | 'info' | 'neutral';

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

  show(message: string, type: NotificationType = 'success', duration = 3000) {
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

  success(message: string, duration = 2800) {
    this.show(message, 'success', duration);
  }

  error(message: string, duration = 3800) {
    this.show(message, 'error', duration);
  }

  danger(message: string, duration = 3800) {
    this.show(message, 'danger', duration);
  }

  warning(message: string, duration = 3500) {
    this.show(message, 'warning', duration);
  }

  info(message: string, duration = 3000) {
    this.show(message, 'info', duration);
  }

  clear() {
    this.currentToast.set(null);
    if (this.timer !== null) {
      window.clearTimeout(this.timer);
      this.timer = null;
    }
  }
}

import { Injectable, signal } from '@angular/core';

export type NotificationTone = 'success' | 'danger' | 'warning' | 'neutral';

export interface ToastMessage {
  id: number;
  message: string;
  tone: NotificationTone;
}

@Injectable({ providedIn: 'root' })
export class Notifications {
  private readonly current = signal<ToastMessage | null>(null);
  private timer: ReturnType<typeof setTimeout> | null = null;
  private counter = 0;

  readonly toast = this.current.asReadonly();

  show(message: string, tone: NotificationTone = 'success', duration = 2800) {
    this.clearTimer();
    this.current.set({ id: ++this.counter, message, tone });
    this.timer = setTimeout(() => this.clear(), duration);
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
    this.clearTimer();
    this.current.set(null);
  }

  private clearTimer() {
    if (this.timer !== null) {
      clearTimeout(this.timer);
      this.timer = null;
    }
  }
}

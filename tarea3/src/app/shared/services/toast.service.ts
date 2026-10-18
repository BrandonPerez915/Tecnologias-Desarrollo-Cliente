import { Injectable, signal } from '@angular/core';
import { ToastMessage } from '../models/toast.model';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  private readonly _toast = signal<ToastMessage | null>(null);
  public readonly toast = this._toast.asReadonly();
  private timer: ReturnType<typeof setTimeout> | null = null;

  show(message: string, icon = 'info', type: 'success' | 'info' | 'error' = 'success', duration = 2500): void {
    if (this.timer) {
      clearTimeout(this.timer);
    }

    const toastItem: ToastMessage = {
      id: Date.now().toString(),
      message,
      icon,
      type,
      duration,
    };

    this._toast.set(toastItem);

    this.timer = setTimeout(() => {
      this._toast.set(null);
      this.timer = null;
    }, duration);
  }

  clear(): void {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
    this._toast.set(null);
  }
}

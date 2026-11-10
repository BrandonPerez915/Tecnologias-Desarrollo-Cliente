import { Injectable, signal } from '@angular/core';
import { Overlay } from '../../types/navigation';

@Injectable({
  providedIn: 'root'
})
export class OverlayService {
  private currentOverlay = signal<Overlay>(null);

  overlay = this.currentOverlay.asReadonly();

  open(overlay: Overlay) {
    this.currentOverlay.set(overlay);
  }

  close() {
    this.currentOverlay.set(null);
  }
}

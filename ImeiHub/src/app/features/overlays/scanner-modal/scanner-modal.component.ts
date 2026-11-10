import { Component, output, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IconComponent } from '../../../components/ui/icon/icon.component';
import { ButtonComponent } from '../../../components/ui/button/button.component';
import { InventoryService } from '../../../core/services/inventory.service';
import { OverlayService } from '../../../core/services/overlay.service';
import { NotificationService } from '../../../core/services/notification.service';
import { Product } from '../../../types/inventory';

@Component({
  selector: 'app-scanner-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, IconComponent, ButtonComponent],
  templateUrl: './scanner-modal.component.html',
  styleUrls: ['./scanner-modal.component.css']
})
export class ScannerModalComponent {
  private inventoryService = inject(InventoryService);
  private overlayService = inject(OverlayService);
  private notifyService = inject(NotificationService);
  private router = inject(Router);

  close = output<void>();
  notify = output<string>();

  flashlightOn = signal(false);
  manualCode = '';
  detectedProduct = signal<Product | null>(null);

  quickProducts = () => this.inventoryService.products().slice(0, 3);

  toggleFlashlight() {
    this.flashlightOn.update((v) => !v);
    this.notifyService.show(
      this.flashlightOn() ? 'Linterna activada' : 'Linterna apagada',
      'neutral'
    );
  }

  handleSearchCode() {
    if (!this.manualCode.trim()) return;
    const found = this.inventoryService.findProductByCode(this.manualCode);
    if (found) {
      this.detectedProduct.set(found);
      this.notifyService.success(`Encontrado: ${found.name}`);
    } else {
      this.notifyService.error(`No se encontró ningún artículo con "${this.manualCode}"`);
    }
  }

  selectQuickCode(code: string) {
    this.manualCode = code;
    this.handleSearchCode();
  }

  handleSimulateRandom() {
    const list = this.inventoryService.products();
    if (list.length > 0) {
      const random = list[Math.floor(Math.random() * list.length)];
      this.detectedProduct.set(random);
      this.notifyService.success(`Código escaneado: ${random.name}`);
    }
  }

  handleSimulateGallery() {
    this.handleSimulateRandom();
  }

  clearDetection() {
    this.detectedProduct.set(null);
    this.manualCode = '';
  }

  proceedToSale() {
    this.close.emit();
    this.overlayService.open('sale');
  }

  proceedToLoan() {
    this.close.emit();
    this.overlayService.open('loan');
  }
}

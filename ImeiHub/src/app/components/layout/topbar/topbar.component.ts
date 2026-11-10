import { Component, input, output, signal, ElementRef, viewChild, OnDestroy, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../../ui/icon/icon.component';
import { ProfilePopoverComponent } from '../profile-popover/profile-popover.component';
import { Screen } from '../../../types/navigation';
import { AuthService } from '../../../core/services/auth.service';

const titles: Record<Screen, string> = {
  landing: 'Inicio',
  home: 'Panel',
  cash: 'Movimientos',
  orders: 'Órdenes',
  inventory: 'Inventario',
  loans: 'Préstamos',
  close: 'Cierre de caja',
  login: 'Iniciar sesión',
  register: 'Crear cuenta',
};

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [CommonModule, IconComponent, ProfilePopoverComponent],
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.css']
})
export class TopbarComponent implements OnInit, OnDestroy {
  private authService = inject(AuthService);

  screen = input.required<Screen>();
  openSidebar = output<void>();
  notify = output<string>();
  navigate = output<Screen>();

  profileOpen = signal(false);
  profileRef = viewChild<ElementRef<HTMLDivElement>>('profileRef');

  user = this.authService.user;

  userInitials(): string {
    const name = this.user()?.name || 'Ada Okafor';
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  }

  private profileCloseTimer: number | null = null;
  private onPointerDown = (event: PointerEvent) => {
    const el = this.profileRef()?.nativeElement;
    if (el && !el.contains(event.target as Node)) {
      this.profileOpen.set(false);
    }
  };

  title(): string {
    return titles[this.screen()] || 'Panel';
  }

  ngOnInit() {
    document.addEventListener('pointerdown', this.onPointerDown);
  }

  ngOnDestroy() {
    document.removeEventListener('pointerdown', this.onPointerDown);
    if (this.profileCloseTimer !== null) {
      window.clearTimeout(this.profileCloseTimer);
    }
  }

  openProfile() {
    if (this.profileCloseTimer !== null) {
      window.clearTimeout(this.profileCloseTimer);
      this.profileCloseTimer = null;
    }
    this.profileOpen.set(true);
  }

  scheduleProfileClose() {
    this.profileCloseTimer = window.setTimeout(() => {
      this.profileOpen.set(false);
    }, 220);
  }

  toggleProfile() {
    this.profileOpen.update((open) => !open);
  }

  onFocusOut(event: FocusEvent) {
    const target = event.relatedTarget as Node | null;
    const currentTarget = event.currentTarget as HTMLElement | null;
    if (currentTarget && (!target || !currentTarget.contains(target))) {
      this.profileOpen.set(false);
    }
  }
}

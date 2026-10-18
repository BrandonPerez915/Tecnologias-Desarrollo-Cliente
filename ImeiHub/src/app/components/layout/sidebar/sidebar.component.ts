import { Component, inject, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../../ui/icon/icon.component';
import { BrandLogoComponent } from '../../ui/brand-logo/brand-logo.component';
import { navItems } from '../../../data/navigation';
import { Screen } from '../../../types/navigation';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, IconComponent, BrandLogoComponent],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  private authService = inject(AuthService);

  open = input<boolean>(false);
  activeScreen = input.required<Screen>();
  navigate = output<Screen>();
  close = output<void>();

  items = navItems;

  logout() {
    this.authService.logout();
    this.close.emit();
  }
}

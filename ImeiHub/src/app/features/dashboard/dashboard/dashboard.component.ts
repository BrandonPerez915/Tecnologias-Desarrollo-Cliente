import { Component, output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ButtonComponent } from '../../../components/ui/button/button.component';
import { IconComponent } from '../../../components/ui/icon/icon.component';
import { PageHeadingComponent } from '../../../components/ui/page-heading/page-heading.component';
import { CashHeroCardComponent } from '../cash-hero-card/cash-hero-card.component';
import { MetricCardComponent } from '../metric-card/metric-card.component';
import { QuickActionsGridComponent } from '../quick-actions-grid/quick-actions-grid.component';
import { Overlay, Screen } from '../../../types/navigation';
import { CashService } from '../../../core/services/cash.service';
import { AuthService } from '../../../core/services/auth.service';
import { OverlayService } from '../../../core/services/overlay.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    ButtonComponent,
    IconComponent,
    PageHeadingComponent,
    CashHeroCardComponent,
    MetricCardComponent,
    QuickActionsGridComponent,
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  cashService = inject(CashService);
  private authService = inject(AuthService);
  private router = inject(Router);
  private overlayService = inject(OverlayService);

  user = this.authService.user;

  open = output<Overlay>();
  navigate = output<Screen>();

  onNavigate(screen: Screen) {
    this.navigate.emit(screen);
    const route = screen === 'home' ? '/dashboard' : `/${screen}`;
    this.router.navigate([route]);
  }

  onOpenOverlay(overlay: Overlay) {
    this.open.emit(overlay);
    this.overlayService.open(overlay);
  }
}

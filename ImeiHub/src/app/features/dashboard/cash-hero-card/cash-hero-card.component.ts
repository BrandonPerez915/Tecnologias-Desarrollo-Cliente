import { Component, output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AmountComponent } from '../../../components/ui/amount/amount.component';
import { IconComponent } from '../../../components/ui/icon/icon.component';
import { Screen } from '../../../types/navigation';
import { CashService } from '../../../core/services/cash.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-cash-hero-card',
  standalone: true,
  imports: [CommonModule, AmountComponent, IconComponent],
  templateUrl: './cash-hero-card.component.html',
  styleUrls: ['./cash-hero-card.component.css']
})
export class CashHeroCardComponent {
  cashService = inject(CashService);
  private authService = inject(AuthService);
  private router = inject(Router);

  user = this.authService.user;
  navigate = output<Screen>();

  goToCash() {
    this.navigate.emit('cash');
    this.router.navigate(['/cash']);
  }
}

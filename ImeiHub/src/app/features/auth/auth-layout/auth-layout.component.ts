import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../../../components/ui/icon/icon.component';
import { BrandLogoComponent } from '../../../components/ui/brand-logo/brand-logo.component';

@Component({
  selector: 'app-auth-layout',
  standalone: true,
  imports: [CommonModule, IconComponent, BrandLogoComponent],
  templateUrl: './auth-layout.component.html',
  styleUrls: ['./auth-layout.component.css']
})
export class AuthLayoutComponent {
  title = input.required<string>();
  subtitle = input.required<string>();
  maxWidth = input<string>('480px');
  showBackButton = input<boolean>(true);
  backLabel = input<string>('Inicio');
  backClicked = output<void>();
}

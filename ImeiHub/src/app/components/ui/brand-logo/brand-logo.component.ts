import { Component, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-brand-logo',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './brand-logo.component.html',
  styleUrls: ['./brand-logo.component.css']
})
export class BrandLogoComponent {
  size = input<'sm' | 'md' | 'lg'>('md');
  showText = input<boolean>(true);
  brandName = input<string>('ImeiHub');
  badge = input<string>('');
  subtitle = input<string>('');
  theme = input<'light' | 'dark'>('light');
  clickable = input<boolean>(false);
  clicked = output<void>();

  imgError = signal(false);

  handleClick() {
    if (this.clickable()) {
      this.clicked.emit();
    }
  }
}

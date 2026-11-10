import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconName } from '../../../types/icons';

@Component({
  selector: 'app-icon',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './icon.component.html'
})
export class IconComponent {
  name = input.required<IconName>();
  size = input<number>(18);
  className = input<string>('');
}

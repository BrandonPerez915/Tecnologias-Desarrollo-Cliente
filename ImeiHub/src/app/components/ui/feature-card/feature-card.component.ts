import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../icon/icon.component';
import { IconName } from '../../../types/icons';

@Component({
  selector: 'app-feature-card',
  standalone: true,
  imports: [CommonModule, IconComponent],
  templateUrl: './feature-card.component.html',
  styleUrls: ['./feature-card.component.css']
})
export class FeatureCardComponent {
  icon = input.required<IconName>();
  tone = input<'primary' | 'success' | 'warning'>('primary');
  badge = input<string>('');
  title = input.required<string>();
  description = input.required<string>();
  highlight = input<string>('');
}

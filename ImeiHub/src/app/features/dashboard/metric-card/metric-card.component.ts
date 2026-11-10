import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AmountComponent } from '../../../components/ui/amount/amount.component';
import { IconComponent } from '../../../components/ui/icon/icon.component';
import { IconName } from '../../../types/icons';

@Component({
  selector: 'app-metric-card',
  standalone: true,
  imports: [CommonModule, AmountComponent, IconComponent],
  templateUrl: './metric-card.component.html',
  styleUrls: ['./metric-card.component.css']
})
export class MetricCardComponent {
  label = input.required<string>();
  amount = input.required<string>();
  note = input.required<string>();
  icon = input.required<IconName>();
  variant = input.required<'in' | 'out'>();
  positive = input<boolean>(false);
}

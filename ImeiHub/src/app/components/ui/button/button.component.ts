import { Component, input, output, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../icon/icon.component';
import { IconName } from '../../../types/icons';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule, IconComponent],
  encapsulation: ViewEncapsulation.None,
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.css']
})
export class ButtonComponent {
  variant = input<'primary' | 'secondary' | 'danger' | 'ghost'>('primary');
  icon = input<IconName | undefined>(undefined);
  type = input<'button' | 'submit' | 'reset'>('button');
  disabled = input<boolean>(false);
  className = input<string>('');
  clicked = output<MouseEvent>();
}

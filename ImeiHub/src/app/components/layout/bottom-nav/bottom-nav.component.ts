import { Component, input, output } from '@angular/core';
import { IconComponent } from '../../ui/icon/icon.component';
import { navItems } from '../../../data/navigation';
import { Screen } from '../../../types/navigation';

@Component({
  selector: 'app-bottom-nav',
  standalone: true,
  imports: [IconComponent],
  templateUrl: './bottom-nav.component.html',
  styleUrls: ['./bottom-nav.component.css']
})
export class BottomNavComponent {
  screen = input.required<Screen>();
  navigate = output<Screen>();

  items = navItems;
}

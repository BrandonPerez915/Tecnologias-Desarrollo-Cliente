import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Icon } from '../../shared/components/icon/icon';
import { NAV_ITEMS } from '../navigation';

@Component({
  selector: 'app-bottom-nav',
  imports: [RouterLink, RouterLinkActive, Icon],
  template: `
    <nav aria-label="Navegación móvil">
      @for (item of items; track item.path) {
        <a [routerLink]="item.path" routerLinkActive="active">
          <span class="pill">
            <app-icon [name]="item.icon" />
            @if (item.badge) {
              <i>{{ item.badge }}</i>
            }
          </span>
          <small>{{ item.shortLabel ?? item.label }}</small>
        </a>
      }
    </nav>
  `,
  styleUrl: './bottom-nav.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BottomNav {
  protected readonly items = NAV_ITEMS;
}

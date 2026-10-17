import {
  ChangeDetectionStrategy,
  Component,
  booleanAttribute,
  inject,
  input,
  output,
} from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Auth } from '../../core/services/auth';
import { BrandLogo } from '../../shared/components/brand-logo/brand-logo';
import { Icon } from '../../shared/components/icon/icon';
import { NAV_ITEMS } from '../navigation';

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, RouterLinkActive, Icon, BrandLogo],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Sidebar {
  readonly open = input(false, { transform: booleanAttribute });
  readonly closed = output<void>();

  private readonly auth = inject(Auth);
  protected readonly items = NAV_ITEMS;

  protected logout() {
    this.closed.emit();
    this.auth.logout();
  }
}

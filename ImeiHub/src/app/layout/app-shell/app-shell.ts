import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter, map } from 'rxjs';
import { BottomNav } from '../bottom-nav/bottom-nav';
import { NAV_ITEMS } from '../navigation';
import { Sidebar } from '../sidebar/sidebar';
import { Topbar } from '../topbar/topbar';

@Component({
  selector: 'app-shell',
  imports: [RouterOutlet, Sidebar, Topbar, BottomNav],
  template: `
    <app-sidebar [open]="sidebarOpen()" (closed)="sidebarOpen.set(false)" />
    <main>
      <app-topbar [title]="title()" (menuClicked)="sidebarOpen.set(true)" />
      <router-outlet />
    </main>
    <app-bottom-nav />
  `,
  styleUrl: './app-shell.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppShell {
  private readonly router = inject(Router);

  private readonly url = toSignal(
    this.router.events.pipe(
      filter((e) => e instanceof NavigationEnd),
      map((e) => e.urlAfterRedirects),
    ),
    { initialValue: this.router.url },
  );

  protected readonly sidebarOpen = signal(false);
  protected readonly title = computed(() => {
    const path = this.url().split(/[?#]/)[0];
    return NAV_ITEMS.find((item) => path.startsWith(item.path))?.label ?? 'Panel';
  });
}

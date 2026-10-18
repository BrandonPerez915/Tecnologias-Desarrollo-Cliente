import { Component, inject, input, output, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { TopbarComponent } from '../topbar/topbar.component';
import { BottomNavComponent } from '../bottom-nav/bottom-nav.component';
import { OverlayManagerComponent } from '../../../features/overlays/overlay-manager/overlay-manager.component';
import { Screen } from '../../../types/navigation';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    SidebarComponent,
    TopbarComponent,
    BottomNavComponent,
    OverlayManagerComponent
  ],
  templateUrl: './app-shell.component.html',
  styleUrls: ['./app-shell.component.css']
})
export class AppShellComponent {
  private router = inject(Router);

  screenInput = input<Screen | undefined>(undefined, { alias: 'screen' });
  navigate = output<Screen>();
  notify = output<string>();

  sidebarOpen = signal(false);
  private currentUrlSignal = signal(this.router.url);

  constructor() {
    this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe((event) => {
        this.currentUrlSignal.set(event.urlAfterRedirects || event.url);
      });
  }

  currentScreen = computed<Screen>(() => {
    if (this.screenInput()) {
      return this.screenInput()!;
    }
    const cleanUrl = this.currentUrlSignal().split('?')[0].replace('/', '');
    if (cleanUrl === 'dashboard' || cleanUrl === '') {
      return 'home';
    }
    return (cleanUrl as Screen) || 'home';
  });

  handleNavigate(destination: Screen) {
    this.sidebarOpen.set(false);
    const targetRoute = destination === 'home' ? 'dashboard' : destination;
    this.router.navigate(['/' + targetRoute]);
    this.navigate.emit(destination);
  }
}

import { Component, inject, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../../ui/icon/icon.component';
import { AuthService } from '../../../core/services/auth.service';
import { NotificationService } from '../../../core/services/notification.service';
import { Screen } from '../../../types/navigation';

@Component({
  selector: 'app-profile-popover',
  standalone: true,
  imports: [CommonModule, IconComponent],
  templateUrl: './profile-popover.component.html',
  styleUrls: ['./profile-popover.component.css']
})
export class ProfilePopoverComponent {
  private authService = inject(AuthService);
  private notifyService = inject(NotificationService);

  user = this.authService.user;

  mouseEnter = output<void>();
  mouseLeave = output<void>();
  notify = output<string>();
  navigate = output<Screen>();

  userInitials(): string {
    const name = this.user()?.name || 'Ada Okafor';
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  }

  notifyInfo(msg: string) {
    this.notifyService.show(msg, 'neutral');
    this.notify.emit(msg);
  }

  handleLogout() {
    this.authService.logout();
    this.notify.emit('Sesión cerrada');
  }
}

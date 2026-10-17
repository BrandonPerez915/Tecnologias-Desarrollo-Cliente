import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Auth } from '../../core/services/auth';
import { Notifications } from '../../core/services/notifications';
import { Icon } from '../../shared/components/icon/icon';

@Component({
  selector: 'app-profile-popover',
  imports: [Icon],
  templateUrl: './profile-popover.html',
  styleUrl: './profile-popover.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfilePopover {
  private readonly auth = inject(Auth);
  private readonly notifications = inject(Notifications);

  protected readonly user = this.auth.user;
  protected readonly initials = this.auth.initials;

  protected info(message: string) {
    this.notifications.show(message, 'neutral');
  }

  protected logout() {
    this.auth.logout();
  }
}

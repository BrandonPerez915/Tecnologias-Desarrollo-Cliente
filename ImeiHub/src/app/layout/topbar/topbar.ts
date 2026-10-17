import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnDestroy,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { Auth } from '../../core/services/auth';
import { Icon } from '../../shared/components/icon/icon';
import { IconButton } from '../../shared/components/icon-button/icon-button';
import { ProfilePopover } from '../profile-popover/profile-popover';

const dateFormat = new Intl.DateTimeFormat('es-MX', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
});

@Component({
  selector: 'app-topbar',
  imports: [Icon, IconButton, ProfilePopover],
  templateUrl: './topbar.html',
  styleUrl: './topbar.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '(document:pointerdown)': 'onDocumentPointerDown($event)',
  },
})
export class Topbar implements OnDestroy {
  readonly title = input('Panel');
  readonly menuClicked = output<void>();

  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private closeTimer: ReturnType<typeof setTimeout> | null = null;

  protected readonly initials = inject(Auth).initials;
  protected readonly profileOpen = signal(false);
  protected readonly today = capitalize(dateFormat.format(new Date()));

  protected openProfile() {
    this.cancelClose();
    this.profileOpen.set(true);
  }

  protected scheduleClose() {
    this.cancelClose();
    this.closeTimer = setTimeout(() => this.profileOpen.set(false), 220);
  }

  protected toggleProfile() {
    this.profileOpen.update((open) => !open);
  }

  protected onDocumentPointerDown(event: PointerEvent) {
    const profile = this.host.nativeElement.querySelector('.profile');
    if (profile && !profile.contains(event.target as Node)) {
      this.profileOpen.set(false);
    }
  }

  ngOnDestroy() {
    this.cancelClose();
  }

  private cancelClose() {
    if (this.closeTimer !== null) {
      clearTimeout(this.closeTimer);
      this.closeTimer = null;
    }
  }
}

function capitalize(text: string) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

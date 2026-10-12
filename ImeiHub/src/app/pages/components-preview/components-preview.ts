import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { BackButton } from '../../shared/components/back-button/back-button';
import { Button, ButtonVariant } from '../../shared/components/button/button';
import { IconButton } from '../../shared/components/icon-button/icon-button';

@Component({
  selector: 'app-components-preview',
  imports: [Button, IconButton, BackButton],
  templateUrl: './components-preview.html',
  styleUrl: './components-preview.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ComponentsPreview {
  protected readonly prototypeUrl = 'https://cursor-modern-58088289.figma.site/';
  protected readonly variants: ButtonVariant[] = ['primary', 'secondary', 'danger', 'ghost'];
  protected readonly clicks = signal(0);

  protected onClick() {
    this.clicks.update((n) => n + 1);
  }
}

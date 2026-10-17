import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { Amount } from '../../shared/components/amount/amount';
import { BackButton } from '../../shared/components/back-button/back-button';
import { BrandLogo } from '../../shared/components/brand-logo/brand-logo';
import { Button, ButtonVariant } from '../../shared/components/button/button';
import { Field } from '../../shared/components/field/field';
import { IconButton } from '../../shared/components/icon-button/icon-button';
import { PageHeading } from '../../shared/components/page-heading/page-heading';
import { PasswordField } from '../../shared/components/password-field/password-field';
import { StatusBadge } from '../../shared/components/status-badge/status-badge';

@Component({
  selector: 'app-components-preview',
  imports: [
    Button,
    IconButton,
    BackButton,
    Field,
    PasswordField,
    Amount,
    StatusBadge,
    PageHeading,
    BrandLogo,
  ],
  templateUrl: './components-preview.html',
  styleUrl: './components-preview.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ComponentsPreview {
  protected readonly prototypeUrl = 'https://cursor-modern-58088289.figma.site/';
  protected readonly variants: ButtonVariant[] = ['primary', 'secondary', 'danger', 'ghost'];
  protected readonly clicks = signal(0);
  protected readonly email = signal('');
  protected readonly password = signal('');

  protected onClick() {
    this.clicks.update((n) => n + 1);
  }
}

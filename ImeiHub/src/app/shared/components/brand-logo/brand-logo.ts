import {
  ChangeDetectionStrategy,
  Component,
  booleanAttribute,
  input,
  output,
  signal,
} from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';

export type BrandLogoSize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'app-brand-logo',
  imports: [NgTemplateOutlet],
  templateUrl: './brand-logo.html',
  styleUrl: './brand-logo.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'size() + " " + theme()',
  },
})
export class BrandLogo {
  readonly size = input<BrandLogoSize>('md');
  readonly theme = input<'light' | 'dark'>('light');
  readonly name = input('ImeiHub');
  readonly badge = input('');
  readonly subtitle = input('');
  readonly showText = input(true, { transform: booleanAttribute });
  readonly clickable = input(false, { transform: booleanAttribute });
  readonly clicked = output<void>();

  protected readonly imgError = signal(false);
}

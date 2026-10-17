import { ChangeDetectionStrategy, Component, input } from '@angular/core';

export type IconName =
  | 'home'
  | 'cash'
  | 'box'
  | 'swap'
  | 'scan'
  | 'plus'
  | 'arrow-up'
  | 'arrow-down'
  | 'clock'
  | 'warning'
  | 'search'
  | 'bell'
  | 'chevron'
  | 'printer'
  | 'bluetooth'
  | 'close'
  | 'flash'
  | 'image'
  | 'user'
  | 'check'
  | 'more'
  | 'calendar'
  | 'tag'
  | 'return'
  | 'menu'
  | 'filter'
  | 'receipt'
  | 'settings'
  | 'logout'
  | 'lock'
  | 'mail'
  | 'eye'
  | 'eye-off'
  | 'store'
  | 'phone'
  | 'shield';

@Component({
  selector: 'app-icon',
  templateUrl: './icon.html',
  styles: `
    :host {
      display: inline-flex;
      flex: none;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Icon {
  readonly name = input.required<IconName>();
  readonly size = input(20);
}

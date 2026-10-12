import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Icon } from '../icon/icon';

@Component({
  selector: 'button[app-back-button]',
  imports: [Icon],
  template: `<app-icon name="return" [size]="17" /><ng-content />`,
  styles: `
    :host {
      display: inline-flex;
      align-items: center;
      gap: 7px;
      padding: 0;
      color: var(--primary);
      background: transparent;
      border: 0;
      font-size: 12px;
      font-weight: 800;
      cursor: pointer;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { type: 'button' },
})
export class BackButton {}

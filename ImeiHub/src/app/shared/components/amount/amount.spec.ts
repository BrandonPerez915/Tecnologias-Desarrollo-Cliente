import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Amount, AmountSize } from './amount';

@Component({
  imports: [Amount],
  template: `<app-amount [size]="size()" [currency]="currency()">12,499</app-amount>`,
})
class Host {
  size = signal<AmountSize>('normal');
  currency = signal('MXN');
}

describe('Amount', () => {
  it('renders currency and projected value', () => {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector('app-amount') as HTMLElement;
    expect(el.querySelector('.currency')?.textContent).toBe('MXN');
    expect(el.textContent).toContain('12,499');
    expect(el.classList).toContain('normal');
  });

  it('changes size and currency', () => {
    const fixture = TestBed.createComponent(Host);
    fixture.componentInstance.size.set('hero');
    fixture.componentInstance.currency.set('USD');
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector('app-amount') as HTMLElement;
    expect(el.classList).toContain('hero');
    expect(el.querySelector('.currency')?.textContent).toBe('USD');
  });
});

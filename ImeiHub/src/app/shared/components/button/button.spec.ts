import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Button, ButtonVariant } from './button';

@Component({
  imports: [Button],
  template: `
    <button
      app-button
      [variant]="variant()"
      [icon]="icon()"
      [badge]="badge()"
      [fullWidth]="full()"
      [disabled]="disabled()"
      (click)="clicks = clicks + 1"
    >
      Guardar
    </button>
  `,
})
class Host {
  variant = signal<ButtonVariant>('primary');
  icon = signal<'plus' | null>(null);
  badge = signal<number | null>(null);
  full = signal(false);
  disabled = signal(false);
  clicks = 0;
}

describe('Button', () => {
  function setup() {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector('button') as HTMLButtonElement;
    return { fixture, host: fixture.componentInstance, el };
  }

  it('renders projected text with primary variant and type button by default', () => {
    const { el } = setup();
    expect(el.textContent).toContain('Guardar');
    expect(el.classList).toContain('btn-primary');
    expect(el.getAttribute('type')).toBe('button');
  });

  it('applies the selected variant class', () => {
    const { fixture, host, el } = setup();
    host.variant.set('danger');
    fixture.detectChanges();
    expect(el.classList).toContain('btn-danger');
    expect(el.classList).not.toContain('btn-primary');
  });

  it('renders the icon only when provided', () => {
    const { fixture, host, el } = setup();
    expect(el.querySelector('app-icon')).toBeNull();
    host.icon.set('plus');
    fixture.detectChanges();
    expect(el.querySelector('app-icon svg')).toBeTruthy();
  });

  it('renders the badge counter', () => {
    const { fixture, host, el } = setup();
    host.badge.set(3);
    fixture.detectChanges();
    expect(el.querySelector('.badge')?.textContent).toBe('3');
    expect(el.classList).toContain('has-badge');
  });

  it('supports full width', () => {
    const { fixture, host, el } = setup();
    host.full.set(true);
    fixture.detectChanges();
    expect(el.classList).toContain('full');
  });

  it('emits clicks and blocks them when disabled', () => {
    const { fixture, host, el } = setup();
    el.click();
    expect(host.clicks).toBe(1);
    host.disabled.set(true);
    fixture.detectChanges();
    el.click();
    expect(host.clicks).toBe(1);
  });
});

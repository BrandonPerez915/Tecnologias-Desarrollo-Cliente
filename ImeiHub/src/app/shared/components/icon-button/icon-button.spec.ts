import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { IconButton, IconButtonVariant } from './icon-button';

@Component({
  imports: [IconButton],
  template: `
    <button
      app-icon-button
      icon="bell"
      label="Notificaciones"
      [variant]="variant()"
      [dot]="dot()"
    ></button>
  `,
})
class Host {
  variant = signal<IconButtonVariant>('outline');
  dot = signal(false);
}

describe('IconButton', () => {
  it('sets aria-label, type and default variant', () => {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector('button') as HTMLButtonElement;
    expect(el.getAttribute('aria-label')).toBe('Notificaciones');
    expect(el.getAttribute('type')).toBe('button');
    expect(el.classList).toContain('outline');
    expect(el.querySelector('svg')).toBeTruthy();
  });

  it('switches variant and shows the dot', () => {
    const fixture = TestBed.createComponent(Host);
    fixture.componentInstance.variant.set('soft');
    fixture.componentInstance.dot.set(true);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector('button') as HTMLButtonElement;
    expect(el.classList).toContain('soft');
    expect(el.querySelector('.dot')).toBeTruthy();
  });
});

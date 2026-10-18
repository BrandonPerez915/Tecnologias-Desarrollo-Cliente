import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { StatusBadge, StatusTone } from './status-badge';

@Component({
  imports: [StatusBadge],
  template: `<app-status-badge [tone]="tone()" [dot]="dot()">Pagado</app-status-badge>`,
})
class Host {
  tone = signal<StatusTone>('neutral');
  dot = signal(true);
}

describe('StatusBadge', () => {
  function setup() {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector('app-status-badge') as HTMLElement;
    return { fixture, host: fixture.componentInstance, el };
  }

  it('renders text, dot and neutral tone by default', () => {
    const { el } = setup();
    expect(el.textContent).toContain('Pagado');
    expect(el.querySelector('.dot')).toBeTruthy();
    expect(el.classList).toContain('neutral');
  });

  it('switches tone and can hide the dot', () => {
    const { fixture, host, el } = setup();
    host.tone.set('success');
    host.dot.set(false);
    fixture.detectChanges();
    expect(el.classList).toContain('success');
    expect(el.querySelector('.dot')).toBeNull();
  });
});

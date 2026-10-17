import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Sheet } from './sheet';

@Component({
  imports: [Sheet],
  template: `
    <app-sheet
      title="Registrar gasto"
      subtitle="Sale de la caja"
      wide
      (closed)="closes = closes + 1"
    >
      <p class="body">contenido</p>
    </app-sheet>
  `,
})
class Host {
  closes = 0;
}

describe('Sheet', () => {
  function setup() {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    return { host: fixture.componentInstance, el: fixture.nativeElement as HTMLElement };
  }

  it('renders an accessible dialog with title, subtitle and content', () => {
    const { el } = setup();
    const dialog = el.querySelector('[role="dialog"]')!;
    const title = el.querySelector('h2')!;
    expect(dialog.getAttribute('aria-labelledby')).toBe(title.id);
    expect(title.textContent).toBe('Registrar gasto');
    expect(el.querySelector('header p')?.textContent).toBe('Sale de la caja');
    expect(el.querySelector('.body')).toBeTruthy();
    expect(dialog.classList).toContain('wide');
  });

  it('closes with the close button', () => {
    const { host, el } = setup();
    (el.querySelector('header button') as HTMLButtonElement).click();
    expect(host.closes).toBe(1);
  });

  it('closes with escape', () => {
    const { host } = setup();
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    expect(host.closes).toBe(1);
  });

  it('closes on backdrop but not inside the sheet', () => {
    const { host, el } = setup();
    el.querySelector('.sheet')!.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
    expect(host.closes).toBe(0);
    el.querySelector('.overlay')!.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
    expect(host.closes).toBe(1);
  });
});

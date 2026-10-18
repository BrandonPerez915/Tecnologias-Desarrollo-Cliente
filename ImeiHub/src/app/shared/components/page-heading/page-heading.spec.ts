import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { PageHeading } from './page-heading';

@Component({
  imports: [PageHeading],
  template: `
    <app-page-heading eyebrow="Hoy" title="Inventario" subtitle="Equipos y series">
      <button headingActions>Agregar</button>
    </app-page-heading>
  `,
})
class Host {}

describe('PageHeading', () => {
  it('renders title, subtitle, eyebrow and projected actions', () => {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('h1')?.textContent).toBe('Inventario');
    expect(el.querySelector('.subtitle')?.textContent).toBe('Equipos y series');
    expect(el.querySelector('.eyebrow')?.textContent).toBe('Hoy');
    expect(el.querySelector('.actions button')?.textContent).toBe('Agregar');
  });

  it('omits eyebrow and subtitle when empty', () => {
    const fixture = TestBed.createComponent(PageHeading);
    fixture.componentRef.setInput('title', 'Panel');
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('.eyebrow')).toBeNull();
    expect(el.querySelector('.subtitle')).toBeNull();
  });
});

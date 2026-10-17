import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Field } from './field';

@Component({
  imports: [Field],
  template: `
    <app-field
      label="Correo"
      icon="mail"
      [(value)]="email"
      [error]="error()"
      [hint]="hint()"
      [disabled]="disabled()"
      required
      (blurred)="blurs = blurs + 1"
    />
  `,
})
class Host {
  email = signal('');
  error = signal('');
  hint = signal('Usa tu correo del negocio');
  disabled = signal(false);
  blurs = 0;
}

describe('Field', () => {
  function setup() {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    const root = fixture.nativeElement as HTMLElement;
    return { fixture, host: fixture.componentInstance, root, input: root.querySelector('input')! };
  }

  it('renders label, required mark, icon and hint', () => {
    const { root } = setup();
    expect(root.querySelector('.label')?.textContent).toContain('Correo');
    expect(root.querySelector('.required')).toBeTruthy();
    expect(root.querySelector('app-icon')).toBeTruthy();
    expect(root.querySelector('.hint')?.textContent).toContain('Usa tu correo');
  });

  it('syncs the value both ways', () => {
    const { fixture, host, input } = setup();
    input.value = 'ada@imeihub.com';
    input.dispatchEvent(new Event('input'));
    expect(host.email()).toBe('ada@imeihub.com');
    host.email.set('otro@imeihub.com');
    fixture.detectChanges();
    expect(input.value).toBe('otro@imeihub.com');
  });

  it('shows the error instead of the hint', () => {
    const { fixture, host, root, input } = setup();
    host.error.set('Correo inválido');
    fixture.detectChanges();
    expect(root.querySelector('.error')?.textContent).toContain('Correo inválido');
    expect(root.querySelector('.hint')).toBeNull();
    expect(root.querySelector('.control')?.classList).toContain('invalid');
    expect(input.getAttribute('aria-invalid')).toBe('true');
  });

  it('disables the input and emits blur', () => {
    const { fixture, host, input } = setup();
    input.dispatchEvent(new Event('blur'));
    expect(host.blurs).toBe(1);
    host.disabled.set(true);
    fixture.detectChanges();
    expect(input.disabled).toBe(true);
  });
});

import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { PasswordField } from './password-field';

@Component({
  imports: [PasswordField],
  template: `<app-password-field [(value)]="password" [error]="error()" required />`,
})
class Host {
  password = signal('');
  error = signal('');
}

describe('PasswordField', () => {
  function setup() {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    const root = fixture.nativeElement as HTMLElement;
    return { fixture, host: fixture.componentInstance, root, input: root.querySelector('input')! };
  }

  it('links the label to the input', () => {
    const { root, input } = setup();
    const label = root.querySelector('label')!;
    expect(label.textContent).toContain('Contraseña');
    expect(label.getAttribute('for')).toBe(input.id);
  });

  it('hides the value by default and toggles visibility', () => {
    const { fixture, root, input } = setup();
    const toggle = root.querySelector('.toggle') as HTMLButtonElement;
    expect(input.type).toBe('password');
    expect(toggle.getAttribute('aria-label')).toBe('Ver contraseña');
    toggle.click();
    fixture.detectChanges();
    expect(input.type).toBe('text');
    expect(toggle.getAttribute('aria-label')).toBe('Ocultar contraseña');
  });

  it('updates the bound value', () => {
    const { host, input } = setup();
    input.value = 'secreto123';
    input.dispatchEvent(new Event('input'));
    expect(host.password()).toBe('secreto123');
  });

  it('shows the error state', () => {
    const { fixture, host, root } = setup();
    host.error.set('Mínimo 8 caracteres');
    fixture.detectChanges();
    expect(root.querySelector('.error')?.textContent).toContain('Mínimo 8 caracteres');
    expect(root.querySelector('.control')?.classList).toContain('invalid');
  });
});

import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { BackButton } from './back-button';

@Component({
  imports: [BackButton],
  template: `<button app-back-button>Volver al panel</button>`,
})
class Host {}

describe('BackButton', () => {
  it('renders the return icon and text', () => {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector('button') as HTMLButtonElement;
    expect(el.textContent).toContain('Volver al panel');
    expect(el.querySelector('app-icon svg')).toBeTruthy();
    expect(el.getAttribute('type')).toBe('button');
  });
});

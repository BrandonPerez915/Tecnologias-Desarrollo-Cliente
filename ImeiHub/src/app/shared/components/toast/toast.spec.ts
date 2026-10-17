import { TestBed } from '@angular/core/testing';
import { Toast } from './toast';

describe('Toast', () => {
  it('renders the message as a polite status', () => {
    const fixture = TestBed.createComponent(Toast);
    fixture.componentRef.setInput('message', 'Venta registrada');
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    expect(el.textContent).toContain('Venta registrada');
    expect(el.getAttribute('role')).toBe('status');
    expect(el.getAttribute('aria-live')).toBe('polite');
    expect(el.classList).toContain('success');
  });

  it('applies the tone class', () => {
    const fixture = TestBed.createComponent(Toast);
    fixture.componentRef.setInput('message', 'Error al guardar');
    fixture.componentRef.setInput('tone', 'danger');
    fixture.detectChanges();
    expect((fixture.nativeElement as HTMLElement).classList).toContain('danger');
  });
});

import { TestBed } from '@angular/core/testing';
import { Icon } from './icon';

describe('Icon', () => {
  it('renders an svg with the given size', () => {
    const fixture = TestBed.createComponent(Icon);
    fixture.componentRef.setInput('name', 'lock');
    fixture.componentRef.setInput('size', 24);
    fixture.detectChanges();
    const svg = fixture.nativeElement.querySelector('svg') as SVGElement;
    expect(svg.getAttribute('width')).toBe('24');
    expect(svg.getAttribute('aria-hidden')).toBe('true');
    expect(svg.querySelector('rect')).toBeTruthy();
  });

  it('switches the drawing when the name changes', () => {
    const fixture = TestBed.createComponent(Icon);
    fixture.componentRef.setInput('name', 'plus');
    fixture.detectChanges();
    const svg = fixture.nativeElement.querySelector('svg') as SVGElement;
    expect(svg.querySelector('path')?.getAttribute('d')).toBe('M12 5v14M5 12h14');
    fixture.componentRef.setInput('name', 'shield');
    fixture.detectChanges();
    expect(svg.querySelector('path')?.getAttribute('d')).toContain('M12 22s8-4');
  });
});

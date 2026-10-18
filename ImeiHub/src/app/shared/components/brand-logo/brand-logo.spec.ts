import { TestBed } from '@angular/core/testing';
import { BrandLogo } from './brand-logo';

describe('BrandLogo', () => {
  function setup(inputs: Record<string, unknown> = {}) {
    const fixture = TestBed.createComponent(BrandLogo);
    for (const [key, value] of Object.entries(inputs)) {
      fixture.componentRef.setInput(key, value);
    }
    fixture.detectChanges();
    return { fixture, el: fixture.nativeElement as HTMLElement };
  }

  it('renders the logo image, name and badge', () => {
    const { el } = setup({ badge: 'POS' });
    expect(el.querySelector('img')?.getAttribute('alt')).toBe('Logo de ImeiHub');
    expect(el.querySelector('.name')?.textContent).toBe('ImeiHub');
    expect(el.querySelector('.badge')?.textContent).toBe('POS');
    expect(el.classList).toContain('md');
    expect(el.classList).toContain('light');
  });

  it('falls back to the svg mark when the image fails', () => {
    const { fixture, el } = setup();
    el.querySelector('img')!.dispatchEvent(new Event('error'));
    fixture.detectChanges();
    expect(el.querySelector('img')).toBeNull();
    expect(el.querySelector('.mark svg')).toBeTruthy();
  });

  it('hides the text when showText is false', () => {
    const { el } = setup({ showText: false });
    expect(el.querySelector('.name')).toBeNull();
  });

  it('renders a button and emits when clickable', () => {
    const { fixture, el } = setup({ clickable: true, theme: 'dark' });
    let clicks = 0;
    fixture.componentInstance.clicked.subscribe(() => clicks++);
    const button = el.querySelector('button') as HTMLButtonElement;
    button.click();
    expect(clicks).toBe(1);
    expect(el.classList).toContain('dark');
  });
});

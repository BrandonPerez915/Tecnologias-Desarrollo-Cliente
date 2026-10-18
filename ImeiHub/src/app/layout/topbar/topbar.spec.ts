import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Topbar } from './topbar';

@Component({
  imports: [Topbar],
  template: `<app-topbar [title]="title()" (menuClicked)="menus = menus + 1" />`,
})
class Host {
  title = signal('Inventario');
  menus = 0;
}

describe('Topbar', () => {
  function setup() {
    TestBed.configureTestingModule({ providers: [provideRouter([])] });
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    return { fixture, host: fixture.componentInstance, el: fixture.nativeElement as HTMLElement };
  }

  it('renders title, date and user initials', () => {
    const { el } = setup();
    expect(el.querySelector('.mobile-title')?.textContent).toBe('Inventario');
    expect(el.querySelector('.date span')?.textContent?.length).toBeGreaterThan(0);
    expect(el.querySelector('.avatar')?.textContent?.trim()).toBe('AO');
  });

  it('emits when the menu button is clicked', () => {
    const { host, el } = setup();
    (el.querySelector('.menu') as HTMLButtonElement).click();
    expect(host.menus).toBe(1);
  });

  it('toggles the profile popover and closes it on outside click', () => {
    const { fixture, el } = setup();
    const avatar = el.querySelector('.avatar') as HTMLButtonElement;
    avatar.click();
    fixture.detectChanges();
    expect(el.querySelector('app-profile-popover')).toBeTruthy();
    expect(avatar.getAttribute('aria-expanded')).toBe('true');
    document.body.dispatchEvent(new Event('pointerdown', { bubbles: true }));
    fixture.detectChanges();
    expect(el.querySelector('app-profile-popover')).toBeNull();
  });
});

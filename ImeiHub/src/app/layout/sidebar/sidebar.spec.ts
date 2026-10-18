import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { Auth } from '../../core/services/auth';
import { Sidebar } from './sidebar';

@Component({ template: '' })
class Blank {}

@Component({
  imports: [Sidebar],
  template: `<app-sidebar [open]="open()" (closed)="closes = closes + 1" />`,
})
class Host {
  open = signal(false);
  closes = 0;
}

describe('Sidebar', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideRouter([{ path: '**', component: Blank }])],
    });
  });

  async function setup() {
    const fixture = TestBed.createComponent(Host);
    await TestBed.inject(Router).navigateByUrl('/orders');
    fixture.detectChanges();
    await fixture.whenStable();
    return { fixture, host: fixture.componentInstance, el: fixture.nativeElement as HTMLElement };
  }

  it('renders the nav items with badges and marks the active route', async () => {
    const { el } = await setup();
    const links = el.querySelectorAll('nav a');
    expect(links.length).toBe(5);
    const active = el.querySelector('nav a.active');
    expect(active?.textContent).toContain('Órdenes');
    expect(active?.querySelector('b')?.textContent).toBe('3');
  });

  it('shows the backdrop only when open and emits closed', async () => {
    const { fixture, host, el } = await setup();
    expect(el.querySelector('.backdrop')).toBeNull();
    host.open.set(true);
    fixture.detectChanges();
    expect(el.querySelector('.sidebar')?.classList).toContain('open');
    (el.querySelector('.backdrop') as HTMLButtonElement).click();
    expect(host.closes).toBe(1);
  });

  it('logs out from the footer', async () => {
    const { el } = await setup();
    const logout = vi.spyOn(TestBed.inject(Auth), 'logout').mockImplementation(() => {});
    (el.querySelector('.logout') as HTMLButtonElement).click();
    expect(logout).toHaveBeenCalled();
  });
});

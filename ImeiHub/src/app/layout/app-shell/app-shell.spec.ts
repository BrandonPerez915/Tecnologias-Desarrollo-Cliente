import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { AppShell } from './app-shell';

@Component({ template: '<p class="page">contenido</p>' })
class Page {}

describe('AppShell', () => {
  async function setup(url: string) {
    TestBed.configureTestingModule({
      providers: [
        provideRouter([
          { path: '', component: AppShell, children: [{ path: '**', component: Page }] },
        ]),
      ],
    });
    const router = TestBed.inject(Router);
    const fixture = TestBed.createComponent(AppShell);
    await router.navigateByUrl(url);
    fixture.detectChanges();
    await fixture.whenStable();
    return fixture.nativeElement as HTMLElement;
  }

  it('renders sidebar, topbar, bottom nav and the routed page', async () => {
    const el = await setup('/inventory');
    expect(el.querySelector('app-sidebar')).toBeTruthy();
    expect(el.querySelector('app-topbar')).toBeTruthy();
    expect(el.querySelector('app-bottom-nav')).toBeTruthy();
    expect(el.querySelector('.page')).toBeTruthy();
  });

  it('uses the active nav item as title', async () => {
    const el = await setup('/inventory?filtro=1');
    expect(el.querySelector('.mobile-title')?.textContent).toBe('Inventario');
  });

  it('falls back to Panel for unknown routes', async () => {
    const el = await setup('/componentes');
    expect(el.querySelector('.mobile-title')?.textContent).toBe('Panel');
  });

  it('opens the sidebar from the topbar menu', async () => {
    const el = await setup('/dashboard');
    (el.querySelector('app-topbar .menu') as HTMLButtonElement).click();
    TestBed.tick();
    expect(el.querySelector('.sidebar')?.classList).toContain('open');
  });
});

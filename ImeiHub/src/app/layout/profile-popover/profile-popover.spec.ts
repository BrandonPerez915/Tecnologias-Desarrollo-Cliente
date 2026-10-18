import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Auth } from '../../core/services/auth';
import { Notifications } from '../../core/services/notifications';
import { ProfilePopover } from './profile-popover';

describe('ProfilePopover', () => {
  function setup() {
    TestBed.configureTestingModule({ providers: [provideRouter([])] });
    const fixture = TestBed.createComponent(ProfilePopover);
    fixture.detectChanges();
    return fixture.nativeElement as HTMLElement;
  }

  it('shows the current user', () => {
    const el = setup();
    expect(el.querySelector('.avatar')?.textContent).toBe('AO');
    expect(el.querySelector('.user strong')?.textContent).toBe('Ada Okafor');
    expect(el.querySelector('.user small')?.textContent).toContain('Puesto A-18');
  });

  it('notifies when opening profile options', () => {
    const el = setup();
    (el.querySelector('.actions button') as HTMLButtonElement).click();
    expect(TestBed.inject(Notifications).toast()?.message).toBe('Configuración de perfil abierta');
  });

  it('logs out', () => {
    const el = setup();
    const logout = vi.spyOn(TestBed.inject(Auth), 'logout').mockImplementation(() => {});
    (el.querySelector('.logout') as HTMLButtonElement).click();
    expect(logout).toHaveBeenCalled();
  });
});

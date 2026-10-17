import { TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { Auth } from './auth';
import { Notifications } from './notifications';

describe('Auth', () => {
  let auth: Auth;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideRouter([])] });
    auth = TestBed.inject(Auth);
  });

  it('starts with the mock user', () => {
    expect(auth.isAuthenticated()).toBe(true);
    expect(auth.user()?.name).toBe('Ada Okafor');
    expect(auth.initials()).toBe('AO');
  });

  it('clears the session, notifies and goes to login on logout', () => {
    const navigate = vi.spyOn(TestBed.inject(Router), 'navigate').mockResolvedValue(true);
    auth.logout();
    expect(auth.user()).toBeNull();
    expect(auth.initials()).toBe('');
    expect(TestBed.inject(Notifications).toast()?.message).toBe('Sesión cerrada correctamente');
    expect(navigate).toHaveBeenCalledWith(['/login']);
  });
});

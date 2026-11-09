import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { NotificationService } from '../services/notification.service';

// Private routes: without a session go to login and remember the requested url
export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const notify = inject(NotificationService);

  if (authService.isAuthenticated()) {
    return true;
  }

  notify.warning('Debes iniciar sesión para acceder a tu espacio de trabajo');
  return router.createUrlTree(['/login'], {
    queryParams: { returnUrl: state.url }
  });
};

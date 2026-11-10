import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Role } from '../../types/auth';

// Restricted routes declare data: { roles: [...] }, other roles see the 403 view
export const roleGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const roles = (route.data['roles'] ?? []) as Role[];

  if (authService.hasRole(roles)) {
    return true;
  }

  return router.createUrlTree(['/forbidden'], {
    queryParams: { from: state.url }
  });
};

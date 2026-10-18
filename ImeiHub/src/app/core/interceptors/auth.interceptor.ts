import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.token();
  const user = authService.user();

  let headers = req.headers.set('X-App-Client', 'ImeiHub-Angular/1.0');

  if (user?.stallNumber) {
    headers = headers.set('X-Stall-ID', user.stallNumber);
  }

  if (token) {
    headers = headers.set('Authorization', `Bearer ${token}`);
  }

  const authReq = req.clone({ headers });
  return next(authReq);
};

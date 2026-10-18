import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { NotificationService } from '../services/notification.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const notify = inject(NotificationService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMsg = 'Ocurrió un error inesperado al procesar la solicitud';

      if (error.status === 401) {
        errorMsg = 'Tu sesión ha expirado o las credenciales no son válidas';
        authService.logout();
      } else if (error.status === 403) {
        errorMsg = 'No tienes permisos suficientes para realizar esta acción';
      } else if (error.status === 404) {
        errorMsg = 'El recurso solicitado no fue encontrado en el servidor';
      } else if (error.status >= 500) {
        errorMsg = 'Error en el servidor de ImeiHub. Intenta de nuevo más tarde';
      } else if (error.error?.message) {
        errorMsg = error.error.message;
      }

      notify.error(errorMsg);
      return throwError(() => error);
    })
  );
};

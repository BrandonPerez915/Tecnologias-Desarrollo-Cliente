import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { Injector, inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { NotificationService } from '../services/notification.service';
import { AuthService } from '../services/auth.service';

export class ApiError extends Error {
  constructor(message: string, readonly status: number) {
    super(message);
  }
}

// Login and register show their errors inside the form
const AUTH_FORM_URL = /\/auth\/(login|register)$/;

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const notify = inject(NotificationService);
  const injector = inject(Injector);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      const isAuthForm = AUTH_FORM_URL.test(req.url);
      let errorMsg = 'Ocurrió un error inesperado al procesar la solicitud';

      if (error.status === 0) {
        errorMsg = 'No fue posible conectar con el servidor de ImeiHub. Verifica que la API esté encendida (npm run api).';
      } else if (error.status === 400) {
        errorMsg = error.error?.message || 'Solicitud incorrecta o campos incompletos';
      } else if (error.status === 401) {
        errorMsg = error.error?.message || 'Tu sesión expiró, inicia sesión de nuevo';
      } else if (error.status === 403) {
        errorMsg = error.error?.message || 'No tienes permisos suficientes para realizar esta acción';
      } else if (error.status === 404) {
        errorMsg = error.error?.message || 'El recurso solicitado no fue encontrado en el servidor';
      } else if (error.status === 409) {
        errorMsg = error.error?.message || 'El registro ya existe';
      } else if (error.status === 422) {
        errorMsg = error.error?.message || 'Los datos enviados no superaron las reglas de negocio';
      } else if (error.status >= 500) {
        errorMsg = error.error?.message || 'Error en el servidor de ImeiHub. Intenta de nuevo más tarde';
      } else if (error.error?.message) {
        errorMsg = error.error.message;
      }

      if (error.status === 401 && !isAuthForm) {
        // Invalid or expired token: close the session and send the user to login
        injector.get(AuthService).handleUnauthorized(errorMsg);
      } else if (!(isAuthForm && error.status > 0 && error.status < 500)) {
        notify.error(errorMsg);
      }

      return throwError(() => new ApiError(errorMsg, error.status));
    })
  );
};

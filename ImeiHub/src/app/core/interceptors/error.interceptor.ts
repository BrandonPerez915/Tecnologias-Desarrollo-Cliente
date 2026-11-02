import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { NotificationService } from '../services/notification.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const notify = inject(NotificationService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMsg = 'Ocurrió un error inesperado al procesar la solicitud';

      if (error.status === 0) {
        errorMsg = 'No fue posible conectar con el servidor de ImeiHub. Verifica que la API esté encendida (npm run api).';
      } else if (error.status === 400) {
        errorMsg = error.error?.message || 'Solicitud incorrecta o campos incompletos';
      } else if (error.status === 401) {
        errorMsg = error.error?.message || 'Credenciales no válidas o sesión expirada';
      } else if (error.status === 403) {
        errorMsg = 'No tienes permisos suficientes para realizar esta acción';
      } else if (error.status === 404) {
        errorMsg = error.error?.message || 'El recurso solicitado no fue encontrado en el servidor';
      } else if (error.status === 422) {
        errorMsg = error.error?.message || 'Los datos enviados no superaron las reglas de negocio';
      } else if (error.status >= 500) {
        errorMsg = error.error?.message || 'Error en el servidor de ImeiHub. Intenta de nuevo más tarde';
      } else if (error.error?.message) {
        errorMsg = error.error.message;
      }

      notify.error(errorMsg);
      return throwError(() => new Error(errorMsg));
    })
  );
};

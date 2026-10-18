import { HttpInterceptorFn } from '@angular/common/http';
import { tap } from 'rxjs';

export const loggingInterceptor: HttpInterceptorFn = (req, next) => {
  const startTime = Date.now();

  return next(req).pipe(
    tap({
      next: () => {
        const elapsed = Date.now() - startTime;
        console.debug(`[HTTP] ${req.method} ${req.urlWithParams} (${elapsed}ms)`);
      },
      error: (err) => {
        const elapsed = Date.now() - startTime;
        console.warn(`[HTTP ERROR] ${req.method} ${req.urlWithParams} [${err.status}] (${elapsed}ms)`);
      }
    })
  );
};

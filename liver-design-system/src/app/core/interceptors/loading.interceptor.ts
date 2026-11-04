import { HttpInterceptorFn } from '@angular/common/http';
import { finalize } from 'rxjs';

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  // Can connect to a global loading spinner signal if needed
  return next(req).pipe(
    finalize(() => {
      // Completed request
    })
  );
};

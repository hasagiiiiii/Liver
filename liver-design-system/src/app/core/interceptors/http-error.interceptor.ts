import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { NotificationService } from '../services/notification.service';

export const httpErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const notificationService = inject(NotificationService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      const errorMessage = error.error?.message || error.statusText || 'Lỗi kết nối máy chủ';
      notificationService.show(`HTTP Error: ${errorMessage}`, 'error');
      return throwError(() => error);
    })
  );
};

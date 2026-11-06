import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { NotificationService } from '../services/notification.service';

export const permissionGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const toast = inject(NotificationService);

  const requiredPermissions = route.data?.['permissions'] as string[] | undefined;
  const requiredRoles = route.data?.['roles'] as string[] | undefined;

  if (requiredPermissions && requiredPermissions.length > 0) {
    const hasPermission = authService.hasPermission(requiredPermissions);
    if (!hasPermission) {
      toast.show('Bạn không có quyền truy cập trang này!', 'error');
      router.navigate(['/dashboard']);
      return false;
    }
  }

  if (requiredRoles && requiredRoles.length > 0) {
    const hasRole = authService.hasRole(requiredRoles);
    if (!hasRole) {
      toast.show('Vai trò của bạn không được phép truy cập trang này!', 'error');
      router.navigate(['/dashboard']);
      return false;
    }
  }

  return true;
};

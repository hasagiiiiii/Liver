import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  // Enterprise mock auth guard
  const isAuthenticated = true;
  if (!isAuthenticated) {
    const router = inject(Router);
    router.navigate(['/login']);
    return false;
  }
  return true;
};

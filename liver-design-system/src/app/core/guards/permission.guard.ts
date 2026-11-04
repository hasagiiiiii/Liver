import { CanActivateFn } from '@angular/router';

export const permissionGuard: CanActivateFn = (route, state) => {
  // Enterprise mock permission guard
  return true;
};

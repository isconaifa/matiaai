import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const user = authService.currentUser();

  if(user?.role === 'SUPER-ADMIN') {
    return true;
  }
  router.navigate(['/matia/chat']);
  return false;
};

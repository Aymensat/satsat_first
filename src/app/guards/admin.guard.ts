import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const adminGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  if (authService.isAdmin()) {
    return true;
  }
  
  // Redirect to the teacher page if the user is logged in but not an admin
  if (authService.isLoggedIn()) {
    router.navigate(['/teacher']);
  } else {
    router.navigate(['/login']);
  }
  
  return false;
};
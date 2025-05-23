import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const adminGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  // Check if user has admin role
  if (authService.isAdminSync()) {
    return true;
  }
  
  // Redirect based on user status
  if (authService.isLoggedIn()) {
    // If logged in but not an admin, redirect based on role
    if (authService.checkTeacherRole()) {
      router.navigate(['/teacher']);
    } else {
      router.navigate(['/student']);
    }
  } else {
    router.navigate(['/login']);
  }
  
  return false;
};
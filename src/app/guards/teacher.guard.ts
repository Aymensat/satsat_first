import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map, take } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

export const teacherGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  // Check if user has teacher role
  if (authService.checkTeacherRole()) {
    return true;
  }
  
  // Redirect based on user status
  if (authService.isLoggedIn()) {
    // If logged in but not a teacher, redirect based on role
    if (authService.isAdminSync()) {
      router.navigate(['/admin']);
    } else {
      router.navigate(['/student']);
    }
  } else {
    router.navigate(['/login']);
  }
  
  return false;
};
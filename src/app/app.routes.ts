import { Routes } from '@angular/router';
import { AdminSpaceComponent } from './admin-space/admin-space.component';
import { authGuard } from './guards/auth.guard';
import { adminGuard } from './guards/admin.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/student', pathMatch: 'full' },
  { path: 'student', loadComponent: () => import('./student-space/student-space.component').then(c => c.StudentSpaceComponent) },
  { path: 'teacher', loadComponent: () => import('./teacher-space/teacher-space.component').then(c => c.TeacherSpaceComponent), canActivate: [authGuard] },
  { path: 'admin', component: AdminSpaceComponent, canActivate: [authGuard, adminGuard] },
  { path: 'login', loadComponent: () => import('./login/login.component').then(c => c.LoginComponent) },
  { path: '**', redirectTo: '/student' }
];
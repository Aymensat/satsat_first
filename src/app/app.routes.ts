import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { TeacherSpaceComponent } from './teacher-space/teacher-space.component';
import { StudentSpaceComponent } from './student-space/student-space.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { 
    path: 'teacher', 
    component: TeacherSpaceComponent,
    canActivate: [authGuard]  // Protect this route with auth guard
  },
  { path: 'student', component: StudentSpaceComponent },
  { path: '**', redirectTo: '/login' }
];
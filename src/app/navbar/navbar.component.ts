import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule, CommonModule],
  template: `
    <nav class="navbar">
      <div class="brand">School Timetable System</div>
      <div class="nav-links">
        <a routerLink="/student" routerLinkActive="active">Student View</a>
        <a routerLink="/teacher" routerLinkActive="active" *ngIf="isAuthenticated">Teacher View</a>
        <a routerLink="/admin" routerLinkActive="active" *ngIf="isAdmin">Admin View</a>
        <a routerLink="/login" routerLinkActive="active" *ngIf="!isAuthenticated">Login</a>
        <button *ngIf="isAuthenticated" (click)="logout()">Logout</button>
      </div>
    </nav>
  `,
  styles: [`
    .navbar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background-color: #3273dc;
      color: white;
      padding: 12px 20px;
    }
    .brand {
      font-size: 1.2rem;
      font-weight: bold;
    }
    .nav-links {
      display: flex;
      gap: 20px;
    }
    a {
      color: white;
      text-decoration: none;
      padding: 5px 10px;
      border-radius: 4px;
    }
    a.active, a:hover {
      background-color: rgba(255, 255, 255, 0.2);
    }
    button {
      padding: 5px 10px;
      background-color: #ff3860;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }
  `]
})
export class NavbarComponent implements OnInit, OnDestroy {
  isAuthenticated = false;
  isAdmin = false;
  
  private authSubscription: Subscription | null = null;
  private adminSubscription: Subscription | null = null;
  
  constructor(private authService: AuthService, private router: Router) {}
  
  ngOnInit(): void {
    // Subscribe to authentication state
    this.authSubscription = this.authService.isAuthenticated().subscribe(auth => {
      this.isAuthenticated = auth;
      
      // If not authenticated, ensure admin is also false
      if (!auth) {
        this.isAdmin = false;
      }
    });
    
    // Subscribe to admin state separately
    this.adminSubscription = this.authService.isAdmin().subscribe(isAdmin => {
      this.isAdmin = isAdmin;
      console.log('Admin status updated:', isAdmin);
    });
  }
  
  ngOnDestroy(): void {
    // Clean up subscriptions when component is destroyed
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
    if (this.adminSubscription) {
      this.adminSubscription.unsubscribe();
    }
  }
  
  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
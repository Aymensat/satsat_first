import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { jwtDecode } from 'jwt-decode';

interface LoginResponse {
  token: string;
}

interface JwtPayload {
  sub: string;
  email: string;
  roles: string[];
  exp: number;
  iat: number;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiURL = 'http://localhost:8080/api/auth';
  private tokenKey = 'auth_token';
  private authSubject = new BehaviorSubject<boolean>(this.isLoggedIn());
  private adminSubject = new BehaviorSubject<boolean>(this.checkIsAdmin());

  constructor(private http: HttpClient) {
    if (this.isLoggedIn()) {
      this.checkTokenExpiration();
      
      // Initialize admin status on service creation
      const isAdmin = this.checkIsAdmin();
      this.adminSubject.next(isAdmin);
      console.log('Initial admin status:', isAdmin);
    }
  }

  login(username: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiURL}/login`, { username, password })
      .pipe(
        tap(response => {
          console.log('Login successful, setting token');
          this.setToken(response.token);
          this.authSubject.next(true);
          
          // Update admin status after login and log it
          const isAdmin = this.checkIsAdmin();
          this.adminSubject.next(isAdmin);
          console.log('User roles from token:', this.getUserRoles());
          console.log('Admin status after login:', isAdmin);
          
          // Debug token contents
          this.debugToken();
        }),
        catchError(error => {
          console.error('Login error:', error);
          return throwError(() => new Error('Login failed. Please check your credentials.'));
        })
      );
  }

  logout(): void {
    console.log('Logging out user');
    if (typeof window !== 'undefined') {
      localStorage.removeItem(this.tokenKey);
    }
    this.authSubject.next(false);
    this.adminSubject.next(false);
  }

  getToken(): string | null {
    if (typeof window === 'undefined') {
      return null;
    }
    return localStorage.getItem(this.tokenKey);
  }

  private setToken(token: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.tokenKey, token);
    }
  }

  isLoggedIn(): boolean {
    const token = this.getToken();
    if (!token) return false;

    try {
      const decoded = jwtDecode<JwtPayload>(token);
      const isExpired = decoded.exp * 1000 < Date.now();
      return !isExpired;
    } catch (error) {
      return false;
    }
  }

  isAuthenticated(): Observable<boolean> {
    return this.authSubject.asObservable();
  }

  isAdmin(): Observable<boolean> {
    return this.adminSubject.asObservable();
  }

  // Check if user is admin based on token
  private checkIsAdmin(): boolean {
    const token = this.getToken();
    if (!token) return false;

    try {
      const decoded = jwtDecode<JwtPayload>(token);
      // Check for both lowercase and uppercase variations of ADMIN role
      const hasAdminRole = decoded.roles.some(role => 
        role.toUpperCase() === 'ADMIN' || 
        role === 'ROLE_ADMIN' || 
        role === 'admin');
      
      return hasAdminRole;
    } catch (error) {
      console.error('Error checking admin role:', error);
      return false;
    }
  }

  // For immediate check without subscribing
  checkAdminRole(): boolean {
    return this.checkIsAdmin();
  }

  // Get user roles from token
  getUserRoles(): string[] {
    const token = this.getToken();
    if (!token) return [];

    try {
      const decoded = jwtDecode<JwtPayload>(token);
      return decoded.roles || [];
    } catch (error) {
      console.error('Error getting user roles:', error);
      return [];
    }
  }

  getUserEmail(): string | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      const decoded = jwtDecode<JwtPayload>(token);
      return decoded.email;
    } catch (error) {
      return null;
    }
  }

  // Debug method to check token contents
  debugToken(): void {
    const token = this.getToken();
    if (!token) {
      console.log('No token found');
      return;
    }
    
    try {
      const decoded = jwtDecode<JwtPayload>(token);
      console.log('Token decoded:', decoded);
      console.log('Roles:', decoded.roles);
      console.log('Is Admin?', this.checkIsAdmin());
      console.log('Token expiration:', new Date(decoded.exp * 1000));
    } catch (error) {
      console.error('Error decoding token:', error);
    }
  }

  private checkTokenExpiration(): void {
    const token = this.getToken();
    if (!token) return;

    try {
      const decoded = jwtDecode<JwtPayload>(token);
      const expirationTime = decoded.exp * 1000;
      const currentTime = Date.now();

      if (expirationTime <= currentTime) {
        this.logout();
      } else {
        const timeUntilExpiry = expirationTime - currentTime;
        setTimeout(() => this.logout(), timeUntilExpiry);
      }
    } catch (error) {
      this.logout();
    }
  }

  // Add these methods to your AuthService class

  checkTeacherRole(): boolean {
    const token = this.getToken();
    if (!token) return false;
  
    try {
      const decoded = jwtDecode<JwtPayload>(token);
      // Check for various formats of teacher role
      const hasTeacherRole = decoded.roles.some(role => 
        role.toUpperCase() === 'TEACHER' || 
        role === 'ROLE_TEACHER' || 
        role === 'teacher');
      
      return hasTeacherRole;
    } catch (error) {
      console.error('Error checking teacher role:', error);
      return false;
    }
  }
  
  // Make sure to keep the original isAdmin() method signature that returns Observable
  // And add a new method for direct boolean check
  isAdminSync(): boolean {
    return this.checkAdminRole();
  }

}
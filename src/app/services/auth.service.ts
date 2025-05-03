import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiURL = 'http://localhost:8080';
  private tokenKey = 'auth_token';

  // we'll initialize this in the constructor
  private isAuthenticatedSubject: BehaviorSubject<boolean>;

  constructor(private http: HttpClient) {
    // only try to read localStorage if we're running in the browser
    const hasToken = typeof window !== 'undefined'
      ? !!localStorage.getItem(this.tokenKey)
      : false;

    this.isAuthenticatedSubject = new BehaviorSubject<boolean>(hasToken);
  }

  login(username: string, password: string): Observable<any> {
    return this.http
      .post<any>(`${this.apiURL}/api/auth/login`, { username, password })
      .pipe(
        tap(response => {
          if (response?.token) {
            this.setToken(response.token);
            this.isAuthenticatedSubject.next(true);
          }
        })
      );
  }

  logout(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(this.tokenKey);
    }
    this.isAuthenticatedSubject.next(false);
  }

  isAuthenticated(): Observable<boolean> {
    return this.isAuthenticatedSubject.asObservable();
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
}

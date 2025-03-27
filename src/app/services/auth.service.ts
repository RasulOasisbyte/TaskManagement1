import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';

// Define a User interface
export interface User {
  profileUrl: string;
  name: string;
  jobTitle: string;
  // Add additional user properties as needed
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private tokenKey = 'authToken';
  private rememberMeKey = 'rememberMe';
  private userKey = 'currentUser';

  // BehaviorSubject to store and expose the current user info
  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser$: Observable<User | null>;

  constructor(private http: HttpClient, private router: Router) {
    // Initialize the currentUser from localStorage if available
    const storedUser = localStorage.getItem(this.userKey);
    this.currentUserSubject = new BehaviorSubject<User | null>(
      storedUser ? JSON.parse(storedUser) : null
    );
    this.currentUser$ = this.currentUserSubject.asObservable();
  }

  // Login method that calls the backend and updates token/user info on success
  login(username: string, password: string): Observable<any> {
    return this.http.post('/api/auth/login', { username, password }).pipe(
      tap((response: any) => {
        if (response.token) {
          localStorage.setItem(this.tokenKey, response.token);
        }
        if (response.user) {
          // Save user details in local storage
          localStorage.setItem(this.userKey, JSON.stringify(response.user));
          // Update the BehaviorSubject so all subscribers (e.g., dashboard) are notified
          this.currentUserSubject.next(response.user);
        }
      })
    );
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem(this.tokenKey);
  }

  // Allow setting "Remember Me" preference which persists in local storage
  setRememberMe(value: boolean): void {
    if (value) {
      localStorage.setItem(this.rememberMeKey, 'true');
    } else {
      localStorage.removeItem(this.rememberMeKey);
    }
  }

  // Logout clears token, user info, and resets the BehaviorSubject
  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.rememberMeKey);
    localStorage.removeItem(this.userKey);
    this.currentUserSubject.next(null);
    this.router.navigate(['/auth/login']);

  }

  // Synchronous getter for current user value
  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }
}

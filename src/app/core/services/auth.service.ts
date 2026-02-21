import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap, map } from 'rxjs';
import { User, LoginRequest, RegisterRequest, AuthResponse } from '../models';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly TOKEN_KEY = 'access_token';
  private readonly REFRESH_TOKEN_KEY = 'refresh_token';
  private readonly USER_KEY = 'user_data';

  private httpClient = inject(HttpClient);
  private router = inject(Router);

  // Signals for reactive state
  private currentUserSignal = signal<User | null>(null);
  private isAuthenticatedSignal = computed(() => !!this.currentUserSignal());

  readonly currentUser = this.currentUserSignal.asReadonly();
  readonly isAuthenticated = this.isAuthenticatedSignal;

  constructor() {
    this.loadUserFromStorage();
  }

  private loadUserFromStorage(): void {
    const userData = localStorage.getItem(this.USER_KEY);
    if (userData) {
      try {
        this.currentUserSignal.set(JSON.parse(userData));
      } catch {
        this.clearAuthData();
      }
    }
  }

  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.httpClient.post<AuthResponse>('/api/auth/login', credentials).pipe(
      tap(response => this.handleAuthSuccess(response))
    );
  }

  register(data: RegisterRequest): Observable<AuthResponse> {
    return this.httpClient.post<AuthResponse>('/api/auth/register', data).pipe(
      tap(response => this.handleAuthSuccess(response))
    );
  }

  logout(): void {
    this.clearAuthData();
    this.router.navigate(['/auth/login']);
  }

  refreshToken(): Observable<AuthResponse> {
    const refreshToken = localStorage.getItem(this.REFRESH_TOKEN_KEY);
    return this.httpClient.post<AuthResponse>('/api/auth/refresh', { refreshToken }).pipe(
      tap(response => this.handleAuthSuccess(response))
    );
  }

  private handleAuthSuccess(response: AuthResponse): void {
    localStorage.setItem(this.TOKEN_KEY, response.token);
    localStorage.setItem(this.USER_KEY, JSON.stringify(response.user));
    this.currentUserSignal.set(response.user as unknown as User);
  }

  private clearAuthData(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.currentUserSignal.set(null);
  }

  getAccessToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(this.REFRESH_TOKEN_KEY);
  }
}
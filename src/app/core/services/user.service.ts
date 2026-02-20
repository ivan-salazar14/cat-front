import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User, CreateUserDto, UpdateUserDto } from '../models';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private httpClient = inject(HttpClient);
  private readonly API_URL = '/api/users';

  getById(id: string): Observable<User> {
    return this.httpClient.get<User>(`${this.API_URL}/${id}`);
  }

  getCurrentUser(): Observable<User> {
    return this.httpClient.get<User>(`${this.API_URL}/me`);
  }

  update(id: string, user: UpdateUserDto): Observable<User> {
    return this.httpClient.patch<User>(`${this.API_URL}/${id}`, user);
  }

  delete(id: string): Observable<void> {
    return this.httpClient.delete<void>(`${this.API_URL}/${id}`);
  }
}
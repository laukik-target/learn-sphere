import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private authUrl = `${environment.apiUrl}/users/login/`;

  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: 'Basic ' + btoa(`${username}:${password}`)
    });

    const body = { username, password };

    return this.http.post(this.authUrl, body, { headers });
  }

  // Set headers in localStorage after successful login
  setAuthHeaders(username: string, password: string): void {
    const authHeader = 'Basic ' + btoa(`${username}:${password}`);
    localStorage.setItem('authHeaders', authHeader);
  }

  getAuthHeaders(): HttpHeaders | null {
    const authHeader = localStorage.getItem('authHeaders');
    return authHeader ? new HttpHeaders({ Authorization: authHeader }) : null;
  }

  logout(): void {
    localStorage.removeItem('authHeaders');
  }
}

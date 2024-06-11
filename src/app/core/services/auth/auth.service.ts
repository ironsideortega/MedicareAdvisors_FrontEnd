import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { HttpInvokeService } from '../http-invoke.service';

interface LoginResponse {
  status: string;
  code: number;
  message: string;
  data: {
    UserName: string;
    ProfileID: number;
    Name: string;
  }[];
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loggedIn!: boolean;

  constructor(private http: HttpInvokeService) { }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('authToken');
  }

  login(loginData: any): Observable<LoginResponse> {
    return this.http
      .PostRequest<LoginResponse, any>('api/profile/login', loginData)
      .pipe(
        tap((response: LoginResponse) => {
          if (response.status === 'success' && response.data.length > 0) {
            const userData = response.data[0];
            console.log(userData);
            localStorage.setItem('authToken', 'token');
            localStorage.setItem('username', userData.UserName);
            localStorage.setItem('name', userData.Name);
            localStorage.setItem('userId', userData.ProfileID.toString());
            this.loggedIn = true;
          }
        }),
        catchError((error) => {
          this.loggedIn = false;
          return of(error);
        })
      );
  }

  logout(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('username');
    localStorage.removeItem('name');
    localStorage.removeItem('userId');
    this.loggedIn = false;
    console.log(this.isLoggedIn());


  }



  getUsername(): string | null {
    return localStorage.getItem('username');
  }

  getName(): string | null {
    return localStorage.getItem('name');
  }

  getUserId(): string | null {
    return localStorage.getItem('userId');
  }
}

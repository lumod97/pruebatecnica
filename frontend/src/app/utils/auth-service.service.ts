import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userNameSubject = new BehaviorSubject<string | null>(localStorage.getItem('userName'));
  private isLoggedInSubject = new BehaviorSubject<boolean>(!!localStorage.getItem('jwt'));

  userName$ = this.userNameSubject.asObservable(); // Observable para el nombre de usuario
  isLoggedIn$ = this.isLoggedInSubject.asObservable(); // Observable para el estado de sesión

  login(userName: string, jwt: string, userId: string): void {
    localStorage.setItem('jwt', jwt);
    localStorage.setItem('userId', userId);
    localStorage.setItem('userName', userName);
    this.isLoggedInSubject.next(true);
    this.userNameSubject.next(userName);
  }

  logout(): void {
    localStorage.removeItem('jwt');
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
    this.isLoggedInSubject.next(false);
    this.userNameSubject.next(null);
  }
}

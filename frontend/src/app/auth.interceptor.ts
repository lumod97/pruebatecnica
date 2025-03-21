import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = localStorage.getItem('jwt');
    if (token) {
      const authRequest = request.clone({
        setHeaders: {
          'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
        },
      });
      return next.handle(authRequest);
    }
    return next.handle(request);
  }
}
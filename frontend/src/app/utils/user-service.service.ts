import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private baseUrl = 'http://localhost:8080/usuarios';

  constructor(private http: HttpClient) {}

  obtenerUsuarioPorId(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/get-username/${id}`);
  }
}
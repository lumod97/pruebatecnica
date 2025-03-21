import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ComentarioService {
  private baseUrl = 'http://localhost:8080/comentarios'; // URL base del backend

  constructor(private http: HttpClient) {}

  obtenerComentariosPorIdArticulo(idArticulo: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/articulo/${idArticulo}`);
  }

  enviarComentario(articuloId: number, comentario: any): Observable<any> {
    const url = `http://localhost:8080/api/articulos/${articuloId}/comentarios`;
    return this.http.post<any>(url, comentario);
  }
}
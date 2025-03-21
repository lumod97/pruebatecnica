import { Injectable } from '@angular/core';
import { Client, IMessage } from '@stomp/stompjs';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private stompClient!: Client; // Cliente WebSocket para manejar la conexión
  private nuevoArticuloSubject = new BehaviorSubject<any>(null); // Emisor de nuevos artículos
  public nuevoArticulo$ = this.nuevoArticuloSubject.asObservable(); // Observable para que los componentes se suscriban

  constructor() {
    this.configurarWebSocket(); // Configura la conexión WebSocket al inicializar el servicio
  }

  // Configura la conexión WebSocket
  private configurarWebSocket(): void {
    this.stompClient = new Client({
      brokerURL: 'ws://localhost:8080/ws', // URL del servidor WebSocket
      debug: (str) => console.log(str), // Habilita logs para depuración
      reconnectDelay: 5000, // Tiempo de reconexión en caso de fallo
    });

    this.stompClient.onConnect = () => {
      console.log('Conexión WebSocket establecida');

      // Suscribirse al tema de nuevos artículos
      this.stompClient.subscribe('/topic/articulos/nuevo', (message: IMessage) => {
        const nuevoArticulo = JSON.parse(message.body);
        console.log('Nuevo artículo recibido:', nuevoArticulo);
        this.nuevoArticuloSubject.next(nuevoArticulo); // Emite el nuevo artículo a los suscriptores
      });
    };

    this.stompClient.onStompError = (frame) => {
      console.error('Error en WebSocket:', frame.headers['message']);
    };

    this.stompClient.activate(); // Activa la conexión WebSocket
  }
}

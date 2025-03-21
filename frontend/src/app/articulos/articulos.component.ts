import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { Client, IMessage } from '@stomp/stompjs';
import { Articulo } from './articulos.interface';
import { AgregarArticuloComponent } from './agregar-articulo/agregar-articulo.component';
import { DetallesArticuloComponent } from '../detalles-articulo/detalles-articulo.component';
import { WebSocketService } from '../utils/websocket.service';
import { NotificationBarComponent } from '../shared/notification-bar/notification-bar.component';
import SwalUtils from '../utils/Swal';

@Component({
  selector: 'app-articulos',
  templateUrl: './articulos.component.html',
  styleUrls: ['./articulos.component.scss'],
  imports: [
    FormsModule,
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
  ],
})
export class ArticulosComponent implements OnInit, OnDestroy {
  @ViewChild('notificationBar') notificationBar!: NotificationBarComponent;

  articulos: Articulo[] = []; // Lista de artículos cargados desde el backend
  private stompClient!: Client; // Cliente WebSocket para manejar actualizaciones en tiempo real

  constructor(
    private http: HttpClient,
    private dialog: MatDialog,
    private webSocketService: WebSocketService
  ) {}

  ngOnInit(): void {
    this.cargarArticulos(); // Carga inicial de artículos
    this.configurarWebSocket(); // Configuración de WebSocket para actualizaciones en tiempo real

    // Suscripción a nuevos artículos enviados por WebSocket
    this.webSocketService.nuevoArticulo$.subscribe((nuevoArticulo) => {
      if (nuevoArticulo) {
        this.agregarArticuloALaVista(nuevoArticulo);
      }
    });
  }

  // Configura la conexión WebSocket para recibir actualizaciones en tiempo real
  configurarWebSocket(): void {
    this.stompClient = new Client({
      brokerURL: 'ws://localhost:8080/ws',
      debug: (str) => console.log(str),
      reconnectDelay: 5000,
    });

    this.stompClient.onConnect = () => {
      console.log('Conexión WebSocket establecida');

      // Suscribirse al tema de vistas de artículos
      this.stompClient.subscribe('/topic/articulos/vistas', (message: IMessage) => {
        const articuloId = JSON.parse(message.body);
        this.actualizarVistasLocalmente(articuloId);
      });
    };

    this.stompClient.onStompError = (frame) => {
      console.error('Error en WebSocket:', frame.headers['message']);
    };

    this.stompClient.activate();
  }

  // Actualiza localmente las vistas de un artículo
  actualizarVistasLocalmente(articuloId: number): void {
    const articulo = this.articulos.find((a) => a.id === articuloId);
    if (articulo) {
      articulo.views++;
    }
  }

  ngOnDestroy(): void {
    // Cierra la conexión WebSocket al destruir el componente
    if (this.stompClient && this.stompClient.connected) {
      this.stompClient.deactivate();
    }
  }

  // Carga la lista de artículos desde el backend
  cargarArticulos(): void {
    this.http.get<Articulo[]>('http://localhost:8080/articulos').subscribe({
      next: (data) => {
        this.articulos = data;
        console.log('Artículos cargados:', data);
      },
      error: (error) => {
        console.error('Error al cargar artículos:', error);
        alert('No se pudieron cargar los artículos. Intenta nuevamente.');
      },
    });
  }

  // Incrementa las vistas de un artículo en el backend
  incrementarVistas(articulo: Articulo): void {
    this.http.post(`http://localhost:8080/articulos/${articulo.id}/incrementar-vistas`, {}).subscribe({
      next: () => {
        console.log(`Vistas incrementadas para el artículo: ${articulo.titulo}`);
      },
      error: (error) => {
        console.error('Error al incrementar vistas:', error);
      },
    });
  }

  // Abre un modal para mostrar los detalles de un artículo
  async verDetalle(articulo: Articulo): Promise<void> {
    const result = await SwalUtils.question('', `¿Ver detalles del artículo: ${articulo.titulo}?`);
    if (result.isConfirmed) {
      this.dialog.open(DetallesArticuloComponent, {
        width: '600px',
        data: articulo,
      });
      this.incrementarVistas(articulo);
    } else {
      console.log('El usuario canceló la acción');
    }
  }

  // Abre un modal para agregar un nuevo artículo
  async agregarArticulo(): Promise<void> {
    const dialogRef = this.dialog.open(AgregarArticuloComponent, {
      width: '600px',
    });

    const resultado = await dialogRef.afterClosed().toPromise();
    if (resultado) {
      this.guardarArticulo(resultado);
    }
  }

  // Guarda un nuevo artículo en el backend
  guardarArticulo(articulo: { titulo: string; contenido: string }): void {
    this.http.post<Articulo>('http://localhost:8080/articulos', articulo).subscribe({
      next: (nuevoArticulo) => {
        this.articulos.push(nuevoArticulo);
        console.log('Artículo agregado:', nuevoArticulo);
      },
      error: (error) => {
        console.error('Error al guardar el artículo:', error);
      },
    });
  }

  // Agrega un artículo a la lista local
  agregarArticuloALaVista(nuevoArticulo: Articulo): void {
    this.articulos.push(nuevoArticulo);
  }
}
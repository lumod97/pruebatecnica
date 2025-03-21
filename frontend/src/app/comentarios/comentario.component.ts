import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Client, IMessage } from '@stomp/stompjs';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ComentarioService } from './comentarios.service';
import { UserService } from '../utils/user-service.service';

@Component({
  selector: 'app-comentarios',
  templateUrl: './comentarios.component.html',
  styleUrls: ['./comentarios.component.scss'],
  imports: [
    FormsModule,
    CommonModule,
    MatListModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
  ],
})
export class ComentariosComponent implements OnInit, OnDestroy {
  @Input() articuloId!: number; // ID del artículo para cargar comentarios
  comentarios: any[] = []; // Lista de comentarios del artículo
  nuevoComentario: string = ''; // Texto del nuevo comentario
  nombresUsuarios: Map<number, string> = new Map(); // Mapa para almacenar los nombres de usuario
  private stompClient!: Client; // Cliente WebSocket para manejar los comentarios en tiempo real

  constructor(
    private http: HttpClient,
    private comentarioService: ComentarioService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    const token = localStorage.getItem('jwt'); // Obtiene el token JWT del almacenamiento local

    // Carga los comentarios iniciales del artículo
    this.cargarComentarios();

    // Configura la conexión WebSocket
    this.stompClient = new Client({
      brokerURL: 'ws://localhost:8080/ws', // URL del servidor WebSocket
      connectHeaders: {
        Authorization: `Bearer ${token}`, // Incluye el token JWT en los encabezados
      },
      debug: (str) => console.log(str), // Habilita logs para depuración
      reconnectDelay: 5000, // Tiempo de reconexión en caso de fallo
    });

    this.stompClient.onConnect = () => {
      console.log('Conexión WebSocket establecida');
      if (this.articuloId) {
        // Suscribirse al tema de comentarios del artículo
        this.stompClient.subscribe(
          `/topic/comentarios/${this.articuloId}`,
          (message: IMessage) => {
            const comentario = JSON.parse(message.body);
            this.procesarComentario(comentario);
          }
        );
      }
    };

    this.stompClient.onStompError = (frame) => {
      console.error('Error en WebSocket:', frame.headers['message']);
    };

    this.stompClient.activate();
  }

  ngOnDestroy(): void {
    // Desactiva la conexión WebSocket al destruir el componente
    if (this.stompClient && this.stompClient.connected) {
      this.stompClient.deactivate();
    }
  }

  // Carga los comentarios del artículo desde el backend
  cargarComentarios(): void {
    this.comentarioService
      .obtenerComentariosPorIdArticulo(this.articuloId)
      .subscribe({
        next: (data: any) => {
          this.comentarios = data;
          // Obtiene los nombres de los usuarios para cada comentario
          this.comentarios.forEach((comentario) => {
            if (!this.nombresUsuarios.has(comentario.usuarioId)) {
              this.obtenerNombreUsuario(comentario.usuarioId);
            }
          });
        },
        error: (error) => {
          console.error('Error al cargar comentarios:', error);
        },
      });
  }

  // Obtiene el nombre del usuario desde el backend y lo almacena en el mapa
  obtenerNombreUsuario(usuarioId: number): void {
    if (this.nombresUsuarios.has(usuarioId)) {
      return; // Si el nombre ya está en el mapa, no hace nada
    }

    this.userService.obtenerUsuarioPorId(usuarioId).subscribe({
      next: (data: any) => {
        this.nombresUsuarios.set(usuarioId, data.nombreUsuario); // Almacena el nombre en el mapa
      },
      error: (error) => {
        if (error.status === 404) {
          console.error(`Usuario con ID ${usuarioId} no encontrado.`);
        } else {
          console.error('Error al obtener el nombre del usuario:', error);
        }
        this.nombresUsuarios.set(usuarioId, 'Usuario desconocido'); // Valor predeterminado
      },
    });
  }

  // Devuelve el nombre del usuario desde el mapa o un valor predeterminado
  obtenerNombreDesdeMapa(usuarioId: number): string {
    return this.nombresUsuarios.get(usuarioId) || 'Cargando...';
  }

  // Envía un nuevo comentario al backend a través del WebSocket
  enviarComentario(): void {
    const currentUser = parseInt(localStorage.getItem('userId') || '0'); // Obtiene el ID del usuario desde el localStorage
    if (this.stompClient && this.stompClient.connected) {
      const nuevoComentario = {
        contenido: this.nuevoComentario,
        usuarioId: currentUser,
        articuloId: this.articuloId,
      };

      // Publica el comentario en el WebSocket
      this.stompClient.publish({
        destination: `/app/comentarios/${this.articuloId}`,
        body: JSON.stringify(nuevoComentario),
      });

      // Limpia el cuadro de texto después de enviar el comentario
      this.nuevoComentario = '';
    } else {
      console.error(
        'No se pudo enviar el comentario: WebSocket no está conectado.'
      );
    }
  }

  // Procesa un comentario recibido a través del WebSocket
  procesarComentario(comentario: any): void {
    const userId = parseInt(localStorage.getItem('userId') || '0');
    if (comentario.usuarioId !== userId) {
      // Reproduce un sonido si el comentario no es del usuario actual
      const audio = new Audio('assets/msn_messenger.mp3');
      audio.play();
    }
    this.comentarios.push(comentario);
  }
}
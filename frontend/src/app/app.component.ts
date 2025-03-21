import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, NavigationEnd, RouterModule } from '@angular/router';
import { UserService } from './utils/user-service.service';
import { AuthService } from './utils/auth-service.service';
import { AgregarArticuloComponent } from './articulos/agregar-articulo/agregar-articulo.component';
import { MatDialog } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { Client } from '@stomp/stompjs';
import { WebSocketService } from './utils/websocket.service';
import { NotificationBarComponent } from './shared/notification-bar/notification-bar.component';
import { Articulo } from './articulos/articulos.interface';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  imports: [RouterModule, CommonModule, NotificationBarComponent]
})
export class AppComponent implements OnInit {
  userId: number | undefined;
  isArticulosRoute: boolean = false;
  isLoggedIn: boolean = false;
  userName: string = "";
  articulos: any[] = [];
  private stompClient!: Client;
  @ViewChild('notificationBar') notificationBar!: NotificationBarComponent;

  constructor(
    private router: Router,
    private authService: AuthService,
    private userService: UserService,
    private dialog: MatDialog,
    private http: HttpClient,
    private webSocketService: WebSocketService
  ) {}

  ngOnInit() {
    // Suscribirse al estado de sesión
    this.authService.isLoggedIn$.subscribe((loggedIn) => {
      this.isLoggedIn = loggedIn;
      if (loggedIn) {
        this.userId = parseInt(localStorage.getItem('userId') || '0'); // Asigna 0 si no hay un valor en localStorage
        if (this.userId) {
          this.obtenerUsuario(); // Llama al método solo si userId es válido
        }
      }
    });

    // Suscribirse al nombre de usuario
    this.authService.userName$.subscribe((name) => {
      this.userName = name || '';
    });

    // Detectar cambios en la ruta
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.isArticulosRoute = event.url === '/articulos';
      }
    });

    this.cargarArticulos(); // Cargar la lista inicial de artículos

    // Suscribirse a los nuevos artículos desde el servicio WebSocket
    this.webSocketService.nuevoArticulo$.subscribe((nuevoArticulo) => {
      if (nuevoArticulo) {
        this.agregarArticuloALaVista(nuevoArticulo);
      }
    });
  }

  obtenerUsuario(): void {
    if (this.isLoggedIn && this.userId !== undefined) { // Validar que userId no sea undefined
      this.userService.obtenerUsuarioPorId(this.userId).subscribe({
        next: (data: any) => {
          this.userName = data.nombreUsuario;
          (this.authService as any).userNameSubject.next(this.userName); // Actualiza el nombre del usuario
        },
        error: (error) => {
          console.error('Error al obtener el nombre del usuario:', error);
        }
      });
    } else {
      console.error('Error: userId es undefined');
    }
  }

  agregarArticuloALaVista(nuevoArticulo: any): void {
    this.articulos.push(nuevoArticulo); // Agrega el nuevo artículo a la lista local

    // Mostrar la notificación
    const message = `Nuevo artículo agregado: "${nuevoArticulo.titulo}" por ${nuevoArticulo.autor}`;
    this.notificationBar.showNotification(message);
  }

  cargarArticulos(): void {
    this.http.get<any[]>('http://localhost:8080/articulos').subscribe({
      next: (data) => {
        this.articulos = data;
      },
      error: (error) => {
        console.error('Error al cargar artículos:', error);
      }
    });
  }

  agregarArticulo(): void {
    const dialogRef = this.dialog.open(AgregarArticuloComponent, {
      width: '600px',
    });
  
    dialogRef.afterClosed().subscribe((resultado) => {
      if (resultado) {
        console.log('Datos del nuevo artículo:', resultado);
        this.guardarArticulo(resultado);
      }
    });
  }
  
  guardarArticulo(articulo: { titulo: string; contenido: string, autor: string }): void {
    articulo.autor = this.userName;
    this.http.post<Articulo>('http://localhost:8080/articulos', articulo).subscribe({
      next: (nuevoArticulo) => {
        this.articulos.push(nuevoArticulo);
        console.log('Artículo agregado:', nuevoArticulo);
  

        const message = `Nuevo artículo agregado: "${nuevoArticulo.titulo}" por ${nuevoArticulo.autor}`;
        this.notificationBar.showNotification(message);
      },
      error: (error) => {
        console.error('Error al guardar el artículo:', error);
      },
    });
  }

  cerrarSesion() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}

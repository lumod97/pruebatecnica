import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../utils/auth-service.service';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  imports: [
    FormsModule,
    CommonModule
  ]
})
export class LoginComponent {
  isLogin: boolean = true; // Controla si se muestra el formulario de login o registro
  username: string = ''; // Nombre de usuario para el login
  password: string = ''; // Contraseña para el login
  registerData: { nombreUsuario: string; contrasena: string } = { nombreUsuario: '', contrasena: '' }; // Datos para el registro

  private baseUrl = 'http://localhost:8080'; // URL base del backend

  constructor(
    private authService: AuthService,
    private router: Router,
    private http: HttpClient
  ) {}

  // Lógica para iniciar sesión
  login(): void {
    const loginPayload = {
      username: this.username,
      password: this.password
    };

    this.http.post(`${this.baseUrl}/login`, loginPayload).subscribe({
      next: (response: any) => {
        // Guarda los datos del usuario en el servicio de autenticación
        this.authService.login(response.userName, response.token, response.userId);
        // Redirige al usuario a la página de artículos después de iniciar sesión
        this.router.navigate(['/articulos']);
      },
      error: (error) => {
        console.error('Error al iniciar sesión:', error);
        alert('Credenciales incorrectas. Por favor, inténtalo de nuevo.');
      }
    });
  }

  // Alterna entre el formulario de login y el de registro
  toggleForm(isLogin: boolean): void {
    this.isLogin = isLogin;
  }

  // Lógica para registrar un nuevo usuario
  register(): void {
    const registerPayload = {
      nombreUsuario: this.registerData.nombreUsuario,
      contrasena: this.registerData.contrasena
    };

    this.http.post(`${this.baseUrl}/usuarios`, registerPayload).subscribe({
      next: (response: any) => {
        alert('Usuario registrado exitosamente. Ahora puedes iniciar sesión.');
        // Cambia al formulario de login después de un registro exitoso
        this.toggleForm(true);
      },
      error: (error) => {
        console.error('Error al registrar usuario:', error);
        alert('Error al registrar el usuario. Por favor, inténtalo de nuevo.');
      }
    });
  }
}
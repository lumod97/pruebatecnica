import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.scss'],
  imports: [
    ReactiveFormsModule,
    CommonModule,
    FormsModule
  ],
})
export class RegistroComponent {
  registroForm: FormGroup;
  usuario = {
    nombreUsuario: '',
    contrasena: ''
  };

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.registroForm = this.fb.group({
      nombre: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
    }, { validators: this.passwordsMatchValidator });
  }

  passwordsMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordsMismatch: true };
  }

  onSubmit() {
    if (this.registroForm.valid) {
      console.log('Formulario enviado:', this.registroForm.value);
      this.http.post('http://localhost:8080/registro', this.registroForm.value).subscribe({
        next: (response) => {
          console.log('Registro exitoso:', response);
          alert('Registro exitoso');
        },
        error: (error) => {
          console.error('Error en el registro:', error);
          alert('Error al registrar. Por favor, inténtalo de nuevo.');
        },
      });
    } else {
      console.log('Formulario inválido');
    }
  }

  registrarUsuario() {
    this.http.post('http://localhost:8080/usuarios', this.usuario).subscribe({
      next: (response) => {
        console.log('Usuario registrado:', response);
        alert('Registro exitoso');
      },
      error: (error) => {
        console.error('Error al registrar usuario:', error);
        alert('Error al registrar usuario. Por favor, inténtalo de nuevo.');
      }
    });
  }
}

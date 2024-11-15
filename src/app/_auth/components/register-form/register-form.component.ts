import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthServiceService } from '../../service/auth-service.service';
import { Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'auth-register-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, HttpClientModule],
  templateUrl: './register-form.component.html',
  styleUrls: ['./register-form.component.css'],
  providers: [AuthServiceService]
})
export class RegisterFormComponent {
  form!: FormGroup;
  loginAlert: boolean = false;
  error: boolean = false;
  errorMessage: string[] = [];

  private authService = inject(AuthServiceService);

  constructor(private fb: FormBuilder, private router: Router) {
    this.formulario();
  }

  formulario() {
    this.form = this.fb.group({
      rut: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(9)]],
      nombre1: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(255)]],
      apellido1: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(255)]],
      apellido2: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(255)]],
      email: ['', [Validators.required, Validators.email]],
      telefono: ['', [Validators.required, Validators.pattern(/^[0-9]+$/)]],  // Asegúrate de que solo números sean permitidos
      role: ['', [Validators.required]],  // Añadido el campo role
    });
  }

  // Validadores personalizados para cada campo
  get rutValidate() {
    return this.form.get('rut')?.invalid && this.form.get('rut')?.touched;
  }

  get nombre1Validate() {
    return this.form.get('nombre1')?.invalid && this.form.get('nombre1')?.touched;
  }

  get apellido1Validate() {
    return this.form.get('apellido1')?.invalid && this.form.get('apellido1')?.touched;
  }

  get apellido2Validate() {
    return this.form.get('apellido2')?.invalid && this.form.get('apellido2')?.touched;
  }

  get emailValidate() {
    return this.form.get('email')?.invalid && this.form.get('email')?.touched;
  }

  get telefonoValidate() {
    return this.form.get('telefono')?.invalid && this.form.get('telefono')?.touched;
  }

  get roleValidate() {
    return this.form.get('role')?.invalid && this.form.get('role')?.touched;
  }

  // Función para registrar usuario
  // Método para registrar usuario
async register() {
  // Primero validamos si el formulario tiene campos inválidos
  if (this.form.invalid) {
    // Marcamos todos los controles como tocados para que se muestren los errores
    Object.values(this.form.controls).forEach(control => {
      control.markAsTouched();
    });
    return;
  }

  // Reseteamos el estado de la alerta de login
  this.loginAlert = true;
  this.errorMessage = [];  // Limpiamos los mensajes de error anteriores

  try {
    // Enviamos los datos del formulario al servicio de autenticación
    const response = await this.authService.register(this.form.value);

    // Verificamos si la respuesta tiene un error
    if (response && !response.error) {
      // Si todo es correcto, redirigimos al login
      this.router.navigate(['/login']);
    } else {
      // Si hay un error en la respuesta, lo mostramos
      console.log('Error en el componente del register [Register Form]: ', response);
      this.error = true;
      this.errorMessage.push(response?.message || 'Error de registro');
    }
  } catch (error) {
    // En caso de error en la solicitud, mostramos el error
    console.log('Error en la solicitud de registro: ', error);
    this.error = true;
    this.errorMessage.push('Error de registro en el formulario');
  }
}

  goToLogin() {
    this.router.navigate(['/login']);
  }
}

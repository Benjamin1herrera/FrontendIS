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
      rut: ['', [Validators.required]],
      nombre1: ['', [Validators.required]],
      apellido1: ['', [Validators.required]],
      apellido2: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      telefono: ['', [Validators.required]]
    });
  }

  get emailValidate() {
    return this.form.get('email')?.invalid && this.form.get('email')?.touched;
  }

  get passwordValidate() {
    return this.form.get('password')?.invalid && this.form.get('password')?.touched;
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

  get rutValidate() {
    return this.form.get('rut')?.invalid && this.form.get('rut')?.touched;
  }

  get telefonoValidate() {
    return this.form.get('telefono')?.invalid && this.form.get('telefono')?.touched;
  }

  async register() {
    if (this.form.invalid) {
      Object.values(this.form.controls).forEach(control => {
        control.markAsTouched();
      });
      return;
    }

    this.loginAlert = true;

    try {
      const response = await this.authService.register(this.form.value);

      if (!response.error){
        this.router.navigate(['/login']);
      } else{
        console.log('Error en el componente del register [Register Form]: ', response);
        this.error = true;
        this.errorMessage.push('Error de registro');
      }

    } catch (error) {
      this.error = true;
      this.errorMessage.push('Error de registro en el formulario');
    }
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }
}

import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthServiceService } from '../../service/auth-service.service';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { LocalStorageService } from '../../../_shared/service/local-storage.service';


@Component({
  selector: 'auth-loginform',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, HttpClientModule],
  templateUrl: './loginform.component.html',
  styleUrls: ['./loginform.component.css'],
  providers: [AuthServiceService, LocalStorageService]
})

export class LoginformComponent {
  form!: FormGroup;
  loginAlert: boolean = false;
  error: boolean = false;
  errorMessage: string[] = [];

  private authService = inject(AuthServiceService);
  private LocalStorageService = inject(LocalStorageService);

  constructor(private fb: FormBuilder, private router: Router) {
    this.formulario();
  }

  formulario() {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  get emailValidate() {
    return this.form.get('email')?.invalid && this.form.get('email')?.touched;
  }

  get passwordValidate() {
    return this.form.get('password')?.invalid && this.form.get('password')?.touched;
  }

  async login() {
    if (this.form.invalid) {
      Object.values(this.form.controls).forEach(control => {
        control.markAsTouched();
      });
      return;
    }

    this.loginAlert = true;

    try {
      const response = await this.authService.login(this.form.value);

      if (response.data.user){
        this.LocalStorageService.setClientLogger(response.data.user);
        this.LocalStorageService.setToken(response.data.token);
        //TODO: Implementar que efectivamente es un admin [redirecciona al admin]
        //TODO: Implementar que efectivamente es un worker [redirecciona al worker]

        this.router.navigate(['/admin/dashboard']);
      } else{
        console.log('Error en el componente del login [Login Form]: ', response);
        this.error = true;
        this.errorMessage.push('Error de autenticación');
      }

    } catch (error) {
      this.error = true;
      this.errorMessage.push('Error de autenticación');
    }
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }
}
import { inject, Injectable } from '@angular/core';
import { ResponseAPILogin, ResponseAPIRegister, User } from '../interfaces/ResponseAPI';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {

  private baseUrl = 'http://127.0.0.1:8000/api'

  public errors: string[] = [];
  private userLogged: User | null = null;
  private http = inject(HttpClient);

  async login(form: any):Promise<ResponseAPILogin> {
    try{
      const data = await firstValueFrom(this.http.post<ResponseAPILogin>(`${this.baseUrl}/login`, form, this.crearHeaders()));
      return Promise.resolve(data);
    } catch (error){
      console.log('Error en el servicio del login [Auth Service]: ', error);
      let e = error as HttpErrorResponse;
      this.errors.push(e.message || 'Error desconocido');
      return Promise.reject(this.errors)
    }
  }

  async register(form: any): Promise<ResponseAPIRegister> {
    try {
      const data = await firstValueFrom(this.http.post<ResponseAPIRegister>(`${this.baseUrl}/register`, form, this.crearHeaders()));
      return Promise.resolve(data);
    } catch (error) {
      console.log('Error en el servicio del registro [Auth Service]: ', error);
      let e = error as HttpErrorResponse;
      this.errors = [];  // Limpiar errores anteriores
      if (e.error && e.error.message) {
        this.errors.push(e.error.message);  // Mensaje de error desde el backend
      } else {
        this.errors.push(e.message || 'Error desconocido');
      }
      return Promise.reject(this.errors);
    }
  }


  logout(): void {
    this.userLogged = null;
    localStorage.removeItem('User');
    localStorage.removeItem('Token');
  }

  crearHeaders() {
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      })
    }
  }

  // // Función para obtener la cookie almacenada
  // getCookie(name: string): string | null {
  //   const nameEQ = `${name}=`;
  //   const ca = document.cookie.split(';');
  //   for (let i = 0; i < ca.length; i++) {
  //     let c = ca[i];
  //     while (c.charAt(0) === ' ') c = c.substring(1, c.length);
  //     if (c.indexOf(nameEQ) === 0) return decodeURIComponent(c.substring(nameEQ.length, c.length));
  //   }
  //   return null;
  // }

  // // Función para obtener el usuario logueado desde las cookies
  // getLoggedUser(): User | null {
  //   const userCookie = this.getCookie('User');
  //   return userCookie ? JSON.parse(userCookie) : null;
  // }


  //  // Establece el usuario logueado y lo guarda en una cookie
  //  setClientLoggedIn(user: User) {
  //   this.userLogged = user;

  //   // Convertir el objeto user a un JSON y luego almacenarlo en las cookies
  //   const userJSON = JSON.stringify(this.userLogged);

  //   // Establecer la cookie con 7 días de duración
  //   document.cookie = `User=${encodeURIComponent(userJSON)};path=/;max-age=${7 * 24 * 60 * 60};`;

  //   // Puedes agregar otras configuraciones como "secure" o "SameSite"
  // }
}

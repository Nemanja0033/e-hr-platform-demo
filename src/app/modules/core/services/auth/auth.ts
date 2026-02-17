import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
// This service provides mehtods for both HR and Employe Auth flow

export class AuthService {
  constructor(private http: HttpClient){}

  registerHr(registerData: {name: string; password: string; email: string} ){
    return this.http.post(`http://localhost:3000/api/hr/auth/register`, registerData);
  }

  loginHr(loginData: {email: string; password: string}){
    return this.http.post(`http://localhost:3000/api/hr/auth/login`, loginData);
  }

  getMeHr(){
    return this.http.get('http://localhost:3000/api/hr/auth/me');
  }

  logout(){
    localStorage.removeItem('token');
  }

  saveToken(token: string){
    localStorage.setItem('token', token);
  }

  getToken(){
    localStorage.getItem('token');
  }
}

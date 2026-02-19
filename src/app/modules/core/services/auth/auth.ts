import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
// This service provides mehtods for both HR and Employe Auth flow

export class AuthService {
  constructor(private http: HttpClient) { }

  registerHr(registerData: { name: string; password: string; email: string }) {
    return this.http.post(`http://localhost:3000/api/hr/auth/register`, registerData);
  }

  loginHr(loginData: { email: string; password: string }) {
    return this.http.post(`http://localhost:3000/api/hr/auth/login`, loginData);
  }

  registerEmploye(registerData: { email: string, name: string, surname: string, password: string, role: string, companyId: string }){
    return this.http.post(`http://localhost:3000/api/employe/auth/register`, registerData);
  }

  loginEmploye(loginData: { email: string, password: string}){
    return this.http.post(`http://localhost:3000/api/employe/auth/login`, loginData);
  }

  // getMe & saveRole method is reusable beause of role argument providing
  getMe(role: "hr" | "employe") {
    return this.http.get(`http://localhost:3000/api/${role}/auth/me`);
  }

  saveRole(role: "hr" | "employe") {
    localStorage.setItem('role', role);
  }

  getRole(): "hr" | "employe" {
    return localStorage.getItem('role') as "hr" | "employe";
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
  }

  saveToken(token: string) {
    localStorage.setItem('token', token);
  }

  getToken() {
    return localStorage.getItem('token');
  }
}

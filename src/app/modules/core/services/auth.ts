import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_URL } from '../constants/env';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient){}

  register(registerData: {name: string; password: string; email: string} ){
    return this.http.post(`http://localhost:3000/api/auth/register`, registerData);
  }

  login(loginData: {email: string; password: string}){
    return this.http.post(`http://localhost:3000/api/auth/login`, loginData);
  }

  getMe(){
    return this.http.get('http://localhost:3000/api/auth/me');
  }

  saveToken(token: string){
    localStorage.setItem('token', token);
  }

  getToken(){
    localStorage.getItem('token');
  }
}

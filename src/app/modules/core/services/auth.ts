import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_URL } from '../constants/env';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient){}

  register(registerData: {name: string; surname: string; password: string; email: string} ){
    return this.http.post(`http://localhost:3000/api/auth/register`, registerData);
  }

  login(loginData: {email: string; password: string}){
    return this.http.post(`${API_URL}/auth/login`, loginData);
  }

  saveToken(token: string){
    localStorage.setItem('token', token);
  }

  getToken(){
    localStorage.getItem('token');
  }
}

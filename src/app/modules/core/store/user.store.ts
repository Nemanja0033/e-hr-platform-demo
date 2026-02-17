import { Injectable } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';

export interface User {
  email: string;
  name?: string;
  token?: string;
  role: 'hr' | 'employe'
}

@Injectable({ providedIn: 'root' })
export class UserStore {
  private userSubject = new BehaviorSubject<User | null>(null);
  user$ = this.userSubject.asObservable();

  // izvedeni stream (derived observable)
    isUserAuth$ = this.user$.pipe(
    map(user => !!user?.token)
  )

  // Subject/BehaviorSubject: ti možeš da pozoveš .next(value) i time emituješ vrednost.
  // Običan Observable: ti ne možeš da pozoveš .next(). On sam emituje vrednosti, a ti samo definišeš šta da radiš kada stignu (next callback u subscribe).
  setUser(user: User) {
    this.userSubject.next(user);
  }

  clearUser() {
    this.userSubject.next(null);
  }

  getUserSnapshot(): User | null {
    return this.userSubject.value;
  }

  rehydrateUser(){
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role') as "hr" | "employe";

    if(token && role){
      this.userSubject.next({ token, role, email: '', name: ''})
    }
  }
}

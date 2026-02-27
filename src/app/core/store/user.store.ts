import { computed, Injectable, signal } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';

export interface User {
  email: string;
  name?: string;
  token?: string;
  role: 'hr' | 'employe';
  vacationDays?: number;  
  sickLeaveDays?: number;
  roleGlobal?: 'hr' | 'employe';
}

@Injectable({ providedIn: 'root' })
export class UserStore {
  // Rxjs behaviorSubject -- old way
  // izvedeni stream (derived observable)
  //   isUserAuth$ = this.user$.pipe(
  //   map(user => !!user?.token)
  // )
  // Subject/BehaviorSubject: ti možeš da pozoveš .next(value) i time emituješ vrednost.
  // Običan Observable: ti ne možeš da pozoveš .next(). On sam emituje vrednosti, a ti samo definišeš šta da radiš kada stignu (next callback u subscribe).
  // private userSubject = new BehaviorSubject<User | null>(null);
  // user$ = this.userSubject.asObservable();

  private _user = signal<User | null>(null);
  user = this._user.asReadonly();

  isUserAuth = computed(() => !!this.user()?.token);
  userRole = computed(() => this.user()?.role ?? this.user()?.roleGlobal);
  
  setUser(user: User) {
    this._user.set(user);
  }

  clearUser() {
    this._user.set(null);
  }

  // getUserSnapshot(): User | null {
  //   return this.userSubject.value;
  // }

  rehydrateUser(){
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role') as "hr" | "employe";

    if(token && role){
      this._user.set({ token, role, email: '', name: undefined})
    }
  }
}

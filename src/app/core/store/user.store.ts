import { Injectable } from '@angular/core';
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
  private userSubject = new BehaviorSubject<User | null>(null);
  public user$ = this.userSubject.asObservable();

  public isUserAuth$ = this.user$.pipe(
    map((user: User | null) => !!user?.token)
  );
  
  setUser(user: User) {
    this.userSubject.next(user);
  }

  clearUser() {
    this.userSubject.next(null);
  }

  getUserSnapshot(): User | null {
    return this.userSubject.value;
  }

  getUserRole() {
    return localStorage.getItem('role');
  }

  rehydrateUser() {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role') as "hr" | "employe";
    const email = localStorage.getItem('email') as string;

    if (token && role) {
      this.userSubject.next({ token, role, email, name: undefined });
    }
  }
}

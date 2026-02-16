import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface User {
  email: string;
  name?: string;
  token?: string;
}

@Injectable({ providedIn: 'root' })
export class UserStore {
  private userSubject = new BehaviorSubject<User | null>(null);
  user$ = this.userSubject.asObservable();

  setUser(user: User) {
    this.userSubject.next(user);
  }

  clearUser() {
    this.userSubject.next(null);
  }

  getUserSnapshot(): User | null {
    return this.userSubject.value;
  }
}

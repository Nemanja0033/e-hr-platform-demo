import { Component } from '@angular/core';
import { UserStore } from '../../../core/store/user.store';

@Component({
  selector: 'app-admin-dashboard',
  imports: [],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css',
})
export class AdminDashboard {
  constructor(private userStore: UserStore){}

  user: any = null;

  ngOnInit(){
    this.userStore.user$.subscribe(user => {
      this.user = user;
    }) 
  }
}

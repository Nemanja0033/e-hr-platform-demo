import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { WebSocketService } from '../../../core/services/ws/webSocket.service';
import { UserStore } from '../../../core/store/user.store';
import { NotificationsType } from '../../../core/models';
const notificationSound = new Audio('assets/notification.mp3');

@Component({
  selector: 'app-notifications',
  imports: [],
  templateUrl: './notifications.html',
  styleUrl: './notifications.css',
})
export class Notifications implements OnInit, OnDestroy {
  private webSocketService = inject(WebSocketService);
  private userStore = inject(UserStore);
  private userRole = this.userStore.getUserRole();

  notifications = signal<NotificationsType[]>([]);
  isNotificationModalOpen = signal(false);
  destroy$ = new Subject<void>();

  toggleNotificationModal(){
    this.isNotificationModalOpen.update((perv) => !perv);
  }

  ngOnInit(): void {
    this.webSocketService.connect(this.userStore.user()?.email as string);
    this.webSocketService.on(`notification:new`).pipe(
      takeUntil(this.destroy$)
    ).subscribe((n) => {
      this.notifications.update((perv: any) => [...perv, n]);
      notificationSound.play();
    })
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.webSocketService.disconnect();
  }
}

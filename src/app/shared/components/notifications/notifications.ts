import { Component, effect, inject, input, OnChanges, OnDestroy, OnInit, output, signal, SimpleChanges } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { WebSocketService } from '../../../core/services/ws/webSocket.service';
import { UserStore } from '../../../core/store/user.store';
import { NotificationsType } from '../../../core/models';
import { DatePipe } from '@angular/common';
const notificationSound = new Audio('assets/notification.mp3');

@Component({
  selector: 'app-notifications',
  imports: [DatePipe],
  templateUrl: './notifications.html',
})
export class Notifications implements OnInit, OnChanges, OnDestroy {
  private webSocketService = inject(WebSocketService);
  private userStore = inject(UserStore);
  private userRole = this.userStore.getUserRole();

  avatarModalOpened = input<boolean>();
  notificationsModalOpened = output<boolean>();

  notifications = signal<NotificationsType[]>([]);
  isNotificationModalOpen = signal(false);
  destroy$ = new Subject<void>();

  toggleNotificationModal(){
    // emit modal state to parent
    this.notificationsModalOpened.emit(true);
    this.isNotificationModalOpen.update((perv) => !perv);
  }

  // TODO move connection to global part of app
  ngOnInit(): void {
    console.log('notifications', this.notifications().length)
    this.webSocketService.connect(this.userStore.user()?.email as string);
    this.webSocketService.on(`notification:new`).pipe(
      takeUntil(this.destroy$)
    ).subscribe((n) => {
      this.notifications.update((perv: any) => [...perv, n]);
      notificationSound.play();
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes['avatarModalOpened']){
      const current = changes['avatarModalOpened'].currentValue;

      if(current === true){
        this.isNotificationModalOpen.set(false)
      }
    }
  }


  ngOnDestroy(): void {
    this.destroy$.next();
    this.webSocketService.disconnect();
  }
}

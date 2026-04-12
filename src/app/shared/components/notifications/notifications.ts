import { Component, inject, Input, OnChanges, OnDestroy, OnInit, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { BehaviorSubject, Subject, takeUntil, Observable } from 'rxjs';
import { WebSocketService } from '../../../core/services/ws/webSocket.service';
import { UserStore } from '../../../core/store/user.store';
import { NotificationsType } from '../../../core/models';

const notificationSound = new Audio('assets/notification.mp3');

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.html',
})
export class NotificationsComponent implements OnInit, OnChanges, OnDestroy {
  private webSocketService = inject(WebSocketService);
  private userStore = inject(UserStore);
  private userRole = this.userStore.getUserRole();

  @Input() avatarModalOpened?: boolean;
  @Output() notificationsModalOpened = new EventEmitter<boolean>();

  private _notifications$ = new BehaviorSubject<NotificationsType[]>([]);
  notifications$: Observable<NotificationsType[]> = this._notifications$.asObservable();
  
  isNotificationModalOpen: boolean = false;
  destroy$ = new Subject<void>();

  toggleNotificationModal(){
    this.notificationsModalOpened.emit(true);
    this.isNotificationModalOpen = !this.isNotificationModalOpen;
  }

  ngOnInit(): void {
    const user = this.userStore.getUserSnapshot();
    if (user?.email) {
      this.webSocketService.connect(user.email);
    }
    
    this.webSocketService.on(`notification:new`).pipe(
      takeUntil(this.destroy$)
    ).subscribe((n: any) => {
      const current = this._notifications$.value;
      this._notifications$.next([...current, n]);
      notificationSound.play().catch(e => console.warn('Audio play failed', e));
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes['avatarModalOpened']){
      const current = changes['avatarModalOpened'].currentValue;
      if(current === true){
        this.isNotificationModalOpen = false;
      }
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.webSocketService.disconnect();
  }
}

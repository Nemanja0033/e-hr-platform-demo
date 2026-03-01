import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { io, Socket } from 'socket.io-client';

@Injectable({ providedIn: 'root' })
export class WebSocketService {
    private socket!: Socket;

    connect(userEmail: string){
        this.socket = io('http://localhost:3000', {
            transports: ['websocket'],
            auth: { userEmail },
            reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 2000
        });
    }

    emit(event: string, data: any) {
        this.socket.emit(event, data);
    }

    // slusanje dogadaja, kreiramo obervable ciji observer salje data na server a obsevable slusa i salje 
    // latest podatke pretplatnicima
    on<T>(event: string): Observable<T> {
        return new Observable<T>(observer => { this.socket.on(event, (data: T) => { observer.next(data); }); });
    }

    disconnect() {
        if (this.socket) {
            this.socket.disconnect();
        }
    }
}
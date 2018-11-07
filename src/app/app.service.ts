import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { map } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class AppService {
  constructor(private socket: Socket) { }

    joinSocket(email){
      this.socket.emit('join', {email});
    }
 
    sendMessage(obj){
        this.socket.emit("send_message", obj);
    }

    getMessage() {
      return this.socket.fromEvent("receive_message").pipe(map(response => response));
    }

    disconnectUser() {
      return this.socket.fromEvent("dis_connect").pipe(map(response => response));
    }

    connectUser() {
      return this.socket.fromEvent("connect_user").pipe(map(response => response));
    }

    getAllUsers(){
      return this.socket.fromEvent("get_all_users").pipe(map(response => response));
    }
}

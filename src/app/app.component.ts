import { Component, OnInit } from '@angular/core';
import { AppService } from './app.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  userSet: boolean = false;
  message:string = '';
  currentUser: string = '';
  users: any = [];
  msgUser: string = '';
  messages: any = [];
  constructor(private chatService: AppService){
  }
  ngOnInit(): void {
    if(localStorage.getItem('user') != null){
      this.chatService.joinSocket(localStorage.getItem('user'));
      this.userSet = true;
      this.currentUser = localStorage.getItem('user');
    } 

    this.chatService.getMessage().subscribe(res=>{
      this.messages.unshift(res);
      // console.log('Messages', res)
    });

    this.chatService.disconnectUser().subscribe(res=>{
      this.users = this.users.filter(u=> u != res);
      this.msgUser == res ? this.msgUser = '' : false;
      // console.log('Disconnect user', res)
    });

    this.chatService.connectUser().subscribe((res: any)=>{
      this.users = this.users.filter(u=> u != res);
      this.users.unshift(res);
      // console.log('Connect user', res)
    });

    this.chatService.getAllUsers().subscribe((res: any)=>{
      this.users = res.filter(o=> o != this.currentUser);
      // console.log('All user', this.users)
    });

  }

  sentMessage(evt){
    this.chatService.sendMessage({from: this.currentUser, to: this.msgUser, message: this.message});
    this.messages.unshift({from: this.currentUser, to: this.msgUser, message: this.message});
    this.message = '';
  }

  userSetup(evt, type){
    this.chatService.joinSocket(evt.target.value);
    localStorage.setItem('user', evt.target.value);
    this.userSet = true;
  }

  setMessageUser(user){
    this.msgUser = user;
  }

}

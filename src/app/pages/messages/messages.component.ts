import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatIcon } from '@angular/material/icon';

import { UserService } from '../../shared/services/user.service';
import { Chat, chats } from '../../shared/models/chat'; 
import { DateFormatterPipe } from '../../shared/pipes/date.pipe';
import { Message } from '../../shared/models/message';
import { Title } from '@angular/platform-browser';



@Component({
  selector: 'app-messages',
  imports: [
    CommonModule,
    MatIcon,
    DateFormatterPipe,
  ],
  templateUrl: './messages.component.html',
  styleUrl: './messages.component.scss'
})
export class MessagesComponent {
  @Input() chats!: Chat[];
  

  title: string = 'Y / Messages';
  constructor(
    private userService: UserService,
    private router: Router,
    private titleService: Title,
  
  ) { }


  user: any;  // Initialize chats with the imported chats array
  ngOnInit(): void {
    this.titleService.setTitle(this.title);
    this.chats = chats;
    for (let chat of this.chats) {
      chat.setUserService(this.userService); // Set the userService instance for each chat
    }

     
    this.user = this.userService.getUser();
    console.log(this.chats[0].getParticipantNamesExceptUser(this.user.id));
    
  }


  openChat(chatId: number) {
    // Navigate to the chat component with the selected chat ID
    this.router.navigate(['/chat', chatId]);
  }
}

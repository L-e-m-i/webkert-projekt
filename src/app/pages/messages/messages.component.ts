import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatIcon } from '@angular/material/icon';

import { UserService } from '../../shared/services/user.service';
import { Chat } from '../../shared/models/chat'; 
import { DateFormatterPipe } from '../../shared/pipes/date.pipe';

@Component({
  selector: 'app-messages',
  imports: [
    CommonModule,
    MatIcon,
    DateFormatterPipe
  ],
  templateUrl: './messages.component.html',
  styleUrl: './messages.component.scss'
})
export class MessagesComponent {
  constructor(
    private userService: UserService
  
  ) { }



  chats: Chat[] = []; // Initialize chats as an empty array
  user: any;  // Initialize chats with the imported chats array
  ngOnInit(): void {
  this.chats = [
    new Chat(1, [1, 3, 2], this.userService),
    new Chat(2, [1, 3], this.userService),
    new Chat(3, [2, 3], this.userService),
  ];

    this.user = this.userService.getUser();
    console.log(this.chats[0].getParticipantNamesExceptUser(this.user.id));
    
  }

}

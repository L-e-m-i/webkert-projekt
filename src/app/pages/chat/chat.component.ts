import { Component, Input } from '@angular/core';
import { Chat, chats } from '../../shared/models/chat';
import { UserService } from '../../shared/services/user.service';
import { Message } from '../../shared/models/message';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { DateFormatterPipe } from '../../shared/pipes/date.pipe';
import { MatIcon } from '@angular/material/icon';
import { MatButton } from '@angular/material/button';
import { MatFormField, MatFormFieldModule } from '@angular/material/form-field';
import { MatInput, MatInputModule } from '@angular/material/input';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { take } from 'rxjs';

@Component({
  selector: 'app-chat',
  imports: [
    DateFormatterPipe,
    MatFormFieldModule,
    MatInput,
    MatButton,
    ReactiveFormsModule,
    MatInputModule,
    FormsModule,
    CommonModule,
  ],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss'
})
export class ChatComponent {
  private chats = chats; 

  title: string = 'Y / Chat';

  send = new FormControl('');
  user: any;
  participant: any | null = null;
  userChat: Chat | null = null; 
  chatId: string | null = null; 
  constructor(
    private userService: UserService,
    private router: Router,

    private titleService: Title,
  ) {

  }

  ngOnInit(): void{
    this.titleService.setTitle(this.title);
    this.loadProfileData();
    const chatIdParam = this.router.url.split('/').pop(); 
    this.chatId = chatIdParam ? chatIdParam : null; 
    this.chats = chats;
    for(let chat of this.chats) {
      if(chat.id === this.chatId) {
        this.userChat = chat; 
        this.userChat.setUserService(this.userService); 
        break; 
      }
    }
    if (this.userChat) {
      this.participant = this.userChat.participants.find((participant: any) => participant.id !== this.user.id) || null;
    }
    
  }


  loadProfileData() {
    if(!this.userService.checkLoginStatus()) {
      this.user = null; // Set user to null if not logged in
    }
    this.userService.getUserProfile().pipe(take(1)).subscribe({
      next: (user) => {
        this.user = user;


      },
      error: (error) => {
        console.error('Error fetching user data:', error);
      },
    })
  }


  adjustTextareaHeight(event: Event): void {
    const textarea = event.target as HTMLTextAreaElement;
    textarea.style.height = 'auto'; // Reset the height to calculate the new height
    if (textarea.scrollHeight < 300) {
      textarea.style.height = `${textarea.scrollHeight}px`; // Set the height to match the content
    }else{
      textarea.style.height = '300px'; // Set a maximum height
    }
  }
  sendMessage(): void {
    const messageContent = this.send.value;
    if (messageContent && this.userChat) {
      const newMessage = new Message(Message.messageId++, this.user.id, new Date().toISOString(), messageContent);
      this.userChat.addMessage(newMessage);
      this.send.setValue(''); // Clear the input field after sending the message

      // Reset the textarea height to its default
      const textarea = document.querySelector('textarea');
      if (textarea) {
        textarea.style.height = 'auto';
      }
    }
  }

}

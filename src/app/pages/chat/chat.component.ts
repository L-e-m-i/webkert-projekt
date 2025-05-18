import { Component, Input } from '@angular/core';
import { Chat } from '../../shared/models/chat';
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
import { Subscription, take } from 'rxjs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Timestamp } from 'firebase/firestore';

@Component({
  selector: 'app-chat',
  imports: [
    CommonModule,
    MatProgressSpinnerModule,
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


  title: string = 'Y / Chat';

  send = new FormControl('');
  user: any;
  participant: any | null = null;
  participantHandle!: string;
  userChat: Chat | null = null; 
  chatId: string | null = null; 
  messages: Message[] = [];

  userSub: Subscription | null = null;

  isLoading: boolean = true;


  constructor(
    private userService: UserService,
    private router: Router,

    private titleService: Title,
  ) {

  }

  ngOnInit(): void{
    this.titleService.setTitle(this.title);
    const chatIdParam = this.router.url.split('/').pop(); 
    this.chatId = chatIdParam ? chatIdParam : null; 

    this.userSub = this.userService.getUserProfile().pipe(take(1)).subscribe({
      next: (user) => {
        if(!user){
          this.router.navigate(['/login']);
          return;
        }
        this.user = user;
        if(!this.chatId){
          console.error('Chat ID is null or undefined');
          return;
        }
        this.userService.getChatById(this.chatId).then((chat: Chat) => {
          if(!this.chatId){
            console.error('Chat ID is null or undefined');
            return;
          }
          this.userChat = chat;
          console.log(chat);
          
          const participantsExceptUser = chat.participants.filter((participant: any) => participant.id !== this.user.id);
          this.participant = participantsExceptUser
            .map((participant) => participant.username)
            .join(', ');
          this.participantHandle = participantsExceptUser[0].handle;
          
          
          this.userService.getMessagesByChatIdRealTime(this.chatId, (messages: Message[]) => {
            this.messages = messages;
 
          });

          this.isLoading = false;
            
        })

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
  async sendMessage(): Promise<void> {
    const messageContent = this.send.value?.replace(/\n/g, '<br>')
    if (messageContent && this.userChat) {
      const newMessage = new Message(Message.messageId++, this.user.id, new Timestamp(Date.now() / 1000, 0), messageContent);
      this.userService.addMessageToChat(this.userChat.id, newMessage).then(() => {

        if (this.userChat && this.userChat.messages) {
          // this.userChat.messages.push(newMessage); 
          // this.messages.push(newMessage);
        }
      })
      this.send.setValue(''); // Clear the input field after sending the message

      // Reset the textarea height to its default
      const textarea = document.querySelector('textarea');
      if (textarea) {
        textarea.style.height = 'auto';
      }
    }
  }

  navigateToProfile(handle: string): void {
    this.router.navigate(['profile', handle]);
  }

}
